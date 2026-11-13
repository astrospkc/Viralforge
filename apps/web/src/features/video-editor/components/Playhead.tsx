import React from 'react';

interface PlayheadProps {
    pixelPosition: number;
    height: number;
}

export const Playhead: React.FC<PlayheadProps> = ({ pixelPosition, height }) => {
    return (
        <div
            className="absolute top-0 pointer-events-none z-30 transition-transform duration-75"
            style={{
                transform: `translateX(${pixelPosition}px)`,
                height,
            }}
        >
            {/* Playhead marker pin */}
            <div className="relative -left-[7px] w-3.5 h-3.5 bg-yellow-400 rotate-45 rounded-sm shadow-md shadow-yellow-500/30" />
            {/* Vertical needle line */}
            <div className="w-[2px] bg-yellow-400 h-full shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
        </div>
    );
};
