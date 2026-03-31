// progress, uploadStatus, 

import { create } from "zustand";

type UploadPhase =
    | 'idle'            // nothing selected
    | 'ready'           // file chosen, awaiting upload
    | 'uploading'       // sending to S3
    | 'transcoding'     // Shorts: waiting for transcode to finish
    | 'metadata'        // Video: fill in metadata after upload
    | 'editing'         // Shorts: clip editor
    | 'done'            // upload complete
    | 'failed';


interface UploadStore {
    uploadPhase: UploadPhase;
    setUploadPhase: (phase: UploadPhase) => void;
    progress: number;
    setProgress: (progress: number) => void;
    isVisible: boolean;

    reset: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
    uploadPhase: "idle",
    progress: 0,
    isVisible: false,


    setUploadPhase: (phase) => set((state) => {
        if (phase === "transcoding") {
            return {
                uploadPhase: phase,
                isVisible: true,
                progress: state.progress > 5 ? state.progress : 5
            }
        }
        if (phase === "ready") {
            return {
                uploadPhase: phase,
                progress: 100,
                isVisible: true
            }
        }
        if (phase === "failed") {
            return {
                uploadPhase: phase,
                isVisible: false,
                progress: 0
            }
        }

        return {
            uploadPhase: phase,
        };
    }),
    setProgress: (value) => set({
        progress: Math.min(value, 95),
    }),
    reset: () => set({ uploadPhase: "idle", progress: 0, isVisible: false }),
}));