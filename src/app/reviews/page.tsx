"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Star, Filter, Loader2, ExternalLink } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
  link?: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'positive' | 'negative' | number>('all');

  useEffect(() => {
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
      setFilteredReviews(reviewsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFilter = (type: 'all' | 'positive' | 'negative' | number) => {
    setFilterType(type);
    
    if (type === 'all') {
      setFilteredReviews(reviews);
    } else if (type === 'positive') {
      setFilteredReviews(reviews.filter(r => r.rating >= 4));
    } else if (type === 'negative') {
      setFilteredReviews(reviews.filter(r => r.rating <= 3));
    } else {
      setFilteredReviews(reviews.filter(r => r.rating === type));
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation onGetQuote={() => {}} />

      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Reviews</h1>
            <p className="text-lg text-muted-foreground">
              See what our clients are saying about our services
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button
              onClick={() => handleFilter('all')}
              variant={filterType === 'all' ? 'default' : 'outline'}
              className={filterType === 'all' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              All Reviews
            </Button>
            <Button
              onClick={() => handleFilter('positive')}
              variant={filterType === 'positive' ? 'default' : 'outline'}
              className={filterType === 'positive' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Positive (4-5 ⭐)
            </Button>
            <Button
              onClick={() => handleFilter('negative')}
              variant={filterType === 'negative' ? 'default' : 'outline'}
              className={filterType === 'negative' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Negative (1-3 ⭐)
            </Button>
            {[5, 4, 3, 2, 1].map((stars) => (
              <Button
                key={stars}
                onClick={() => handleFilter(stars)}
                variant={filterType === stars ? 'default' : 'outline'}
                className={filterType === stars ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
              >
                {stars} ⭐
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-border">
              <Star className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No Reviews Found</h2>
              <p className="text-muted-foreground">
                {filterType !== 'all' ? 'Try changing the filter to see more reviews.' : 'Be the first to leave a review!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-border shadow-lg hover:shadow-xl transition-shadow"
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
                    <span className="text-sm text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 italic">"{review.comment}"</p>
                  
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{review.userName}</p>
                    {review.link && (
                      <Link 
                        href={review.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 text-sm"
                      >
                        View More <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
