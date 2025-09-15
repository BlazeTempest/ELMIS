import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, BookOpen, UploadCloud, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { mockBooks } from '@/lib/mockData';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { ExcelImportModal } from '@/components/ui/excel-import-modal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import type { Book as UIBook } from '@/components/ui/book-card';
import { ExportMenu } from '@/components/ui/export-menu';

export default function BooksPage() {
  const [books, setBooks] = useState<UIBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<UIBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<UIBook | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    status: 'available' as 'available' | 'rented' | 'maintenance',
  });
  const { toast } = useToast();

  // Simulate loading
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
      setIsLoading(false);
    };
    loadBooks();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, genreFilter, statusFilter);
  };

  const handleGenreFilter = (genre: string) => {
    setGenreFilter(genre);
    applyFilters(searchTerm, genre, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    applyFilters(searchTerm, genreFilter, status);
  };

  const applyFilters = (search: string, genre: string, status: string) => {
    let filtered = books.filter(book =>
      (book.title.toLowerCase().includes(search.toLowerCase()) ||
       book.author.toLowerCase().includes(search.toLowerCase()) ||
       book.genre.toLowerCase().includes(search.toLowerCase())) &&
      (genre === 'all' || book.genre === genre) &&
      (status === 'all' || book.status === status)
    );
    setFilteredBooks(filtered);
  };

  const handleAdd = () => {
    if (!formData.title || !formData.author || !formData.genre) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newBook: UIBook = {
      id: Date.now().toString(),
      title: formData.title,
      author: formData.author,
      genre: formData.genre,
      description: formData.description,
      status: formData.status,
      rating: 0,
    };

    setTimeout(() => {
      const updatedBooks = [...books, newBook];
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);
      setFormData({ title: '', author: '', genre: '', description: '', status: 'available' });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Book added successfully",
      });
    }, 300);
  };

  const handleEdit = () => {
    if (!formData.title || !formData.author || !formData.genre || !editingBook) return;

    setTimeout(() => {
      const updatedBooks = books.map(book =>
        book.id === editingBook.id
          ? { ...book, ...formData }
          : book
      );
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);
      setFormData({ title: '', author: '', genre: '', description: '', status: 'available' });
      setEditingBook(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Book updated successfully",
      });
    }, 300);
  };

  const handleDelete = (id: string) => {
    setTimeout(() => {
      const updatedBooks = books.filter(book => book.id !== id);
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);
      toast({
        title: "Success",
        description: "Book deleted successfully",
      });
    }, 300);
  };

  const handleImport = (importedData: any[]) => {
    const newBooks = importedData.map((item, index) => ({
      id: `imported-${Date.now()}-${index}`,
      title: item.title || `Imported Book ${index + 1}`,
      author: item.author || 'Unknown Author',
      genre: item.genre || 'General',
      description: item.description || 'Imported from Excel',
      status: 'available' as const,
      rating: 0,
    }));

    const updatedBooks = [...books, ...newBooks];
    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);
  };

  const openEditDialog = (book: UIBook) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      status: book.status,
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      available: <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/50">Available</Badge>,
      rented: <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/50">Rented</Badge>,
      maintenance: <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">Maintenance</Badge>,
    };
    return badges[status as keyof typeof badges] || <Badge variant="outline">{status}</Badge>;
  };

  const uniqueGenres = Array.from(new Set(books.map(book => book.genre)));

  if (isLoading) {
    return <LoadingSkeleton rows={8} showHeader={true} type="table" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Book Management</h1>
          <p className="text-muted-foreground">Manage your library's book collection</p>
        </div>
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              className="group hover:border-accent/50"
              onClick={() => setIsImportModalOpen(true)}
            >
              <UploadCloud className="h-4 w-4 mr-2 group-hover:text-accent transition-colors" />
              Import Excel
            </Button>
          </motion.div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="group hover:scale-105 transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                  Add Book
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="bg-card/95 backdrop-blur border-primary/20 max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>
                  Add a new book to the library collection.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter book title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Enter author name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="genre">Genre *</Label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                    placeholder="Enter genre"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'available' | 'rented' | 'maintenance') => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-full">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter book description"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd}>Add Book</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, author, or genre..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={genreFilter} onValueChange={handleGenreFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {uniqueGenres.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Books Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Books</CardTitle>
            <ExportMenu
              fileName="books"
              getData={() => filteredBooks}
              mapRow={(b) => ({
                Title: b.title,
                Author: b.author,
                Genre: b.genre,
                Status: b.status,
                Rating: b.rating,
              })}
            />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-primary/10">
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book, index) => (
                  <motion.tr
                    key={book.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-primary/10 hover:bg-primary/5 transition-colors group"
                  >
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell className="text-muted-foreground">{book.author}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-accent/50 text-accent">
                        {book.genre}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(book.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{book.rating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(book)}
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
                              <AlertDialogTitle>Delete Book</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{book.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(book.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card/95 backdrop-blur border-primary/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Update book information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter book title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-author">Author *</Label>
              <Input
                id="edit-author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Enter author name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-genre">Genre *</Label>
              <Input
                id="edit-genre"
                value={formData.genre}
                onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                placeholder="Enter genre"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'available' | 'rented' | 'maintenance') => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-full">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter book description"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Book</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Excel Import Modal */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        title="Books"
        sampleData={mockBooks}
      />
    </div>
  );
}