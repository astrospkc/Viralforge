import type { EditorProject } from '../types/editor.types.ts';
import { validateEditorProject } from './ProjectValidator.ts';

export interface SerializationResult {
    json: string;
    valid: boolean;
    issues?: string[];
}

/**
 * Cleanly serializes an EditorProject to a JSON string.
 * Strips any ephemeral properties (e.g. temporary object URLs or DOM elements)
 * and validates the project model.
 */
export function serializeProject(project: EditorProject): SerializationResult {
    const validation = validateEditorProject(project);

    // Deep clone and clean
    const cleanProject: EditorProject = {
        schemaVersion: 1,
        id: project.id,
        title: project.title,
        description: project.description,
        canvas: {
            width: project.canvas.width,
            height: project.canvas.height,
            backgroundColor: project.canvas.backgroundColor || '#000000',
        },
        source: {
            assetId: project.source.assetId,
            originalObjectKey: project.source.originalObjectKey,
            fileName: project.source.fileName,
            mimeType: project.source.mimeType,
            durationMs: project.source.durationMs,
            width: project.source.width,
            height: project.source.height,
            frameRate: project.source.frameRate,
            fileSizeBytes: project.source.fileSizeBytes,
        },
        tracks: project.tracks.map(track => ({
            id: track.id,
            type: track.type,
            name: track.name,
            muted: track.muted,
            hidden: track.hidden,
            clips: track.clips.map(clip => ({
                id: clip.id,
                assetId: clip.assetId,
                type: clip.type,
                timelineStartMs: clip.timelineStartMs,
                timelineDurationMs: clip.timelineDurationMs,
                sourceStartMs: clip.sourceStartMs,
                sourceEndMs: clip.sourceEndMs,
                playbackRate: clip.playbackRate,
            })),
        })),
        transform: {
            rotation: project.transform.rotation,
            aspectRatio: project.transform.aspectRatio,
            flipHorizontal: project.transform.flipHorizontal,
        },
        filters: {
            brightness: project.filters.brightness,
            contrast: project.filters.contrast,
            saturation: project.filters.saturation,
        },
        audio: {
            originalMuted: project.audio.originalMuted,
            originalVolume: project.audio.originalVolume,
            backgroundAudioUrl: project.audio.backgroundAudioUrl,
            backgroundAudioName: project.audio.backgroundAudioName,
            backgroundAudioVolume: project.audio.backgroundAudioVolume,
            backgroundAudioMuted: project.audio.backgroundAudioMuted,
        },
        textOverlays: project.textOverlays.map(to => ({
            id: to.id,
            text: to.text,
            xPercent: to.xPercent,
            yPercent: to.yPercent,
            fontSize: to.fontSize,
            color: to.color,
            backgroundColor: to.backgroundColor,
            fontFamily: to.fontFamily,
            fontWeight: to.fontWeight,
            fontStyle: to.fontStyle,
            textAlign: to.textAlign,
            rotation: to.rotation,
            opacity: to.opacity,
            timelineStartMs: to.timelineStartMs,
            timelineDurationMs: to.timelineDurationMs,
        })),
        export: {
            width: project.export.width,
            height: project.export.height,
            frameRate: project.export.frameRate,
            videoCodec: project.export.videoCodec,
            audioCodec: project.export.audioCodec,
            format: project.export.format,
        },
        createdAt: project.createdAt,
        updatedAt: new Date().toISOString(),
    };

    return {
        json: JSON.stringify(cleanProject, null, 2),
        valid: validation.valid,
        issues: validation.issues.map(i => `${i.field}: ${i.message}`),
    };
}

/**
 * Deserializes and validates a JSON string into an EditorProject.
 */
export function deserializeProject(jsonString: string): { project: EditorProject | null; error?: string } {
    try {
        const parsed = JSON.parse(jsonString);
        const validation = validateEditorProject(parsed);
        if (!validation.valid) {
            return {
                project: null,
                error: `Invalid project schema: ${validation.issues.map(i => `${i.field} - ${i.message}`).join(', ')}`,
            };
        }
        return { project: parsed as EditorProject };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown parsing error';
        return { project: null, error: `Malformed JSON: ${message}` };
    }
}
