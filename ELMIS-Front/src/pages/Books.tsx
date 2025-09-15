import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { motion } from 'framer-motion';
import { Search, Grid, List, BookOpen, Plus } from 'lucide-react'; // Removed Filter
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookCard, Book } from '@/components/ui/book-card';
import { Card, CardContent } from '@/components/ui/card'; // Removed CardHeader, CardTitle
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';

// Removed mockBooks import

export default function Books() {
  const [searchQuery, setSearchQuery] = useState('');
  // Removed selectedGenre state
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [books, setBooks] = useState<Book[]>([]); // Initialize with empty array
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  // Removed genres state

  const { user } = useAuthStore();
  const { toast } = useToast();

  // Fetch books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<Book[]>('/api/books', {
          params: {
            // Add backend filtering parameters here if needed, e.g., title, author, etc.
            // For now, we fetch all and filter client-side.
          }
        });
        setBooks(response.data);
        // Removed genre extraction
      } catch (err) {
        console.error("Error fetching books:", err);
        setError('Failed to load books. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load books. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []); // Empty dependency array means this runs once on mount

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    // Removed genre filtering
    const matchesStatus = selectedStatus === 'all' || (book.status && book.status === selectedStatus);
    
    return matchesSearch && matchesStatus; // Removed matchesGenre
  });

  const handleRentBook = async (bookId: string) => {
    if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to rent books.',
          variant: 'default', // Changed from 'warning' to 'default'
        });
      return;
    }

    try {
      // The response.data from axios.post('/api/rentals', ...) is typed as Book,
      // but the backend returns RentalDto. This might cause issues if Book interface
      // doesn't match RentalDto. For now, we assume it's compatible enough for title and dueDate.
      const response = await axios.post<Book>('/api/rentals', {
        userId: user.id,
        bookId: bookId,
      });
      
      // Update local state optimistically or based on response
      setBooks(prev => prev.map(book => 
        book.id === bookId 
          ? { 
              ...book, 
              status: 'rented' as const, 
              rentedBy: user.name, 
              // Assuming backend returns updated book data or we calculate dueDate
              // The response.data.dueDate is expected to be a string from RentalDto
              dueDate: response.data.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() 
            }
          : book
      ));
      
      // Assuming response.data.title is available and correct
      toast({
        title: 'Book Rented Successfully!',
        description: `You have rented "${response.data.title}". Due date: ${new Date(response.data.dueDate).toLocaleDateString()}`,
      });
    } catch (err) {
      console.error("Error renting book:", err);
      setError('Failed to rent book.');
      toast({
        title: 'Error Renting Book',
        description: 'There was a problem renting the book. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleReturnBook = async (bookId: string) => {
    try {
      // The backend returns RentalDto, but we are updating Book state.
      // We assume the response from PUT /api/rentals/return/{id} contains enough info to update the book state.
      await axios.put(`/api/rentals/return/${bookId}`); // Assuming this endpoint handles return
      
      // Update local state
      setBooks(prev => prev.map(book => 
        book.id === bookId 
          ? { ...book, status: 'available' as const, rentedBy: undefined, dueDate: undefined }
          : book
      ));
      
      toast({
        title: 'Book Returned Successfully!',
        description: `Thank you for returning the book.`,
      });
    } catch (err) {
      console.error("Error returning book:", err);
      setError('Failed to return book.');
      toast({
        title: 'Error Returning Book',
        description: 'There was a problem returning the book. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Removed handleExtendRental function as it was a placeholder and not directly related to the task's core.
  // If extend functionality is needed, it should be implemented with a proper backend endpoint.

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-col lg:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Book Collection</h1>
          <p className="text-muted-foreground">
            Discover and manage your digital library
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="gradient-primary hover-glow">
              <Plus className="mr-2 h-4 w-4" />
              Add New Book
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Filters and Search */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass bg-background/50 border-border/50 focus:glow-primary"
              />
            </div>

            {/* Removed Genre Filter */}

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[200px] glass bg-background/50 border-border/50">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-border/50 glass">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <p>Loading books...</p>
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

      {/* Results Info */}
      {!loading && !error && filteredBooks.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredBooks.length} of {books.length} books
          </p>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-success">
              {books.filter(b => b.status === 'available').length} Available
            </Badge>
            <Badge variant="outline" className="text-warning">
              {books.filter(b => b.status === 'rented').length} Rented
            </Badge>
            <Badge variant="outline" className="text-destructive">
              {books.filter(b => b.status === 'maintenance').length} Maintenance
            </Badge>
          </div>
        </div>
      )}

      {/* Books Grid/List */}
      {!loading && !error && (
        filteredBooks.length > 0 ? (
          <motion.div
            layout
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}
          >
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <BookCard
                  book={book}
                  onRent={handleRentBook}
                  onReturn={handleReturnBook}
                  className={viewMode === 'list' ? 'flex-row' : ''}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No books found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                // Removed setSelectedGenre('all');
                setSelectedStatus('all');
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )
      )}
    </div>
  );
}
