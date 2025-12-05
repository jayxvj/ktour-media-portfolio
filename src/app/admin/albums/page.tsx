"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Plus, Trash2, Image as ImageIcon, Video as VideoIcon, 
  ArrowLeft, Upload, X, Edit
} from 'lucide-react';
import { 
  collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, 
  query, orderBy, updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Link from 'next/link';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  mediaURL: string;
  title: string;
  location: string;
  description: string;
  uploadedAt: any;
}

export default function AdminPortfolioPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaLocation, setMediaLocation] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [deletingMedia, setDeletingMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    } else if (user) {
      fetchMedia();
    }
  }, [user, authLoading]);

  const fetchMedia = async () => {
    try {
      const q = query(collection(db, 'media'), orderBy('uploadedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const mediaData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        type: doc.data().type,
        mediaURL: doc.data().mediaURL,
        title: doc.data().title || '',
        location: doc.data().location || '',
        description: doc.data().description || '',
        uploadedAt: doc.data().uploadedAt,
      }));
      setMediaItems(mediaData);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleUploadMedia = async () => {
    if (mediaFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    if (!mediaTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setUploading(true);
    setUploadProgress('');
    
    try {
      let successCount = 0;
      
      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i];
        setUploadProgress(`Processing ${i + 1} of ${mediaFiles.length}...`);
        
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');
        
        if (!isImage && !isVideo) {
          toast.error(`Skipped ${file.name}: Not a valid image or video`);
          continue;
        }

        try {
          const base64Data = await fileToBase64(file);
          
          await addDoc(collection(db, 'media'), {
            type: isVideo ? 'video' : 'image',
            mediaURL: base64Data,
            title: mediaTitle.trim(),
            location: mediaLocation.trim(),
            description: mediaDescription.trim(),
            uploadedAt: serverTimestamp(),
          });
          
          successCount++;
        } catch (fileError) {
          console.error(`Error uploading ${file.name}:`, fileError);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (successCount > 0) {
        toast.success(`✅ ${successCount} file(s) uploaded successfully!`);
        setShowUploadModal(false);
        setMediaFiles([]);
        setMediaTitle('');
        setMediaLocation('');
        setMediaDescription('');
        setUploadProgress('');
        fetchMedia();
      } else {
        toast.error('No files were uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleEditMedia = (media: MediaItem) => {
    setEditingMedia(media);
    setMediaTitle(media.title);
    setMediaLocation(media.location);
    setMediaDescription(media.description);
    setShowEditModal(true);
  };

  const handleUpdateMedia = async () => {
    if (!editingMedia) return;
    
    if (!mediaTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setUploading(true);
    
    try {
      await updateDoc(doc(db, 'media', editingMedia.id), {
        title: mediaTitle.trim(),
        location: mediaLocation.trim(),
        description: mediaDescription.trim(),
      });
      
      toast.success('✅ Media updated successfully!');
      setShowEditModal(false);
      setEditingMedia(null);
      setMediaTitle('');
      setMediaLocation('');
      setMediaDescription('');
      fetchMedia();
    } catch (error) {
      console.error('Error updating media:', error);
      toast.error('Failed to update media');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = (media: MediaItem) => {
    setDeletingMedia(media);
    setShowDeleteModal(true);
  };

  const confirmDeleteMedia = async () => {
    if (!deletingMedia) return;

    try {
      await deleteDoc(doc(db, 'media', deletingMedia.id));
      toast.success('✅ Media deleted successfully!');
      setShowDeleteModal(false);
      setDeletingMedia(null);
      fetchMedia();
    } catch (error) {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete media');
    }
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setMediaFiles([]);
    setMediaTitle('');
    setMediaLocation('');
    setMediaDescription('');
    setUploadProgress('');
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingMedia(null);
    setMediaTitle('');
    setMediaLocation('');
    setMediaDescription('');
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingMedia(null);
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
            <h1 className="text-2xl font-bold">Portfolio Media</h1>
          </div>
          <Button onClick={() => setShowUploadModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Photos/Videos
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Media</p>
                <p className="text-3xl font-bold">{mediaItems.length}</p>
              </div>
              <Upload className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Photos</p>
                <p className="text-3xl font-bold">
                  {mediaItems.filter(m => m.type === 'image').length}
                </p>
              </div>
              <ImageIcon className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Videos</p>
                <p className="text-3xl font-bold">
                  {mediaItems.filter(m => m.type === 'video').length}
                </p>
              </div>
              <VideoIcon className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-border">
            <ImageIcon className="w-20 h-20 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No Media Yet</h2>
            <p className="text-muted-foreground mb-8">Upload your first 360° photos or videos to get started</p>
            <Button onClick={() => setShowUploadModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Photos/Videos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {mediaItems.map((media, index) => (
              <motion.div
                key={media.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative rounded-xl overflow-hidden border border-border bg-white dark:bg-gray-900 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {media.type === 'image' ? (
                  <img
                    src={media.mediaURL}
                    alt={media.title || `Media ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <video
                    src={media.mediaURL}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                  {media.type === 'image' ? (
                    <><ImageIcon size={12} /> <span>Photo</span></>
                  ) : (
                    <><VideoIcon size={12} /> <span>Video</span></>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={() => handleEditMedia(media)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg z-10"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteMedia(media)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg z-10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg mb-1">{media.title}</h3>
                  {media.location && (
                    <p className="text-white/90 text-sm mb-1">📍 {media.location}</p>
                  )}
                  {media.description && (
                    <p className="text-white/80 text-xs line-clamp-2">{media.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeUploadModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Upload Photos & Videos</h2>
                  <button onClick={closeUploadModal} className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-border">
                    <p className="text-sm">
                      <strong className="text-blue-600 dark:text-blue-400">📸 Upload Media:</strong> Add title, location, and description for your media. 
                      This information will be visible when users hover over your portfolio items!
                    </p>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2 block">Title <span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      placeholder="e.g., Modern Office Space, Luxury Villa Interior"
                      value={mediaTitle}
                      onChange={(e) => setMediaTitle(e.target.value)}
                      className="mt-1"
                      disabled={uploading}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2 block">Location</Label>
                    <Input
                      type="text"
                      placeholder="e.g., Downtown Mumbai, Marina Bay Singapore"
                      value={mediaLocation}
                      onChange={(e) => setMediaLocation(e.target.value)}
                      className="mt-1"
                      disabled={uploading}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2 block">Description</Label>
                    <Textarea
                      placeholder="e.g., A stunning 360° view of a modern co-working space with natural lighting"
                      value={mediaDescription}
                      onChange={(e) => setMediaDescription(e.target.value)}
                      className="mt-1 resize-none"
                      rows={3}
                      disabled={uploading}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2 block">Select Photos <span className="text-red-500">*</span></Label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setMediaFiles(Array.from(e.target.files || []))}
                      className="mt-1 cursor-pointer"
                      disabled={uploading}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Hold <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Ctrl</kbd> or <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Cmd</kbd> to select multiple images
                    </p>
                    {mediaFiles.length > 0 && (
                      <div className="mt-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900">
                        <p className="text-sm text-green-800 dark:text-green-200 font-semibold">
                          ✓ {mediaFiles.length} image{mediaFiles.length !== 1 ? 's' : ''} selected
                        </p>
                        <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                          {mediaFiles.map((file, i) => (
                            <p key={i} className="text-xs text-green-700 dark:text-green-300">
                              • {file.name}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {uploadProgress && (
                      <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900">
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-semibold">
                          {uploadProgress}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={closeUploadModal}
                      className="flex-1"
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUploadMedia}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={uploading || mediaFiles.length === 0 || !mediaTitle.trim()}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload {mediaFiles.length > 0 ? `${mediaFiles.length} file${mediaFiles.length !== 1 ? 's' : ''}` : 'Files'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editingMedia && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeEditModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Edit Media Information</h2>
                  <button onClick={closeEditModal} className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    {editingMedia.type === 'image' ? (
                      <img
                        src={editingMedia.mediaURL}
                        alt={editingMedia.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <video
                        src={editingMedia.mediaURL}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      {editingMedia.type === 'image' ? (
                        <><ImageIcon size={12} /> <span>Photo</span></>
                      ) : (
                        <><VideoIcon size={12} /> <span>Video</span></>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-border">
                    <p className="text-sm">
                      <strong className="text-blue-600 dark:text-blue-400">✏️ Edit Information:</strong> Update the title, location, and description. 
                      Changes will be visible when users hover over this media in your portfolio!
                    </p>
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2 block">Title <span className="text-red-500">*</span></Label>
                    <Input
                      type="text"
                      placeholder="e.g., Modern Office Space, Luxury Villa Interior"
                      value={mediaTitle}
                      onChange={(e) => setMediaTitle(e.target.value)}
                      className="mt-1"
                      disabled={uploading}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2 block">Location</Label>
                    <Input
                      type="text"
                      placeholder="e.g., Downtown Mumbai, Marina Bay Singapore"
                      value={mediaLocation}
                      onChange={(e) => setMediaLocation(e.target.value)}
                      className="mt-1"
                      disabled={uploading}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-2 block">Description</Label>
                    <Textarea
                      placeholder="e.g., A stunning 360° view of a modern co-working space with natural lighting"
                      value={mediaDescription}
                      onChange={(e) => setMediaDescription(e.target.value)}
                      className="mt-1 resize-none"
                      rows={3}
                      disabled={uploading}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={closeEditModal}
                      className="flex-1"
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateMedia}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={uploading || !mediaTitle.trim()}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Edit className="mr-2 h-4 w-4" />
                          Update Media
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && deletingMedia && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDeleteModal}
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
                  
                  <h2 className="text-2xl font-bold mb-2">Delete Media?</h2>
                  <p className="text-muted-foreground mb-6">
                    Are you sure you want to delete <strong>{deletingMedia.title}</strong>? This will remove it from your portfolio permanently.
                  </p>

                  <div className="flex gap-3 w-full">
                    <Button
                      variant="outline"
                      onClick={closeDeleteModal}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmDeleteMedia}
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
    </div>
  );
}