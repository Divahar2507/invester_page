import React, { useState, useEffect } from 'react';
import { User, MessageCircle, Star, Send } from 'lucide-react';
import { api } from '../services/api';

export default function CommentsSection({ pitchId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [pitchId]);

    const fetchComments = async () => {
        try {
            const data = await api.getComments(pitchId);
            if (data) {
                setComments(data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await api.postComment({
                pitch_id: pitchId,
                comment: newComment,
                rating: rating > 0 ? rating : null
            });
            setNewComment("");
            setRating(0);
            fetchComments(); // Refresh list
        } catch (error) {
            console.error('Error posting comment:', error);
            alert('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageCircle className="text-blue-600" />
                Investor Feedback
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Leave your thoughts</label>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your feedback, questions, or analysis..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        rows="3"
                    ></textarea>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-600 mr-2">Rate Pitch:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-2xl focus:outline-none transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                    >
                        <Send size={16} />
                        Post Comment
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                {comment.user_name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{comment.user_name}</h4>
                                        <p className="text-xs text-blue-600 uppercase tracking-wide font-medium">
                                            {comment.user_role}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {comment.rating && (
                                            <div className="flex text-yellow-400 text-sm">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i}>{i < comment.rating ? '★' : '☆'}</span>
                                                ))}
                                            </div>
                                        )}
                                        <span className="text-sm text-gray-400">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-700 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                                    {comment.comment}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {comments.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        No comments yet. Be the first to share your feedback!
                    </div>
                )}
            </div>
        </div>
    );
}
