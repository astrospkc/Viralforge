import test from 'node:test';
import assert from 'node:assert';
import { TimelineEngine } from '../engine/TimelineEngine.ts';

test('TimelineEngine timeToPixel and pixelToTime conversions', () => {
    const pixelsPerMs = 0.1; // 100px per second
    const maxDurationMs = 10000;

    assert.strictEqual(TimelineEngine.timeToPixel(1000, pixelsPerMs), 100);
    assert.strictEqual(TimelineEngine.timeToPixel(2500, pixelsPerMs), 250);

    assert.strictEqual(TimelineEngine.pixelToTime(100, pixelsPerMs, maxDurationMs), 1000);
    assert.strictEqual(TimelineEngine.pixelToTime(250, pixelsPerMs, maxDurationMs), 2500);

    // Clamping to max duration
    assert.strictEqual(TimelineEngine.pixelToTime(1500, pixelsPerMs, maxDurationMs), 10000);
});

test('TimelineEngine calculateFitZoom produces positive zoom', () => {
    const zoom = TimelineEngine.calculateFitZoom(10000, 1000);
    assert.ok(zoom > 0);
    assert.strictEqual(Math.round(zoom * 10000), 952); // ~952px for 10s
});

test('TimelineEngine generateRulerTicks creates valid ticks and labels', () => {
    const durationMs = 5000;
    const pixelsPerMs = 0.1;
    const ticks = TimelineEngine.generateRulerTicks(durationMs, pixelsPerMs);

    assert.ok(ticks.length > 0);
    assert.strictEqual(ticks[0].timeMs, 0);
    assert.strictEqual(ticks[0].pixelPosition, 0);
    assert.strictEqual(ticks[0].label, '0:00');
});
