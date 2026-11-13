import type { AspectRatioType } from '../types/editor.types';

export interface CanvasDimensions {
    width: number;
    height: number;
}

/**
 * Returns standard target pixel dimensions for a given aspect ratio.
 * Base 1080p standard for short-form video.
 */
export function getStandardCanvasDimensions(aspectRatio: AspectRatioType): CanvasDimensions {
    switch (aspectRatio) {
        case '9:16':
            return { width: 1080, height: 1920 };
        case '1:1':
            return { width: 1080, height: 1080 };
        case '16:9':
            return { width: 1920, height: 1080 };
        case 'custom':
        default:
            return { width: 1080, height: 1920 };
    }
}

/**
 * Calculates fit dimensions inside a container while preserving the target aspect ratio.
 */
export function calculateFitDimensions(
    aspectRatio: AspectRatioType,
    containerWidth: number,
    containerHeight: number,
    padding = 24
): { width: number; height: number; scale: number } {
    const target = getStandardCanvasDimensions(aspectRatio);
    const availableW = Math.max(100, containerWidth - padding * 2);
    const availableH = Math.max(100, containerHeight - padding * 2);

    const scale = Math.min(availableW / target.width, availableH / target.height);
    const width = Math.round(target.width * scale);
    const height = Math.round(target.height * scale);

    return { width, height, scale };
}

/**
 * Normalizes pixel coordinate (relative to preview canvas) to 0..100 percentage.
 */
export function toPercent(pixelVal: number, totalPixel: number): number {
    if (totalPixel <= 0) return 0;
    return Math.max(0, Math.min(100, (pixelVal / totalPixel) * 100));
}

/**
 * Converts percentage 0..100 to actual pixel value on canvas.
 */
export function fromPercent(percent: number, totalPixel: number): number {
    return (percent / 100) * totalPixel;
}
