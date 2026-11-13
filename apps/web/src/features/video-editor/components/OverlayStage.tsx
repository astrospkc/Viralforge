import React, { useRef, useState } from 'react';
import { useEditorStore } from '../store/editorStore.ts';
import type { TextOverlay } from '../types/editor.types.ts';
import { Trash2 } from 'lucide-react';
import { toPercent } from '../utils/geometry.ts';

interface OverlayStageProps {
    canvasWidth: number;
    canvasHeight: number;
}

export const OverlayStage: React.FC<OverlayStageProps> = ({ canvasWidth, canvasHeight }) => {
    const {
        project,
        currentTimeMs,
        selectedOverlayId,
        selectOverlay,
        updateTextOverlay,
        removeTextOverlay,
    } = useEditorStore();

    const stageRef = useRef<HTMLDivElement>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    if (!project) return null;

    // Filter overlays visible at currentTimeMs
    const visibleOverlays = project.textOverlays.filter(to => {
        const endMs = to.timelineStartMs + to.timelineDurationMs;
        return currentTimeMs >= to.timelineStartMs && currentTimeMs <= endMs;
    });

    const handlePointerDown = (e: React.PointerEvent, overlay: TextOverlay) => {
        e.stopPropagation();
        selectOverlay(overlay.id);

        if (!stageRef.current) return;
        const rect = stageRef.current.getBoundingClientRect();
        const currentPixelX = (overlay.xPercent / 100) * rect.width;
        const currentPixelY = (overlay.yPercent / 100) * rect.height;

        setDraggingId(overlay.id);
        setDragOffset({
            x: e.clientX - rect.left - currentPixelX,
            y: e.clientY - rect.top - currentPixelY,
        });

        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!draggingId || !stageRef.current) return;

        const rect = stageRef.current.getBoundingClientRect();
        const targetPixelX = e.clientX - rect.left - dragOffset.x;
        const targetPixelY = e.clientY - rect.top - dragOffset.y;

        const xPercent = toPercent(targetPixelX, rect.width);
        const yPercent = toPercent(targetPixelY, rect.height);

        updateTextOverlay(draggingId, { xPercent, yPercent });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (draggingId) {
            setDraggingId(null);
            try {
                (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
            } catch {
                // ignore
            }
        }
    };

    return (
        <div
            ref={stageRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={() => selectOverlay(null)}
            className="absolute inset-0 pointer-events-auto overflow-hidden select-none"
            style={{ width: canvasWidth, height: canvasHeight }}
        >
            {visibleOverlays.map((overlay) => {
                const isSelected = selectedOverlayId === overlay.id;

                return (
                    <div
                        key={overlay.id}
                        onPointerDown={(e) => handlePointerDown(e, overlay)}
                        style={{
                            left: `${overlay.xPercent}%`,
                            top: `${overlay.yPercent}%`,
                            transform: 'translate(-50%, -50%)',
                            fontSize: `${Math.max(12, Math.round(overlay.fontSize * (canvasHeight / 1920) * 1.5))}px`,
                            color: overlay.color,
                            backgroundColor: overlay.backgroundColor || 'transparent',
                            fontFamily: overlay.fontFamily,
                            fontWeight: overlay.fontWeight,
                            fontStyle: overlay.fontStyle || 'normal',
                            textAlign: overlay.textAlign,
                            opacity: overlay.opacity ?? 1,
                        }}
                        className={`absolute px-2.5 py-1 rounded cursor-move transition-shadow ${
                            isSelected
                                ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-black/50 shadow-lg'
                                : 'hover:ring-1 hover:ring-white/40'
                        }`}
                    >
                        <span>{overlay.text}</span>

                        {/* Selection Handle & Action Controls */}
                        {isSelected && (
                            <div className="absolute -top-7 right-0 flex items-center gap-1 bg-[#12141D] border border-slate-700 rounded-md px-1.5 py-0.5 shadow-md">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeTextOverlay(overlay.id);
                                    }}
                                    className="text-red-400 hover:text-red-300 p-0.5 transition cursor-pointer"
                                    title="Delete Text"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
