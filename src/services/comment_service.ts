import axios from "axios";
import baseUrl from "./api_service";

export const CommentService = {

    async getTopLevelComments(videoId: number, token: string) {
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
    },
    async postComment(videoId: number, token: string, comment: string, rating: number) {
        try {
            console.log("comment: ", comment)
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            // here we need , both root_comment_id and parent_comment_id
            const response = await axios.post(
                `${baseUrl}/v1/videos/comments/${videoId}`,
                {
                    content: comment,
                    rating: rating
                },
                config
            );
            console.log("post comment response :", response.data)
            return response.data;
        } catch (error) {
            console.error("error in posting comment: ", error)
            return {
                Data: null,
                Code: 500,
                Success: false,
                Message: "Failed to post comment"
            }
        }
    },
    async getReplies(parentCommentId: number, token: string) {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.get(`${baseUrl}/v1/videos/comments/${parentCommentId}/replies`,
                config,
            )
            return response.data;
        } catch (error) {
            console.error("error in posting comment: ", error)
            return {
                Data: null,
                Code: 500,
                Success: false,
                Message: "Failed to post comment"
            }
        }
    }
}