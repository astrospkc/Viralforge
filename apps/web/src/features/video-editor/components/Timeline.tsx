import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useEditorStore } from '../store/editorStore.ts';
import { TimelineRuler } from './TimelineRuler.tsx';
import { Playhead } from './Playhead.tsx';
import { TimelineEngine } from '../engine/TimelineEngine.ts';
import { Film, Type, Volume2, ZoomIn, ZoomOut } from 'lucide-react';
import { clamp } from '../utils/time.ts';

type DragMode = 'playhead' | 'trim-start' | 'trim-end' | null;

export const Timeline: React.FC = () => {
    const {
        project,
        currentTimeMs,
        seek,
        setTrim,
        pixelsPerMs,
        setPixelsPerMs,
    } = useEditorStore();

    const trackContainerRef = useRef<HTMLDivElement>(null);
    const [dragMode, setDragMode] = useState<DragMode>(null);

    const totalDurationMs = project?.source.durationMs || 10000;
    const videoClip = project?.tracks.find(t => t.type === 'video')?.clips[0];
    const startMs = videoClip ? videoClip.sourceStartMs : 0;
    const endMs = videoClip ? videoClip.sourceEndMs : totalDurationMs;

    // Auto-fit zoom on mount or resize
    const handleFitZoom = useCallback(() => {
        if (!trackContainerRef.current) return;
        const width = trackContainerRef.current.clientWidth;
        const fitZoom = TimelineEngine.calculateFitZoom(totalDurationMs, width, 40);
        setPixelsPerMs(fitZoom);
    }, [totalDurationMs, setPixelsPerMs]);

    useEffect(() => {
        handleFitZoom();
    }, [handleFitZoom]);

    if (!project) return null;

    const timelinePixelWidth = Math.max(400, Math.round(totalDurationMs * pixelsPerMs));

    const playheadPixel = TimelineEngine.timeToPixel(currentTimeMs, pixelsPerMs);
    const startPixel = TimelineEngine.timeToPixel(startMs, pixelsPerMs);
    const endPixel = TimelineEngine.timeToPixel(endMs, pixelsPerMs);

    const handlePointerDownTimeline = (e: React.PointerEvent) => {
        if (!trackContainerRef.current) return;
        const rect = trackContainerRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left + trackContainerRef.current.scrollLeft;
        const targetTime = TimelineEngine.pixelToTime(clickX, pixelsPerMs, totalDurationMs);
        seek(targetTime);
        setDragMode('playhead');
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };

    const handlePointerDownHandle = (e: React.PointerEvent, mode: 'trim-start' | 'trim-end') => {
        e.stopPropagation();
        setDragMode(mode);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragMode || !trackContainerRef.current) return;
        const rect = trackContainerRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left + trackContainerRef.current.scrollLeft;
        const timeAtPointer = TimelineEngine.pixelToTime(currentX, pixelsPerMs, totalDurationMs);

        if (dragMode === 'playhead') {
            seek(timeAtPointer);
        } else if (dragMode === 'trim-start') {
            const newStart = clamp(timeAtPointer, 0, endMs - 500);
            setTrim(newStart, endMs);
            seek(newStart);
        } else if (dragMode === 'trim-end') {
            const newEnd = clamp(timeAtPointer, startMs + 500, totalDurationMs);
            setTrim(startMs, newEnd);
            seek(newEnd);
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (dragMode) {
            setDragMode(null);
            try {
                (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
            } catch {
                // ignore
            }
        }
    };

    return (
        <div className="h-44 bg-[#0A0C10] border-t border-slate-800/80 flex flex-col select-none">
            {/* Timeline Header Toolbar */}
            <div className="h-8 px-4 flex items-center justify-between bg-[#10121A] border-b border-slate-800/80 text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-200">Timeline</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 font-semibold">
                        Reel: {((endMs - startMs) / 1000).toFixed(1)}s
                    </span>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setPixelsPerMs(Math.max(0.01, pixelsPerMs * 0.75))}
                        className="p-1 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
                        title="Zoom Out"
                    >
                        <ZoomOut size={13} />
                    </button>
                    <button
                        type="button"
                        onClick={handleFitZoom}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition cursor-pointer"
                    >
                        Fit
                    </button>
                    <button
                        type="button"
                        onClick={() => setPixelsPerMs(Math.min(0.5, pixelsPerMs * 1.35))}
                        className="p-1 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
                        title="Zoom In"
                    >
                        <ZoomIn size={13} />
                    </button>
                </div>
            </div>

            {/* Scrollable Tracks Area */}
            <div
                ref={trackContainerRef}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[#0C0E14] cursor-crosshair scrollbar-thin"
            >
                {/* Time Ruler */}
                <TimelineRuler
                    durationMs={totalDurationMs}
                    pixelsPerMs={pixelsPerMs}
                    width={timelinePixelWidth}
                />

                {/* Tracks Container */}
                <div
                    onPointerDown={handlePointerDownTimeline}
                    className="relative pt-2 pb-3 px-2 space-y-2 min-h-[96px]"
                    style={{ width: timelinePixelWidth }}
                >
                    {/* Draggable Playhead Needle */}
                    <Playhead pixelPosition={playheadPixel} height={90} />

                    {/* Track 1: Video Clip Track with Trim Handles */}
                    <div className="relative h-12 bg-[#161824] rounded-xl border border-slate-800 overflow-hidden group">
                        {/* Filmstrip faux pattern */}
                        <div className="absolute inset-0 opacity-20 flex items-center justify-around pointer-events-none">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <Film key={i} size={18} className="text-slate-400" />
                            ))}
                        </div>

                        {/* Dimmed left inactive area */}
                        <div
                            className="absolute top-0 bottom-0 left-0 bg-black/60 pointer-events-none"
                            style={{ width: startPixel }}
                        />

                        {/* Active Trimmed Region */}
                        <div
                            className="absolute top-0 bottom-0 border-y-2 border-yellow-400 bg-yellow-400/10 pointer-events-none flex items-center justify-between px-3"
                            style={{
                                left: startPixel,
                                width: endPixel - startPixel,
                            }}
                        >
                            <span className="text-[10px] font-bold text-yellow-300 drop-shadow truncate">
                                {project.source.fileName}
                            </span>
                        </div>

                        {/* Left Trim Handle */}
                        <div
                            onPointerDown={(e) => handlePointerDownHandle(e, 'trim-start')}
                            className="absolute top-0 bottom-0 w-3.5 bg-yellow-400 hover:bg-yellow-300 rounded-l-md cursor-ew-resize z-20 flex items-center justify-center shadow-lg transition"
                            style={{ left: Math.max(0, startPixel - 14) }}
                            title="Drag to trim start"
                        >
                            <div className="w-[1.5px] h-4 bg-slate-950 rounded-full" />
                        </div>

                        {/* Right Trim Handle */}
                        <div
                            onPointerDown={(e) => handlePointerDownHandle(e, 'trim-end')}
                            className="absolute top-0 bottom-0 w-3.5 bg-yellow-400 hover:bg-yellow-300 rounded-r-md cursor-ew-resize z-20 flex items-center justify-center shadow-lg transition"
                            style={{ left: endPixel }}
                            title="Drag to trim end"
                        >
                            <div className="w-[1.5px] h-4 bg-slate-950 rounded-full" />
                        </div>

                        {/* Dimmed right inactive area */}
                        <div
                            className="absolute top-0 bottom-0 right-0 bg-black/60 pointer-events-none"
                            style={{ left: endPixel + 14 }}
                        />
                    </div>

                    {/* Track 2: Text Overlays Indicator Track */}
                    <div className="relative h-6 bg-[#12141D] rounded-lg border border-slate-800/80 overflow-hidden flex items-center">
                        <div className="absolute left-2 flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase pointer-events-none">
                            <Type size={10} className="text-yellow-400" /> Overlays
                        </div>

                        {/* Individual Text Overlay Clips on Timeline */}
                        {project.textOverlays.map((to) => {
                            const left = TimelineEngine.timeToPixel(to.timelineStartMs, pixelsPerMs);
                            const width = Math.max(24, TimelineEngine.timeToPixel(to.timelineDurationMs, pixelsPerMs));

                            return (
                                <div
                                    key={to.id}
                                    style={{ left, width }}
                                    className="absolute top-1 bottom-1 bg-violet-500/30 border border-violet-400/50 rounded text-[9px] font-bold text-violet-200 px-1.5 flex items-center truncate shadow"
                                >
                                    <span className="truncate">{to.text}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Track 3: Audio Indicator Track */}
                    <div className="relative h-5 bg-[#12141D] rounded-lg border border-slate-800/80 overflow-hidden flex items-center px-2">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase">
                            <Volume2 size={10} className="text-yellow-400" />
                            <span>Audio: {project.audio.originalMuted ? 'Muted' : `${Math.round(project.audio.originalVolume * 100)}%`}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
