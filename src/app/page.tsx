"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GetQuoteModal from '@/components/GetQuoteModal';
import ReviewModal from '@/components/ReviewModal';
import { Button } from '@/components/ui/button';
import { Camera, Globe, Video, Star, CheckCircle, ArrowRight, Loader2, MessageSquarePlus } from 'lucide-react';
import Link from 'next/link';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export default function Home() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'), 
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        userName: doc.data().userName,
        rating: doc.data().rating,
        comment: doc.data().comment,
        createdAt: doc.data().createdAt,
      }));
      setReviews(reviewsData);
      setLoadingReviews(false);
    });

    return () => unsubscribe();
  }, []);

  const services = [
  {
    icon: <Globe className="w-12 h-12" />,
    title: "Google 360° Virtual Tours",
    description: "Immersive virtual tours that showcase your business on Google Maps and Search."
  },
  {
    icon: <Camera className="w-12 h-12" />,
    title: "360° Photography",
    description: "Professional 360° photos that capture every angle of your space."
  },
  {
    icon: <Video className="w-12 h-12" />,
    title: "360° Video Production",
    description: "Engaging 360° videos that tell your brand story in an immersive way."
  }];


  const benefits = [
  "Google Verified Photographer",
  "Boost Local SEO & Visibility",
  "Premium 360° Photo & Video",
  "Increase Customer Engagement",
  "Professional Equipment & Expertise",
  "Fast Turnaround Time"];


  return (
    <div className="min-h-screen">
      <Navigation onGetQuote={() => setIsQuoteModalOpen(true)} />

      {/* Hero Section with 360° Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover">

            <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight !whitespace-pre-line">KTOUR – Kosmos Media Tour

            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              We Create Google 360° Virtual Tours for Businesses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">

                <Link href="/portfolio">
                  <Camera className="mr-2" />
                  View Portfolio
                </Link>
              </Button>
              <Button
                onClick={() => setIsQuoteModalOpen(true)}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">

                Get a Quote
                <ArrowRight className="ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white">

          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16">

            <h2 className="text-4xl md:text-5xl font-bold mb-6">About KTOUR</h2>
            <p className="text-lg text-muted-foreground">
              We are a specialized media production company focused on creating stunning 360° virtual experiences
              that help businesses showcase their spaces, products, and services in the most engaging way possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-border shadow-lg hover:shadow-xl transition-shadow">

                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">

            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose KTOUR?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge technology with creative expertise to deliver exceptional results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-3 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">

                <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                <span className="font-medium">{benefit}</span>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16">

            <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground">
              Real reviews from businesses we've helped grow.
            </p>
          </motion.div>

          {loadingReviews ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl border border-border">
              <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-bold mb-2">No Reviews Yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to share your experience!</p>
              <Button
                onClick={() => setShowReviewModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <MessageSquarePlus className="mr-2 w-4 h-4" />
                Write a Review
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {reviews.map((review, index) =>
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-border shadow-lg">

                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) =>
                    <Star key={i} className={`${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} size={20} />
                    )}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{review.comment}"</p>
                    <div>
                      <p className="font-bold">{review.userName}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="text-center">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="mr-4"
                >
                  <Link href="/reviews">
                    View All Reviews
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  onClick={() => setShowReviewModal(true)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <MessageSquarePlus className="mr-2 w-4 h-4" />
                  Write a Review
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Book your 360° shoot today and start engaging customers like never before.
            </p>
            <Button
              onClick={() => setIsQuoteModalOpen(true)}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">

              Book Your 360° Shoot
              <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <GetQuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
      
      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal 
          isOpen={showReviewModal} 
          onClose={() => setShowReviewModal(false)} 
        />
      )}
    </div>);

}