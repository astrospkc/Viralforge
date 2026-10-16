import { useState, useEffect, useRef } from "react";

import { VideoService } from "../services/video_service";

export type VideoQualityStatus = {
    id: number,
    video_upload_id: number,
    user_id: number,
    master_cdn_url: string,
    quality: string,
    codec: string,
    bitrate: string,
    resolution: string,
    playlist_key: string,
    cdn_url: string,
    status: string,
    file_size_bytes: number,
    CreatedAt: string
}

type VideoStatus = {
    status: "pending" | "processing" | "completed" | "failed",
    message: string,
    videoQualityStatus: VideoQualityStatus[] | null
}

export function useVideoStatus(videoId: number, token: string) {
    const [videoStatus, setVideoStatus] = useState<VideoStatus>({
        status: "pending",
        message: "",
        videoQualityStatus: null
    })
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const stopPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    useEffect(() => {
        // console.log("video id: ", videoId)
        const poll = async () => {
            try {
                const response = await VideoService.GetTranscodeStatus(token, videoId);
                console.log("video status in useVideoStatus: ", response)
                if (response.success) {
                    setVideoStatus({
                        status: "completed",
                        message: "Video transcoding completed successfully",
                        videoQualityStatus: response.data
                    });
                    stopPolling();
                } else {
                    setVideoStatus({
                        status: "failed",
                        message: "Failed to get video status",
                        videoQualityStatus: null
                    });
                    stopPolling();
                }
            } catch (error) {
                console.error("Error fetching video status:", error);
            }
        };
        poll()
        intervalRef.current = setInterval(poll, 5000);
        return () => stopPolling();
    }, [videoId]);

    // console.log("video status at end: ", videoStatus)

    return { videoStatus, stopPolling }
}