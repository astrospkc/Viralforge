import axios from "axios";
import baseUrl from "./api_service";

export const CommentService = {
    async getComments(videoId: number, token: string) {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.get(
                `${baseUrl}/v1/videos/${videoId}/comments`,
                config
            );
            console.log("get comments response :", response.data)
            return response.data;
        } catch (error) {
            console.error("error in getting comments: ", error)
            return {
                Data: null,
                Code: 500,
                Success: false,
                Message: "Failed to get comments"
            }
        }
    }
}