"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GetQuoteModal from '@/components/GetQuoteModal';
import { Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  mediaURL: string;
  title: string;
  location: string;
  description: string;
  uploadedAt: any;
}

export default function PortfolioPage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const q = query(collection(db, 'media'), orderBy('uploadedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const mediaData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        type: doc.data().type,
        mediaURL: doc.data().mediaURL,
        title: doc.data().title || 'Untitled',
        location: doc.data().location || '',
        description: doc.data().description || '',
        uploadedAt: doc.data().uploadedAt,
      }));
      
      setMediaItems(mediaData);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation onGetQuote={() => setIsQuoteModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Portfolio
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore our collection of stunning virtual tours and immersive media
            </p>
          </motion.div>
        </div>
      </section>

      {/* Media Collage Grid */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          ) : mediaItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <ImageIcon className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No Media Yet</h2>
              <p className="text-muted-foreground mb-8">
                Our portfolio is coming soon. Check back later!
              </p>
            </motion.div>
          ) : (
            <>
              {/* Stats Badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center space-x-6 bg-white dark:bg-gray-900 rounded-full px-8 py-4 shadow-lg border border-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="font-semibold">{mediaItems.length} Total</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ImageIcon size={16} className="text-green-600" />
                    <span className="text-muted-foreground">{mediaItems.filter(m => m.type === 'image').length} Photos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Video size={16} className="text-purple-600" />
                    <span className="text-muted-foreground">{mediaItems.filter(m => m.type === 'video').length} Videos</span>
                  </div>
                </div>
              </div>

              {/* Masonry Collage Grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {mediaItems.map((media, index) => {
                  // Randomize heights for collage effect
                  const heights = ['h-48', 'h-56', 'h-64', 'h-72', 'h-80'];
                  const randomHeight = heights[index % heights.length];
                  
                  return (
                    <motion.div
                      key={media.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.02 }}
                      className="break-inside-avoid group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                      {media.type === 'image' ? (
                        <img
                          src={media.mediaURL}
                          alt={media.title || `Media ${index + 1}`}
                          className={`w-full ${randomHeight} object-cover`}
                        />
                      ) : (
                        <video
                          src={media.mediaURL}
                          className={`w-full ${randomHeight} object-cover`}
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      )}
                      
                      {/* Type Badge */}
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5">
                        {media.type === 'image' ? (
                          <><ImageIcon size={14} /> <span>Photo</span></>
                        ) : (
                          <><Video size={14} /> <span>Video</span></>
                        )}
                      </div>

                      {/* Info Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-white font-bold text-lg mb-1">{media.title}</h3>
                        {media.location && (
                          <p className="text-white/90 text-sm mb-2 flex items-center">
                            <span className="mr-1">📍</span> {media.location}
                          </p>
                        )}
                        {media.description && (
                          <p className="text-white/80 text-xs line-clamp-3">{media.description}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Want Your Business Featured Here?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Let's create an amazing virtual tour for your business.
            </p>
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Get Started Today
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <GetQuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </div>
  );
}