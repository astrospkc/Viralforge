import type { EditorProject } from '../types/editor.types';

export interface ValidationIssue {
    field: string;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    issues: ValidationIssue[];
}

export function validateEditorProject(project: unknown): ValidationResult {
    const issues: ValidationIssue[] = [];

    if (!project || typeof project !== 'object') {
        return {
            valid: false,
            issues: [{ field: 'root', message: 'Project must be a non-null object' }],
        };
    }

    const p = project as Partial<EditorProject>;

    if (p.schemaVersion !== 1) {
        issues.push({ field: 'schemaVersion', message: 'Schema version must be 1' });
    }

    if (!p.id || typeof p.id !== 'string') {
        issues.push({ field: 'id', message: 'Project ID is required and must be a string' });
    }

    if (!p.title || typeof p.title !== 'string') {
        issues.push({ field: 'title', message: 'Project title is required' });
    }

    // Source validation
    if (!p.source) {
        issues.push({ field: 'source', message: 'Source metadata is missing' });
    } else {
        if (typeof p.source.durationMs !== 'number' || p.source.durationMs <= 0) {
            issues.push({ field: 'source.durationMs', message: 'Duration must be a positive number' });
        }
        if (typeof p.source.width !== 'number' || p.source.width <= 0) {
            issues.push({ field: 'source.width', message: 'Source width must be positive' });
        }
        if (typeof p.source.height !== 'number' || p.source.height <= 0) {
            issues.push({ field: 'source.height', message: 'Source height must be positive' });
        }
    }

    // Tracks validation
    if (!Array.isArray(p.tracks) || p.tracks.length === 0) {
        issues.push({ field: 'tracks', message: 'Project must contain at least one track' });
    } else {
        const videoTrack = p.tracks.find(t => t.type === 'video');
        if (!videoTrack || videoTrack.clips.length === 0) {
            issues.push({ field: 'tracks', message: 'Project must have a video track with at least one clip' });
        } else {
            const clip = videoTrack.clips[0];
            if (clip.sourceStartMs < 0) {
                issues.push({ field: 'clip.sourceStartMs', message: 'Clip start time cannot be negative' });
            }
            if (clip.sourceEndMs <= clip.sourceStartMs) {
                issues.push({ field: 'clip.sourceEndMs', message: 'Clip end time must be greater than start time' });
            }
            if (p.source && clip.sourceEndMs > p.source.durationMs) {
                issues.push({ field: 'clip.sourceEndMs', message: 'Clip end time cannot exceed source duration' });
            }
        }
    }

    // Filters validation
    if (p.filters) {
        if (p.filters.brightness < 0.2 || p.filters.brightness > 2.0) {
            issues.push({ field: 'filters.brightness', message: 'Brightness must be between 0.2 and 2.0' });
        }
        if (p.filters.contrast < 0.2 || p.filters.contrast > 2.0) {
            issues.push({ field: 'filters.contrast', message: 'Contrast must be between 0.2 and 2.0' });
        }
        if (p.filters.saturation < 0 || p.filters.saturation > 3.0) {
            issues.push({ field: 'filters.saturation', message: 'Saturation must be between 0 and 3.0' });
        }
    }

    // Audio validation
    if (p.audio) {
        if (p.audio.originalVolume < 0 || p.audio.originalVolume > 1) {
            issues.push({ field: 'audio.originalVolume', message: 'Volume must be between 0.0 and 1.0' });
        }
    }

    return {
        valid: issues.length === 0,
        issues,
    };
}
