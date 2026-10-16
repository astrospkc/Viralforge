'use client';

import '@videojs/react/video/skin.css';
import { createPlayer, videoFeatures } from '@videojs/react';
import { VideoSkin } from '@videojs/react/video';
import { HlsVideo } from '@videojs/react/media/hls-video';

const Player = createPlayer({ features: videoFeatures });

interface MyPlayerProps {
    src: string;
}

export const VideoPlayer = ({ src }: MyPlayerProps) => {
    return (
        <div className="w-full h-full bg-black flex items-center justify-center">
            <Player.Provider>
                <VideoSkin>
                    <HlsVideo 
                        src={src} 
                        className="w-full h-full"
                    />
                </VideoSkin>
            </Player.Provider>
        </div>
    );
};