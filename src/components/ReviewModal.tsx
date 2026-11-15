import React, { useState } from 'react';
import { MessageSquarePlus, Star, X } from 'lucide-react';
import { StudentProfile } from '../types';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSubmitReview: (params: {
    authorName: string;
    hscContext: string;
    rating: number;
    comment: string;
  }) => Promise<void>;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  onClose,
  profile,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmitReview({
        authorName: profile.name || 'Elevora Student',
        hscContext: `${profile.hscYear} · ${profile.stream}`,
        rating,
        comment,
      });
      setSuccess(true);
      setComment('');
      window.setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-blue-400" />
            <h2 className="font-display text-lg font-bold text-zinc-50">
              Share Your Elevora Review
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Your review appears publicly on the 1st landing page to inspire fellow HSC students.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <span className="block text-xs font-medium text-zinc-300">Rating</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="modal-review-comment" className="block text-xs font-medium text-zinc-300">
              Your Honest Feedback
            </label>
            <textarea
              id="modal-review-comment"
              rows={4}
              maxLength={400}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Elevora কীভাবে আপনার HSC পড়াশোনা, রুটিন বা DET প্রস্তুতিতে সাহায্য করছে তা লিখুন..."
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {success && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
              Review published to the 1st page! Thank you!
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            {submitting ? 'Publishing Review...' : 'Publish Review'}
          </button>
        </form>
      </div>
    </div>
  );
};
