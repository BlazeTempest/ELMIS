import { motion } from 'framer-motion';
import { BookOpen, Clock, Star, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Book {
  id: string;
  title: string;
  author: string;
  status: 'available' | 'rented' | 'maintenance';
  coverUrl?: string;
  rating: number;
  rentedBy?: string;
  dueDate?: string;
  description?: string;
}

interface BookCardProps {
  book: Book;
  onRent?: (bookId: string) => void;
  onReturn?: (bookId: string) => void;
  onExtend?: (bookId: string) => void;
  viewOnly?: boolean;
  className?: string;
}

export function BookCard({ 
  book, 
  onRent, 
  onReturn, 
  onExtend, 
  viewOnly = false,
  className 
}: BookCardProps) {
  const statusColors = {
    available: 'bg-success text-white',
    rented: 'bg-warning text-white',
    maintenance: 'bg-destructive text-white'
  };

  const handleAction = () => {
    if (book.status === 'available' && onRent) {
      onRent(book.id);
    } else if (book.status === 'rented' && onReturn) {
      onReturn(book.id);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className={cn(
        "glass-card hover-glow border-border/50 overflow-hidden h-full",
        book.status === 'available' && "hover:shadow-[0_0_30px_hsl(var(--success)/0.3)]",
        book.status === 'rented' && "hover:shadow-[0_0_30px_hsl(var(--warning)/0.3)]",
        className
      )}>
        <div className="relative">
          {/* Book Cover */}
          <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative overflow-hidden">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="h-20 w-20 text-muted-foreground" />
            )}
            
            {/* Status Badge */}
            <Badge className={cn(
              "absolute top-2 right-2",
              statusColors[book.status]
            )}>
              {book.status}
            </Badge>
          </div>
          
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <User className="h-3 w-3 mr-1" />
              {book.author}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm">
            {/* Removed genre badge as genre is not provided by backend */}
            
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{book.rating}</span>
            </div>
          </div>

          {book.status === 'rented' && book.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Due: {new Date(book.dueDate).toLocaleDateString()}
            </div>
          )}

          {!viewOnly && (
            <div className="flex space-x-2 pt-2">
              {book.status === 'available' && (
                <Button
                  size="sm"
                  onClick={handleAction}
                  className="flex-1 gradient-primary hover:scale-105 transition-transform btn-press"
                >
                  Rent Book
                </Button>
              )}
              
              {book.status === 'rented' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onExtend?.(book.id)}
                    className="flex-1"
                  >
                    Extend
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAction}
                    className="flex-1"
                  >
                    Return
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
