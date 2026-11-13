import React from 'react';
import { useEditorStore } from '../store/editorStore.ts';
import { Scissors, RotateCcw, Clock } from 'lucide-react';
import { formatTimeMs } from '../utils/time.ts';

export const TrimTool: React.FC = () => {
    const { project, setTrim, seek } = useEditorStore();

    if (!project) return null;

    const videoClip = project.tracks.find(t => t.type === 'video')?.clips[0];
    const totalDurationMs = project.source.durationMs;
    const startMs = videoClip ? videoClip.sourceStartMs : 0;
    const endMs = videoClip ? videoClip.sourceEndMs : totalDurationMs;
    const trimDurationMs = endMs - startMs;

    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.round(parseFloat(e.target.value || '0') * 1000);
        setTrim(val, endMs);
        seek(val);
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.round(parseFloat(e.target.value || '0') * 1000);
        setTrim(startMs, val);
        seek(val);
    };

    const handleReset = () => {
        setTrim(0, totalDurationMs);
        seek(0);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                    <Scissors size={14} className="text-yellow-400" /> Video Trimming
                </span>
                <button
                    type="button"
                    onClick={handleReset}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
                >
                    <RotateCcw size={11} /> Reset Full
                </button>
            </div>

            {/* Readout Summary Banner */}
            <div className="p-3 rounded-xl bg-[#161924] border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                    <Clock size={15} className="text-violet-300 shrink-0" />
                    <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Trimmed Reel Length</span>
                        <span className="font-black text-yellow-400 text-sm">
                            {formatTimeMs(trimDurationMs, true)}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Original Length</span>
                    <span className="text-xs font-bold text-slate-300">
                        {formatTimeMs(totalDurationMs, false)}
                    </span>
                </div>
            </div>

            {/* Precise In & Out Number Inputs */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#12141D] border border-slate-800">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        In Point (Start)
                    </label>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max={(endMs / 1000 - 0.5).toFixed(1)}
                            value={(startMs / 1000).toFixed(1)}
                            onChange={handleStartChange}
                            className="w-full bg-[#1A1D2B] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold focus:border-yellow-400 focus:outline-none"
                        />
                        <span className="text-xs text-slate-500 font-mono">s</span>
                    </div>
                </div>

                <div className="p-3 rounded-xl bg-[#12141D] border border-slate-800">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Out Point (End)
                    </label>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            step="0.1"
                            min={(startMs / 1000 + 0.5).toFixed(1)}
                            max={(totalDurationMs / 1000).toFixed(1)}
                            value={(endMs / 1000).toFixed(1)}
                            onChange={handleEndChange}
                            className="w-full bg-[#1A1D2B] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono font-bold focus:border-yellow-400 focus:outline-none"
                        />
                        <span className="text-xs text-slate-500 font-mono">s</span>
                    </div>
                </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
                Tip: You can also drag the yellow trim handles directly on the timeline below to interactively set the reel start and end points.
            </p>
        </div>
    );
};
