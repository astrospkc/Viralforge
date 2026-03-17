import toast from "react-hot-toast";
import baseUrl from "./api_service";
import axios from "axios";

type SignInData = {
    Email: string;
    Password: string;
}

type SignUpData = {
    Name: string;
    Email: string;
    Password: string;
}

type UserData = {
    ID: number,
    Name: string,
    Email: string,
    CreatedAt: string,
    UpdatedAt: string,
}
type AuthResponse = {
    Data: UserData | null,
    Message: string,
    Token: string,
    Success: boolean
}

export const AuthService = {
    async SignUp(data: SignUpData): Promise<AuthResponse | null> {
        try {
            console.log("base url: ", baseUrl)
            console.log("register details: ", data)
            const response = await axios.post(`${baseUrl}/auth/v1/register`,
                data
            );
            console.log("register details :", response.data)
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                toast.error(error.response.data.Message);
                throw new Error(error.response.data.Message);
            }
            toast.error("An unexpected error occurred. Please try again.");
            throw new Error("An unexpected error occurred. Please try again.");
        }

    },
    async SignIn(data: SignInData): Promise<AuthResponse | null> {
        try {
            console.log("base url: ", baseUrl)
            console.log("login details: ", data)
            const response = await axios.post(`${baseUrl}/auth/v1/login`,
                data,
            );
            console.log("login details :", response.data)
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                toast.error(error.response.data.Message);
                throw new Error(error.response.data.Message);
            }
            toast.error("An unexpected error occurred. Please try again.");
            throw new Error("An unexpected error occurred. Please try again.");
        }

    },

    async GetUserData(token: string): Promise<UserData | null> {
        try {
            const response = await axios.get(`${baseUrl}/auth/v1`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            return response.data
        } catch (error: unknown) {
            console.error("internal error occurred while fetch user info", error)
            return null;
        }
    }
}