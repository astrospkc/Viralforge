import axios from "axios";
import baseUrl from "./api_service";


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
                `${baseUrl}/video/v1/get_presigned_url`, fileKey, config
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

    async CreateVideo(filename: string, filetype: string, objectKey: string, token: string): Promise<VideoUploadResponse | null> {
        try {
            console.log("filename, filetype, objectKey: ", filename, filetype, objectKey)
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.post(
                `${baseUrl}/video/v1/create_video`, { filename, filetype, objectKey }, config
            );
            console.log("create video response :", response.data)
            return response.data;
        } catch (error) {
            console.error("error in creating video: ", error)
            return {
                Data: null,
                Code: 500,
                Success: false,
                Message: "Failed to create video"
            }
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
                `${baseUrl}/video/v1/get_all_videos`, config
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
                `${baseUrl}/video/v1/get_download_url`,
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
    }

}