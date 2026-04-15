import axios from "axios";
import baseUrl from "./api_service";
import type { VideoPost } from "../../types";


export type GetPresignedUrlResponse = {
    Message: string,
    Url: string,
    ObjectKey: string,
    Code: number
}


export type VideoUpload = {
    id: number
    user_id: number
    file_url: string
    file_type: string
    thumbnails: string[]
    selected_thumbnail: string
    is_deleted: boolean
    transcode_status: boolean
    created_at: string
    updated_at: string
}
export type VideoUploadResponse = {
    Data: VideoUpload | null
    Code: number
    Success: boolean
    Message: string
}

type GetListOfVideoFilesResponse = {
    VideoFiles: VideoUpload[]
    Success: boolean
    Code: number
}



export const VideoService = {


    async GetPresignedUrl(fileKey: { filename: string, contentType: string }, token: string): Promise<GetPresignedUrlResponse> {
        console.log("fileKey :", fileKey)

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.post(
                `${baseUrl}/v1/upload/initiate`, fileKey, config
            );
            console.log("presigned url :", response.data)
            return {
                Message: response.data.Message,
                Url: response.data.Url,
                ObjectKey: response.data.ObjectKey,
                Code: response.data.Code
            }
        } catch (error) {

            console.error("error in getting presigned url: ", error)
            throw error;

        }
    },

    async CreateVideo(
        filename: string,
        filetype: string,
        objectKey: string,
        token: string
    ): Promise<VideoUploadResponse> {
        console.log("[createVideo] called", {
            filename,
            filetype,
            objectKey,
        });

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }

        try {
            const response = await axios.post<VideoUploadResponse>(
                `${baseUrl}/v1/upload/commit`,
                {
                    filename,
                    filetype,
                    objectKey,
                },
                config
            );

            console.log("[createVideo] success", response.data);

            return response.data;
        } catch (error: any) {
            console.error("[createVideo] failed", {
                message: error?.message,
                status: error?.response?.status,
                data: error?.response?.data,
                stack: error?.stack,
            });

            return {
                Data: null,
                Code: error?.response?.status ?? 500,
                Success: false,
                Message:
                    error?.response?.data?.message ??
                    error?.message ??
                    "Failed to create video",
            };
        }
    },

    async GetAllVideos(token: string): Promise<GetListOfVideoFilesResponse | null> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.get(
                `${baseUrl}/v1/videos`, config
            );
            console.log("get all videos response :", response.data)
            return response.data;
        } catch (error) {
            console.error("error in getting all videos: ", error)
            return {
                VideoFiles: [],
                Success: false,
                Code: 500
            }
        }
    },

    async DownloadVideo(objectKey: string, token: string) {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.get(
                `${baseUrl}/v1/videos/download`,
                {
                    ...config,
                    params: { objectKey },
                }
            );
            console.log("download video response :", response.data)
            return response.data;
        } catch (error) {
            console.error("error in downloading video: ", error)
            return {
                Data: null,
                Code: 500,
                Success: false,
                Message: "Failed to download video"
            }
        }
    },

    async TranscodeVideo(videoId: number, objectKey: string, token: string) {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.post(
                `${baseUrl}/video/v1/transcode_video`,
                {
                    ...config,
                    params: { objectKey, videoId },
                }
            );
            console.log("transcode video response :", response.data)
            return response.data;
        } catch (error) {
            console.error("error in transcoding video: ", error)
            return {
                Data: null,
                Code: 500,
                Success: false,
                Message: "Failed to transcode video"
            }
        }
    },

    async GetTranscodedVideo(token: string, videoId: number) {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.get(
                `${baseUrl}/video/v1/get_transcoded_videos`,
                {
                    ...config,
                    params: { videoId },
                }
            );
            console.log("get transcoded video response :", response.data)
            return response.data;
        } catch (error) {
            console.error("error in getting transcoded video: ", error)
            return {
                Data: null,
                Code: 500,
                Success: false,
                Message: "Failed to get transcoded video"
            }
        }
    },

    async GetTranscodeStatus(token: string, videoId: number) {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.get(
                `${baseUrl}/v1/videos/${videoId}/status`,
                {
                    ...config,
                }
            );
            console.log("get transcode status response :", response.data)
            return response.data;
        } catch (error) {
            console.error("error in getting transcode status: ", error)
            return {
                Data: null,
                Code: 500,
                Success: false,
                Message: "Failed to get transcode status"
            }
        }
    },

    async UpdateVideo(videoId: number, token: string, videoTitle: string, videoDescription: string, videoTags: string[], selectedThumbnail: File | string | null, action: string, objectKey: string) {
        console.log("update video params: ", videoId, token, videoTitle, videoDescription, videoTags, selectedThumbnail, action, objectKey)
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const formData = new FormData();
            // formData.append('videoId', videoId.toString());
            formData.append('title', videoTitle);
            formData.append('description', videoDescription);
            formData.append('tags', JSON.stringify(videoTags));
            formData.append("object_key", objectKey);
            formData.append("publish_status", action);
            if (selectedThumbnail) {
                formData.append('thumbnail', selectedThumbnail);
            }
            const response = await axios.put(
                `${baseUrl}/v1/videos/${videoId}`,
                formData,
                config,

            );
            console.log("update video response :", response.data)
            return response.data;
        } catch (error) {
            console.error("error in updating video: ", error)
            return {
                Data: null,
                Code: 500,
                Success: false,
                Message: "Failed to update video"
            }
        }
    },

    // get all feeds
    // get your library 

    async GetAllFeeds(cursor: string, limit: number, token: string): Promise<VideoPost[] | null> {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            const response = await axios.get(
                `${baseUrl}/v1/feed?cursor=${cursor}&limit=${limit}`,
                config,

            );
            console.log("get all feeds response :", response.data)

            return response.data.data
        } catch (error) {
            console.error("error in getting all feeds: ", error)
            return null;
        }
    },

    async GetYourLibrary(cursor: string, limit: number, token: string) {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.get(`${baseUrl}/v1/feed/mine`, {
                params: {
                    cursor: cursor || "",
                    limit: limit || 10
                },
                ...config
            })
            console.log("get your library response :", response.data)
            return response.data;
        } catch (error) {
            console.error("error in getting your library: ", error)
            return {
                Data: null,
                Code: 500,
                Success: false,
                Message: "Failed to get your library"
            }
        }
    },

    async DeleteVideo(videoId: number, token: string) {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.delete(
                `${baseUrl}/v1/videos/${videoId}`,
                config,
            );
            console.log("delete video response :", response.data)
            return response.data;
        } catch (error) {
            console.error("error in deleting video: ", error)
            return {
                Data: null,
                Code: 500,
                Success: false,
                Message: "Failed to delete video"
            }
        }
    }






}