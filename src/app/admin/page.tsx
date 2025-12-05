"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Loader2, LayoutDashboard, Image, Video, Mail, MessageSquare, LogOut, Star } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    albums: 0,
    images: 0,
    videos: 0,
    contacts: 0,
    quotes: 0,
    reviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    } else if (user) {
      fetchStats();
    }
  }, [user, authLoading]);

  const fetchStats = async () => {
    try {
      const albumsSnapshot = await getDocs(collection(db, 'albums'));
      const mediaSnapshot = await getDocs(collection(db, 'media'));
      const contactsSnapshot = await getDocs(collection(db, 'contactRequests'));
      const quotesSnapshot = await getDocs(collection(db, 'quoteRequests'));
      const reviewsSnapshot = await getDocs(collection(db, 'reviews'));

      const mediaData = mediaSnapshot.docs.map(doc => doc.data());
      const images = mediaData.filter(m => m.type === 'image').length;
      const videos = mediaData.filter(m => m.type === 'video').length;

      setStats({
        albums: albumsSnapshot.size,
        images,
        videos,
        contacts: contactsSnapshot.size,
        quotes: quotesSnapshot.size,
        reviews: reviewsSnapshot.size,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    { icon: <LayoutDashboard className="w-8 h-8" />, label: 'Total Albums', value: stats.albums, color: 'from-blue-500 to-cyan-500', href: '/admin/albums' },
    { icon: <Image className="w-8 h-8" />, label: 'Total Images', value: stats.images, color: 'from-purple-500 to-pink-500', href: '/admin/albums' },
    { icon: <Video className="w-8 h-8" />, label: 'Total Videos', value: stats.videos, color: 'from-orange-500 to-red-500', href: '/admin/albums' },
    { icon: <Star className="w-8 h-8" />, label: 'Customer Reviews', value: stats.reviews, color: 'from-yellow-500 to-amber-500', href: '/admin/reviews' },
    { icon: <Mail className="w-8 h-8" />, label: 'Contact Requests', value: stats.contacts, color: 'from-green-500 to-teal-500', href: '/admin/contacts' },
    { icon: <MessageSquare className="w-8 h-8" />, label: 'Quote Requests', value: stats.quotes, color: 'from-indigo-500 to-purple-500', href: '/admin/quotes' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">KTOUR Admin</h1>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">Here's what's happening with your media portfolio</p>
        </motion.div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link href={card.href}>
                    <div className={`p-6 rounded-2xl bg-gradient-to-r ${card.color} text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}>
                      <div className="mb-4">{card.icon}</div>
                      <div className="text-3xl font-bold mb-1">{card.value}</div>
                      <div className="text-sm text-white/80">{card.label}</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/admin/albums">
                  <Button className="w-full h-20 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <LayoutDashboard className="mr-2" />
                    Manage Albums
                  </Button>
                </Link>
                <Link href="/admin/reviews">
                  <Button className="w-full h-20 text-lg bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700">
                    <Star className="mr-2" />
                    Manage Reviews
                  </Button>
                </Link>
                <Link href="/admin/contacts">
                  <Button className="w-full h-20 text-lg" variant="outline">
                    <Mail className="mr-2" />
                    View Contacts
                  </Button>
                </Link>
                <Link href="/admin/quotes">
                  <Button className="w-full h-20 text-lg" variant="outline">
                    <MessageSquare className="mr-2" />
                    View Quotes
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}