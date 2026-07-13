import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { AuthService } from '../services/auth_service';
import { useAuthStore } from '../store/auth_store';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ Email: "", Password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const { setToken, setIsAuthenticated } = useAuthStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await AuthService.SignIn(formData);
            console.log("login response :", response);
            if (response?.Success) {
                localStorage.setItem("token", response.Token);
                setToken(response.Token);
                setIsAuthenticated(true);
                toast.success("Login successful");
                navigate("/browse");
            } else {
                toast.error("failed to login");
            }
        } catch (error: unknown) {
            console.error("failed to signin , internal error occurred", error);
            throw new Error("internal error occurred while signing up");
        }
    };

    const handleGoogleSignIn = () => {
        // TODO: wire up your Google OAuth flow here
        toast("Google sign-in coming soon!", { icon: "🚧" });
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
                        {/* Email */}
                        <input
                            id="signin-email"
                            type="email"
                            placeholder="Email"
                            value={formData.Email}
                            name="Email"
                            onChange={handleChange}
                            className="p-4 rounded bg-[#333] placeholder-gray-400 text-white focus:outline-none focus:bg-[#454545]"
                            required
                        />

                        {/* Password with eye toggle */}
                        <div className="relative">
                            <input
                                id="signin-password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={formData.Password}
                                name="Password"
                                onChange={handleChange}
                                className="w-full p-4 pr-12 rounded bg-[#333] placeholder-gray-400 text-white focus:outline-none focus:bg-[#454545]"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="flex justify-end -mt-1">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-gray-400 hover:text-white transition-colors hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            id="signin-submit"
                            type="submit"
                            className="bg-[#E50914] text-white font-bold py-3 pt-3.5 rounded mt-4 hover:bg-[#c11119] transition"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* OR divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-gray-500 text-xs font-medium uppercase tracking-widest">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Google sign-in */}
                    <button
                        id="signin-google"
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="flex items-center justify-center gap-3 w-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded transition"
                    >
                        {/* Google SVG logo */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z" />
                            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H5.9C9.2 35.7 16 44 24 44z" />
                            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.5l6.2 5.2C41 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-3.9z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="flex justify-between text-gray-400 text-sm mt-5">
                        <div className="flex items-center gap-1">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <a href="#" className="hover:underline">Need help?</a>
                    </div>

                    <div className="mt-10 text-gray-400">
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
