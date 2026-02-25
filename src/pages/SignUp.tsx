import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { AuthService } from '../services/auth_service';
import { useAuthStore } from '../store/auth_store.ts';

const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setToken, setIsAuthenticated } = useAuthStore();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        // Registration logic here
        const data = {
            name,
            email,
            password,
        }
        const response = await AuthService.SignUp(data);
        console.log("register response :", response);
        localStorage.setItem("token", response.token);
        setToken(response.token);
        setIsAuthenticated(true)

        navigate("/browse");
    };

    return (
        <div className="relative min-h-screen w-full bg-white md:bg-transparent text-black md:text-white">
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
                <div className="bg-white md:bg-black/80 p-8 md:p-16 rounded-lg w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-4 md:mb-8 text-[#333] md:text-white">Sign Up</h1>
                    <p className="mb-6 md:text-gray-300">Just a few more steps and you're done! We hate paperwork, too.</p>
                    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            className="p-4 border border-gray-400 rounded md:bg-[#333] placeholder-gray-500 md:placeholder-gray-400 text-black md:text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email address"
                            className="p-4 border border-gray-400 rounded md:bg-[#333] placeholder-gray-500 md:placeholder-gray-400 text-black md:text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Add a password"
                            className="p-4 border border-gray-400 rounded md:bg-[#333] placeholder-gray-500 md:placeholder-gray-400 text-black md:text-white focus:outline-none focus:ring-1 focus:ring-[#E50914]"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="bg-[#E50914] text-white font-bold py-3 pt-3.5 rounded mt-4 hover:bg-[#c11119] transition">
                            Next
                        </button>
                    </form>

                    <div className="mt-6 md:text-gray-400">
                        Already have an account? <Link to="/signin" className="md:text-white font-medium hover:underline">Sign In</Link>.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
