import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, Trash2, MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { mockReviews, mockBooks } from '@/lib/mockData';

interface Review {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  userRole: 'admin' | 'operator';
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [newReview, setNewReview] = useState({
    bookId: '',
    rating: 0,
    comment: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleSubmitReview = () => {
    if (!newReview.bookId || !newReview.rating || !newReview.comment.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    const book = mockBooks.find(b => b.id === newReview.bookId);
    if (!book) return;

    const review: Review = {
      id: Date.now().toString(),
      bookId: newReview.bookId,
      bookTitle: book.title,
      userId: user?.id || '',
      userName: user?.name || '',
      userRole: user?.role || 'operator',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString(),
      helpful: 0
    };

    setReviews(prev => [review, ...prev]);
    setNewReview({ bookId: '', rating: 0, comment: '' });
    setIsDialogOpen(false);

    toast({
      title: 'Review Posted!',
      description: 'Thank you for sharing your feedback',
    });
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    toast({
      title: 'Review Deleted',
      description: 'The review has been removed',
    });
  };

  const handleHelpfulVote = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const StarRating = ({ rating, onRatingChange, readOnly = false }: { 
    rating: number; 
    onRatingChange?: (rating: number) => void;
    readOnly?: boolean;
  }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            whileHover={!readOnly ? { scale: 1.1 } : {}}
            whileTap={!readOnly ? { scale: 0.9 } : {}}
            onClick={() => !readOnly && onRatingChange?.(star)}
            disabled={readOnly}
            className="focus:outline-none"
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              }`}
            />
          </motion.button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-text">Book Reviews</h1>
          <p className="text-muted-foreground">
            Share your thoughts and discover what others think
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="gradient-primary hover-glow">
                <Plus className="mr-2 h-4 w-4" />
                Write Review
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="book-select">Select Book</Label>
                <select
                  id="book-select"
                  value={newReview.bookId}
                  onChange={(e) => setNewReview(prev => ({ ...prev, bookId: e.target.value }))}
                  className="w-full mt-1 p-2 rounded-md border border-border/50 bg-background/50 glass"
                >
                  <option value="">Choose a book...</option>
                  {mockBooks.map(book => (
                    <option key={book.id} value={book.id}>
                      {book.title} by {book.author}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Rating</Label>
                <div className="mt-2">
                  <StarRating
                    rating={newReview.rating}
                    onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your thoughts about this book..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  className="mt-1 glass bg-background/50 border-border/50"
                  rows={4}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSubmitReview} className="flex-1">
                  Post Review
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card border-border/50 hover-glow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="gradient-primary text-primary-foreground">
                          {review.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{review.userName}</h4>
                          <Badge variant="outline" className="text-xs">
                            {review.userRole}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {(user?.role === 'admin' || user?.id === review.userId) && (
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">{review.bookTitle}</h3>
                    <StarRating rating={review.rating} readOnly />
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleHelpfulVote(review.id)}
                      className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>Helpful ({review.helpful})</span>
                    </motion.button>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>Review</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share your thoughts about our books
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              Write First Review
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}