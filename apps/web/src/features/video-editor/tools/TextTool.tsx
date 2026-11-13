import React from 'react';
import { useEditorStore } from '../store/editorStore.ts';
import { Type, Plus, Trash2, AlignLeft, AlignCenter, AlignRight, Bold } from 'lucide-react';

const COLOR_SWATCHES = [
    { label: 'Brand Yellow', color: '#FACC15' },
    { label: 'White', color: '#FFFFFF' },
    { label: 'Violet', color: '#C4B5FD' },
    { label: 'Rose Red', color: '#F43F5E' },
    { label: 'Emerald', color: '#10B981' },
    { label: 'Dark', color: '#0F172A' },
];

export const TextTool: React.FC = () => {
    const {
        project,
        selectedOverlayId,
        addTextOverlay,
        updateTextOverlay,
        removeTextOverlay,
        selectOverlay,
    } = useEditorStore();

    if (!project) return null;

    const selectedOverlay = project.textOverlays.find(o => o.id === selectedOverlayId);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                    <Type size={14} className="text-yellow-400" /> Text Overlays
                </span>
                <button
                    type="button"
                    onClick={() => addTextOverlay('New Reel Text')}
                    className="inline-flex items-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-xs transition cursor-pointer shadow-sm shadow-yellow-500/20"
                >
                    <Plus size={13} /> Add Text
                </button>
            </div>

            {/* List of text overlays */}
            {project.textOverlays.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {project.textOverlays.map((o, idx) => {
                        const isSelected = o.id === selectedOverlayId;
                        return (
                            <button
                                key={o.id}
                                type="button"
                                onClick={() => selectOverlay(o.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border shrink-0 transition cursor-pointer ${
                                    isSelected
                                        ? 'bg-yellow-400 text-slate-950 border-yellow-400 shadow-md shadow-yellow-500/20'
                                        : 'bg-[#12141D] text-slate-300 border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                Text {idx + 1}: {o.text.slice(0, 10)}...
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Selected overlay editor */}
            {selectedOverlay ? (
                <div className="space-y-3 p-3.5 rounded-2xl bg-[#12141D] border border-slate-800">
                    <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                            Text Content
                        </label>
                        <input
                            type="text"
                            value={selectedOverlay.text}
                            onChange={(e) => updateTextOverlay(selectedOverlay.id, { text: e.target.value })}
                            className="w-full bg-[#181B26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:border-yellow-400 focus:outline-none"
                            placeholder="Enter text..."
                        />
                    </div>

                    {/* Font size & style */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                                <span>Size</span>
                                <span className="text-yellow-400 font-mono">{selectedOverlay.fontSize}px</span>
                            </div>
                            <input
                                type="range"
                                min="14"
                                max="72"
                                value={selectedOverlay.fontSize}
                                onChange={(e) => updateTextOverlay(selectedOverlay.id, { fontSize: Number(e.target.value) })}
                                className="w-full accent-yellow-400 cursor-pointer"
                            />
                        </div>

                        {/* Alignment & Weight buttons */}
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Formatting</span>
                            <div className="flex items-center gap-1 bg-[#181B26] border border-slate-700/80 rounded-lg p-0.5">
                                <button
                                    type="button"
                                    onClick={() => updateTextOverlay(selectedOverlay.id, { textAlign: 'left' })}
                                    className={`p-1.5 rounded flex-1 flex items-center justify-center transition ${selectedOverlay.textAlign === 'left' ? 'bg-yellow-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <AlignLeft size={13} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateTextOverlay(selectedOverlay.id, { textAlign: 'center' })}
                                    className={`p-1.5 rounded flex-1 flex items-center justify-center transition ${selectedOverlay.textAlign === 'center' ? 'bg-yellow-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <AlignCenter size={13} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateTextOverlay(selectedOverlay.id, { textAlign: 'right' })}
                                    className={`p-1.5 rounded flex-1 flex items-center justify-center transition ${selectedOverlay.textAlign === 'right' ? 'bg-yellow-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <AlignRight size={13} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateTextOverlay(selectedOverlay.id, { fontWeight: selectedOverlay.fontWeight === 'bold' ? 'normal' : 'bold' })}
                                    className={`p-1.5 rounded flex-1 flex items-center justify-center transition ${selectedOverlay.fontWeight === 'bold' ? 'bg-violet-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <Bold size={13} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Color palette */}
                    <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">Color</span>
                        <div className="flex items-center gap-2">
                            {COLOR_SWATCHES.map((swatch) => (
                                <button
                                    key={swatch.color}
                                    type="button"
                                    onClick={() => updateTextOverlay(selectedOverlay.id, { color: swatch.color })}
                                    style={{ backgroundColor: swatch.color }}
                                    className={`w-6 h-6 rounded-full border-2 transition transform hover:scale-110 cursor-pointer ${
                                        selectedOverlay.color === swatch.color ? 'border-white scale-110 shadow-md' : 'border-slate-700'
                                    }`}
                                    title={swatch.label}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Delete action */}
                    <div className="pt-2 border-t border-slate-800 flex justify-end">
                        <button
                            type="button"
                            onClick={() => removeTextOverlay(selectedOverlay.id)}
                            className="text-red-400 hover:text-red-300 text-xs font-semibold inline-flex items-center gap-1 transition cursor-pointer"
                        >
                            <Trash2 size={13} /> Delete Overlay
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-6 rounded-2xl bg-[#12141D] border border-slate-800/80 text-center">
                    <p className="text-xs text-slate-400">
                        Select a text overlay on the preview video or click <span className="text-yellow-400 font-bold">Add Text</span> above to place a new caption.
                    </p>
                </div>
            )}
        </div>
    );
};
