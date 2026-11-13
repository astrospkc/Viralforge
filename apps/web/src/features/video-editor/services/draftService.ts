import type { EditorProject } from '../types/editor.types.ts';
import { serializeProject, deserializeProject } from '../engine/ProjectSerializer.ts';
import axios from 'axios';
import baseUrl from '../../../services/api_service.ts';

const DRAFT_PREFIX = 'viralforge_editor_draft_';
const RECENT_DRAFTS_KEY = 'viralforge_editor_recent_drafts';

export interface DraftSummary {
    id: string;
    title: string;
    updatedAt: string;
    durationMs: number;
    fileName: string;
}

export const DraftService = {
    /**
     * Save draft to local storage and sync with backend if online and authenticated
     */
    async saveDraft(project: EditorProject, token?: string): Promise<{ success: boolean; message: string }> {
        try {
            const { json, valid, issues } = serializeProject(project);
            if (!valid) {
                return { success: false, message: `Validation failed: ${issues?.join(', ')}` };
            }

            // 1. Always save locally first for instant, resilient offline backup
            localStorage.setItem(`${DRAFT_PREFIX}${project.id}`, json);

            // Update recent drafts list
            const recent = DraftService.listLocalDrafts();
            const filtered = recent.filter(d => d.id !== project.id);
            filtered.unshift({
                id: project.id,
                title: project.title,
                updatedAt: project.updatedAt,
                durationMs: project.source.durationMs,
                fileName: project.source.fileName,
            });
            localStorage.setItem(RECENT_DRAFTS_KEY, JSON.stringify(filtered.slice(0, 10)));

            // 2. If authenticated, sync draft with backend
            if (token) {
                try {
                    await axios.post(
                        `${baseUrl}/api/v1/video-projects`,
                        {
                            title: project.title,
                            schemaVersion: project.schemaVersion,
                            project,
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            timeout: 5000,
                        }
                    );
                } catch {
                    // Fallback to local storage silently without interrupting UX
                    console.info('[DraftService] Backend draft sync unavailable, saved locally.');
                }
            }

            return { success: true, message: 'Draft saved successfully' };
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to save draft';
            return { success: false, message: msg };
        }
    },

    /**
     * Load draft by ID from local storage
     */
    loadDraft(id: string): { project: EditorProject | null; error?: string } {
        const raw = localStorage.getItem(`${DRAFT_PREFIX}${id}`);
        if (!raw) {
            return { project: null, error: 'Draft not found.' };
        }
        return deserializeProject(raw);
    },

    /**
     * List all locally saved drafts
     */
    listLocalDrafts(): DraftSummary[] {
        try {
            const raw = localStorage.getItem(RECENT_DRAFTS_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    },

    /**
     * Delete a local draft
     */
    deleteDraft(id: string): void {
        localStorage.removeItem(`${DRAFT_PREFIX}${id}`);
        const recent = DraftService.listLocalDrafts().filter(d => d.id !== id);
        localStorage.setItem(RECENT_DRAFTS_KEY, JSON.stringify(recent));
    },
};
