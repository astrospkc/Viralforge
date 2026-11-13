import { create } from 'zustand';
import type {
    EditorProject,
    EditorSourceMetadata,
    AspectRatioType,
    VisualFilters,
    AudioSettings,
    TextOverlay,
} from '../types/editor.types';
import { calculateTrimBounds, clamp } from '../utils/time';
import { getStandardCanvasDimensions } from '../utils/geometry';

export type ActiveTool = 'trim' | 'crop' | 'text' | 'filter' | 'audio';

export interface EditorState {
    // Durable project data
    project: EditorProject | null;
    // Ephemeral browser object URL for preview (never serialized)
    localBlobUrl: string | null;

    // Transient UI state
    isPlaying: boolean;
    currentTimeMs: number;
    selectedOverlayId: string | null;
    activeTool: ActiveTool;
    pixelsPerMs: number;
    saveStatus: 'idle' | 'saving' | 'saved' | 'error';
    saveMessage: string;

    // Undo / Redo history
    history: EditorProject[];
    future: EditorProject[];

    // Actions
    initProject: (sourceMeta: EditorSourceMetadata, blobUrl: string) => void;
    setLocalBlobUrl: (url: string | null) => void;
    setTrim: (startMs: number, endMs: number) => void;
    seek: (timeMs: number) => void;
    setPlaying: (playing: boolean) => void;
    setActiveTool: (tool: ActiveTool) => void;
    setPixelsPerMs: (scale: number) => void;
    setRotation: (rotation: 0 | 90 | 180 | 270) => void;
    setAspectRatio: (aspectRatio: AspectRatioType) => void;
    setFilters: (filters: Partial<VisualFilters>) => void;
    setAudioSettings: (audio: Partial<AudioSettings>) => void;
    addTextOverlay: (text?: string) => void;
    updateTextOverlay: (id: string, updates: Partial<TextOverlay>) => void;
    removeTextOverlay: (id: string) => void;
    selectOverlay: (id: string | null) => void;
    setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error', message?: string) => void;
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
    reset: () => void;
}

const MAX_HISTORY_LENGTH = 30;

function pushHistory(state: EditorState, newProject: EditorProject): Partial<EditorState> {
    if (!state.project) return { project: newProject };
    return {
        project: newProject,
        history: [...state.history.slice(-MAX_HISTORY_LENGTH), state.project],
        future: [],
    };
}

