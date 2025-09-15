import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mockReports } from '@/lib/mockData';
import { Progress } from '@/components/ui/progress';
import { ExportMenu } from '@/components/ui/export-menu';
export default function ReportsPage() {
  const [dateFilter, setDateFilter] = useState('monthly');
  const { toast } = useToast();

  const handleExport = (format: 'pdf' | 'csv') => {
    toast({
      title: "Export Started",
      description: `Generating ${format.toUpperCase()} report...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${format.toUpperCase()} report downloaded successfully`,
      });
    }, 2000);
  };

  const getOverduePercentage = () => {
    const { summary } = mockReports;
    return Math.round((summary.overdueBooks / summary.rentedBooks) * 100);
  };

  const getStatusBadge = (returned: boolean, extended: boolean) => {
    if (returned) {
      return <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/50">Returned</Badge>;
    }
    if (extended) {
      return <Badge variant="default" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">Extended</Badge>;
    }
    return <Badge variant="outline" className="border-blue-500/50 text-blue-400">Active</Badge>;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">View rental statistics and generate reports</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            className="group hover:scale-105 transition-all duration-200"
          >
            <FileText className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            className="group hover:scale-105 transition-all duration-200"
          >
            <Download className="h-4 w-4 mr-2 group-hover:translate-y-1 transition-transform duration-200" />
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Books',
            value: mockReports.summary.totalBooks,
            icon: BarChart3,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/20',
            borderColor: 'border-blue-500/50',
          },
          {
            title: 'Rented Books',
            value: mockReports.summary.rentedBooks,
            icon: FileText,
            color: 'text-green-400',
            bgColor: 'bg-green-500/20',
            borderColor: 'border-green-500/50',
          },
          {
            title: 'Overdue Books',
            value: mockReports.summary.overdueBooks,
            icon: Calendar,
            color: 'text-red-400',
            bgColor: 'bg-red-500/20',
            borderColor: 'border-red-500/50',
          },
          {
            title: 'Active Users',
            value: mockReports.summary.activeUsers,
            icon: BarChart3,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/20',
            borderColor: 'border-purple-500/50',
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className={`bg-card/50 backdrop-blur border-primary/10 hover:${stat.borderColor} transition-all duration-300 group`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Overdue Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-card/50 backdrop-blur border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              Overdue Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overdue Rate</span>
                <span className="text-muted-foreground">{getOverduePercentage()}%</span>
              </div>
              <Progress 
                value={getOverduePercentage()} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {mockReports.summary.overdueBooks} out of {mockReports.summary.rentedBooks} rented books are overdue
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-card/50 backdrop-blur border-primary/10">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Rental Activity Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-card/50 backdrop-blur border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Rental Activity</CardTitle>
            <ExportMenu
              fileName="rental-activity"
              getData={() => mockReports.rentalActivity}
              mapRow={(r) => ({
                User: r.userName,
                BookTitle: r.bookTitle,
                PickupDate: r.pickupDate,
                DueDate: r.dueDate,
                Returned: r.returned ? 'Yes' : 'No',
                Extended: r.extended ? 'Yes' : 'No',
              })}
            />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-primary/10">
                  <TableHead>User</TableHead>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Pickup Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReports.rentalActivity.map((rental, index) => (
                  <motion.tr
                    key={rental.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-primary/10 hover:bg-primary/5 transition-colors"
                  >
                    <TableCell className="font-medium">{rental.userName}</TableCell>
                    <TableCell className="text-muted-foreground">{rental.bookTitle}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(rental.pickupDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(rental.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(rental.returned, rental.extended)}
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