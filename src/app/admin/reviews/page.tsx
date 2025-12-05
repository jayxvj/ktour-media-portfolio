"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Trash2, ArrowLeft, Star, ExternalLink, X, Plus
} from 'lucide-react';
import { 
  collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
  link?: string;
}

export default function AdminReviewsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [linkInput, setLinkInput] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    } else if (user) {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reviewsData = snapshot.docs.map(doc => ({
          id: doc.id,
          userName: doc.data().userName,
          rating: doc.data().rating,
          comment: doc.data().comment,
          createdAt: doc.data().createdAt,
          link: doc.data().link || '',
        }));
        setReviews(reviewsData);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, authLoading, router]);

  const handleDeleteReview = (review: Review) => {
    setDeletingReview(review);
    setShowDeleteModal(true);
  };

  const confirmDeleteReview = async () => {
    if (!deletingReview) return;

    try {
      await deleteDoc(doc(db, 'reviews', deletingReview.id));
      toast.success('✅ Review deleted successfully!');
      setShowDeleteModal(false);
      setDeletingReview(null);
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const handleAddLink = (review: Review) => {
    setEditingReview(review);
    setLinkInput(review.link || '');
    setShowLinkModal(true);
  };

  const handleUpdateLink = async () => {
    if (!editingReview) return;

    setUpdating(true);
    
    try {
      await updateDoc(doc(db, 'reviews', editingReview.id), {
        link: linkInput.trim(),
      });
      
      toast.success('✅ Link updated successfully!');
      setShowLinkModal(false);
      setEditingReview(null);
      setLinkInput('');
    } catch (error) {
      console.error('Error updating link:', error);
      toast.error('Failed to update link');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Manage Reviews</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Reviews</p>
                <p className="text-3xl font-bold">{reviews.length}</p>
              </div>
              <Star className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">5-Star Reviews</p>
                <p className="text-3xl font-bold">
                  {reviews.filter(r => r.rating === 5).length}
                </p>
              </div>
              <Star className="w-12 h-12 text-yellow-500 opacity-20 fill-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Rating</p>
                <p className="text-3xl font-bold">
                  {reviews.length > 0 
                    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <Star className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">With Links</p>
                <p className="text-3xl font-bold">
                  {reviews.filter(r => r.link).length}
                </p>
              </div>
              <ExternalLink className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-border">
            <Star className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No Reviews Yet</h2>
            <p className="text-muted-foreground mb-8">
              Reviews from customers will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative p-6 rounded-2xl bg-white dark:bg-gray-900 border border-border shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4 italic line-clamp-3">
                  "{review.comment}"
                </p>
                
                <div className="mb-4">
                  <p className="font-bold">{review.userName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                </div>

                {review.link && (
                  <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Link:</p>
                    <a 
                      href={review.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 break-all flex items-center gap-1"
                    >
                      {review.link.substring(0, 40)}... <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddLink(review)}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {review.link ? 'Edit Link' : 'Add Link'}
                  </Button>
                  <Button
                    onClick={() => handleDeleteReview(review)}
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && deletingReview && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                    <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-2">Delete Review?</h2>
                  <p className="text-muted-foreground mb-6">
                    Are you sure you want to delete the review by <strong>{deletingReview.userName}</strong>? 
                    This action cannot be undone.
                  </p>

                  <div className="flex gap-3 w-full">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmDeleteReview}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add/Edit Link Modal */}
      <AnimatePresence>
        {showLinkModal && editingReview && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLinkModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{editingReview.link ? 'Edit' : 'Add'} Link</h2>
                  <button 
                    onClick={() => setShowLinkModal(false)} 
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-border">
                  <p className="text-sm">
                    <strong className="text-blue-600 dark:text-blue-400">🔗 Review Link:</strong> Add a link 
                    that will appear below this review (e.g., portfolio page, website, social media).
                  </p>
                </div>

                <div className="mb-6">
                  <Label className="mb-2 block">Link URL</Label>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    disabled={updating}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Leave empty to remove the link
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowLinkModal(false)}
                    className="flex-1"
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateLink}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Save Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
