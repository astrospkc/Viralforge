import type { EditorProject } from './editor.types';

export interface UploadSessionRequest {
    fileName: string;
    contentType: string;
    sizeBytes: number;
}

export interface UploadSessionResponse {
    uploadId: string;
    assetId: string;
    uploadUrl: string;
    objectKey: string;
    expiresAt: string;
}

export interface CompleteUploadRequest {
    uploadId: string;
    assetId: string;
    objectKey: string;
}

export interface SaveDraftRequest {
    title: string;
    schemaVersion: 1;
    project: EditorProject;
}

export interface SaveDraftResponse {
    projectId: string;
    updatedAt: string;
    success: boolean;
    message?: string;
}

export interface PublishProjectRequest {
    projectId: string;
    sourceAssetId?: string;
    objectKey: string;
    schemaVersion: 1;
    project: EditorProject;
    idempotencyKey: string;
}

export interface PublishProjectResponse {
    videoId: number | string;
    jobId: string;
    status: 'queued' | 'processing';
    message: string;
}

export interface ProcessingStatusResponse {
    videoId: number | string;
    status: 'queued' | 'processing' | 'ready' | 'failed';
    stage?: 'upload' | 'inspect' | 'transcode' | 'hls' | 'thumbnail' | 'completed';
    progress: number;
    error?: string | null;
    hlsUrl?: string;
    mp4Url?: string;
    thumbnailUrl?: string;
}
