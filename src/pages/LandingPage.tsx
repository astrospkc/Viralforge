import Navbar from '../components/Navbar';
import Hero from '../components/Hero';


const LandingPage = () => {
    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar />
            <Hero />

            {/* Feature Section 1 */}
            <div className="py-16 px-4 md:px-20 border-b-8 border-[#232323] flex flex-col md:flex-row items-center justify-center text-center md:text-left">
                <div className="md:w-1/2 mb-8 md:mb-0">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Enjoy building viral content</h2>
                    <p className="text-xl md:text-2xl">Create and share viral content with the world.</p>
                </div>
                <div className="md:w-1/2 relative">
                    <img src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png" alt="TV" className="relative z-10" />
                    <div className="absolute top-[20%] left-[13%] w-[73%] h-[54%] z-0">
                        <video className="w-full h-full object-cover" autoPlay playsInline muted loop>
                            <source src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/video-tv-0819.m4v" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>

            {/* Feature Section 2 */}
            <div className="py-16 px-4 md:px-20 border-b-8 border-[#232323] flex flex-col md:flex-row-reverse items-center justify-center text-center md:text-left">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pl-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Download your videos into multiple format</h2>
                    <p className="text-xl md:text-2xl">Save your favorites easily and always have something to watch.</p>
                </div>
                <div className="md:w-1/2 relative">
                    <img src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/mobile-0819.jpg" alt="Mobile" />
                    <div className="border-2 border-gray-600 rounded-xl bg-black flex items-center gap-4 p-2 w-[60%] absolute bottom-4 left-1/2 -translate-x-1/2">
                        <img src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/boxshot.png" className="h-12 md:h-16" alt="Cover" />
                        <div className="flex-1 text-left">
                            <div className="text-white font-bold">Stranger Things</div>
                            <div className="text-blue-500 text-sm">Downloading...</div>
                        </div>
                        <div className="text-white animate-pulse">⬇</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
