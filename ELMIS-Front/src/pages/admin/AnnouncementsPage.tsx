import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
// Removed mockAnnouncements import
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  createdBy: string;
}

// Define a type for the data sent to the backend for creating/updating announcements
interface AnnouncementInput {
  title: string;
  message: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]); // Initialize with empty array
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState<AnnouncementInput>({ title: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch announcements on component mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<Announcement[]>('/api/announcements');
        setAnnouncements(response.data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError('Failed to load announcements. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load announcements. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleAdd = async () => {
    if (!formData.title || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post<Announcement>('/api/announcements', formData);
      setAnnouncements(prev => [response.data, ...prev]);
      setFormData({ title: '', message: '' });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Announcement created successfully",
      });
    } catch (err) {
      console.error("Error creating announcement:", err);
      setError('Failed to create announcement.');
      toast({
        title: 'Error',
        description: 'There was a problem creating the announcement. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async () => {
    if (!formData.title || !formData.message || !editingAnnouncement) return;

    try {
      const response = await axios.put<Announcement>(`/api/announcements/${editingAnnouncement.id}`, formData);
      setAnnouncements(prev =>
        prev.map(ann =>
          ann.id === editingAnnouncement.id ? response.data : ann
        )
      );
      setFormData({ title: '', message: '' });
      setEditingAnnouncement(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Announcement updated successfully",
      });
    } catch (err) {
      console.error("Error updating announcement:", err);
      setError('Failed to update announcement.');
      toast({
        title: 'Error',
        description: 'There was a problem updating the announcement. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/announcements/${id}`);
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting announcement:", err);
      setError('Failed to delete announcement.');
      toast({
        title: 'Error',
        description: 'There was a problem deleting the announcement. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({ title: announcement.title, message: announcement.message });
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground">Manage system announcements and notifications</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="group hover:scale-105 transition-all duration-200">
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
              Add Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur border-primary/20">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
              <DialogDescription>
                Add a new system announcement that will be visible to all users.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter announcement title"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter announcement message"
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>Create Announcement</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <p>Loading announcements...</p>
          {/* You could add a spinner component here */}
        </div>
      )}

      {error && (
        <div className="flex flex-col justify-center items-center h-64 text-destructive">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      )}

      {/* Announcements List */}
      {!loading && !error && (
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="bg-card/50 backdrop-blur border-primary/10 hover:border-primary/30 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {announcement.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(announcement.createdAt)}
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(announcement)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:scale-110 transition-transform text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card/95 backdrop-blur border-primary/20">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this announcement? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(announcement.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-foreground/80 leading-relaxed">
                    {announcement.message}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card/95 backdrop-blur border-primary/20">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update the announcement details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter announcement title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-message">Message</Label>
              <Textarea
                id="edit-message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter announcement message"
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>Update Announcement</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
