import axios from "axios";
import baseUrl from "./api_service";

export const VideoService = {
    async GetPresignedUrl(fileKey: FormData, token: string) {
        const response = await axios.post(`${baseUrl}/video/v1/get-presigned-url`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            fileKey
        });
        console.log("presigned url :", response.data)
        return response.data;
    }
}