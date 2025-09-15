import { motion } from 'framer-motion';
import { BookOpen, Clock, AlertTriangle, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { mockRentals, mockReviews } from '@/lib/mockData';
import { useEffect, useState } from 'react';

interface StatCard {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'primary' | 'accent' | 'warning' | 'success';
}

const AnimatedCounter = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startValue = 0;
    const endValue = value;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count}</span>;
};

export function RentalHistoryCards() {
  const { user } = useAuthStore();
  
  if (!user) return null;

  // Calculate user-specific stats
  const userRentals = mockRentals.filter(rental => rental.userId === user.id);
  const userReviews = mockReviews.filter(review => review.userId === user.id);
  const activeRentals = userRentals.filter(rental => rental.status === 'RENTED' || rental.status === 'READING');
  const overdueRentals = activeRentals.filter(rental => new Date(rental.dueDate) < new Date());

  const stats: StatCard[] = [
    {
      title: 'Total Rentals',
      value: userRentals.length + 5, // Add some mock history
      icon: BookOpen,
      color: 'primary'
    },
    {
      title: 'Active Rentals',
      value: activeRentals.length,
      icon: Clock,
      color: 'accent'
    },
    {
      title: 'Overdue Books',
      value: overdueRentals.length,
      icon: AlertTriangle,
      color: 'warning'
    },
    {
      title: 'Reviews Posted',
      value: userReviews.length,
      icon: Star,
      color: 'success'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'from-primary/20 to-primary-glow/20 border-primary/30 text-primary';
      case 'accent':
        return 'from-accent/20 to-accent-glow/20 border-accent/30 text-accent';
      case 'warning':
        return 'from-warning/20 to-warning/30 border-warning/30 text-warning';
      case 'success':
        return 'from-success/20 to-success/30 border-success/30 text-success';
      default:
        return 'from-primary/20 to-primary-glow/20 border-primary/30 text-primary';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Activity Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Card className={`relative overflow-hidden bg-gradient-to-br ${getColorClasses(stat.color)} hover-glow transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <motion.div 
                        className="text-3xl font-bold mb-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                      >
                        <AnimatedCounter value={stat.value} duration={1000 + index * 200} />
                      </motion.div>
                      <p className="text-sm opacity-80">{stat.title}</p>
                    </div>
                    <motion.div
                      className="p-3 rounded-lg bg-background/20"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                  </div>
                  
                  {/* Animated background effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}