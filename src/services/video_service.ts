import axios from "axios";
import baseUrl from "./api_service";


type GetPresignedUrlResponse = {
    Message: string,
    Url: string,
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
                Code: response.data.Code
            }
        } catch (error) {

            console.error("error in getting presigned url: ", error)
            throw error;

        }
    }
}