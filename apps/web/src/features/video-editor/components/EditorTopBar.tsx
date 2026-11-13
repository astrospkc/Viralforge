import React, { useState } from 'react';
import { useEditorStore } from '../store/editorStore.ts';
import { Undo2, Redo2, Save, Send, X, Check, Loader2 } from 'lucide-react';
import { DraftService } from '../services/draftService.ts';
import { useAuthStore } from '../../../store/auth_store.ts';
import toast from 'react-hot-toast';

interface EditorTopBarProps {
    onOpenPublish: () => void;
}

export const EditorTopBar: React.FC<EditorTopBarProps> = ({ onOpenPublish }) => {
    const {
        project,
        undo,
        redo,
        canUndo,
        canRedo,
        reset,
        saveStatus,
        setSaveStatus,
    } = useEditorStore();

    const { token } = useAuthStore();
    const [isSaving, setIsSaving] = useState(false);

    if (!project) return null;

    const handleSaveDraft = async () => {
        setIsSaving(true);
        setSaveStatus('saving');
        try {
            const res = await DraftService.saveDraft(project, token);
            if (res.success) {
                setSaveStatus('saved');
                toast.success('Draft saved locally & synced.');
            } else {
                setSaveStatus('error', res.message);
                toast.error(res.message);
            }
        } catch {
            setSaveStatus('error', 'Failed to save draft');
            toast.error('Failed to save draft');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    return (
        <header className="h-14 bg-[#0E1015] border-b border-slate-800/80 px-4 flex items-center justify-between select-none">
            {/* Left: Brand + Project Title */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-yellow-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-md shadow-yellow-500/20">
                        VF
                    </span>
                    <span className="text-sm font-black tracking-tight text-white hidden sm:inline">
                        VIRAL<span className="text-violet-300 font-light ml-0.5">EDITOR</span>
                    </span>
                </div>

                <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

                {/* Editable Project Title */}
                <input
                    type="text"
                    value={project.title}
                    onChange={(e) => {
                        useEditorStore.setState({
                            project: { ...project, title: e.target.value },
                        });
                    }}
                    className="bg-transparent hover:bg-slate-800/50 focus:bg-[#161824] border border-transparent focus:border-yellow-400/50 rounded-lg px-2.5 py-1 text-xs font-bold text-white max-w-[160px] sm:max-w-xs transition focus:outline-none"
                    placeholder="Project Name..."
                />
            </div>

            {/* Center: Undo / Redo */}
            <div className="flex items-center gap-1 bg-[#12141D] border border-slate-800/80 rounded-xl p-0.5">
                <button
                    type="button"
                    disabled={!canUndo()}
                    onClick={undo}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-slate-800 transition cursor-pointer"
                    title="Undo (Ctrl+Z)"
                >
                    <Undo2 size={14} />
                </button>
                <button
                    type="button"
                    disabled={!canRedo()}
                    onClick={redo}
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-lg hover:bg-slate-800 transition cursor-pointer"
                    title="Redo (Ctrl+Y)"
                >
                    <Redo2 size={14} />
                </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Save Draft */}
                <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                    className="hidden sm:inline-flex items-center gap-1.5 bg-[#161824] hover:bg-[#1a1e2c] text-slate-200 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                    {isSaving ? (
                        <Loader2 size={13} className="animate-spin text-yellow-400" />
                    ) : saveStatus === 'saved' ? (
                        <Check size={13} className="text-green-400" />
                    ) : (
                        <Save size={13} className="text-slate-400" />
                    )}
                    <span>{saveStatus === 'saved' ? 'Saved' : 'Save Draft'}</span>
                </button>

                {/* Publish Button */}
                <button
                    type="button"
                    onClick={onOpenPublish}
                    className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 px-4 py-1.5 rounded-xl text-xs font-black shadow-md shadow-yellow-500/20 hover:scale-[1.02] transition cursor-pointer"
                >
                    <Send size={13} />
                    <span>Publish Reel</span>
                </button>

                {/* Close Project */}
                <button
                    type="button"
                    onClick={() => {
                        if (window.confirm('Close current project? Any unsaved edits will be lost.')) {
                            reset();
                        }
                    }}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer ml-1"
                    title="Close Video"
                >
                    <X size={16} />
                </button>
            </div>
        </header>
    );
};
