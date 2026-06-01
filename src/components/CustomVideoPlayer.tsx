import { useRef, useState, useEffect, useCallback } from "react";
import {
    Play, Pause, Volume2, VolumeX, Maximize2, Minimize2,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
const fmt = (s: number) => {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
};

/* ─────────────────────────────────────────────────────────────
   CustomVideoPlayer
───────────────────────────────────────────────────────────── */
interface Props {
    src: string;
    autoPlay?: boolean;
}

const CustomVideoPlayer = ({ src, autoPlay = true }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [hoverX, setHoverX] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    /* ── Auto-hide controls ── */
    const showControls = useCallback(() => {
        setControlsVisible(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => {
            if (playing) setControlsVisible(false);
        }, 2800);
    }, [playing]);

    useEffect(() => { showControls(); }, []);
    useEffect(() => {
        if (!playing) {
            setControlsVisible(true);
            if (hideTimer.current) clearTimeout(hideTimer.current);
        }
    }, [playing]);

    /* ── Video event listeners ── */
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const onTime = () => setCurrent(v.currentTime);
        const onDur = () => setDuration(v.duration);
        const onPlay = () => setPlaying(true);
        const onPause = () => setPlaying(false);
        const onProgress = () => {
            if (v.buffered.length > 0) {
                setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
            }
        };
        v.addEventListener("timeupdate", onTime);
        v.addEventListener("durationchange", onDur);
        v.addEventListener("play", onPlay);
        v.addEventListener("pause", onPause);
        v.addEventListener("progress", onProgress);
        if (autoPlay) v.play().catch(() => { });
        return () => {
            v.removeEventListener("timeupdate", onTime);
            v.removeEventListener("durationchange", onDur);
            v.removeEventListener("play", onPlay);
            v.removeEventListener("pause", onPause);
            v.removeEventListener("progress", onProgress);
        };
    }, [src]);

    /* ── Fullscreen change sync ── */
    useEffect(() => {
        const onChange = () => setFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", onChange);
        return () => document.removeEventListener("fullscreenchange", onChange);
    }, []);

    /* ─────────────────────────────────────────────
       Scrubbing logic — mouse + touch
    ───────────────────────────────────────────── */
    const getSeekRatio = (clientX: number) => {
        const bar = progressBarRef.current;
        if (!bar) return 0;
        const { left, width } = bar.getBoundingClientRect();
        return Math.min(1, Math.max(0, (clientX - left) / width));
    };

    const applySeek = useCallback((clientX: number) => {
        const ratio = getSeekRatio(clientX);
        const v = videoRef.current;
        if (!v || !duration) return;
        v.currentTime = ratio * duration;
        setCurrent(ratio * duration);
    }, [duration]);

    /* Mouse */
    const onBarMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setDragging(true);
        applySeek(e.clientX);
    };

    useEffect(() => {
        if (!dragging) return;
        const onMove = (e: MouseEvent) => applySeek(e.clientX);
        const onUp = () => setDragging(false);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [dragging, applySeek]);

    /* Touch */
    const onBarTouchStart = (e: React.TouchEvent) => {
        setDragging(true);
        applySeek(e.touches[0].clientX);
    };
    useEffect(() => {
        if (!dragging) return;
        const onMove = (e: TouchEvent) => applySeek(e.touches[0].clientX);
        const onEnd = () => setDragging(false);
        window.addEventListener("touchmove", onMove);
        window.addEventListener("touchend", onEnd);
        return () => {
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("touchend", onEnd);
        };
    }, [dragging, applySeek]);

    /* Hover preview time */
    const onBarMouseMove = (e: React.MouseEvent) => {
        const ratio = getSeekRatio(e.clientX);
        setHoverTime(ratio * duration);
        setHoverX(e.clientX - (progressBarRef.current?.getBoundingClientRect().left ?? 0));
    };

    /* ── Controls ── */
    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        v.paused ? v.play() : v.pause();
    };

    const toggleMute = () => {
        const v = videoRef.current;
        if (!v) return;
        v.muted = !v.muted;
        setMuted(v.muted);
    };

    const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        const v = videoRef.current;
        if (!v) return;
        v.volume = val;
        setVolume(val);
        setMuted(val === 0);
        v.muted = val === 0;
    };

    const toggleFullscreen = () => {
        const el = containerRef.current;
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const progress = duration ? (current / duration) * 100 : 0;

    /* ── Skip on video click ── */
    const onVideoClick = () => { togglePlay(); showControls(); };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-black select-none overflow-hidden group"
            onMouseMove={showControls}
            style={{ cursor: controlsVisible ? "default" : "none" }}
        >
            {/* ── Video element ── */}
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-contain"
                onClick={onVideoClick}
                preload="metadata"
                playsInline
            />

            {/* ── Big play/pause tap indicator ── */}
            {!playing && (
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ background: "rgba(0,0,0,0.25)" }}
                >
                    <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <Play size={28} className="fill-white text-white ml-1" />
                    </div>
                </div>
            )}

            {/* ── Controls overlay ── */}
            <div
                className="absolute bottom-0 left-0 right-0 transition-opacity duration-300"
                style={{
                    opacity: controlsVisible ? 1 : 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
                    paddingBottom: "12px",
                }}
            >
                {/* ── Progress / Scrub bar ── */}
                <div className="px-4 pb-1 pt-3">
                    <div
                        ref={progressBarRef}
                        className="relative w-full rounded-full cursor-pointer"
                        style={{ height: "4px", background: "rgba(255,255,255,0.2)" }}
                        onMouseDown={onBarMouseDown}
                        onMouseMove={onBarMouseMove}
                        onMouseLeave={() => setHoverTime(null)}
                        onTouchStart={onBarTouchStart}
                    >
                        {/* Buffered */}
                        <div
                            className="absolute top-0 left-0 h-full rounded-full"
                            style={{ width: `${buffered}%`, background: "rgba(255,255,255,0.25)" }}
                        />
                        {/* Played */}
                        <div
                            className="absolute top-0 left-0 h-full rounded-full"
                            style={{
                                width: `${progress}%`,
                                background: "linear-gradient(90deg, #E50914, #ff4d57)",
                                transition: dragging ? "none" : "width 0.1s linear",
                            }}
                        />
                        {/* Thumb */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white shadow-lg"
                            style={{
                                left: `${progress}%`,
                                width: dragging ? "18px" : "14px",
                                height: dragging ? "18px" : "14px",
                                background: "#E50914",
                                transition: dragging ? "none" : "left 0.1s linear, width 0.15s, height 0.15s",
                                cursor: "grab",
                                boxShadow: "0 0 8px rgba(229,9,20,0.6)",
                            }}
                        />
                        {/* Hover time tooltip */}
                        {hoverTime !== null && (
                            <div
                                className="absolute -top-8 px-2 py-1 rounded-md text-white text-xs font-mono pointer-events-none"
                                style={{
                                    left: hoverX,
                                    transform: "translateX(-50%)",
                                    background: "rgba(0,0,0,0.85)",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {fmt(hoverTime)}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Bottom controls row ── */}
                <div className="px-4 flex items-center gap-3 mt-1">
                    {/* Play / Pause */}
                    <button
                        onClick={togglePlay}
                        className="text-white hover:text-red-400 transition-colors shrink-0"
                    >
                        {playing
                            ? <Pause size={20} className="fill-white" />
                            : <Play size={20} className="fill-white" />
                        }
                    </button>

                    {/* Time */}
                    <span className="text-white text-xs font-mono shrink-0 tabular-nums">
                        {fmt(current)} / {fmt(duration)}
                    </span>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Volume */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button onClick={toggleMute} className="text-white hover:text-red-400 transition-colors">
                            {muted || volume === 0
                                ? <VolumeX size={18} />
                                : <Volume2 size={18} />
                            }
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.02}
                            value={muted ? 0 : volume}
                            onChange={onVolumeChange}
                            className="w-20 accent-red-500 cursor-pointer"
                            style={{ height: "4px" }}
                        />
                    </div>

                    {/* Fullscreen */}
                    <button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-red-400 transition-colors shrink-0"
                    >
                        {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomVideoPlayer;
