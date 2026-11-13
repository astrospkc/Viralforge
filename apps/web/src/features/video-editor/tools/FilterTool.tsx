import React from 'react';
import { useEditorStore } from '../store/editorStore.ts';
import { Sliders, RotateCcw, Sparkles } from 'lucide-react';

const PRESETS = [
    { label: 'Original', filters: { brightness: 1.0, contrast: 1.0, saturation: 1.0 } },
    { label: 'Vibrant', filters: { brightness: 1.08, contrast: 1.15, saturation: 1.35 } },
    { label: 'Noir (B&W)', filters: { brightness: 1.0, contrast: 1.25, saturation: 0.0 } },
    { label: 'Warm Glow', filters: { brightness: 1.05, contrast: 1.1, saturation: 1.2 } },
    { label: 'Punchy', filters: { brightness: 0.98, contrast: 1.3, saturation: 1.4 } },
];

export const FilterTool: React.FC = () => {
    const { project, setFilters } = useEditorStore();

    if (!project) return null;

    const { filters } = project;

    const handleReset = () => {
        setFilters({ brightness: 1.0, contrast: 1.0, saturation: 1.0 });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sliders size={14} className="text-yellow-400" /> Color Adjustments
                </span>
                <button
                    type="button"
                    onClick={handleReset}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
                >
                    <RotateCcw size={11} /> Reset
                </button>
            </div>

            {/* Quick Filter Presets */}
            <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 flex items-center gap-1">
                    <Sparkles size={11} className="text-violet-300" /> Instant Presets
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {PRESETS.map((p) => {
                        const isMatch =
                            filters.brightness === p.filters.brightness &&
                            filters.contrast === p.filters.contrast &&
                            filters.saturation === p.filters.saturation;

                        return (
                            <button
                                key={p.label}
                                type="button"
                                onClick={() => setFilters(p.filters)}
                                className={`px-2 py-1.5 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${
                                    isMatch
                                        ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                                        : 'border-slate-800 bg-[#12141D] hover:bg-[#161824] text-slate-300'
                                }`}
                            >
                                {p.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Manual Sliders */}
            <div className="space-y-3.5 pt-2">
                {/* Brightness */}
                <div className="p-3 rounded-xl bg-[#12141D] border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-300">Brightness</span>
                        <span className="font-mono text-yellow-400 font-bold">
                            {Math.round(filters.brightness * 100)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.05"
                        value={filters.brightness}
                        onChange={(e) => setFilters({ brightness: parseFloat(e.target.value) })}
                        className="w-full accent-yellow-400 cursor-pointer"
                    />
                </div>

                {/* Contrast */}
                <div className="p-3 rounded-xl bg-[#12141D] border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-300">Contrast</span>
                        <span className="font-mono text-yellow-400 font-bold">
                            {Math.round(filters.contrast * 100)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.05"
                        value={filters.contrast}
                        onChange={(e) => setFilters({ contrast: parseFloat(e.target.value) })}
                        className="w-full accent-yellow-400 cursor-pointer"
                    />
                </div>

                {/* Saturation */}
                <div className="p-3 rounded-xl bg-[#12141D] border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-300">Saturation</span>
                        <span className="font-mono text-yellow-400 font-bold">
                            {Math.round(filters.saturation * 100)}%
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0.0"
                        max="2.0"
                        step="0.05"
                        value={filters.saturation}
                        onChange={(e) => setFilters({ saturation: parseFloat(e.target.value) })}
                        className="w-full accent-yellow-400 cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};
