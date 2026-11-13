import React from 'react';
import { useEditorStore } from '../store/editorStore.ts';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const AudioTool: React.FC = () => {
    const { project, setAudioSettings } = useEditorStore();

    if (!project) return null;

    const { audio } = project;

    return (
        <div className="space-y-4">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Volume2 size={14} className="text-yellow-400" /> Audio & Mixing
            </span>

            {/* Original Video Audio */}
            <div className="p-3.5 rounded-2xl bg-[#12141D] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {audio.originalMuted ? (
                            <VolumeX size={16} className="text-red-400" />
                        ) : (
                            <Volume2 size={16} className="text-yellow-400" />
                        )}
                        <div>
                            <span className="font-bold text-xs text-white block">Original Video Audio</span>
                            <span className="text-[10px] text-slate-400">Recorded mic / video track</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setAudioSettings({ originalMuted: !audio.originalMuted })}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                            audio.originalMuted
                                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                    >
                        {audio.originalMuted ? 'Muted' : 'Mute'}
                    </button>
                </div>

                {!audio.originalMuted && (
                    <div>
                        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                            <span>Volume</span>
                            <span className="text-yellow-400 font-mono">
                                {Math.round(audio.originalVolume * 100)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={audio.originalVolume}
                            onChange={(e) => setAudioSettings({ originalVolume: parseFloat(e.target.value) })}
                            className="w-full accent-yellow-400 cursor-pointer"
                        />
                    </div>
                )}
            </div>

            {/* Background Music / Audio Track */}
            <div className="p-3.5 rounded-2xl bg-[#12141D] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Music size={16} className="text-violet-300" />
                        <div>
                            <span className="font-bold text-xs text-white block">Background Music</span>
                            <span className="text-[10px] text-slate-400">Added soundtrack</span>
                        </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-violet-400/10 text-violet-300 font-semibold border border-violet-400/20">
                        Optional
                    </span>
                </div>

                <div>
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                        <span>Music Volume</span>
                        <span className="text-violet-300 font-mono">
                            {Math.round(audio.backgroundAudioVolume * 100)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={audio.backgroundAudioVolume}
                        onChange={(e) => setAudioSettings({ backgroundAudioVolume: parseFloat(e.target.value) })}
                        className="w-full accent-violet-400 cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};
