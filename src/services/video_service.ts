import axios from "axios";
import baseUrl from "./api_service";
import toast from "react-hot-toast";


type GetPresignedUrlResponse = {
    Message: string,
    Url: string,
    Code: number
}
export const VideoService = {
    async GetPresignedUrl(fileKey: { filename: string, contentType: string }, token: string): Promise<GetPresignedUrlResponse> {
        console.log("fileKey :", fileKey)
        try {
            const response = await axios.post(
                `${baseUrl}/video/v1/get_presigned_url`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    fileKey,
                }
            );
            console.log("presigned url :", response.data)
            return {
                Message: response.data.Message,
                Url: response.data.Url,
                Code: response.data.Code
            }
        } catch (error) {

            console.error("error in getting presigned url: ", error)
            throw error;

        }
    }
}