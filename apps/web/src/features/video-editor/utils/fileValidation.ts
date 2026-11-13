export const SUPPORTED_VIDEO_MIME_TYPES = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-m4v',
    'video/ogg',
];

export const MAX_VIDEO_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

export interface FileValidationResult {
    valid: boolean;
    error?: string;
    fileName: string;
    fileSizeBytes: number;
    mimeType: string;
}

export function validateVideoFile(file: File): FileValidationResult {
    if (!file) {
        return {
            valid: false,
            error: 'No file provided.',
            fileName: '',
            fileSizeBytes: 0,
            mimeType: '',
        };
    }

    if (file.size > MAX_VIDEO_FILE_SIZE_BYTES) {
        return {
            valid: false,
            error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max allowed size is 500MB.`,
            fileName: file.name,
            fileSizeBytes: file.size,
            mimeType: file.type,
        };
    }

    // Check MIME type or extension
    const mime = file.type.toLowerCase();
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isMimeSupported = SUPPORTED_VIDEO_MIME_TYPES.includes(mime);
    const isExtSupported = ['mp4', 'webm', 'mov', 'm4v', 'ogv', 'mkv'].includes(extension || '');

    if (!isMimeSupported && !isExtSupported) {
        return {
            valid: false,
            error: `Unsupported video format (${file.type || extension || 'unknown'}). Please upload MP4, WebM, or MOV.`,
            fileName: file.name,
            fileSizeBytes: file.size,
            mimeType: file.type || 'video/unknown',
        };
    }

    return {
        valid: true,
        fileName: file.name,
        fileSizeBytes: file.size,
        mimeType: file.type || 'video/mp4',
    };
}

/**
 * Loads video element in browser to inspect duration and natural dimensions.
 */
export async function extractVideoMetadata(file: File): Promise<{
    durationMs: number;
    width: number;
    height: number;
    blobUrl: string;
}> {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;

    try {
        await new Promise<void>((resolve, reject) => {
            video.onloadedmetadata = () => resolve();
            video.onerror = () => {
                reject(new Error('Failed to read video metadata. The file may be corrupt or encoded in an unsupported codec.'));
            };
        });

        const durationMs = Math.round(video.duration * 1000);
        const width = video.videoWidth || 1080;
        const height = video.videoHeight || 1920;

        return {
            durationMs,
            width,
            height,
            blobUrl: url,
        };
    } catch (error) {
        URL.revokeObjectURL(url);
        throw error;
    }
}
