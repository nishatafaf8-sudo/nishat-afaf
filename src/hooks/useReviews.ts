import { useEffect, useState } from 'react';
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { OperationType, auth, db, handleFirestoreError } from '../firebase';
import { StudentReview } from '../types';

export function useReviews() {
  const [reviews, setReviews] = useState<StudentReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('rating', 'in', [1, 2, 3, 4, 5]),
      limit(50)
    );

    const unsub = onSnapshot(
      reviewsQuery,
      (snapshot) => {
        const list: StudentReview[] = snapshot.docs
          .map((d) => {
            const data = d.data();
            const ts = data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now();
            return {
              id: d.id,
              authorUid: String(data.authorUid || ''),
              authorName: String(data.authorName || 'HSC Student'),
              hscContext: String(data.hscContext || 'HSC Student'),
              rating: Number(data.rating || 5),
              comment: String(data.comment || ''),
              createdAtMs: ts,
            };
          })
          .sort((a, b) => b.createdAtMs - a.createdAtMs);
        setReviews(list);
        setReviewsLoading(false);
      },
      (error) => {
        setReviewsLoading(false);
        console.error('Reviews listener error:', error);
      }
    );

    return () => unsub();
  }, []);

  const submitReview = async (params: {
    authorName: string;
    hscContext: string;
    rating: number;
    comment: string;
  }) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Please sign in with Google first to submit a review.');
    }

    const cleanName = params.authorName.trim().slice(0, 80) || user.displayName || 'Elevora Student';
    const cleanContext = params.hscContext.trim().slice(0, 80) || 'HSC Student';
    const cleanRating = Math.min(5, Math.max(1, Math.round(params.rating)));
    const cleanComment = params.comment.trim().slice(0, 400);

    if (cleanComment.length < 5) {
      throw new Error('Please write at least 5 characters in your review.');
    }

    const reviewId = `rev_${user.uid.slice(0, 12)}_${Date.now()}`;
    const path = `reviews/${reviewId}`;

    try {
      await setDoc(doc(db, 'reviews', reviewId), {
        authorUid: user.uid,
        authorName: cleanName,
        hscContext: cleanContext,
        rating: cleanRating,
        comment: cleanComment,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const deleteReview = async (reviewId: string) => {
    const path = `reviews/${reviewId}`;
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return {
    reviews,
    reviewsLoading,
    submitReview,
    deleteReview,
  };
}
