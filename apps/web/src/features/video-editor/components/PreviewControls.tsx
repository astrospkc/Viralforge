import React from 'react';
import { useEditorStore } from '../store/editorStore.ts';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { formatTimeMs } from '../utils/time.ts';

export const PreviewControls: React.FC = () => {
    const {
        project,
        isPlaying,
        setPlaying,
        currentTimeMs,
        seek,
    } = useEditorStore();

    if (!project) return null;

    const videoClip = project.tracks.find(t => t.type === 'video')?.clips[0];
    const sourceStartMs = videoClip ? videoClip.sourceStartMs : 0;
    const sourceEndMs = videoClip ? videoClip.sourceEndMs : project.source.durationMs;
    const activeDurationMs = sourceEndMs - sourceStartMs;
    const currentProgressMs = Math.max(0, currentTimeMs - sourceStartMs);

    const handleSkip = (deltaMs: number) => {
        seek(currentTimeMs + deltaMs);
    };

    const handleReset = () => {
        seek(sourceStartMs);
    };

    return (
        <div className="h-12 bg-[#10121A] border-t border-slate-800/80 px-4 flex items-center justify-between text-xs text-slate-300 select-none">
            {/* Left: Current time / duration */}
            <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-white text-sm">
                    {formatTimeMs(currentProgressMs, true)}
                </span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-400">
                    {formatTimeMs(activeDurationMs, false)}
                </span>
            </div>

            {/* Center: Playback buttons */}
            <div className="flex items-center gap-1.5 sm:gap-3">
                <button
                    type="button"
                    onClick={handleReset}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                    title="Jump to Trim Start"
                >
                    <RotateCcw size={15} />
                </button>

                <button
                    type="button"
                    onClick={() => handleSkip(-1000)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                    title="Rewind 1s"
                >
                    <SkipBack size={16} />
                </button>

                <button
                    type="button"
                    onClick={() => setPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-yellow-500/20 transition cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5 fill-current" />}
                </button>

                <button
                    type="button"
                    onClick={() => handleSkip(1000)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                    title="Forward 1s"
                >
                    <SkipForward size={16} />
                </button>
            </div>

            {/* Right: Clip details pill */}
            <div className="hidden sm:flex items-center gap-2">
                <span className="text-[11px] text-slate-500 truncate max-w-[140px]">
                    {project.source.fileName}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-semibold">
                    {project.source.width}x{project.source.height}
                </span>
            </div>
        </div>
    );
};
