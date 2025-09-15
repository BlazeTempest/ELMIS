import { motion } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp, Edit, Trash2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { mockReviews } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

export function ReviewFeed() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  if (!user) return null;

  // Get user reviews and add some mock data
  const userReviews = [
    ...mockReviews.filter(review => review.userId === user.id),
    // Add some mock user reviews
    {
      id: '4',
      bookId: '4',
      bookTitle: 'Space Exploration 2050',
      userId: user.id,
      userName: user.name,
      userRole: user.role as 'admin' | 'operator',
      rating: 5,
      comment: 'Amazing book! The author\'s vision of space exploration is both realistic and inspiring.',
      date: '2024-01-08',
      helpful: 7
    },
    {
      id: '5',
      bookId: '5',
      bookTitle: 'Climate Change Solutions',
      userId: user.id,
      userName: user.name,
      userRole: user.role as 'admin' | 'operator',
      rating: 4,
      comment: 'Comprehensive overview of climate solutions. Some chapters could be more actionable.',
      date: '2024-01-06',
      helpful: 3
    }
  ];

  const handleEdit = (reviewId: string) => {
    toast({
      title: "Edit Review",
      description: "Review editing functionality would open here.",
    });
  };

  const handleDelete = (reviewId: string) => {
    toast({
      title: "Review Deleted",
      description: "Your review has been removed.",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  const getTimeAgo = (date: string) => {
    const days = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          My Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors group"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">{review.bookTitle}</h4>
                  <Badge variant="outline" className="text-xs">
                    {review.userRole}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {renderStars(review.rating)}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {getTimeAgo(review.date)}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(review.id)}
                    className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(review.id)}
                    className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Review Content */}
            <p className="text-sm text-foreground mb-3">{review.comment}</p>

            {/* Review Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <motion.div
                className="flex items-center gap-1 hover:text-accent cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <ThumbsUp className="h-3 w-3" />
                <span>{review.helpful} helpful</span>
              </motion.div>
            </div>
          </motion.div>
        ))}

        {userReviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 text-muted-foreground"
          >
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No reviews posted yet. Share your thoughts on books you've read!</p>
          </motion.div>
        )}

        {/* Write Review Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-4 border-t"
        >
          <Button className="w-full bg-gradient-primary hover:opacity-90 hover-glow">
            <Star className="h-4 w-4 mr-2" />
            Write New Review
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}