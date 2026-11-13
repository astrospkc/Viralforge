import test from 'node:test';
import assert from 'node:assert';
import {
    clamp,
    msToSeconds,
    secondsToMs,
    formatTimeMs,
    calculateTrimBounds,
    sourceTimeToTimelineTime,
    timelineTimeToSourceTime,
} from '../utils/time.ts';

test('clamp handles values correctly within bounds', () => {
    assert.strictEqual(clamp(5, 0, 10), 5);
    assert.strictEqual(clamp(-5, 0, 10), 0);
    assert.strictEqual(clamp(15, 0, 10), 10);
    assert.strictEqual(clamp(NaN, 0, 10), 0);
});

test('msToSeconds and secondsToMs conversions', () => {
    assert.strictEqual(msToSeconds(2500), 2.5);
    assert.strictEqual(secondsToMs(2.5), 2500);
    assert.strictEqual(secondsToMs(0), 0);
});

test('formatTimeMs formats timestamps properly', () => {
    assert.strictEqual(formatTimeMs(0), '00:00.0');
    assert.strictEqual(formatTimeMs(65400), '01:05.4');
    assert.strictEqual(formatTimeMs(65400, false), '01:05');
});

test('calculateTrimBounds clamps start, end and enforces minimum duration', () => {
    // Standard valid trim
    const trim1 = calculateTrimBounds(10000, 1000, 5000);
    assert.strictEqual(trim1.startMs, 1000);
    assert.strictEqual(trim1.endMs, 5000);
    assert.strictEqual(trim1.durationMs, 4000);

    // Negative start time
    const trim2 = calculateTrimBounds(10000, -500, 3000);
    assert.strictEqual(trim2.startMs, 0);
    assert.strictEqual(trim2.endMs, 3000);

    // End time exceeding duration
    const trim3 = calculateTrimBounds(10000, 2000, 15000);
    assert.strictEqual(trim3.startMs, 2000);
    assert.strictEqual(trim3.endMs, 10000);

    // End time less than start time
    const trim4 = calculateTrimBounds(10000, 4000, 2000, 500);
    assert.strictEqual(trim4.startMs, 4000);
    assert.strictEqual(trim4.endMs, 4500);
    assert.strictEqual(trim4.durationMs, 500);
});

test('time mapping between source and timeline coordinate systems', () => {
    const sourceStartMs = 2000;
    const sourceEndMs = 8000;

    // Source time 3500ms should be 1500ms on the timeline
    assert.strictEqual(sourceTimeToTimelineTime(3500, sourceStartMs), 1500);

    // Timeline time 1500ms should map back to 3500ms source time
    assert.strictEqual(timelineTimeToSourceTime(1500, sourceStartMs, sourceEndMs), 3500);

    // Timeline time past the end clamps to sourceEndMs
    assert.strictEqual(timelineTimeToSourceTime(10000, sourceStartMs, sourceEndMs), 8000);
});
