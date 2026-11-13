import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useEditorStore } from '../store/editorStore.ts';
import { OverlayStage } from './OverlayStage.tsx';
import { calculateFitDimensions } from '../utils/geometry.ts';
import { Play, RotateCw } from 'lucide-react';
import { formatTimeMs } from '../utils/time.ts';

export const VideoPreview: React.FC = () => {
    const {
        project,
        localBlobUrl,
        isPlaying,
        setPlaying,
        currentTimeMs,
        seek,
    } = useEditorStore();

    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const animFrameRef = useRef<number | null>(null);

    const [viewportSize, setViewportSize] = useState({ width: 360, height: 640 });

    const videoClip = project?.tracks.find(t => t.type === 'video')?.clips[0];
    const sourceStartMs = videoClip ? videoClip.sourceStartMs : 0;
    const sourceEndMs = videoClip ? videoClip.sourceEndMs : (project?.source.durationMs || 10000);

    // Update viewport dimensions on resize to preserve aspect ratio
    const updateDimensions = useCallback(() => {
        if (!containerRef.current || !project) return;
        const rect = containerRef.current.getBoundingClientRect();
        const fit = calculateFitDimensions(project.transform.aspectRatio, rect.width, rect.height, 16);
        setViewportSize({ width: fit.width, height: fit.height });
    }, [project]);

    useEffect(() => {
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [updateDimensions]);

    // Video play/pause effect
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            // Check if current time is at or past end
            if (video.currentTime * 1000 >= sourceEndMs) {
                video.currentTime = sourceStartMs / 1000;
            }
            video.play().catch(() => setPlaying(false));
        } else {
            video.pause();
        }
    }, [isPlaying, sourceStartMs, sourceEndMs, setPlaying]);

    // Synchronize playhead time with requestAnimationFrame while playing
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const loop = () => {
            if (video && !video.paused) {
                const currentMs = Math.round(video.currentTime * 1000);

                // If reached trim end, loop back to trim start
                if (currentMs >= sourceEndMs) {
                    video.currentTime = sourceStartMs / 1000;
                    seek(sourceStartMs);
                } else {
                    seek(currentMs);
                }
            }
            if (isPlaying) {
                animFrameRef.current = requestAnimationFrame(loop);
            }
        };

        if (isPlaying) {
            animFrameRef.current = requestAnimationFrame(loop);
        } else if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
        }

        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [isPlaying, sourceStartMs, sourceEndMs, seek]);

    // Synchronize seek from external controls (timeline drag, trim changes)
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const videoTimeMs = Math.round(video.currentTime * 1000);
        // Only seek if the difference is meaningful (> 50ms) to avoid stutter
        if (Math.abs(videoTimeMs - currentTimeMs) > 60) {
            video.currentTime = currentTimeMs / 1000;
        }
    }, [currentTimeMs]);

    // Audio settings effect
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !project) return;
        video.muted = project.audio.originalMuted;
        video.volume = project.audio.originalVolume;
    }, [project]);

    if (!project || !localBlobUrl) return null;

    const { filters, transform } = project;

    // Filter style string
    const filterStyle = `brightness(${filters.brightness}) contrast(${filters.contrast}) saturate(${filters.saturation})`;
    const transformStyle = `rotate(${transform.rotation}deg)${transform.flipHorizontal ? ' scaleX(-1)' : ''}`;

    const activeDurationMs = sourceEndMs - sourceStartMs;
    const currentProgressMs = Math.max(0, currentTimeMs - sourceStartMs);

    return (
        <div
            ref={containerRef}
            className="flex-1 flex flex-col items-center justify-center p-3 relative bg-[#090A0E] overflow-hidden select-none"
        >
            {/* Viewport Frame with Aspect Ratio */}
            <div
                className="relative rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 transition-all duration-200"
                style={{ width: viewportSize.width, height: viewportSize.height }}
            >
                {/* Source HTML5 Video */}
                <video
                    ref={videoRef}
                    src={localBlobUrl}
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover transition-[filter,transform] duration-75 pointer-events-none"
                    style={{
                        filter: filterStyle,
                        transform: transformStyle,
                    }}
                />

                {/* Interactive Text & Overlay Canvas Stage */}
                <OverlayStage canvasWidth={viewportSize.width} canvasHeight={viewportSize.height} />

                {/* Aspect Ratio Badge */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-slate-300 pointer-events-none uppercase">
                    {project.transform.aspectRatio}
                </div>

                {/* Play/Pause Overlay Click Trigger */}
                <button
                    type="button"
                    onClick={() => setPlaying(!isPlaying)}
                    className="absolute inset-0 w-full h-full flex items-center justify-center group cursor-pointer bg-transparent focus:outline-none"
                >
                    {!isPlaying && (
                        <div className="w-14 h-14 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center shadow-lg shadow-yellow-500/30 transform group-hover:scale-110 transition">
                            <Play size={24} className="ml-1 fill-current" />
                        </div>
                    )}
                </button>

                {/* Rotation Indicator (if rotated) */}
                {transform.rotation !== 0 && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-yellow-400/90 text-slate-950 text-[10px] font-bold flex items-center gap-1 shadow">
                        <RotateCw size={11} /> {transform.rotation}°
                    </div>
                )}

                {/* Time Indicator Badge */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono font-bold text-white pointer-events-none">
                    {formatTimeMs(currentProgressMs, true)} / {formatTimeMs(activeDurationMs, false)}
                </div>
            </div>
        </div>
    );
};
