import { clamp } from '../utils/time.ts';

export interface RulerTick {
    timeMs: number;
    label: string;
    isMajor: boolean;
    pixelPosition: number;
}

export class TimelineEngine {
    /**
     * Converts a millisecond timestamp to pixel position given scale (pixels per ms).
     */
    static timeToPixel(timeMs: number, pixelsPerMs: number): number {
        return Math.max(0, timeMs * pixelsPerMs);
    }

    /**
     * Converts pixel position to millisecond timestamp.
     */
    static pixelToTime(pixel: number, pixelsPerMs: number, maxDurationMs: number): number {
        if (pixelsPerMs <= 0) return 0;
        const time = pixel / pixelsPerMs;
        return clamp(Math.round(time), 0, maxDurationMs);
    }

    /**
     * Calculates the default zoom level (pixels per ms) so the entire clip fits inside the timeline container width.
     */
    static calculateFitZoom(durationMs: number, containerWidth: number, minPadding = 48): number {
        if (durationMs <= 0) return 0.05;
        const availableW = Math.max(200, containerWidth - minPadding);
        return availableW / durationMs;
    }

    /**
     * Generates ruler tick marks and formatted time labels based on timeline duration and scale.
     */
    static generateRulerTicks(durationMs: number, pixelsPerMs: number): RulerTick[] {
        if (durationMs <= 0 || pixelsPerMs <= 0) return [];

        // Determine step size in ms based on zoom level
        // At 100px width per second -> pixelsPerMs = 0.1
        let stepMs = 1000; // 1s
        if (pixelsPerMs > 0.2) stepMs = 500; // 0.5s
        if (pixelsPerMs > 0.5) stepMs = 250; // 0.25s
        if (pixelsPerMs < 0.05) stepMs = 2000; // 2s
        if (pixelsPerMs < 0.02) stepMs = 5000; // 5s

        const ticks: RulerTick[] = [];
        const totalTicks = Math.ceil(durationMs / stepMs);

        for (let i = 0; i <= totalTicks; i++) {
            const timeMs = Math.min(durationMs, i * stepMs);
            const pixelPosition = timeMs * pixelsPerMs;
            const isMajor = i % 2 === 0;

            const totalSec = Math.floor(timeMs / 1000);
            const subSec = Math.floor((timeMs % 1000) / 100);
            const min = Math.floor(totalSec / 60);
            const sec = totalSec % 60;

            const label = isMajor
                ? `${min}:${String(sec).padStart(2, '0')}${stepMs < 1000 ? `.${subSec}` : ''}`
                : '';

            ticks.push({
                timeMs,
                label,
                isMajor,
                pixelPosition,
            });
        }

        return ticks;
    }
}
