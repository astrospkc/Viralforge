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

// type ForgotPasswordData = {
//     Email: string;
// }

type ResetPasswordData = {
    Email: string;
    Code: string;
    NewPassword: string;
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
        } catch (error: any) {
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
        } catch (error: any) {
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
    },
    async SendForgotPasswordCode(email: string) {
        try {
            const response = await axios.post(`${baseUrl}/auth/v1/reset_code`, {
                "Email": email
            },

            );
            console.log("reset code response: ", response.data)
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data?.Message ?? "Failed to send reset code.");
                throw new Error(error.response.data?.Message);
            }
            toast.error("An unexpected error occurred. Please try again.");
            throw new Error("An unexpected error occurred.");
        }
    },

    async VerifyResetCode(email: string, code: string) {
        try {
            const response = await axios.post(`${baseUrl}/auth/v1/verify_code`, {
                "Email": email,
                "OTP": code
            });
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data?.Message ?? "Failed to verify reset code.");
                throw new Error(error.response.data?.Message);
            }
            toast.error("An unexpected error occurred. Please try again.");
            throw new Error("An unexpected error occurred.");
        }
    },

    async ResetPassword(data: ResetPasswordData): Promise<{ Success: boolean; Message: string } | null> {
        try {
            const response = await axios.post(`${baseUrl}/auth/v1/reset_password`, data);
            return response.data;
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data?.Message ?? "Failed to reset password.");
                throw new Error(error.response.data?.Message);
            }
            toast.error("An unexpected error occurred. Please try again.");
            throw new Error("An unexpected error occurred.");
        }
    },

}