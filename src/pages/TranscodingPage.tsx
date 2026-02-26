import React, { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { Upload, FileVideo, Scissors, Download, RefreshCw, X } from 'lucide-react';
import { VideoService } from '../services/video_service';
import { useAuthStore } from '../store/auth_store';

const TranscodingPage = () => {
    const { token } = useAuthStore()
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
        }
    }, []);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const clearFile = () => setSelectedFile(null);
    const handleUpload = async () => {
        console.log("selectedFile :", selectedFile)
        console.log(selectedFile instanceof File);
        if (!selectedFile) {
            return;
        }
        const response = await VideoService.GetPresignedUrl({ filename: selectedFile.name, contentType: selectedFile.type }, token);
        console.log("response for presigned url: ", response)
        if (response.Code === 200) {
            const presignedUrl = response.Url;
            const uploadResponse = await fetch(presignedUrl, {
                method: 'PUT',
                body: selectedFile,
                headers: {
                    'Content-Type': selectedFile.type,
                },
            });
            console.log("upload response status: ", uploadResponse.status)
            if (uploadResponse.ok) {
                console.log('File uploaded successfully');
            } else {
                const errText = await uploadResponse.text();
                console.error('Upload failed:', uploadResponse.status, errText);
            }
        }
    }

    return (
        <div className="bg-[#141414] min-h-screen text-white pt-24 pb-12 px-4 md:px-12 flex flex-col items-center">
            <Navbar />

            <div className="w-full max-w-5xl">
                <header className="mb-8 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter text-[#E50914] uppercase">
                        Transcode & Edit
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Upload your video to transcode, download, or create viral shorts.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Section */}
                    <div className="lg:col-span-2">
                        {!selectedFile ? (
                            <div
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                className={`relative h-[400px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${isDragging ? 'border-[#E50914] bg-[#E50914]/5' : 'border-gray-700 bg-[#1f1f1f] hover:border-gray-500'}`}
                            >
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Upload size={64} className={`${isDragging ? 'text-[#E50914]' : 'text-gray-500'} mb-4`} />
                                <h3 className="text-xl font-bold mb-2">Drag and drop your video here</h3>
                                <p className="text-gray-400">or click to browse files</p>
                                <p className="mt-8 text-xs text-gray-500 uppercase tracking-widest">Supports MP4, MOV, AVI, WEBM</p>
                            </div>
                        ) : (
                            <div className="bg-[#1f1f1f] rounded-lg p-8 border border-gray-800 flex flex-col items-center justify-center relative min-h-[400px]">
                                <button
                                    onClick={clearFile}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                                >
                                    <X size={24} />
                                </button>
                                <div className="bg-black/40 p-12 rounded-full mb-6">
                                    <FileVideo size={80} className="text-[#E50914]" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 break-all text-center px-4">{selectedFile.name}</h3>
                                <p className="text-gray-400 mb-6">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}</p>

                                <div className="w-full max-w-md bg-gray-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#E50914] h-full w-[100%]"></div>
                                </div>
                                <p className="mt-2 text-sm text-gray-500">Ready for processing</p>
                            </div>
                        )}
                        <button disabled={!selectedFile} onClick={handleUpload} className={`w-full py-4 rounded font-bold flex items-center justify-center gap-3 transition-all duration-300 bg-[#E50914] hover:bg-[#c11119] text-white shadow-lg ${!selectedFile ? 'opacity-50 cursor-not-allowed' : ''}`}>Upload Video</button>
                    </div>

                    {/* Controls Section */}
                    <div className="space-y-6">
                        <div className="bg-[#1f1f1f] rounded-lg p-6 border border-gray-800">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <RefreshCw size={20} className="text-[#E50914]" />
                                Processing Options
                            </h2>

                            <div className="space-y-4">
                                <button
                                    disabled={!selectedFile}
                                    className={`w-full py-4 rounded font-bold flex items-center justify-center gap-3 transition-all duration-300 ${selectedFile ? 'bg-[#E50914] hover:bg-[#c11119] text-white shadow-lg' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                >
                                    <RefreshCw size={20} />
                                    TRANSCODE
                                </button>

                                <button
                                    disabled={!selectedFile}
                                    className={`w-full py-4 rounded font-bold border flex items-center justify-center gap-3 transition-all duration-300 ${selectedFile ? 'border-white text-white hover:bg-white hover:text-black' : 'border-gray-800 text-gray-600 cursor-not-allowed'}`}
                                >
                                    <Download size={20} />
                                    DOWNLOAD
                                </button>

                                <div className="pt-4 border-t border-gray-800 mt-4">
                                    <button
                                        disabled={!selectedFile}
                                        className={`w-full py-4 rounded font-bold flex items-center justify-center gap-3 transition-all duration-300 ${selectedFile ? 'bg-white text-black hover:bg-opacity-80' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        <Scissors size={20} />
                                        EDIT SHORTS
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#E50914]/10 to-transparent rounded-lg p-6 border border-[#E50914]/20">
                            <h4 className="font-bold mb-2">Did you know?</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Our Viral AI can automatically detect the most engaging moments in your video and create 9:16 shorts optimized for TikTok and Reels.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranscodingPage;
