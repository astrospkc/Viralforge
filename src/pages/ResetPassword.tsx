import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthService } from '../services/auth_service';
import toast from 'react-hot-toast';
import { KeyRound, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const emailFromUrl = searchParams.get('email') ?? '';

    const [form, setForm] = useState({
        email: emailFromUrl,
        code: "",
        newPassword: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [success, setSuccess] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleVerifyCode = async () => {
        if (!form.code.trim()) {
            toast.error('Please enter the reset code.');
            return;
        }
        setVerifying(true);
        try {
            console.log("email: ", form.email, "code: ", form.code)
            const response = await AuthService.VerifyResetCode(form.email, form.code);
            if (response?.Success) {
                setOtpVerified(true);
                toast.success('Code verified! Set your new password.');
            } else {
                toast.error(response?.Message ?? 'Invalid or expired code.');
            }
        } catch {
            // error already toasted by AuthService
        } finally {
            setVerifying(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.newPassword !== form.confirmPassword) {
            toast.error("Passwords don't match.");
            return;
        }
        if (form.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        try {
            const response = await AuthService.ResetPassword({
                Email: form.email,
                Code: form.code,
                NewPassword: form.newPassword,
            });

            if (response?.Success) {
                setSuccess(true);
                // Redirect to sign-in after 2.5 seconds
                setTimeout(() => navigate('/signin'), 2500);
            } else {
                toast.error(response?.Message ?? 'Failed to reset password.');
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

                    {/* ── Success state ── */}
                    {success ? (
                        <div className="flex flex-col items-center text-center gap-4 py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                                <CheckCircle2 size={32} className="text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Password Reset!</h2>
                            <p className="text-gray-400 text-sm">
                                Your password has been updated successfully.
                                Redirecting you to Sign In…
                            </p>
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mt-2" />
                        </div>
                    ) : (
                        <>
                            {/* Icon + heading */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-14 h-14 rounded-full bg-[#E50914]/10 border border-[#E50914]/30 flex items-center justify-center mb-4">
                                    <KeyRound size={24} className="text-[#E50914]" />
                                </div>
                                <h1 className="text-3xl font-bold text-white">Reset Password</h1>
                                <p className="text-gray-400 text-sm mt-2 text-center">
                                    Enter the code we sent to your email and choose a new password.
                                </p>
                            </div>

                            <form onSubmit={handleReset} className="flex flex-col gap-4">
                                {/* Email — pre-filled, read-only */}
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Email</label>
                                    <input
                                        id="reset-email"
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        readOnly
                                        className="w-full p-4 rounded bg-[#222] text-gray-400 cursor-not-allowed focus:outline-none"
                                    />
                                </div>

                                {/* OTP Code */}
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Reset Code</label>
                                    <input
                                        id="reset-code"
                                        type="text"
                                        name="code"
                                        placeholder="Enter the code from your email"
                                        value={form.code}
                                        onChange={e => {
                                            handleChange(e);
                                            // reset verification if user edits the code
                                            if (otpVerified) setOtpVerified(false);
                                        }}
                                        disabled={otpVerified}
                                        className="w-full p-4 rounded bg-[#333] placeholder-gray-400 text-white focus:outline-none focus:bg-[#454545] tracking-widest text-center font-mono text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                        autoComplete="one-time-code"
                                        maxLength={8}
                                    />
                                </div>

                                {/* Verify Code button / verified badge */}
                                {!otpVerified ? (
                                    <button
                                        id="verify-code-btn"
                                        type="button"
                                        onClick={handleVerifyCode}
                                        disabled={verifying || !form.code.trim()}
                                        className="flex items-center justify-center gap-2 w-full border border-[#E50914] text-[#E50914] font-semibold py-3 rounded hover:bg-[#E50914]/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {verifying ? (
                                            <span className="w-5 h-5 border-2 border-[#E50914]/30 border-t-[#E50914] rounded-full animate-spin" />
                                        ) : (
                                            'Verify Code'
                                        )}
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/30 rounded px-4 py-3">
                                        <CheckCircle2 size={16} className="shrink-0" />
                                        <span>Code verified successfully</span>
                                    </div>
                                )}

                                {/* New Password — shown only after OTP is verified */}
                                {otpVerified && (
                                    <>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">New Password</label>
                                            <div className="relative">
                                                <input
                                                    id="reset-new-password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="newPassword"
                                                    placeholder="New password (min. 8 characters)"
                                                    value={form.newPassword}
                                                    onChange={handleChange}
                                                    className="w-full p-4 pr-12 rounded bg-[#333] placeholder-gray-400 text-white focus:outline-none focus:bg-[#454545] transition-colors"
                                                    required
                                                    minLength={8}
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
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Confirm Password</label>
                                            <div className="relative">
                                                <input
                                                    id="reset-confirm-password"
                                                    type={showConfirm ? 'text' : 'password'}
                                                    name="confirmPassword"
                                                    placeholder="Confirm new password"
                                                    value={form.confirmPassword}
                                                    onChange={handleChange}
                                                    className={`w-full p-4 pr-12 rounded bg-[#333] placeholder-gray-400 text-white focus:outline-none focus:bg-[#454545] transition-colors ${form.confirmPassword && form.confirmPassword !== form.newPassword
                                                        ? 'ring-1 ring-red-500'
                                                        : form.confirmPassword && form.confirmPassword === form.newPassword
                                                            ? 'ring-1 ring-green-500'
                                                            : ''
                                                        }`}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirm(p => !p)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                                    aria-label="Toggle confirm password visibility"
                                                >
                                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            {form.confirmPassword && form.confirmPassword !== form.newPassword && (
                                                <p className="text-red-400 text-xs mt-1">Passwords don't match</p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex items-center justify-center gap-2 bg-[#E50914] text-white font-bold py-3 rounded mt-2 hover:bg-[#c11119] transition disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                'Reset Password'
                                            )}
                                        </button>
                                    </>
                                )}
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
