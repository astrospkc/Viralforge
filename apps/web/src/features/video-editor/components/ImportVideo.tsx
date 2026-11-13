import React, { useState, useRef } from 'react';
import { Upload, Film, AlertCircle, Sparkles, CheckCircle2, Clock, FileVideo } from 'lucide-react';
import { validateVideoFile, extractVideoMetadata } from '../utils/fileValidation.ts';
import { useEditorStore } from '../store/editorStore.ts';
import { formatTimeMs } from '../utils/time.ts';
import { DraftService, type DraftSummary } from '../services/draftService.ts';

export const ImportVideo: React.FC = () => {
    const { initProject, project } = useEditorStore();
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [recentDrafts] = useState<DraftSummary[]>(() => DraftService.listLocalDrafts());

    const handleFile = async (file: File) => {
        setError(null);
        const validation = validateVideoFile(file);
        if (!validation.valid) {
            setError(validation.error || 'Invalid video file.');
            return;
        }

        setIsLoading(true);
        try {
            const meta = await extractVideoMetadata(file);
            initProject(
                {
                    fileName: file.name,
                    mimeType: file.type || 'video/mp4',
                    durationMs: meta.durationMs,
                    width: meta.width,
                    height: meta.height,
                    fileSizeBytes: file.size,
                },
                meta.blobUrl
            );
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to parse video metadata.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const loadDraft = (_id: string) => {
        setError('To reopen a draft with full preview, please select the original video file or import a new clip.');
    };

    if (project) return null;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[calc(100vh-64px)] bg-[#0A0C10] text-white">
            <div className="max-w-xl w-full">
                {/* Title badge */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-300 text-xs font-semibold mb-3">
                        <Sparkles size={13} className="text-yellow-400" />
                        ViralForge Studio Editor
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Create Video <span className="text-yellow-400">Reels</span>
                    </h1>
                    <p className="text-sm text-slate-400 mt-2">
                        Trim, crop, add text overlays, adjust visual filters, and publish directly to discovery feeds.
                    </p>
                </div>

                {/* Drop Zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
                        isDragging
                            ? 'border-yellow-400 bg-yellow-400/5 scale-[1.01]'
                            : 'border-slate-800 hover:border-slate-700 bg-[#12141D] hover:bg-[#151824]'
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
                        onChange={onSelectFile}
                        className="hidden"
                    />

                    <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shadow-lg shadow-yellow-500/10">
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Upload size={28} />
                        )}
                    </div>

                    <div>
                        <p className="text-base font-bold text-white">
                            {isLoading ? 'Analyzing video metadata...' : 'Drop video here or click to browse'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Supports MP4, WebM, MOV • Up to 500 MB • 9:16 vertical reels recommended
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled={isLoading}
                        className="mt-2 inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md shadow-yellow-500/20 cursor-pointer"
                    >
                        <Film size={14} />
                        Select Local Video
                    </button>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Feature Highlights */}
                <div className="grid grid-cols-3 gap-3 mt-8">
                    <div className="p-3.5 rounded-xl bg-[#12141D] border border-slate-800/80 text-center">
                        <CheckCircle2 size={16} className="text-yellow-400 mx-auto mb-1.5" />
                        <p className="text-xs font-bold text-slate-200">Interactive Preview</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Real-time client playback</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#12141D] border border-slate-800/80 text-center">
                        <CheckCircle2 size={16} className="text-violet-300 mx-auto mb-1.5" />
                        <p className="text-xs font-bold text-slate-200">Live Overlays</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Custom text & styles</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#12141D] border border-slate-800/80 text-center">
                        <CheckCircle2 size={16} className="text-yellow-400 mx-auto mb-1.5" />
                        <p className="text-xs font-bold text-slate-200">FFmpeg Render</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Async high quality export</p>
                    </div>
                </div>

                {/* Recent Drafts */}
                {recentDrafts.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-800/80">
                        <p className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                            <Clock size={13} /> Saved Draft Projects ({recentDrafts.length})
                        </p>
                        <div className="space-y-2">
                            {recentDrafts.map((draft) => (
                                <div
                                    key={draft.id}
                                    onClick={() => loadDraft(draft.id)}
                                    className="p-3 rounded-xl bg-[#12141D] border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 text-xs cursor-pointer transition hover:bg-[#161824]"
                                >
                                    <div className="flex items-center gap-2.5 truncate">
                                        <FileVideo size={16} className="text-yellow-400 shrink-0" />
                                        <div className="truncate">
                                            <p className="font-bold text-white truncate">{draft.title}</p>
                                            <p className="text-[11px] text-slate-500">
                                                {formatTimeMs(draft.durationMs, false)} • {new Date(draft.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] text-yellow-400 font-semibold px-2 py-0.5 rounded bg-yellow-400/10">
                                        Draft
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
