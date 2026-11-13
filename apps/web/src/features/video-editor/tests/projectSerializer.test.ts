import test from 'node:test';
import assert from 'node:assert';
import { serializeProject, deserializeProject } from '../engine/ProjectSerializer.ts';
import type { EditorProject } from '../types/editor.types.ts';

const mockProject: EditorProject = {
    schemaVersion: 1,
    id: 'proj_serial_1',
    title: 'Product Demo',
    canvas: { width: 1080, height: 1920, backgroundColor: '#000000' },
    source: {
        fileName: 'demo.mp4',
        mimeType: 'video/mp4',
        durationMs: 12000,
        width: 1080,
        height: 1920,
    },
    tracks: [
        {
            id: 'track_1',
            type: 'video',
            name: 'Video 1',
            clips: [
                {
                    id: 'clip_1',
                    type: 'video',
                    timelineStartMs: 0,
                    timelineDurationMs: 10000,
                    sourceStartMs: 1000,
                    sourceEndMs: 11000,
                },
            ],
        },
    ],
    transform: { rotation: 0, aspectRatio: '9:16' },
    filters: { brightness: 1.1, contrast: 1.05, saturation: 1.2 },
    audio: { originalMuted: false, originalVolume: 0.9, backgroundAudioVolume: 0.4 },
    textOverlays: [
        {
            id: 'text_1',
            text: 'Special Offer',
            xPercent: 50,
            yPercent: 30,
            fontSize: 32,
            color: '#FACC15',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            textAlign: 'center',
            timelineStartMs: 1000,
            timelineDurationMs: 4000,
        },
    ],
    export: {
        width: 1080,
        height: 1920,
        frameRate: 30,
        videoCodec: 'h264',
        audioCodec: 'aac',
        format: 'mp4',
    },
    createdAt: '2026-11-13T10:00:00Z',
    updatedAt: '2026-11-13T10:00:00Z',
};

test('serializeProject serializes cleanly and parses back', () => {
    const { json, valid, issues } = serializeProject(mockProject);
    assert.strictEqual(valid, true, `Validation issues: ${issues?.join(', ')}`);
    assert.ok(json.includes('"id": "proj_serial_1"'));

    const { project, error } = deserializeProject(json);
    assert.strictEqual(error, undefined);
    assert.ok(project !== null);
    assert.strictEqual(project?.id, mockProject.id);
    assert.strictEqual(project?.filters.saturation, 1.2);
    assert.strictEqual(project?.textOverlays.length, 1);
    assert.strictEqual(project?.textOverlays[0].text, 'Special Offer');
});

test('deserializeProject handles malformed JSON gracefully', () => {
    const { project, error } = deserializeProject('{ not valid json');
    assert.strictEqual(project, null);
    assert.ok(error?.includes('Malformed JSON'));
});
