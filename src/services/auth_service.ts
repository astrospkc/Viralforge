import baseUrl from "./api_service";
import axios from "axios";


export const AuthService = {
    async SignUp(data: any) {
        console.log("base url: ", baseUrl)
        console.log("register details: ", data)
        const response = await axios.post(`${baseUrl}/auth/v1/register`, {
            headers: {
                "Content-Type": "application/json",
            },
            data
        });
        console.log("register details :", response.data)
        return response.data;
    },
    async SignIn(data: any) {
        console.log("base url: ", baseUrl)
        console.log("login details: ", data)
        const response = await axios.post(`${baseUrl}/auth/v1/login`, {
            headers: {
                "Content-Type": "application/json",
            },
            data,
        });
        console.log("login details :", response.data)
        return response.data;
    },
}