export const useEditorStore = create<EditorState>((set, get) => ({
    project: null,
    localBlobUrl: null,

    isPlaying: false,
    currentTimeMs: 0,
    selectedOverlayId: null,
    activeTool: 'trim',
    pixelsPerMs: 0.05,
    saveStatus: 'idle',
    saveMessage: '',

    history: [],
    future: [],

    initProject: (sourceMeta, blobUrl) => {
        const dimensions = getStandardCanvasDimensions('9:16');
        const now = new Date().toISOString();
        const duration = sourceMeta.durationMs || 10000;

        const newProject: EditorProject = {
            schemaVersion: 1,
            id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            title: sourceMeta.fileName ? sourceMeta.fileName.replace(/\.[^/.]+$/, '') : 'New ViralForge Reel',
            canvas: {
                width: dimensions.width,
                height: dimensions.height,
                backgroundColor: '#000000',
            },
            source: {
                fileName: sourceMeta.fileName,
                mimeType: sourceMeta.mimeType,
                durationMs: duration,
                width: sourceMeta.width,
                height: sourceMeta.height,
                fileSizeBytes: sourceMeta.fileSizeBytes,
            },
            tracks: [
                {
                    id: 'track_video_main',
                    type: 'video',
                    name: 'Main Video',
                    clips: [
                        {
                            id: 'clip_main',
                            type: 'video',
                            timelineStartMs: 0,
                            timelineDurationMs: duration,
                            sourceStartMs: 0,
                            sourceEndMs: duration,
                        },
                    ],
                },
                {
                    id: 'track_audio_main',
                    type: 'audio',
                    name: 'Original Audio',
                    clips: [],
                },
                {
                    id: 'track_overlay_main',
                    type: 'overlay',
                    name: 'Text & Overlays',
                    clips: [],
                },
            ],
            transform: {
                rotation: 0,
                aspectRatio: '9:16',
            },
            filters: {
                brightness: 1.0,
                contrast: 1.0,
                saturation: 1.0,
            },
            audio: {
                originalMuted: false,
                originalVolume: 1.0,
                backgroundAudioVolume: 0.5,
            },
            textOverlays: [],
            export: {
                width: 1080,
                height: 1920,
                frameRate: 30,
                videoCodec: 'h264',
                audioCodec: 'aac',
                format: 'mp4',
            },
            createdAt: now,
            updatedAt: now,
        };

        set({
            project: newProject,
            localBlobUrl: blobUrl,
            currentTimeMs: 0,
            isPlaying: false,
            selectedOverlayId: null,
            activeTool: 'trim',
            history: [],
            future: [],
            saveStatus: 'idle',
        });
    },

    setLocalBlobUrl: (url) => set({ localBlobUrl: url }),

    setTrim: (startMs, endMs) => {
        const { project } = get();
        if (!project) return;

        const bounds = calculateTrimBounds(project.source.durationMs, startMs, endMs);
        const updatedTracks = project.tracks.map(t => {
            if (t.type === 'video' && t.clips.length > 0) {
                return {
                    ...t,
                    clips: [
                        {
                            ...t.clips[0],
                            sourceStartMs: bounds.startMs,
                            sourceEndMs: bounds.endMs,
                            timelineDurationMs: bounds.durationMs,
                        },
                    ],
                };
            }
            return t;
        });

        const newProject: EditorProject = {
            ...project,
            tracks: updatedTracks,
            updatedAt: new Date().toISOString(),
        };

        const clampedCurrent = clamp(get().currentTimeMs, bounds.startMs, bounds.endMs);
        set(state => ({
            ...pushHistory(state, newProject),
            currentTimeMs: clampedCurrent,
        }));
    },

    seek: (timeMs) => {
        const { project } = get();
        if (!project) return;
        const videoClip = project.tracks.find(t => t.type === 'video')?.clips[0];
        const min = videoClip ? videoClip.sourceStartMs : 0;
        const max = videoClip ? videoClip.sourceEndMs : project.source.durationMs;
        set({ currentTimeMs: clamp(timeMs, min, max) });
    },

    setPlaying: (playing) => set({ isPlaying: playing }),

    setActiveTool: (tool) => set({ activeTool: tool }),

    setPixelsPerMs: (scale) => set({ pixelsPerMs: scale }),

    setRotation: (rotation) => {
        const { project } = get();
        if (!project) return;
        const newProject: EditorProject = {
            ...project,
            transform: {
                ...project.transform,
                rotation,
            },
            updatedAt: new Date().toISOString(),
        };
        set(state => pushHistory(state, newProject));
    },

    setAspectRatio: (aspectRatio) => {
        const { project } = get();
        if (!project) return;
        const dims = getStandardCanvasDimensions(aspectRatio);
        const newProject: EditorProject = {
            ...project,
            canvas: {
                ...project.canvas,
                width: dims.width,
                height: dims.height,
            },
            transform: {
                ...project.transform,
                aspectRatio,
            },
            export: {
                ...project.export,
                width: dims.width,
                height: dims.height,
            },
            updatedAt: new Date().toISOString(),
        };
        set(state => pushHistory(state, newProject));
    },

    setFilters: (filters) => {
        const { project } = get();
        if (!project) return;
        const newProject: EditorProject = {
            ...project,
            filters: {
                ...project.filters,
                ...filters,
            },
            updatedAt: new Date().toISOString(),
        };
        set(state => pushHistory(state, newProject));
    },

    setAudioSettings: (audio) => {
        const { project } = get();
        if (!project) return;
        const newProject: EditorProject = {
            ...project,
            audio: {
                ...project.audio,
                ...audio,
            },
            updatedAt: new Date().toISOString(),
        };
        set(state => pushHistory(state, newProject));
    },

    addTextOverlay: (initialText = 'Tap to edit text') => {
        const { project, currentTimeMs } = get();
        if (!project) return;

        const videoClip = project.tracks.find(t => t.type === 'video')?.clips[0];
        const clipDuration = videoClip ? videoClip.timelineDurationMs : project.source.durationMs;

        const newOverlay: TextOverlay = {
            id: `text_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
            text: initialText,
            xPercent: 50,
            yPercent: 40 + (project.textOverlays.length * 8) % 30,
            fontSize: 28,
            color: '#FACC15', // Brand yellow default
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 'bold',
            textAlign: 'center',
            opacity: 1,
            timelineStartMs: currentTimeMs,
            timelineDurationMs: Math.min(5000, clipDuration),
        };

        const newProject: EditorProject = {
            ...project,
            textOverlays: [...project.textOverlays, newOverlay],
            updatedAt: new Date().toISOString(),
        };

        set(state => ({
            ...pushHistory(state, newProject),
            selectedOverlayId: newOverlay.id,
            activeTool: 'text',
        }));
    },

    updateTextOverlay: (id, updates) => {
        const { project } = get();
        if (!project) return;

        const newOverlays = project.textOverlays.map(to => {
            if (to.id === id) {
                return { ...to, ...updates };
            }
            return to;
        });

        const newProject: EditorProject = {
            ...project,
            textOverlays: newOverlays,
            updatedAt: new Date().toISOString(),
        };

        set(state => pushHistory(state, newProject));
    },

    removeTextOverlay: (id) => {
        const { project, selectedOverlayId } = get();
        if (!project) return;

        const newProject: EditorProject = {
            ...project,
            textOverlays: project.textOverlays.filter(to => to.id !== id),
            updatedAt: new Date().toISOString(),
        };

        set(state => ({
            ...pushHistory(state, newProject),
            selectedOverlayId: selectedOverlayId === id ? null : selectedOverlayId,
        }));
    },

    selectOverlay: (id) => set({ selectedOverlayId: id }),

    setSaveStatus: (status, message = '') => set({ saveStatus: status, saveMessage: message }),

    canUndo: () => get().history.length > 0,
    canRedo: () => get().future.length > 0,

    undo: () => {
        const { history, future, project } = get();
        if (history.length === 0 || !project) return;

        const previous = history[history.length - 1];
        const newHistory = history.slice(0, -1);

        set({
            project: previous,
            history: newHistory,
            future: [project, ...future],
        });
    },

    redo: () => {
        const { history, future, project } = get();
        if (future.length === 0 || !project) return;

        const next = future[0];
        const newFuture = future.slice(1);

        set({
            project: next,
            history: [...history, project],
            future: newFuture,
        });
    },

    reset: () => {
        const { localBlobUrl } = get();
        if (localBlobUrl) {
            try {
                URL.revokeObjectURL(localBlobUrl);
            } catch {
                // ignore
            }
        }
        set({
            project: null,
            localBlobUrl: null,
            isPlaying: false,
            currentTimeMs: 0,
            selectedOverlayId: null,
            activeTool: 'trim',
            history: [],
            future: [],
            saveStatus: 'idle',
        });
    },
}));
