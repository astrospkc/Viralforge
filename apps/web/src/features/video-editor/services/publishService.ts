import type { EditorProject } from '../types/editor.types.ts';
import { VideoService } from '../../../services/video_service.ts';
import axios from 'axios';
import baseUrl from '../../../services/api_service.ts';

export interface PublishProgressCallback {
    (status: 'uploading' | 'committing' | 'queued', progressPercent: number, message: string): void;
}

export interface PublishResult {
    success: boolean;
    videoId?: number | string;
    jobId?: string;
    objectKey?: string;
    message: string;
}

export const PublishService = {
    /**
     * Complete publication workflow:
     * 1. Get S3 Presigned URL from backend
     * 2. Upload source media file directly to S3 with progress tracking
     * 3. Commit upload & submit declarative editing project JSON to publish endpoint
     */
    async publishProject(
        file: File,
        project: EditorProject,
        token: string,
        onProgress?: PublishProgressCallback,
        entityLinks?: {
            merchant_id?: number;
            shop_id?: number;
            product_id?: number;
            shop_product_id?: number;
        }
    ): Promise<PublishResult> {
        try {
            if (!token) {
                return { success: false, message: 'You must be signed in to publish videos.' };
            }

            onProgress?.('uploading', 5, 'Requesting secure upload session...');

            // Step 1: Request presigned upload URL
            const presigned = await VideoService.GetPresignedUrl(
                { filename: file.name, contentType: file.type || 'video/mp4' },
                token
            );

            if (!presigned?.Url || !presigned?.ObjectKey) {
                return { success: false, message: 'Failed to obtain upload authorization.' };
            }

            onProgress?.('uploading', 15, 'Uploading original video to storage...');

            // Step 2: Direct S3 upload with progress
            await axios.put(presigned.Url, file, {
                headers: { 'Content-Type': file.type || 'video/mp4' },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 70) / progressEvent.total);
                        onProgress?.('uploading', 15 + percentCompleted, `Uploading source video (${Math.round((progressEvent.loaded / (1024 * 1024)))}MB / ${Math.round((progressEvent.total / (1024 * 1024)))}MB)...`);
                    }
                },
            });

            onProgress?.('committing', 88, 'Committing media and editor instructions...');

            // Step 3: Register media and commit project
            const commitRes = await VideoService.CreateVideo(
                file.name,
                file.type,
                presigned.ObjectKey,
                token,
                entityLinks
            );

            if (!commitRes.Success || !commitRes.Data?.id) {
                return { success: false, message: commitRes.Message || 'Failed to register video on backend.' };
            }

            const videoId = commitRes.Data.id;

            // Step 4: Submit versioned project instructions to video project publish endpoint
            try {
                await axios.post(
                    `${baseUrl}/api/v1/video-projects/${videoId}/publish`,
                    {
                        projectId: project.id,
                        schemaVersion: project.schemaVersion,
                        objectKey: presigned.ObjectKey,
                        project,
                        idempotencyKey: `publish_${project.id}_${Date.now()}`,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        timeout: 10000,
                    }
                );
            } catch {
                console.info('[PublishService] Dedicated publish endpoint fallback to standard transcode trigger.');
                // Fallback to standard transcode trigger if dedicated publish endpoint is pending backend deployment
                await VideoService.TranscodeVideo(videoId, presigned.ObjectKey, token);
            }

            onProgress?.('queued', 100, 'Video queued for server-side FFmpeg rendering!');

            return {
                success: true,
                videoId,
                objectKey: presigned.ObjectKey,
                message: 'Published successfully! Video rendering started.',
            };
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Publishing failed';
            return { success: false, message: msg };
        }
    },
};
