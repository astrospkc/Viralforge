import React, { useState, useCallback, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import {
    Upload, FileVideo, Scissors, Download,
    RefreshCw, X, ChevronRight, Zap, Clock,
    Film, Clapperboard, Tag, Check, Image as ImageIcon,
    Play, Pause, AlertCircle
} from 'lucide-react';
import { VideoService, type VideoUpload } from '../services/video_service';
import { useAuthStore } from '../store/auth_store';
import toast from 'react-hot-toast';
import TranscodeStatus from '../components/TranscodeStatus';

// ── Types ──────────────────────────────────────────────────────────────────────
type PostType = 'video' | 'shorts';
type UploadPhase =
    | 'idle'            // nothing selected
    | 'ready'           // file chosen, awaiting upload
    | 'uploading'       // sending to S3
    | 'transcoding'     // Shorts: waiting for transcode to finish
    | 'metadata'        // Video: fill in metadata after upload
    | 'editing'         // Shorts: clip editor
    | 'done'         // upload complete
    | 'failed';

// ── Component ──────────────────────────────────────────────────────────────────
const TranscodingPage = () => {
    const { token } = useAuthStore();

    // Tab / mode
    const [postType, setPostType] = useState<PostType>('video');


    // File selection
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadPhase, setUploadPhase] = useState<UploadPhase>('idle');
    const [pendingDbSave, setPendingDbSave] = useState<{ filename: string; contentType: string; objectKey: string } | null>(null);

    // After successful upload → we get a videoId to open the correct modal
    const [uploadedVideoId, setUploadedVideoId] = useState<number | null>(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
    const [uploadedThumbnails, setUploadedThumbnails] = useState<string[]>([]);

    // Video publish modal state (inline dropdown style)
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [videoTagInput, setVideoTagInput] = useState('');
    const [videoTags, setVideoTags] = useState<string[]>([]);
    const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
    const [customThumb, setCustomThumb] = useState<File | null>(null);
    const [customThumbPreview, setCustomThumbPreview] = useState<string | null>(null);
    const thumbInputRef = useRef<HTMLInputElement>(null);

    // Shorts editor state (inline dropdown)
    const videoRef = useRef<HTMLVideoElement>(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [shortsTitle, setShortsTitle] = useState('');
    const [shortsDescription, setShortsDescription] = useState('');
    const [shortsTagInput, setShortsTagInput] = useState('');
    const [shortsTags, setShortsTags] = useState<string[]>([]);
    const [video_id, setVideo_Id] = useState<number | null>(null);

    // Library
    const [allVideos, setAllVideos] = useState<VideoUpload[] | null>(null);

    useEffect(() => {
        const fetchVideos = async () => {
            const response = await VideoService.GetAllVideos(token);
            if (response?.Success) setAllVideos(response.VideoFiles);
        };
        fetchVideos();
    }, [token]);

    // reset when switching tabs
    useEffect(() => {
        resetAll();
    }, [postType]);

    const resetAll = () => {
        setSelectedFile(null);
        setPendingDbSave(null);
        setUploadPhase('idle');
        setUploadedVideoId(null);
        setUploadedFileUrl('');
        setUploadedThumbnails([]);
        setVideoTitle(''); setVideoDescription(''); setVideoTags([]); setVideoTagInput('');
        setSelectedThumbnail(null); setCustomThumb(null); setCustomThumbPreview(null);
        setShortsTitle(''); setShortsDescription(''); setShortsTags([]); setShortsTagInput('');
        setStartTime(0); setEndTime(0); setDuration(0); setCurrentTime(0); setIsPlaying(false);
    };

    // ── File handlers ──────────────────────────────────────────────────────────
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) { setSelectedFile(e.target.files[0]); setUploadPhase('ready'); }
    };
    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
        if (e.dataTransfer.files?.[0]) { setSelectedFile(e.dataTransfer.files[0]); setUploadPhase('ready'); }
    }, []);
    const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
    const onDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
    const clearFile = () => { setSelectedFile(null); setUploadPhase('idle'); setPendingDbSave(null); };

    // ------------polling for transcoding status ----------------------
    useEffect(() => {
        if (uploadPhase !== 'transcoding') return;
        const interval = setInterval(async () => {
            const res = await VideoService.GetTranscodeStatus(token, uploadedVideoId!);
            if (res?.Success) {
                if (res.Data?.transcode_status === 'completed') {
                    toast.success('Transcoding completed');
                    setUploadPhase('ready');
                } else if (res.Data?.transcode_status === 'failed') {
                    toast.error('Transcoding failed');
                    setUploadPhase('failed');
                }
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [uploadPhase, uploadedVideoId, token]);

    // ── Upload ─────────────────────────────────────────────────────────────────
    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploadPhase('uploading');
        try {
            const presigned = await VideoService.GetPresignedUrl(
                { filename: selectedFile.name, contentType: selectedFile.type }, token
            );
            if (presigned.Code !== 200) { toast.error('Failed to get upload URL'); setUploadPhase('ready'); return; }

            const putRes = await fetch(presigned.Url, {
                method: 'PUT', body: selectedFile,
                headers: { 'Content-Type': selectedFile.type },
            });
            if (!putRes.ok) { toast.error('Upload to storage failed'); setUploadPhase('ready'); return; }

            setPendingDbSave({ filename: selectedFile.name, contentType: selectedFile.type, objectKey: presigned.ObjectKey });

            // TODO: in createVideo() - add parameter:= title, description , tags, thumbnail
            // one its done , transcode the video in the background process
            // so basically click upload video :- createVideo and Transcode video runs
            // transcoding result :- "processing", "completed" or "failed"
            // processing - show processing modal
            // completed - show completed modal
            // failed - show failed modal - toast it
            const createRes = await VideoService.CreateVideo(
                selectedFile.name, selectedFile.type, presigned.ObjectKey, token
            );
            console.log("create video response :", createRes)
            if (createRes?.Success) {
                toast.success('Uploaded! ' + (postType === 'video' ? 'Fill in details below.' : 'Transcoding started…'));
                setPendingDbSave(null);
                const videoId = createRes?.Data?.id ?? null;

                setUploadedVideoId(videoId);
                setUploadedFileUrl(createRes?.Data?.file_url ?? '');

                if (postType === 'video') {
                    setUploadPhase('metadata');               // open inline metadata form
                    // Here update the video details : parameters - title, description , tags, thumbnail
                    const updateRes = await VideoService.UpdateVideo(videoId!, token, videoTitle, videoDescription, videoTags, selectedThumbnail, presigned.ObjectKey);
                    console.log("update video response :", updateRes)
                } else {
                    setUploadPhase('transcoding');             // show "waiting" state
                }
                try {
                    console.log("videoId :", videoId)
                    const res = await VideoService.TranscodeVideo(videoId!, presigned.ObjectKey, token);
                    console.log("transcode video response :", res)
                    if (res?.Success) toast.success(res.Message);

                    else toast.error('Failed to transcode video');
                } catch { toast.error('Failed to transcode video'); }
                // Refresh library
                const libRes = await VideoService.GetAllVideos(token);
                if (libRes?.Success) setAllVideos(libRes.VideoFiles);
            } else {
                toast.error('Failed to save video');
                setUploadPhase('ready');
            }
        } catch {
            toast.error('Upload failed');
            setUploadPhase('ready');
        }
    };

    const handleRetryDbSave = async () => {
        if (!pendingDbSave) return;
        try {
            const res = await VideoService.CreateVideo(pendingDbSave.filename, pendingDbSave.contentType, pendingDbSave.objectKey, token);
            if (res?.Success) { toast.success(res.Message); setPendingDbSave(null); }
            else toast.error('Failed to create video');
        } catch { toast.error('Failed to create video'); }
    };

    const handleDownloadVideo = async (fileUrl: string) => {
        try {
            const res = await VideoService.DownloadVideo(fileUrl, token);
            if (res?.Success) toast.success(res.Message);
            else toast.error('Failed to download video');
        } catch { toast.error('Failed to download video'); }
    };

    // ── Video metadata helpers ─────────────────────────────────────────────────
    const addVideoTag = () => {
        const t = videoTagInput.trim();
        if (t && !videoTags.includes(t)) setVideoTags(prev => [...prev, t]);
        setVideoTagInput('');
    };
    const handleVideoTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addVideoTag(); }
    };
    const handleCustomThumb = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCustomThumb(file);
        setSelectedThumbnail(null);
        setCustomThumbPreview(URL.createObjectURL(file));
    };
    const handleVideoPublish = async () => {
        if (!videoTitle.trim()) { toast.error('Title is required'); return; }
        // TODO: wire up VideoService.PublishVideo
        console.log('Publish video', { videoTitle, videoDescription, videoTags, selectedThumbnail, customThumb });

        // now get the post data
        // now post video with all the details 
        // saving both details at the same time in both post and video table 
        // only post handle
        toast.success('Video published!');
        resetAll();
    };

    // ── Shorts editor helpers ──────────────────────────────────────────────────
    const handleTranscodingComplete = () => {
        // Called when shorts transcoding is done → switch to editing phase
        setUploadPhase('editing');
    };
    const handleMetadataLoaded = () => {
        if (!videoRef.current) return;
        const d = videoRef.current.duration;
        setDuration(d);
        setEndTime(Math.min(60, d));
    };
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const t = videoRef.current.currentTime;
        setCurrentTime(t);
        if (t >= endTime) { videoRef.current.currentTime = startTime; if (isPlaying) videoRef.current.play(); }
    };
    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); }
        else { videoRef.current.currentTime = startTime; videoRef.current.play(); setIsPlaying(true); }
    };
    const seekTo = (t: number) => { if (videoRef.current) videoRef.current.currentTime = t; setCurrentTime(t); };
    const pct = (t: number) => duration > 0 ? (t / duration) * 100 : 0;
    const fmt = (t: number) => `${Math.floor(t / 60).toString().padStart(2, '0')}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
    const clipDuration = endTime - startTime;

    const addShortsTag = () => {
        const t = shortsTagInput.trim();
        if (t && !shortsTags.includes(t)) setShortsTags(prev => [...prev, t]);
        setShortsTagInput('');
    };
    const handleShortsTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addShortsTag(); }
    };
    const handleShortsPublish = () => {
        if (!shortsTitle.trim()) { toast.error('Title is required'); return; }
        // TODO: wire up VideoService.PublishShort
        console.log('Publish short', { shortsTitle, shortsDescription, shortsTags, startTime, endTime });
        toast.success('Short published!');
        resetAll();
    };

    const effectiveThumbnail = customThumbPreview ?? selectedThumbnail;

    return (
        <div className="min-h-screen text-white font-sans antialiased" style={{ background: '#111' }}>
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 md:px-6 pt-28 pb-16">

                {/* ── Page title ──────────────────────────────────────────────── */}
                <div className="mb-8">
                    <p className="text-red-500 text-xs font-semibold tracking-[0.2em] uppercase mb-2">Studio</p>
                    <h1 className="text-3xl font-black text-white tracking-tight">Transcode & Edit</h1>
                    <p className="text-gray-500 text-sm mt-1">Upload, transcode, and publish videos or shorts.</p>
                </div>

                {/* ── Tab selector ─────────────────────────────────────────────── */}
                <div className="flex gap-2 mb-8">
                    <TabButton
                        active={postType === 'video'}
                        onClick={() => setPostType('video')}
                        icon={<Film size={14} />}
                        label="Video"
                        sublabel="Full-length video post"
                    />
                    <TabButton
                        active={postType === 'shorts'}
                        onClick={() => setPostType('shorts')}
                        icon={<Clapperboard size={14} />}
                        label="Shorts"
                        sublabel="Clip · 9:16 · up to 60s"
                    />
                </div>

                {/* ── Upload zone card ─────────────────────────────────────────── */}
                <div className="flex flex-col gap-4">

                    {/* Drop zone or file card */}
                    {uploadPhase === 'idle' || uploadPhase === 'ready' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            {/* LEFT: drop zone */}
                            <div className="lg:col-span-3 flex flex-col gap-4">
                                {!selectedFile ? (
                                    <div
                                        onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                                        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer min-h-[240px] ${isDragging
                                            ? 'border-red-500 bg-red-500/5'
                                            : 'border-white/10 hover:border-white/20 bg-[#1a1a1a]'
                                            }`}
                                    >
                                        <input
                                            type="file" accept="video/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <Upload size={36} className={`mb-4 ${isDragging ? 'text-red-400' : 'text-gray-600'}`} />
                                        <p className="text-sm font-semibold text-gray-300 mb-1">
                                            Drop your {postType === 'shorts' ? 'raw clip' : 'video'} here, or{' '}
                                            <span className="text-red-400">browse</span>
                                        </p>
                                        <p className="text-xs text-gray-600">MP4 · MOV · AVI · WEBM</p>
                                        {postType === 'shorts' && (
                                            <p className="text-[10px] text-gray-700 mt-1">Recommended: 9:16 vertical · max 60s raw</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-[#1a1a1a] rounded-2xl border border-white/8 p-5 flex items-center gap-4 relative">
                                        <button onClick={clearFile} className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors">
                                            <X size={16} />
                                        </button>
                                        <div className="w-14 h-14 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center justify-center shrink-0">
                                            {postType === 'shorts' ? <Clapperboard size={22} className="text-red-400" /> : <FileVideo size={26} className="text-red-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · {selectedFile.type}
                                            </p>
                                            <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                                                <div className="h-full w-full bg-red-600 rounded-full" />
                                            </div>
                                            <p className="text-[10px] text-gray-600 mt-1">Ready for upload</p>
                                        </div>
                                    </div>
                                )}

                                {/* Upload / Retry button */}
                                {pendingDbSave ? (
                                    <button
                                        onClick={handleRetryDbSave}
                                        className="w-full py-3 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw size={15} /> Retry Save
                                    </button>
                                ) : (
                                    <button
                                        disabled={!selectedFile}
                                        onClick={handleUpload}
                                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${selectedFile
                                            ? 'bg-red-600 hover:bg-red-700 text-white hover:scale-[1.01] hover:shadow-lg hover:shadow-red-900/30'
                                            : 'bg-white/5 text-gray-600 cursor-not-allowed'
                                            }`}
                                    >
                                        <Upload size={15} />
                                        {postType === 'shorts' ? 'Upload & Start Transcoding' : 'Upload & start transcoding'}
                                    </button>
                                )}
                            </div>

                            {/* RIGHT: context info */}
                            <div className="lg:col-span-2 flex flex-col gap-3">
                                <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-1">
                                    {postType === 'video' ? 'What happens next' : 'Shorts flow'}
                                </p>

                                {postType === 'video' ? (
                                    <>
                                        <FlowStep step={1} label="Upload to S3" sublabel="Your file is securely stored" active />
                                        <FlowStep step={2} label="Transcoding" sublabel="360p · 720p · 1080p via FFmpeg" />
                                        <FlowStep step={3} label="Add Details" sublabel="Title, description & tags" />
                                    </>
                                ) : (
                                    <>
                                        <FlowStep step={1} label="Upload Raw Video" sublabel="Any format, any orientation" active />
                                        <FlowStep step={2} label="Auto-Transcode" sublabel="System converts to 9:16 Shorts format" />
                                        <FlowStep step={3} label="Clip & Edit" sublabel="Set in/out points for your short" />
                                        <FlowStep step={4} label="Add Details & Publish" sublabel="Title, description & tags" />
                                    </>
                                )}

                                {/* AI hint */}
                                <div className="mt-1 bg-red-600/5 border border-red-600/15 rounded-xl p-4">
                                    <div className="flex items-start gap-2.5">
                                        <Zap size={14} className="text-red-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-white mb-1">Viral AI</p>
                                            <p className="text-[11px] text-gray-500 leading-relaxed">
                                                {postType === 'shorts'
                                                    ? 'AI detects your most engaging moments and auto-clips a 9:16 Short optimised for discovery.'
                                                    : 'AI detects the most engaging moments and creates clips optimised for discovery feeds.'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* ── Uploading spinner ──────────────────────────────────────── */}
                    {uploadPhase === 'uploading' && (
                        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl p-8 flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-red-600/30 border-t-red-500 animate-spin" />
                            <p className="text-sm font-bold text-white">Uploading…</p>
                            <p className="text-xs text-gray-500">Please wait while your file is being uploaded</p>
                        </div>
                    )}

                    {/* ── VIDEO: inline metadata form ───────────────────────────── */}
                    {postType === 'video' && uploadPhase === 'metadata' && (
                        <div
                            className="rounded-2xl overflow-hidden border border-white/8"
                            style={{ background: 'linear-gradient(160deg,#1c1c1c 0%,#161616 100%)' }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                <div>
                                    <p className="text-red-500 text-[10px] font-semibold tracking-widest uppercase mb-0.5">Studio</p>
                                    <h2 onClick={handleVideoPublish} className="text-base font-black text-white tracking-tight">Publish Video</h2>
                                </div>
                                <button
                                    onClick={resetAll}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 flex flex-col md:flex-row gap-6">
                                {/* LEFT: thumbnail picker */}
                                <div className="md:w-56 shrink-0 flex flex-col gap-4">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1.5">
                                            <ImageIcon size={10} /> Thumbnail
                                        </p>
                                        {uploadedThumbnails.length > 0 ? (
                                            <div className="grid grid-cols-3 gap-1.5 mb-2">
                                                {uploadedThumbnails.map((url, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => { setSelectedThumbnail(url); setCustomThumb(null); setCustomThumbPreview(null); }}
                                                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${selectedThumbnail === url && !customThumb ? 'border-red-500' : 'border-transparent hover:border-white/20'}`}
                                                    >
                                                        <img src={url} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                                                        {selectedThumbnail === url && !customThumb && (
                                                            <span className="absolute inset-0 flex items-center justify-center bg-red-600/40">
                                                                <Check size={12} className="text-white" />
                                                            </span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[11px] text-gray-600 mb-2">Thumbnails generate after transcoding.</p>
                                        )}
                                        <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleCustomThumb} />
                                        <button
                                            onClick={() => thumbInputRef.current?.click()}
                                            className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${customThumb ? 'border-red-500/50 bg-red-600/10 text-red-400' : 'border-white/10 hover:border-white/20 text-gray-400 hover:text-white bg-white/3'}`}
                                        >
                                            <Upload size={11} />
                                            {customThumb ? 'Custom ✓' : 'Upload thumbnail'}
                                        </button>
                                        {customThumbPreview && (
                                            <div className="mt-2 rounded-lg overflow-hidden border border-red-600/30 aspect-video">
                                                <img src={customThumbPreview} alt="custom-thumb" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                    {effectiveThumbnail && (
                                        <div className="flex items-center gap-2 p-2.5 bg-white/3 border border-white/5 rounded-xl">
                                            <img src={effectiveThumbnail} alt="selected" className="w-12 aspect-video object-cover rounded-md" />
                                            <div>
                                                <p className="text-xs font-semibold text-white">Selected</p>
                                                <p className="text-[10px] text-gray-500">{customThumb ? 'Custom' : 'Generated'}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT: form */}
                                <div className="flex-1 flex flex-col gap-5">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Title *</label>
                                        <input
                                            value={videoTitle}
                                            onChange={e => setVideoTitle(e.target.value)}
                                            placeholder="Give your video a title…"
                                            className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 focus:bg-red-600/3 transition-colors"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Description</label>
                                        <textarea
                                            value={videoDescription}
                                            onChange={e => setVideoDescription(e.target.value)}
                                            placeholder="What is this video about?"
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-red-600/50 transition-colors"
                                        />
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Tags</label>
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {videoTags.map(t => (
                                                <span key={t} className="flex items-center gap-1 px-2.5 py-1 bg-red-600/15 border border-red-600/20 text-red-300 text-xs rounded-full">
                                                    <Tag size={9} /> {t}
                                                    <button onClick={() => setVideoTags(prev => prev.filter(x => x !== t))} className="ml-0.5 text-red-400/60 hover:text-red-300">
                                                        <X size={9} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                value={videoTagInput}
                                                onChange={e => setVideoTagInput(e.target.value)}
                                                onKeyDown={handleVideoTagKey}
                                                placeholder="Add tag, press Enter…"
                                                className="flex-1 bg-white/5 border border-white/8 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 transition-colors"
                                            />
                                            <button
                                                onClick={addVideoTag}
                                                className="px-3 py-2 bg-white/5 border border-white/8 rounded-xl text-xs text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-white/5 flex gap-3">
                                <button
                                    onClick={resetAll}
                                    className="flex-1 py-3 rounded-xl font-bold text-sm border border-white/10 bg-white/3 hover:bg-white/8 text-gray-400 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleVideoPublish}
                                    disabled={!videoTitle.trim()}
                                    className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${videoTitle.trim()
                                        ? 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg hover:shadow-red-900/40'
                                        : 'bg-white/5 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    <Upload size={15} /> Publish Video
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── SHORTS: transcoding wait state ────────────────────────── */}
                    {postType === 'shorts' && uploadPhase === 'transcoding' && (
                        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                <div>
                                    <p className="text-red-500 text-[10px] font-semibold tracking-widest uppercase mb-0.5">Shorts</p>
                                    <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                                        <RefreshCw size={15} className="text-red-400 animate-spin" /> Transcoding…
                                    </h2>
                                </div>
                                <button onClick={resetAll} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                    <X size={15} />
                                </button>
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                <p className="text-sm text-gray-400">
                                    Your raw video is being transcoded. Once complete, you'll be able to clip it into a short.
                                </p>
                                {uploadedVideoId && (
                                    <TranscodeStatus
                                        v_id={uploadedVideoId}
                                    // onComplete={handleTranscodingComplete}
                                    />
                                )}
                                <button
                                    onClick={handleTranscodingComplete}
                                    className="self-start text-xs text-gray-500 hover:text-white underline underline-offset-2 transition-colors"
                                >
                                    Skip to editor (if already done)
                                </button>
                            </div>
                            <div className="px-6 py-4 border-t border-white/5">
                                <button onClick={resetAll} className="py-2.5 px-5 rounded-xl font-bold text-sm border border-white/10 bg-white/3 hover:bg-white/8 text-gray-400 hover:text-white transition-all">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── SHORTS: clip editor + metadata ────────────────────────── */}
                    {postType === 'shorts' && uploadPhase === 'editing' && (
                        <div
                            className="rounded-2xl overflow-hidden border border-white/8"
                            style={{ background: 'linear-gradient(160deg,#1a1a1a 0%,#141414 100%)' }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                                <div>
                                    <p className="text-red-500 text-[10px] font-semibold tracking-widest uppercase mb-0.5">Shorts</p>
                                    <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                                        <Scissors size={15} className="text-red-400" /> Edit & Clip Your Short
                                    </h2>
                                </div>
                                <button onClick={resetAll} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                    <X size={15} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 flex flex-col gap-6">

                                {/* Video editor section */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* 9:16 preview */}
                                    <div
                                        className="md:w-44 shrink-0 rounded-xl overflow-hidden bg-black border border-white/5 self-start"
                                        style={{ aspectRatio: '9/16', maxHeight: '250px' }}
                                    >
                                        {uploadedFileUrl ? (
                                            <video
                                                ref={videoRef}
                                                src={uploadedFileUrl}
                                                className="w-full h-full object-contain"
                                                onLoadedMetadata={handleMetadataLoaded}
                                                onTimeUpdate={handleTimeUpdate}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-700">
                                                <AlertCircle size={20} />
                                                <p className="text-xs">No preview</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Clip controls */}
                                    <div className="flex-1 flex flex-col gap-4">
                                        {/* Clip info */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="px-2.5 py-1 bg-red-600/15 border border-red-600/20 text-red-300 text-xs rounded-full font-semibold">
                                                {fmt(startTime)} → {fmt(endTime)}
                                            </span>
                                            <span className="text-gray-600 text-xs">{clipDuration.toFixed(1)}s</span>
                                            {clipDuration > 60 && (
                                                <span className="text-amber-400 text-[10px] font-semibold">⚠ Shorts max 60s</span>
                                            )}
                                        </div>

                                        {/* Play/pause */}
                                        <button
                                            onClick={togglePlay}
                                            className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-600/25 flex items-center justify-center hover:bg-red-600/25 transition-colors self-start"
                                        >
                                            {isPlaying ? <Pause size={16} className="text-red-400" /> : <Play size={16} className="text-red-400 ml-0.5" />}
                                        </button>

                                        {/* Timeline scrubber */}
                                        {duration > 0 && (
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Set Clip Range</p>
                                                <div className="relative h-8 flex items-center select-none">
                                                    <div className="absolute inset-x-0 h-1.5 bg-white/8 rounded-full" />
                                                    <div
                                                        className="absolute h-1.5 bg-red-600 rounded-full"
                                                        style={{ left: `${pct(startTime)}%`, width: `${pct(endTime) - pct(startTime)}%` }}
                                                    />
                                                    <div
                                                        className="absolute w-0.5 h-5 bg-white/40 rounded-full pointer-events-none"
                                                        style={{ left: `${pct(currentTime)}%` }}
                                                    />
                                                    <input
                                                        type="range" min={0} max={duration} step={0.1}
                                                        value={startTime}
                                                        onChange={e => { const v = parseFloat(e.target.value); setStartTime(Math.min(v, endTime - 1)); seekTo(v); }}
                                                        className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-10"
                                                    />
                                                </div>
                                                <div className="flex gap-3">
                                                    <div className="flex-1">
                                                        <label className="text-[10px] text-gray-600 uppercase tracking-wide">Start</label>
                                                        <input
                                                            type="range" min={0} max={duration - 1} step={0.5}
                                                            value={startTime}
                                                            onChange={e => { const v = parseFloat(e.target.value); setStartTime(v); seekTo(v); }}
                                                            className="w-full accent-red-500 mt-1"
                                                        />
                                                        <p className="text-xs text-gray-400 mt-0.5">{fmt(startTime)}</p>
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-[10px] text-gray-600 uppercase tracking-wide">End</label>
                                                        <input
                                                            type="range" min={1} max={duration} step={0.5}
                                                            value={endTime}
                                                            onChange={e => { const v = parseFloat(e.target.value); setEndTime(Math.max(v, startTime + 1)); seekTo(v); }}
                                                            className="w-full accent-red-500 mt-1"
                                                        />
                                                        <p className="text-xs text-gray-400 mt-0.5">{fmt(endTime)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Encoding hint */}
                                        <div className="p-3 bg-red-600/5 border border-red-600/12 rounded-xl">
                                            <p className="text-[11px] text-gray-500 leading-relaxed">
                                                The clip will be exported at <span className="text-white font-semibold">9:16</span> and transcoded to multiple resolutions optimised for Shorts feeds.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-white/5" />

                                {/* Metadata section */}
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-4">Post Details</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Title */}
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Title *</label>
                                            <input
                                                value={shortsTitle}
                                                onChange={e => setShortsTitle(e.target.value)}
                                                placeholder="Your short's title…"
                                                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 transition-colors"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Description</label>
                                            <textarea
                                                value={shortsDescription}
                                                onChange={e => setShortsDescription(e.target.value)}
                                                placeholder="Describe this short…"
                                                rows={3}
                                                className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-red-600/50 transition-colors"
                                            />
                                        </div>

                                        {/* Tags */}
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Tags</label>
                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                {shortsTags.map(t => (
                                                    <span key={t} className="flex items-center gap-1 px-2.5 py-1 bg-red-600/15 border border-red-600/20 text-red-300 text-xs rounded-full">
                                                        <Tag size={9} /> {t}
                                                        <button onClick={() => setShortsTags(prev => prev.filter(x => x !== t))} className="ml-0.5 text-red-400/60 hover:text-red-300">
                                                            <X size={9} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    value={shortsTagInput}
                                                    onChange={e => setShortsTagInput(e.target.value)}
                                                    onKeyDown={handleShortsTagKey}
                                                    placeholder="Add tag, press Enter…"
                                                    className="flex-1 bg-white/5 border border-white/8 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 transition-colors"
                                                />
                                                <button
                                                    onClick={addShortsTag}
                                                    className="px-3 py-2 bg-white/5 border border-white/8 rounded-xl text-xs text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-white/5 flex gap-3">
                                <button
                                    onClick={resetAll}
                                    className="flex-1 py-3 rounded-xl font-bold text-sm border border-white/10 bg-white/3 hover:bg-white/8 text-gray-400 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleShortsPublish}
                                    disabled={!shortsTitle.trim()}
                                    className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${shortsTitle.trim()
                                        ? 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg hover:shadow-red-900/40'
                                        : 'bg-white/5 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    <Scissors size={15} /> Export & Publish Short
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Uploaded videos library ──────────────────────────────────── */}
                {allVideos && allVideos.length > 0 && (
                    <div className="mt-12">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock size={14} className="text-gray-500" />
                            <h2 className="text-sm font-bold text-white">Your Uploads</h2>
                            <span className="ml-auto text-xs text-gray-600">{allVideos.length} file{allVideos.length !== 1 ? 's' : ''}</span>
                        </div>

                        <div className="flex flex-col gap-3">
                            {allVideos.map((video) => (
                                <div
                                    key={video.id}
                                    className="bg-[#1a1a1a] border border-white/5 hover:border-white/10 rounded-xl px-4 py-4 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                                            <FileVideo size={16} className="text-gray-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white font-medium truncate">
                                                {video.file_url.split('/').pop() ?? video.file_url}
                                            </p>
                                            <p className="text-[10px] text-gray-600 mt-0.5">
                                                {video.file_type} · {new Date(video.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            disabled={!video.file_url}
                                            onClick={() => handleDownloadVideo(video.file_url)}
                                            className="shrink-0 flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-white/8 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                                        >
                                            <Download size={12} /> Download
                                        </button>
                                        {
                                            !video.transcode_status &&
                                            <button
                                                disabled={!video.file_url}
                                                // onClick={() => handleTranscodeVideo(video.id, video.file_url)}
                                                className="shrink-0 flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-white/8 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                                            >
                                                Transcode
                                            </button>
                                        }
                                    </div>

                                    <div className="mt-3">
                                        <TranscodeStatus v_id={Number(video.id)} />
                                    </div>

                                    {video.thumbnails?.length > 0 && (
                                        <div className="mt-3 grid grid-cols-4 gap-2">
                                            {video.thumbnails.slice(0, 4).map((thumb, i) => (
                                                <div key={i} className="aspect-video rounded-lg overflow-hidden bg-black/40">
                                                    <img src={thumb} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Tab button ─────────────────────────────────────────────────────────────────
const TabButton = ({
    active, onClick, icon, label, sublabel,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    sublabel: string;
}) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 text-left ${active
            ? 'border-red-600/50 bg-red-600/10 shadow-[0_0_0_1px_rgba(220,38,38,0.2)]'
            : 'border-white/8 bg-[#1a1a1a] hover:border-white/15 hover:bg-[#1d1d1d]'
            }`}
    >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-red-600/20' : 'bg-white/5'}`}>
            <span className={active ? 'text-red-400' : 'text-gray-500'}>{icon}</span>
        </div>
        <div>
            <p className={`text-sm font-bold ${active ? 'text-white' : 'text-gray-400'}`}>{label}</p>
            <p className="text-[10px] text-gray-500">{sublabel}</p>
        </div>
        {active && <ChevronRight size={14} className="text-red-500/60 ml-auto" />}
    </button>
);

// ── Flow step indicator ────────────────────────────────────────────────────────
const FlowStep = ({ step, label, sublabel, active }: {
    step: number; label: string; sublabel: string; active?: boolean;
}) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${active ? 'border-red-600/30 bg-red-600/5' : 'border-white/5 bg-[#1a1a1a]'}`}>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${active ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-600'}`}>
            {step}
        </div>
        <div>
            <p className={`text-xs font-bold ${active ? 'text-white' : 'text-gray-500'}`}>{label}</p>
            <p className="text-[10px] text-gray-600">{sublabel}</p>
        </div>
    </div>
);

export default TranscodingPage;
