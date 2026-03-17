import { useVideoStatus, type VideoQualityStatus } from "../hooks/useVideoStatus";
import { useAuthStore } from "../store/auth_store";
import { VideoPlayer } from "./VideoPlayer";

type Props = {
    status: {
        status: string;
        data: VideoQualityStatus[] | null;
    };
};

export default function TranscodeStatus(data: { v_id: number }) {
    const { token } = useAuthStore();
    const { videoStatus, stopPolling } = useVideoStatus(data.v_id, token);
    console.log("video id , video status: ", data, videoStatus)

    // still waiting for worker to pick up
    if (videoStatus.status === "pending") {
        return (
            <div>
                <span>⏳</span>
                <p>Waiting in queue...</p>
            </div>
        );
    }

    // worker is processing
    if (videoStatus.status === "processing") {
        return (
            <div>
                <span>🔄</span>
                <p>Transcoding your video...</p>

                {/* show individual quality progress if data exists */}
                {videoStatus.videoQualityStatus?.map((q) => (
                    <div key={q.quality}>
                        <span>{q.quality}</span>
                        <span>
                            {q.status === "completed" ? "✅" : "⏳"}
                            {q.status}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    // something went wrong
    if (videoStatus.status === "failed") {
        return (
            <div>
                <span>❌</span>
                <p>Transcoding failed. Please try again.</p>
            </div>
        );
    }

    // all done — show player
    if (videoStatus.status === "completed" && videoStatus.videoQualityStatus) {
        const hls1080 = videoStatus.videoQualityStatus.find((q) => q.quality === "1080p")?.cdn_url;
        const hls720 = videoStatus.videoQualityStatus.find((q) => q.quality === "720p")?.cdn_url;
        const hls480 = videoStatus.videoQualityStatus.find((q) => q.quality === "480p")?.cdn_url;

        return (
            <div>
                <p>✅ Ready to watch!</p>
                <VideoPlayer src={hls1080 ?? hls720 ?? hls480 ?? hls480 ?? ""} />
            </div>
        );
    }

    return null;
}