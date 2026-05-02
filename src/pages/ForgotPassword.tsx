import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthService } from '../services/auth_service';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useAuthStore } from '../store/auth_store';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        try {
            const response = await AuthService.SendForgotPasswordCode(email);
            console.log("reset code response: ", response)
            if (response?.Success) {
                toast.success('Reset code sent! Check your inbox.');
                navigate(`/reset-password?email=${encodeURIComponent(email)}`);
            } else {
                toast.error(response?.Message ?? 'Failed to send reset code.');
            }
        } catch {
            // error already toasted by AuthService
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-black md:bg-transparent">
            <Navbar />

            {/* Background */}
            <div className="absolute inset-0 z-0 hidden md:block">
                <img
                    src="https://assets.nflxext.com/ffe/siteui/vlv3/9d3533b2-0e2b-40b2-95e0-ecd7979cc93b/d3a7396f-42ae-448c-8f85-290076f60027/US-en-20240311-popsignuptwoweeks-perspective_alpha_website_large.jpg"
                    alt="Background"
                    className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <div className="bg-black/80 p-8 md:p-16 rounded-lg w-full max-w-md">

                    {/* Icon + heading */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 flex items-center justify-center mb-4">
                            <Mail size={24} className="text-[#E50914]" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Forgot Password?</h1>
                        <p className="text-gray-400 text-sm mt-2 text-center">
                            Enter your email address and we'll send you a reset code.
                        </p>
                    </div>

                    <form onSubmit={handleSendCode} className="flex flex-col gap-4">
                        <input
                            id="forgot-email"
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="p-4 rounded bg-[#333] placeholder-gray-400 text-white focus:outline-none focus:bg-[#454545] transition-colors"
                            required
                            autoComplete="email"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-[#E50914] text-white font-bold py-3 rounded mt-2 hover:bg-[#c11119] transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send size={16} />
                                    Send Code
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <Link
                            to="/signin"
                            className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
                        >
                            <ArrowLeft size={15} />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
