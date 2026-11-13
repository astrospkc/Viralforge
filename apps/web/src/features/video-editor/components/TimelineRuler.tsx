import React from 'react';
import { TimelineEngine, type RulerTick } from '../engine/TimelineEngine.ts';

interface TimelineRulerProps {
    durationMs: number;
    pixelsPerMs: number;
    width: number;
}

export const TimelineRuler: React.FC<TimelineRulerProps> = ({ durationMs, pixelsPerMs, width }) => {
    const ticks: RulerTick[] = TimelineEngine.generateRulerTicks(durationMs, pixelsPerMs);

    return (
        <div
            className="h-6 relative bg-[#12141D] border-b border-slate-800 text-[10px] text-slate-500 font-mono select-none"
            style={{ width }}
        >
            {ticks.map((tick, idx) => (
                <div
                    key={idx}
                    className="absolute top-0 bottom-0 pointer-events-none"
                    style={{ left: tick.pixelPosition }}
                >
                    {/* Tick line */}
                    <div
                        className={`w-[1px] ${
                            tick.isMajor ? 'h-3 bg-slate-600' : 'h-1.5 bg-slate-800'
                        }`}
                    />
                    {/* Major label */}
                    {tick.label && (
                        <span className="absolute top-2.5 left-1 text-[9px] text-slate-400 font-semibold">
                            {tick.label}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};
