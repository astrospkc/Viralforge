import { useState } from 'react';
import Navbar from '../components/Navbar';
import VideoRow from '../components/VideoRow';
import UploadModal from '../components/UploadModal';
import { Play, Info, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate()
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Placeholder Data
    const videos1 = [1, 2, 3, 4, 5, 6, 7, 8];
    const videos2 = [9, 10, 11, 12, 13, 14, 15, 16];
    const videos3 = [17, 18, 19, 20, 21, 22, 23, 24];

    return (
        <div className="bg-[#141414] min-h-screen text-white pb-10">
            <Navbar />

            {/* Featured Video / Billboard */}
            <div className="relative h-[60vh] md:h-[85vh] w-full">
                <img
                    src="https://occ-0-64-58.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABeJ7_yFj5z_p5Kx8q5r5q5z_p5Kx8q5r5.jpg?r=2c4" // Placeholder for hero
                    className="w-full h-full object-cover brightness-[0.7]"
                    alt="Featured Content"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>

                <div className="absolute bottom-[20%] left-4 md:left-12 max-w-xl">
                    {/* Title Logo Placeholder or Text */}
                    <button onClick={() => navigate('/transcode')} className="bg-[#E50914] hover:bg-[#c11119] text-white px-6 md:px-8 py-2 md:py-3 rounded flex items-center gap-2 transition font-bold text-lg cursor-pointer">Transcode</button>
                    <h1 className="text-5xl md:text-8xl font-black mb-4 drop-shadow-lg tracking-tighter text-[#E50914]">STRANGER <br /> THINGS</h1>

                    <div className="flex items-center gap-4 mb-4 text-white font-bold text-shadow">
                        <span className="text-green-400">98% Match</span>
                        <span>2024</span>
                        <span className="border border-gray-400 px-1 text-sm bg-black/20">5 Seasons</span>
                        <span className="border border-white/40 px-1 text-xs">HD</span>
                    </div>

                    <p className="text-lg md:text-xl text-shadow-md mb-6 line-clamp-3 font-medium">
                        When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.
                    </p>

                    <div className="flex items-center gap-4">
                        <button className="bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded flex items-center gap-2 hover:bg-opacity-80 transition font-bold text-lg">
                            <Play className="fill-black" size={24} /> Play
                        </button>
                        <button className="bg-[rgba(109,109,110,0.7)] text-white px-6 md:px-8 py-2 md:py-3 rounded flex items-center gap-2 hover:bg-[rgba(109,109,110,0.4)] transition font-bold text-lg">
                            <Info size={28} /> More Info
                        </button>
                    </div>
                </div>
            </div>

            {/* Video Rows */}
            <div className="pl-4 md:pl-12 -mt-24 relative z-10 space-y-2">
                <VideoRow title="Trending Now" videos={videos1} />
                <VideoRow title="New Releases" videos={videos2} />
                <VideoRow title="Watch It Again" videos={videos3} />
                <VideoRow title="Action Movies" videos={videos1} />

                {/* Upload Section Call to Action */}
                <div className="pr-4 md:pr-12 mt-12 mb-20">
                    <div className="bg-gradient-to-r from-[#1f1f1f] to-[#141414] p-8 rounded-lg border border-[#333] flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Have something to share?</h3>
                            <p className="text-gray-400">Upload your own videos to the platform and share them with the world.</p>
                        </div>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="bg-[#E50914] hover:bg-[#c11119] text-white px-6 py-3 rounded font-bold flex items-center gap-2 transition"
                        >
                            <Plus size={20} /> Upload Video
                        </button>
                    </div>
                </div>
            </div>

            <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
        </div>
    );
};

export default MainPage;
