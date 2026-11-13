/**
 * Technology-independent editing project schema for ViralForge.
 * Version: 1
 * 
 * Designed to be consumed by:
 * - Web Editor (React/TS client preview)
 * - Android Editor (Mobile app)
 * - Backend Renderer (Go + FFmpeg Asynq workers)
 */

export type AspectRatioType = '9:16' | '1:1' | '16:9' | 'custom';

export type ClipType = 'video' | 'audio' | 'text' | 'image' | 'subtitle';

export type TrackType = 'video' | 'audio' | 'overlay' | 'subtitle';

export interface VisualFilters {
    /** 0.5 to 1.5, default 1.0 */
    brightness: number;
    /** 0.5 to 1.5, default 1.0 */
    contrast: number;
    /** 0.0 to 2.0, default 1.0 */
    saturation: number;
}

export interface AudioSettings {
    originalMuted: boolean;
    /** 0.0 to 1.0, default 1.0 */
    originalVolume: number;
    backgroundAudioUrl?: string;
    backgroundAudioName?: string;
    /** 0.0 to 1.0, default 0.5 */
    backgroundAudioVolume: number;
    backgroundAudioMuted?: boolean;
}

export interface TransformSettings {
    /** Rotation in degrees: 0, 90, 180, 270 */
    rotation: 0 | 90 | 180 | 270;
    /** Target canvas aspect ratio */
    aspectRatio: AspectRatioType;
    /** Horizontal flip */
    flipHorizontal?: boolean;
}

export interface TextOverlay {
    id: string;
    text: string;
    /** Normalized x position: 0% to 100% of canvas width */
    xPercent: number;
    /** Normalized y position: 0% to 100% of canvas height */
    yPercent: number;
    fontSize: number; // in pt/px (relative to 1080p canvas)
    color: string; // hex color
    backgroundColor?: string;
    fontFamily: string;
    fontWeight: 'normal' | 'bold' | '900';
    fontStyle?: 'normal' | 'italic';
    textAlign: 'left' | 'center' | 'right';
    rotation?: number; // degrees
    opacity?: number; // 0 to 1
    timelineStartMs: number;
    timelineDurationMs: number;
}

export interface EditorSourceMetadata {
    assetId?: string;
    originalObjectKey?: string;
    fileName: string;
    mimeType: string;
    durationMs: number;
    width: number;
    height: number;
    frameRate?: number;
    fileSizeBytes?: number;
}

export interface EditorClip {
    id: string;
    assetId?: string;
    type: ClipType;
    timelineStartMs: number;
    timelineDurationMs: number;
    sourceStartMs: number;
    sourceEndMs: number;
    playbackRate?: number;
}

export interface EditorTrack {
    id: string;
    type: TrackType;
    name: string;
    muted?: boolean;
    hidden?: boolean;
    clips: EditorClip[];
}

export interface CanvasDimensions {
    width: number;
    height: number;
    backgroundColor: string;
}

export interface ExportSettings {
    width: number;
    height: number;
    frameRate: number;
    videoCodec: 'h264' | 'h265';
    audioCodec: 'aac';
    format: 'mp4';
}

/**
 * Durable, persisted editing project format (versioned).
 * Contains NO runtime object URLs, DOM elements, or canvas instances.
 */
export interface EditorProject {
    schemaVersion: 1;
    id: string;
    title: string;
    description?: string;
    canvas: CanvasDimensions;
    source: EditorSourceMetadata;
    tracks: EditorTrack[];
    transform: TransformSettings;
    filters: VisualFilters;
    audio: AudioSettings;
    textOverlays: TextOverlay[];
    export: ExportSettings;
    createdAt: string;
    updatedAt: string;
}

/**
 * Processing status for video rendering job
 */
export type RenderStatus = 'draft' | 'uploading' | 'queued' | 'processing' | 'ready' | 'failed';

export interface VideoProcessingState {
    videoId?: string | number;
    jobId?: string;
    status: RenderStatus;
    stage?: 'upload' | 'inspect' | 'transcode' | 'hls' | 'thumbnail' | 'completed';
    progressPercent: number;
    errorMessage?: string;
    outputUrl?: string;
    thumbnailUrl?: string;
}
