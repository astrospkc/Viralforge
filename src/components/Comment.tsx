import type { CommentNode } from "../utils/comments";
function Comment({ comment }: { comment: CommentNode }) {
    return (
        <div style={{ marginLeft: comment.depth * 20 }}>
            <p>{comment.content}</p>

            {comment.children.map(child => (
                <Comment key={child.id} comment={child} />
            ))}
        </div>
    );
}

export default Comment

