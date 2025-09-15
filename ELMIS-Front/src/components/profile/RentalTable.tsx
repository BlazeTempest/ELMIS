import { motion } from 'framer-motion';
import { Calendar, Clock, RotateCcw, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuthStore } from '@/stores/authStore';
import { mockRentals } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

export function RentalTable() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  if (!user) return null;

  // Get user rentals and add some mock historical data
  const userRentals = [
    ...mockRentals.filter(rental => rental.userId === user.id),
    // Add some mock historical data
    {
      id: '4',
      bookId: '3',
      bookTitle: 'Artificial Intelligence Ethics',
      userId: user.id,
      userName: user.name,
      pickupDate: '2024-01-01',
      dueDate: '2024-01-31',
      status: 'RENTED' as const,
      returnDate: null,
      extended: false,
      renewalCount: 0
    },
    {
      id: '5',
      bookId: '4',
      bookTitle: 'Space Exploration 2050',
      userId: user.id,
      userName: user.name,
      pickupDate: '2023-12-01',
      dueDate: '2023-12-31',
      status: 'COMPLETED' as const,
      returnDate: '2023-12-30',
      extended: false,
      renewalCount: 1
    }
  ];

  const handleExtend = (rentalId: string) => {
    toast({
      title: "Rental Extended",
      description: "Your rental has been extended by 2 weeks.",
    });
  };

  const handleReturn = (rentalId: string) => {
    toast({
      title: "Book Returned",
      description: "Thank you for returning the book on time!",
    });
  };

  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = new Date(dueDate) < new Date() && (status === 'RENTED' || status === 'READING');
    
    if (status === 'COMPLETED') {
      return <Badge variant="outline" className="bg-success/20 text-success border-success/30">Returned</Badge>;
    }
    if (status === 'OVERDUE' || isOverdue) {
      return <Badge variant="destructive" className="bg-destructive/20 border-destructive/30">Overdue</Badge>;
    }
    if (status === 'RENTED' || status === 'READING') {
      return <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">Active</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-accent" />
          My Rentals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rent Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Renewals</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userRentals.map((rental, index) => {
                const daysUntilDue = getDaysUntilDue(rental.dueDate);
                const isOverdue = daysUntilDue < 0 && (rental.status === 'RENTED' || rental.status === 'READING');
                const canExtend = (rental.renewalCount || 0) < 2 && !isOverdue;

                return (
                  <motion.tr
                    key={rental.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-muted/50 transition-colors group"
                  >
                    <TableCell className="font-medium">
                      <motion.div whileHover={{ x: 5 }} className="transition-transform">
                        {rental.bookTitle}
                      </motion.div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(rental.status, rental.dueDate)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(rental.pickupDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className={`h-4 w-4 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`} />
                        <span className={isOverdue ? 'text-destructive font-medium' : ''}>
                          {new Date(rental.dueDate).toLocaleDateString()}
                        </span>
                        {(rental.status === 'RENTED' || rental.status === 'READING') && (
                          <span className={`text-xs ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                            ({Math.abs(daysUntilDue)} days {isOverdue ? 'overdue' : 'left'})
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <RotateCcw className="h-4 w-4 text-muted-foreground" />
                        <span>{rental.renewalCount || 0}/2</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {(rental.status === 'RENTED' || rental.status === 'READING') && (
                          <>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExtend(rental.id)}
                                disabled={!canExtend}
                                className="hover-glow"
                              >
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Extend
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                onClick={() => handleReturn(rental.id)}
                                className="bg-gradient-accent hover:opacity-90"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Return
                              </Button>
                            </motion.div>
                          </>
                        )}
                        {rental.status === 'COMPLETED' && (
                          <div className="flex items-center gap-1 text-success text-sm">
                            <CheckCircle className="h-4 w-4" />
                            Completed
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {userRentals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 text-muted-foreground"
          >
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No rentals found. Start exploring our book collection!</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}