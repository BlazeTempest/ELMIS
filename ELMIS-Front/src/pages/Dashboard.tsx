import { motion } from 'framer-motion';
import { BookOpen, Users, Clock, TrendingUp, Plus } from 'lucide-react';
import { StatsCard } from '@/components/ui/stats-card';
import { AnnouncementBanner } from '@/components/ui/announcement-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { mockAnnouncements, mockBooks, mockRentals, mockEmployees } from '@/lib/mockData';

export default function Dashboard() {
  const { user } = useAuthStore();
  
  const isAdmin = user?.role === 'admin';
  
  // Calculate stats
  const totalBooks = mockBooks.length;
  const availableBooks = mockBooks.filter(book => book.status === 'available').length;
  const activeRentals = mockRentals.filter(rental => rental.status === 'RENTED' || rental.status === 'READING').length;
  const totalEmployees = mockEmployees.length;
  const overdueRentals = mockRentals.filter(rental => rental.status === 'OVERDUE').length;

  const userWelcomeMessage = isAdmin 
    ? "Welcome to your admin dashboard. Manage your library efficiently."
    : "Welcome back! Here's your personalized dashboard.";

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold gradient-text">
          {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          {userWelcomeMessage}
        </p>
      </motion.div>

      {/* Announcements */}
      <AnnouncementBanner announcements={mockAnnouncements.map(a => ({ ...a, type: 'info' as const, date: a.createdAt }))} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Books"
          value={totalBooks}
          change="+12% from last month"
          changeType="positive"
          icon={BookOpen}
          gradient="primary"
        />
        
        <StatsCard
          title="Available Books"
          value={availableBooks}
          change={`${Math.round((availableBooks / totalBooks) * 100)}% available`}
          changeType="neutral"
          icon={BookOpen}
          gradient="success"
        />
        
        <StatsCard
          title="Active Rentals"
          value={activeRentals}
          change={overdueRentals > 0 ? `${overdueRentals} overdue` : "All current"}
          changeType={overdueRentals > 0 ? "negative" : "positive"}
          icon={Clock}
          gradient="accent"
        />
        
        {isAdmin && (
          <StatsCard
            title="Total Employees"
            value={totalEmployees}
            change="+2 this month"
            changeType="positive"
            icon={Users}
            gradient="warning"
          />
        )}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Frequently used actions for your workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isAdmin ? (
              <>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full justify-start gradient-primary hover-glow">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Book
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Post Announcement
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Reports
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full justify-start gradient-primary hover-glow">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Books
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    My Rentals
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Submit Review
                  </Button>
                </motion.div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRentals.slice(0, 3).map((rental, index) => (
                <motion.div
                  key={rental.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                >
                  <div className="h-2 w-2 rounded-full bg-primary pulse-glow" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {rental.bookTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {rental.status === 'RENTED' || rental.status === 'READING' ? 'Rented' : 'Returned'} by {rental.userName}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(rental.pickupDate).toLocaleDateString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Due Reminders for Operators */}
      {!isAdmin && (
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Due Reminders</span>
            </CardTitle>
            <CardDescription>
              Your upcoming book returns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRentals
                .filter(rental => (rental.status === 'RENTED' || rental.status === 'READING') && rental.userName === user?.name)
                .map((rental, index) => {
                  const dueDate = new Date(rental.dueDate);
                  const today = new Date();
                  const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <motion.div
                      key={rental.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${
                        daysLeft < 0
                          ? 'border-destructive/50 bg-destructive/10'
                          : daysLeft <= 3
                          ? 'border-warning/50 bg-warning/10'
                          : 'border-border/50 bg-secondary/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{rental.bookTitle}</h4>
                          <p className="text-sm text-muted-foreground">
                            Due: {dueDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            daysLeft < 0 ? 'text-destructive' : daysLeft <= 3 ? 'text-warning' : 'text-success'
                          }`}>
                            {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                          </p>
                          <Button size="sm" variant="outline" className="mt-2">
                            {daysLeft < 0 ? 'Return Now' : 'Extend'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              }
              {mockRentals.filter(rental => (rental.status === 'RENTED' || rental.status === 'READING') && rental.userName === user?.name).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No active rentals. Browse our collection to find your next read!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}