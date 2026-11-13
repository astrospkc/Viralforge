import test from 'node:test';
import assert from 'node:assert';
import { validateEditorProject } from '../engine/ProjectValidator.ts';
import type { EditorProject } from '../types/editor.types.ts';

const validMockProject: EditorProject = {
    schemaVersion: 1,
    id: 'proj_test_123',
    title: 'Test Reel',
    canvas: { width: 1080, height: 1920, backgroundColor: '#000000' },
    source: {
        fileName: 'test.mp4',
        mimeType: 'video/mp4',
        durationMs: 10000,
        width: 1080,
        height: 1920,
    },
    tracks: [
        {
            id: 't_video',
            type: 'video',
            name: 'Video',
            clips: [
                {
                    id: 'c_video',
                    type: 'video',
                    timelineStartMs: 0,
                    timelineDurationMs: 8000,
                    sourceStartMs: 1000,
                    sourceEndMs: 9000,
                },
            ],
        },
    ],
    transform: { rotation: 0, aspectRatio: '9:16' },
    filters: { brightness: 1, contrast: 1, saturation: 1 },
    audio: { originalMuted: false, originalVolume: 1, backgroundAudioVolume: 0.5 },
    textOverlays: [],
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

test('validateEditorProject approves valid project', () => {
    const res = validateEditorProject(validMockProject);
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.issues.length, 0);
});

test('validateEditorProject rejects invalid schemaVersion', () => {
    const invalid = { ...validMockProject, schemaVersion: 2 };
    const res = validateEditorProject(invalid);
    assert.strictEqual(res.valid, false);
    assert.ok(res.issues.some(i => i.field === 'schemaVersion'));
});

test('validateEditorProject rejects negative or invalid clip ranges', () => {
    const invalidClip = {
        ...validMockProject,
        tracks: [
            {
                id: 't_video',
                type: 'video' as const,
                name: 'Video',
                clips: [
                    {
                        id: 'c_video',
                        type: 'video' as const,
                        timelineStartMs: 0,
                        timelineDurationMs: 1000,
                        sourceStartMs: 5000,
                        sourceEndMs: 2000, // end < start!
                    },
                ],
            },
        ],
    };
    const res = validateEditorProject(invalidClip);
    assert.strictEqual(res.valid, false);
    assert.ok(res.issues.some(i => i.field === 'clip.sourceEndMs'));
});
