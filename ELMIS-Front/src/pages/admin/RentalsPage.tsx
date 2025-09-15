import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { motion } from 'framer-motion';
import { Edit, Trash2, Clock, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
// Removed mockRentals import
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ExportMenu } from '@/components/ui/export-menu';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

interface Rental {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  bookTitle: string;
  status: 'RENTED' | 'READING' | 'COMPLETED' | 'OVERDUE';
  pickupDate: string;
  dueDate: string;
  returnDate: string | null;
  extended: boolean;
}

// Define a type for the data sent to the backend for updating rental status
interface UpdateRentalStatusPayload {
  status: 'RENTED' | 'READING' | 'COMPLETED' | 'OVERDUE';
  returnDate?: string | null; // Include returnDate if status is COMPLETED
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]); // Initialize with empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch rentals on component mount
  useEffect(() => {
    const fetchRentals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<Rental[]>('/api/rentals');
        setRentals(response.data);
      } catch (err) {
        console.error("Error fetching rentals:", err);
        setError('Failed to load rentals. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load rentals. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const updateRentalStatus = async (id: string, newStatus: string) => {
    let toastMessage = `Rental status changed to ${newStatus.toLowerCase()}`;
    let toastVariant: 'default' | 'destructive' | 'warning' = 'default';

    try {
      if (newStatus === 'COMPLETED') {
        // Assuming returnDate should be set to today when marked as completed
        const payload = { returnDate: new Date().toISOString().split('T')[0] };
        await axios.put(`/api/rentals/return/${id}`, payload); // Use the return endpoint for completion
        toastMessage = `Rental marked as completed.`;
      } else if (newStatus === 'OVERDUE') {
        // Call the new backend endpoint to mark as overdue
        await axios.put(`/api/rentals/overdue/${id}`);
        toastMessage = `Rental marked as overdue.`;
      } else {
        // For other statuses like READING, if backend supports it via a general update
        // For now, we'll assume only COMPLETED and OVERDUE need specific backend calls
        console.warn(`Backend does not have a specific endpoint for status: ${newStatus}.`);
        // If a general update endpoint existed, it would be called here.
        // For example: await axios.put(`/api/rentals/${id}`, { status: newStatus });
        return; // Exit if no specific backend action is needed for this status
      }

      // Update local state
      setRentals(prev =>
        prev.map(rental =>
          rental.id === id
            ? { ...rental, status: newStatus as any, returnDate: newStatus === 'COMPLETED' ? new Date().toISOString().split('T')[0] : rental.returnDate }
            : rental
        )
      );
      toast({
        title: "Status Updated",
        description: toastMessage,
      });
    } catch (err) {
      console.error(`Error updating rental status to ${newStatus}:`, err);
      setError(`Failed to update rental status to ${newStatus}.`);
      toast({
        title: 'Error',
        description: `There was a problem updating the rental status. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const extendRental = async (id: string) => {
    const rental = rentals.find(r => r.id === id);
    if (!rental) return;

    if (rental.extended) {
      toast({
        title: "Cannot Extend",
        description: "This rental has already been extended once",
        variant: "destructive",
      });
      return;
    }

    // Note: There is no explicit backend endpoint for extending rentals in the provided controllers.
    // This functionality might require a new backend endpoint or a modification to an existing one.
    // For now, we will simulate the extension locally and show a toast.
      toast({
        title: 'Feature Not Supported',
        description: 'Extending rentals is not yet supported by the backend.',
        variant: 'default', // Changed from 'warning' to 'default'
      });

    // Placeholder for future implementation if backend endpoint is added:
    // try {
    //   const response = await axios.put(`/api/rentals/extend/${id}`); // Example endpoint
    //   setRentals(prev =>
    //     prev.map(r =>
    //       r.id === id
    //         ? { ...r, extended: true, dueDate: response.data.dueDate }
    //         : r
    //     )
    //   );
    //   toast({
    //     title: "Rental Extended",
    //     description: "Rental period extended successfully",
    //   });
    // } catch (err) {
    //   console.error("Error extending rental:", err);
    //   setError('Failed to extend rental.');
    //   toast({
    //     title: 'Error',
    //     description: 'There was a problem extending the rental. Please try again.',
    //     variant: 'destructive',
    //   });
    // }
  };

  const deleteRental = async (id: string) => {
    try {
      await axios.delete(`/api/rentals/${id}`);
      setRentals(prev => prev.filter(rental => rental.id !== id));
      toast({
        title: "Success",
        description: "Rental deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting rental:", err);
      setError('Failed to delete rental.');
      toast({
        title: 'Error',
        description: 'There was a problem deleting the rental. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; icon: React.ElementType } } = {
      RENTED: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/50', icon: Clock },
      READING: { color: 'bg-green-500/20 text-green-400 border-green-500/50', icon: CheckCircle },
      COMPLETED: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/50', icon: CheckCircle },
      OVERDUE: { color: 'bg-red-500/20 text-red-400 border-red-500/50', icon: AlertCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null; // Handle unexpected status values

    const IconComponent = config.icon;

    return (
      <Badge variant="outline" className={config.color}>
        <IconComponent className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  const isOverdue = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to midnight
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0); // Normalize due date to midnight
    return due < today;
  };

  if (isLoading) {
    return <LoadingSkeleton rows={6} showHeader={true} type="table" />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rental Management</h1>
          <p className="text-muted-foreground">Monitor and manage all book rentals</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-card/50 backdrop-blur border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Rentals</CardTitle>
            <ExportMenu
              fileName="rentals"
              getData={() => rentals}
              mapRow={(r) => ({
                User: r.userName,
                Book: r.bookTitle,
                Status: r.status,
                PickupDate: r.pickupDate,
                DueDate: r.dueDate,
                ReturnDate: r.returnDate ?? '',
                Extended: r.extended ? 'Yes' : 'No',
              })}
            />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-primary/10">
                  <TableHead>User</TableHead>
                  <TableHead>Book</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pickup Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.map((rental, index) => (
                  <motion.tr
                    key={rental.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-primary/10 hover:bg-primary/5 transition-colors group ${
                      isOverdue(rental.dueDate) && rental.status !== 'COMPLETED' && rental.status !== 'OVERDUE' ? 'bg-red-500/5' : ''
                    }`}
                  >
                    <TableCell className="font-medium">{rental.userName}</TableCell>
                    <TableCell className="text-muted-foreground">{rental.bookTitle}</TableCell>
                    <TableCell>{getStatusBadge(rental.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(rental.pickupDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className={`text-muted-foreground ${
                      isOverdue(rental.dueDate) && rental.status !== 'COMPLETED' && rental.status !== 'OVERDUE' ? 'text-red-400 font-medium' : ''
                    }`}>
                      {new Date(rental.dueDate).toLocaleDateString()}
                      {rental.extended && (
                        <Badge variant="outline" className="ml-2 text-xs">Extended</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {rental.returnDate ? new Date(rental.returnDate).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Select
                          value={rental.status}
                          onValueChange={(value) => updateRentalStatus(rental.id, value)}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RENTED">Rented</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="OVERDUE">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => extendRental(rental.id)}
                          disabled={rental.extended || rental.status === 'COMPLETED' || rental.status === 'OVERDUE'}
                          className="hover:scale-110 transition-transform"
                          title={rental.extended ? "Already extended" : rental.status === 'COMPLETED' || rental.status === 'OVERDUE' ? "Cannot extend this status" : "Extend rental"}
                        >
                          <RotateCcw className="h-4 w-4" />
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
                              <AlertDialogTitle>Delete Rental Record</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this rental record? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteRental(rental.id)}>
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
    </div>
  );
}
