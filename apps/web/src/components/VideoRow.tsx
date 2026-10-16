import { Play, Plus, ChevronDown } from 'lucide-react';

interface VideoRowProps {
    title: string;
    videos: number[]; // Replacing with real data type later
}

const VideoRow = ({ title, videos }: VideoRowProps) => {
    return (
        <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#e5e5e5] hover:text-white cursor-pointer transition px-4 md:px-0">{title}</h2>

            <div className="group relative">
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar px-4 md:px-0 scroll-smooth">
                    {videos.map((v) => (
                        <div key={v} className="min-w-[200px] md:min-w-[240px] aspect-video bg-[#2f2f2f] rounded-md overflow-hidden hover:scale-105 hover:z-20 transition duration-300 cursor-pointer relative group/item shadow-lg">
                            {/* Placeholder Image */}
                            <img src={`https://picsum.photos/seed/${v + Math.random()}/300/169`} alt="Thumbnail" className="w-full h-full object-cover rounded-md" />

                            {/* Hover Info Card (Simple version) */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition flex flex-col justify-end p-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="bg-white text-black p-1.5 rounded-full hover:bg-gray-200 transition">
                                        <Play size={12} fill="black" />
                                    </div>
                                    <div className="border border-gray-400 text-white p-1.5 rounded-full hover:border-white transition">
                                        <Plus size={12} />
                                    </div>
                                    <div className="border border-gray-400 text-white p-1.5 rounded-full hover:border-white transition ml-auto">
                                        <ChevronDown size={12} />
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-green-400">98% Match</div>
                                <div className="text-[10px] text-gray-300 flex items-center gap-2">
                                    <span className="border border-gray-500 px-1">HD</span>
                                    <span>TV-MA</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VideoRow;
