import React from 'react';
import { useEditorStore, type ActiveTool } from '../store/editorStore.ts';
import { Scissors, Crop, Type, Sliders, Volume2 } from 'lucide-react';
import { TrimTool } from '../tools/TrimTool.tsx';
import { CropRotateTool } from '../tools/CropRotateTool.tsx';
import { TextTool } from '../tools/TextTool.tsx';
import { FilterTool } from '../tools/FilterTool.tsx';
import { AudioTool } from '../tools/AudioTool.tsx';

interface ToolTab {
    id: ActiveTool;
    label: string;
    icon: React.ReactNode;
}

const TABS: ToolTab[] = [
    { id: 'trim', label: 'Trim', icon: <Scissors size={14} /> },
    { id: 'crop', label: 'Crop / Rotate', icon: <Crop size={14} /> },
    { id: 'text', label: 'Text Overlays', icon: <Type size={14} /> },
    { id: 'filter', label: 'Filters', icon: <Sliders size={14} /> },
    { id: 'audio', label: 'Audio', icon: <Volume2 size={14} /> },
];

export const ToolPanel: React.FC = () => {
    const { activeTool, setActiveTool } = useEditorStore();

    return (
        <div className="w-full md:w-80 lg:w-96 bg-[#0E1015] border-l border-slate-800/80 flex flex-col h-full overflow-hidden select-none">
            {/* Tool Tabs Bar */}
            <div className="flex items-center gap-1 p-2 bg-[#12141D] border-b border-slate-800/80 overflow-x-auto scrollbar-none">
                {TABS.map((tab) => {
                    const isActive = activeTool === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTool(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                                isActive
                                    ? 'bg-yellow-400 text-slate-950 shadow-md shadow-yellow-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Active Tool Content */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {activeTool === 'trim' && <TrimTool />}
                {activeTool === 'crop' && <CropRotateTool />}
                {activeTool === 'text' && <TextTool />}
                {activeTool === 'filter' && <FilterTool />}
                {activeTool === 'audio' && <AudioTool />}
            </div>
        </div>
    );
};
