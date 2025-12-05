"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Mail, Phone, User, MessageSquare, Calendar, CheckCircle } from 'lucide-react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'in-progress' | 'closed';
  createdAt: any;
}

export default function AdminContactsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'in-progress' | 'closed'>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    } else if (user) {
      fetchContacts();
    }
  }, [user, authLoading]);

  const fetchContacts = async () => {
    try {
      const q = query(collection(db, 'contactRequests'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const contactsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        phone: doc.data().phone,
        message: doc.data().message,
        status: doc.data().status || 'new',
        createdAt: doc.data().createdAt,
      }));
      setContacts(contactsData);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: 'new' | 'in-progress' | 'closed') => {
    try {
      await updateDoc(doc(db, 'contactRequests', id), { status: newStatus });
      toast.success('Status updated');
      fetchContacts();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredContacts = filter === 'all' 
    ? contacts 
    : contacts.filter(c => c.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'closed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
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
            <h1 className="text-2xl font-bold">Contact Requests</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={filter === 'all' ? 'default' : 'outline'} 
                   className="cursor-pointer" 
                   onClick={() => setFilter('all')}>
              All ({contacts.length})
            </Badge>
            <Badge variant={filter === 'new' ? 'default' : 'outline'} 
                   className="cursor-pointer" 
                   onClick={() => setFilter('new')}>
              New ({contacts.filter(c => c.status === 'new').length})
            </Badge>
            <Badge variant={filter === 'in-progress' ? 'default' : 'outline'} 
                   className="cursor-pointer" 
                   onClick={() => setFilter('in-progress')}>
              In Progress ({contacts.filter(c => c.status === 'in-progress').length})
            </Badge>
            <Badge variant={filter === 'closed' ? 'default' : 'outline'} 
                   className="cursor-pointer" 
                   onClick={() => setFilter('closed')}>
              Closed ({contacts.filter(c => c.status === 'closed').length})
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-20">
            <Mail className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No Contact Requests</h2>
            <p className="text-muted-foreground">
              {filter === 'all' ? 'No contacts yet' : `No ${filter} contacts`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-border p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold">{contact.name}</h3>
                      <Badge className={getStatusColor(contact.status)}>
                        {contact.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Mail size={16} />
                        <a href={`mailto:${contact.email}`} className="hover:text-blue-600">
                          {contact.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone size={16} />
                        <span>{contact.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>
                          {contact.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <MessageSquare size={16} className="mt-1 flex-shrink-0" />
                    <p className="text-sm">{contact.message}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {contact.status !== 'new' && (
                    <Button
                      onClick={() => updateStatus(contact.id, 'new')}
                      variant="outline"
                      size="sm"
                    >
                      Mark as New
                    </Button>
                  )}
                  {contact.status !== 'in-progress' && (
                    <Button
                      onClick={() => updateStatus(contact.id, 'in-progress')}
                      variant="outline"
                      size="sm"
                    >
                      Mark In Progress
                    </Button>
                  )}
                  {contact.status !== 'closed' && (
                    <Button
                      onClick={() => updateStatus(contact.id, 'closed')}
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
