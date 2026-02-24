import { X, Upload } from 'lucide-react';
import { useState } from 'react';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
    const [dragActive, setDragActive] = useState(false);

    if (!isOpen) return null;

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-[#181818] w-full max-w-2xl rounded-lg shadow-2xl relative z-10 overflow-hidden text-white border border-[#333]">
                <div className="flex items-center justify-between p-4 border-b border-[#333]">
                    <h2 className="text-xl font-bold">Upload Video</h2>
                    <button onClick={onClose} className="p-1 hover:bg-[#333] rounded-full transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <form className="space-y-6">
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${dragActive ? 'border-[#E50914] bg-[#E50914]/10' : 'border-[#444] hover:border-gray-300'}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrag}
                        >
                            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-lg mb-2">Drag and drop video files to upload</p>
                            <p className="text-sm text-gray-500">Your videos will be private until you publish them.</p>
                            <button type="button" className="mt-4 bg-[#E50914] px-6 py-2 rounded font-bold hover:bg-[#c11119] transition">
                                Select Files
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                <input type="text" className="w-full bg-[#333] border border-transparent focus:border-[#555] rounded px-4 py-2 text-white focus:outline-none" placeholder="Video Title" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                <select className="w-full bg-[#333] border border-transparent focus:border-[#555] rounded px-4 py-2 text-white focus:outline-none appearance-none">
                                    <option>Movies</option>
                                    <option>TV Shows</option>
                                    <option>Documentaries</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea className="w-full bg-[#333] border border-transparent focus:border-[#555] rounded px-4 py-2 text-white focus:outline-none h-24 resize-none" placeholder="Description..."></textarea>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-4 border-t border-[#333] flex justify-end gap-3 bg-[#141414]">
                    <button onClick={onClose} className="px-6 py-2 rounded font-medium text-gray-300 hover:text-white transition">Cancel</button>
                    <button className="px-6 py-2 rounded font-bold bg-white text-black hover:bg-opacity-90 transition">Upload</button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
