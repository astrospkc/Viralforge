// components/GlobalUploadProgress.tsx
import { useEffect } from "react";
import { useUploadStore } from "../store/progressStatus_store";


export default function GlobalUploadProgress() {
    const {
        uploadPhase,
        progress,
        isVisible,
        // setProgress,
        reset,
    } = useUploadStore();

    useEffect(() => {
        if (uploadPhase !== "transcoding") return;

        const timer = setInterval(() => {
            useUploadStore.setState((state) => {
                if (state.progress >= 95) return state;

                return {
                    progress: state.progress + Math.random() * 8,
                };
            });
        }, 700);

        return () => clearInterval(timer);
    }, [uploadPhase]);

    useEffect(() => {
        if (uploadPhase === "ready") {
            const timeout = setTimeout(() => {
                reset();
            }, 1200);

            return () => clearTimeout(timeout);
        }
    }, [uploadPhase, reset]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 z-[9999] h-1 w-full bg-neutral-200">
            <div
                className="h-full transition-all duration-500 ease-out bg-black"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}