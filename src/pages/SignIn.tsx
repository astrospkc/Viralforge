import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { AuthService } from '../services/auth_service';
import { useAuthStore } from '../store/auth_store';

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setToken, setIsAuthenticated } = useAuthStore();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            email,
            password,
        }
        const response = await AuthService.SignIn(data);
        console.log("login response :", response);
        localStorage.setItem("token", response.token);
        setToken(response.token);
        setIsAuthenticated(true)
        navigate("/browse");

    };

    return (
        <div className="relative min-h-screen w-full bg-black md:bg-transparent">
            <Navbar />
            {/* Background Image (Hidden on mobile) */}
            <div className="absolute inset-0 z-0 hidden md:block">
                <img
                    src="https://assets.nflxext.com/ffe/siteui/vlv3/9d3533b2-0e2b-40b2-95e0-ecd7979cc93b/d3a7396f-42ae-448c-8f85-290076f60027/US-en-20240311-popsignuptwoweeks-perspective_alpha_website_large.jpg"
                    alt="Background"
                    className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="bg-black/80 p-8 md:p-16 rounded-lg w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-8">Sign In</h1>
                    <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Email or mobile number"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-4 rounded bg-[#333] placeholder-gray-400 text-white focus:outline-none focus:bg-[#454545]"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-4 rounded bg-[#333] placeholder-gray-400 text-white focus:outline-none focus:bg-[#454545]"
                            required
                        />
                        <button type="submit" className="bg-[#E50914] text-white font-bold py-3 pt-3.5 rounded mt-6 hover:bg-[#c11119] transition">
                            Sign In
                        </button>
                    </form>

                    <div className="flex justify-between text-gray-400 text-sm mt-4">
                        <div className="flex items-center gap-1">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="#" className="hover:underline">Need help?</a>
                    </div>

                    <div className="mt-16 text-gray-400">
                        New to VIRAL_FORGE? <Link to="/signup" className="text-white hover:underline">Sign up now</Link>.
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                        This page is protected by Google reCAPTCHA to ensure you're not a bot.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
