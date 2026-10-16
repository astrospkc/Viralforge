import type { Comment } from "../../types";


export type CommentNode = Comment & {
    children: CommentNode[];
}
export function buildCommentTree(comments: Comment[]): CommentNode[] {
    const map = new Map<number, CommentNode>();
    const roots: CommentNode[] = [];
    // Step 1: index every comment with an empty children array
    comments.forEach((c) => {
        map.set(c.id, { ...c, children: [] });
    });
    // Step 2: link children to their parents
    comments.forEach((c) => {
        const node = map.get(c.id)!;
        if (c.parentCommentId) {
            map.get(c.parentCommentId)?.children.push(node);
        } else {
            roots.push(node);
        }
    });
    return roots;
}
