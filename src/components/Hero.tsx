import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    const handleGetStarted = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/signup');
    };

    return (
        <div className="relative h-screen w-full border-b-8 border-[#232323]">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://assets.nflxext.com/ffe/siteui/vlv3/9d3533b2-0e2b-40b2-95e0-ecd7979cc93b/d3a7396f-42ae-448c-8f85-290076f60027/US-en-20240311-popsignuptwoweeks-perspective_alpha_website_large.jpg"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/80 via-transparent to-black/80"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black max-w-4xl mb-4">
                    Create viral content with the world.
                </h1>
                <p className="text-lg md:text-2xl font-normal mb-6">
                    Share your videos with the world.
                </p>
                <p className="text-lg md:text-xl font-normal mb-6">
                    Ready to create? Enter your email to create your account.
                </p>

                <form onSubmit={handleGetStarted} className="flex flex-col md:flex-row gap-2 w-full max-w-2xl items-center">
                    <input
                        type="email"
                        placeholder="Email address"
                        className="w-full md:w-2/3 px-4 py-3 md:py-4 rounded bg-black/40 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        required
                    />
                    <button type="submit" className="w-full md:w-1/3 bg-[#E50914] text-white text-xl md:text-2xl font-medium py-3 md:py-4 rounded hover:bg-[#c11119] transition flex items-center justify-center gap-2">
                        Get Started <ChevronRight />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Hero;
