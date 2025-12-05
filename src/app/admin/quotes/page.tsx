"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Mail, Phone, Building, MapPin, Briefcase, MessageSquare, Calendar, CheckCircle } from 'lucide-react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';

interface QuoteRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  businessName: string;
  location: string;
  serviceType: string;
  message?: string;
  status: 'new' | 'in-progress' | 'closed';
  createdAt: any;
}

export default function AdminQuotesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'in-progress' | 'closed'>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    } else if (user) {
      fetchQuotes();
    }
  }, [user, authLoading]);

  const fetchQuotes = async () => {
    try {
      const q = query(collection(db, 'quoteRequests'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const quotesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        phone: doc.data().phone,
        email: doc.data().email,
        businessName: doc.data().businessName,
        location: doc.data().location,
        serviceType: doc.data().serviceType,
        message: doc.data().message,
        status: doc.data().status || 'new',
        createdAt: doc.data().createdAt,
      }));
      setQuotes(quotesData);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: 'new' | 'in-progress' | 'closed') => {
    try {
      await updateDoc(doc(db, 'quoteRequests', id), { status: newStatus });
      toast.success('Status updated');
      fetchQuotes();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredQuotes = filter === 'all' 
    ? quotes 
    : quotes.filter(q => q.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'closed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getServiceLabel = (serviceType: string) => {
    const labels: { [key: string]: string } = {
      'google-360-tour': 'Google 360° Virtual Tour',
      '360-product': '360° Product Shoot',
      '360-interior': '360° Interior & Real Estate',
      '360-video': '360° Video Production',
      'branding': 'Business Branding Photography',
      'custom': 'Custom Virtual Tour Solution',
    };
    return labels[serviceType] || serviceType;
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
            <h1 className="text-2xl font-bold">Quote Requests</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={filter === 'all' ? 'default' : 'outline'} 
                   className="cursor-pointer" 
                   onClick={() => setFilter('all')}>
              All ({quotes.length})
            </Badge>
            <Badge variant={filter === 'new' ? 'default' : 'outline'} 
                   className="cursor-pointer" 
                   onClick={() => setFilter('new')}>
              New ({quotes.filter(q => q.status === 'new').length})
            </Badge>
            <Badge variant={filter === 'in-progress' ? 'default' : 'outline'} 
                   className="cursor-pointer" 
                   onClick={() => setFilter('in-progress')}>
              In Progress ({quotes.filter(q => q.status === 'in-progress').length})
            </Badge>
            <Badge variant={filter === 'closed' ? 'default' : 'outline'} 
                   className="cursor-pointer" 
                   onClick={() => setFilter('closed')}>
              Closed ({quotes.filter(q => q.status === 'closed').length})
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No Quote Requests</h2>
            <p className="text-muted-foreground">
              {filter === 'all' ? 'No quotes yet' : `No ${filter} quotes`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredQuotes.map((quote, index) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-border p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold">{quote.name}</h3>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar size={14} />
                      <span>
                        {quote.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Building size={16} className="text-muted-foreground" />
                      <span>{quote.businessName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span>{quote.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Mail size={16} className="text-muted-foreground" />
                    <a href={`mailto:${quote.email}`} className="hover:text-blue-600">
                      {quote.email}
                    </a>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Phone size={16} className="text-muted-foreground" />
                    <span>{quote.phone}</span>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center space-x-2 text-sm">
                      <Briefcase size={16} className="text-muted-foreground" />
                      <span className="font-semibold">{getServiceLabel(quote.serviceType)}</span>
                    </div>
                  </div>
                </div>

                {quote.message && (
                  <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <MessageSquare size={16} className="mt-1 flex-shrink-0 text-muted-foreground" />
                      <p className="text-sm">{quote.message}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {quote.status !== 'new' && (
                    <Button
                      onClick={() => updateStatus(quote.id, 'new')}
                      variant="outline"
                      size="sm"
                    >
                      Mark as New
                    </Button>
                  )}
                  {quote.status !== 'in-progress' && (
                    <Button
                      onClick={() => updateStatus(quote.id, 'in-progress')}
                      variant="outline"
                      size="sm"
                    >
                      Mark In Progress
                    </Button>
                  )}
                  {quote.status !== 'closed' && (
                    <Button
                      onClick={() => updateStatus(quote.id, 'closed')}
                      variant="outline"
                      size="sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark Closed
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
