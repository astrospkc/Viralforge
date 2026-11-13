/**
 * Pure time calculation and formatting utilities for timeline and video editing.
 * Works with integer milliseconds.
 */

export function clamp(val: number, min: number, max: number): number {
    if (isNaN(val)) return min;
    return Math.max(min, Math.min(max, val));
}

export function msToSeconds(ms: number): number {
    return ms / 1000;
}

export function secondsToMs(seconds: number): number {
    return Math.round(seconds * 1000);
}

/**
 * Formats milliseconds as mm:ss.d (e.g. 01:23.4) or mm:ss
 */
export function formatTimeMs(ms: number, includeSubseconds = true): string {
    if (!ms || ms < 0 || isNaN(ms)) ms = 0;
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const sub = Math.floor((totalSeconds % 1) * 10);

    const mStr = String(minutes).padStart(2, '0');
    const sStr = String(seconds).padStart(2, '0');

    if (includeSubseconds) {
        return `${mStr}:${sStr}.${sub}`;
    }
    return `${mStr}:${sStr}`;
}

/**
 * Validates and clamps trim boundaries within a given duration.
 * Ensures start >= 0, end <= duration, and start <= end - minDurationMs.
 */
export function calculateTrimBounds(
    durationMs: number,
    startMs: number,
    endMs: number,
    minDurationMs = 500
): { startMs: number; endMs: number; durationMs: number } {
    const totalDuration = Math.max(0, Math.round(durationMs));
    if (totalDuration === 0) {
        return { startMs: 0, endMs: 0, durationMs: 0 };
    }

    const effectiveMin = Math.min(minDurationMs, totalDuration);

    let clampedStart = clamp(Math.round(startMs), 0, totalDuration - effectiveMin);
    let clampedEnd = clamp(Math.round(endMs), clampedStart + effectiveMin, totalDuration);

    if (clampedEnd - clampedStart < effectiveMin) {
        if (clampedStart + effectiveMin <= totalDuration) {
            clampedEnd = clampedStart + effectiveMin;
        } else {
            clampedStart = Math.max(0, totalDuration - effectiveMin);
            clampedEnd = totalDuration;
        }
    }

    return {
        startMs: clampedStart,
        endMs: clampedEnd,
        durationMs: clampedEnd - clampedStart,
    };
}

/**
 * Calculates current playback timeline time relative to trim start.
 */
export function sourceTimeToTimelineTime(sourceTimeMs: number, sourceStartMs: number): number {
    return Math.max(0, sourceTimeMs - sourceStartMs);
}

/**
 * Calculates video element source time from timeline time.
 */
export function timelineTimeToSourceTime(timelineTimeMs: number, sourceStartMs: number, sourceEndMs: number): number {
    return clamp(sourceStartMs + timelineTimeMs, sourceStartMs, sourceEndMs);
}
