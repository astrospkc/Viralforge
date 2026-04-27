import { ChevronDown, ChevronUp, MessageCircle, Send, Star, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CommentService } from "../services/comment_service";
import type { Comment } from "../../types";



/* ─────────────────────────────────────────
   Review thread (collapsible)
───────────────────────────────────────── */
const ReviewThread = ({ videoId: videoId, token }:
    { videoId: number; token: string }) => {
    const [open, setOpen] = useState(false);
    const [helpful, setHelpful] = useState<Record<number, boolean>>({});
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState<string | undefined>();
    const commentRef = useRef<HTMLTextAreaElement>(null);

    const [reviews, setReviews] = useState<Comment[]>([]);

    // fetch reviews for a particular videoId;
    useEffect(() => {
        const getReviews = async () => {
            const response = await CommentService.getTopLevelComments(videoId, token)
            console.log("response data: ", response.Data)
            setReviews(response.Data)
        }
        getReviews()
    }, [videoId])


    // const avgRating = reviews?.length ? Math.round(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) : 0;
    const avgRating = 5;

    // TODO: we can do like this- when user wants to write individual comment or submit review then submit review click , else when want to reply - reply submit reply clicked.
    // const submitReply = () => {

    // }


    const submitReview = async () => {
        console.log("new comment: , new rating", newComment, newRating)
        if (!newRating || !newComment?.trim()) return;
        // TODO: call api to submit review
        // when you will click reply then parent_comment_id will be needed and for just comment - nothing but only content will be needed.
        const commentData = await CommentService.postComment(videoId, token, newComment.trim(), newRating)

        setReviews((prev) => [...prev, commentData.Data])
        setNewRating(0);
        setNewComment("")
    };

    // const toggleHelpful = (id: number) => {
    //     setHelpful(p => ({ ...p, [id]: !p[id] }));
    //     setReviews(prev => prev.map(r => r.id === id ? { ...r } : r));
    // };
    console.log("reviews: ", reviews)

    return (
        <div className="border-t border-white/5 mt-4 pt-3 ">
            {/* Toggle header */}
            <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-3 group hover:cursor-pointer">
                <div className="flex items-center gap-2 flex-1">
                    <MessageCircle size={14} className="text-gray-500 group-hover:text-red-400 transition-colors" />
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                        {reviews?.length} Review{reviews?.length !== 1 ? 's' : ''}
                    </span>
                    {reviews?.length > 0 && (
                        <span className="flex items-center gap-1">
                            <StarRating value={avgRating} size={11} />
                            <span className="text-gray-600 text-xs">{avgRating}.0</span>
                        </span>
                    )}
                </div>
                {open ? <ChevronUp size={14} className="text-gray-600" /> : <ChevronDown size={14} className="text-gray-600" />}
            </button>

            {open && (
                <div className="mt-4 space-y-4">
                    {/* Write a review */}
                    <div className="bg-[#1e1e1e] rounded-xl p-4 border border-white/5">
                        <p className="text-xs font-bold text-white mb-3">Write a Review</p>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs text-gray-500">Your rating:</span>
                            <StarPicker value={newRating} onChange={setNewRating} />
                        </div>
                        <textarea
                            ref={commentRef}
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Share your honest experience with this product or service..."
                            rows={2}
                            className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-red-600/50 transition-colors"
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={submitReview}
                                disabled={!newRating || !newComment?.trim()}
                                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                            >
                                <Send size={12} /> Submit Review
                            </button>
                        </div>
                    </div>

                    {/* Existing reviews */}
                    {reviews && reviews.map((r: Comment, i: number) => (
                        <div key={i} className="flex gap-3">
                            {/* <img src={r.avatar} alt={r.userName} className="w-8 h-8 rounded-full shrink-0 mt-0.5" /> */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="text-xs font-bold text-white">{r?.user?.name}</span>
                                    <StarRating value={r?.rating} size={11} />
                                    {/* <span className="text-gray-600 text-[10px] ml-auto">{r.time}</span> */}
                                </div>
                                <p className="text-gray-300 text-xs leading-relaxed mb-2">"{r?.content}"</p>
                                <button
                                    // onClick={() => toggleHelpful(r.id)}
                                    className="flex items-center gap-1 group"
                                >
                                    <ThumbsUp size={12} className={helpful[r?.id] ? 'text-blue-400 fill-blue-400' : 'text-gray-600 group-hover:text-blue-400 transition-colors'} />
                                    {/* <span className={`text-[10px] transition-colors ${helpful[r.id] ? 'text-blue-400' : 'text-gray-600'}`}>
                                        {r.helpful} helpful
                                    </span> */}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const StarRating = ({ value, size = 13 }: { value: number; size?: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={size} className={s <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'} />
        ))}
    </div>
);

const StarPicker = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => onChange(s)}>
                    <Star size={18} className={(hover || value) >= s ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} />
                </button>
            ))}
        </div>
    );
};

export default ReviewThread;