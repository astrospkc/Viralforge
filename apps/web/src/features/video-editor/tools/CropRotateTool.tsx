import React from 'react';
import { useEditorStore } from '../store/editorStore.ts';
import type { AspectRatioType } from '../types/editor.types.ts';
import { Crop, RotateCw, FlipHorizontal, Smartphone, Square, Monitor } from 'lucide-react';

export const CropRotateTool: React.FC = () => {
    const { project, setAspectRatio, setRotation } = useEditorStore();

    if (!project) return null;

    const currentRatio = project.transform.aspectRatio;
    const currentRotation = project.transform.rotation;

    const handleRotate90 = () => {
        const next = ((currentRotation + 90) % 360) as 0 | 90 | 180 | 270;
        setRotation(next);
    };

    const ratios: Array<{ id: AspectRatioType; label: string; sub: string; icon: React.ReactNode }> = [
        { id: '9:16', label: '9:16', sub: 'Reels / TikTok', icon: <Smartphone size={16} /> },
        { id: '1:1', label: '1:1', sub: 'Square Post', icon: <Square size={16} /> },
        { id: '16:9', label: '16:9', sub: 'Landscape', icon: <Monitor size={16} /> },
    ];

    return (
        <div className="space-y-4">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Crop size={14} className="text-yellow-400" /> Canvas Aspect Ratio
            </span>

            {/* Aspect Ratio Cards */}
            <div className="grid grid-cols-3 gap-2">
                {ratios.map((r) => {
                    const isSelected = currentRatio === r.id;
                    return (
                        <button
                            key={r.id}
                            type="button"
                            onClick={() => setAspectRatio(r.id)}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                                isSelected
                                    ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400 shadow-md shadow-yellow-500/10'
                                    : 'border-slate-800 bg-[#12141D] hover:bg-[#161824] text-slate-400 hover:text-white'
                            }`}
                        >
                            {r.icon}
                            <span className="font-bold text-xs">{r.label}</span>
                            <span className="text-[10px] text-slate-500">{r.sub}</span>
                        </button>
                    );
                })}
            </div>

            {/* Transform Controls */}
            <div className="pt-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider mb-2.5">
                    <RotateCw size={14} className="text-violet-300" /> Orientation & Transform
                </span>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={handleRotate90}
                        className="p-3 rounded-xl bg-[#12141D] border border-slate-800 hover:border-slate-700 hover:bg-[#161824] text-slate-200 flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer"
                    >
                        <RotateCw size={14} className="text-yellow-400" />
                        Rotate 90° ({currentRotation}°)
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            const { project } = useEditorStore.getState();
                            if (project) {
                                useEditorStore.setState({
                                    project: {
                                        ...project,
                                        transform: {
                                            ...project.transform,
                                            flipHorizontal: !project.transform.flipHorizontal,
                                        },
                                        updatedAt: new Date().toISOString(),
                                    },
                                });
                            }
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${
                            project.transform.flipHorizontal
                                ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400'
                                : 'bg-[#12141D] border-slate-800 hover:border-slate-700 hover:bg-[#161824] text-slate-200'
                        }`}
                    >
                        <FlipHorizontal size={14} />
                        Flip Horizontal
                    </button>
                </div>
            </div>
        </div>
    );
};
