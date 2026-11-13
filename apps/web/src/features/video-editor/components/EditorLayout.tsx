import React, { useState } from 'react';
import { useEditorStore } from '../store/editorStore.ts';
import { ImportVideo } from './ImportVideo.tsx';
import { EditorTopBar } from './EditorTopBar.tsx';
import { VideoPreview } from './VideoPreview.tsx';
import { PreviewControls } from './PreviewControls.tsx';
import { ToolPanel } from './ToolPanel.tsx';
import { Timeline } from './Timeline.tsx';
import { PublishModal } from './PublishModal.tsx';

export const EditorLayout: React.FC = () => {
    const { project } = useEditorStore();
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

    if (!project) {
        return (
            <div className="min-h-screen bg-[#0A0C10] flex flex-col">
                <ImportVideo />
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-[#0A0C10] flex flex-col overflow-hidden text-slate-100 select-none">
            {/* Top Navigation Bar */}
            <EditorTopBar onOpenPublish={() => setIsPublishModalOpen(true)} />

            {/* Central Workspace: Preview + ToolPanel */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                {/* Main Viewport & Preview Controls */}
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#07080C]">
                    <VideoPreview />
                    <PreviewControls />
                </div>

                {/* Right Tool & Adjustments Panel */}
                <ToolPanel />
            </div>

            {/* Bottom Timeline Section */}
            <Timeline />

            {/* Publish Flow Modal */}
            <PublishModal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
            />
        </div>
    );
};
