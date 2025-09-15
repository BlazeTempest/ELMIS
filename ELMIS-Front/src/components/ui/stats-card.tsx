import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  className?: string;
  gradient?: 'primary' | 'accent' | 'success' | 'warning';
}

export function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  className,
  gradient = 'primary'
}: StatsCardProps) {
  const gradientClasses = {
    primary: 'gradient-primary',
    accent: 'gradient-accent',
    success: 'from-success to-success/80',
    warning: 'from-warning to-warning/80'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className={cn(
        "glass-card hover-glow border-border/50 overflow-hidden relative",
        className
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-3xl font-bold">
                {value}
              </p>
              {change && (
                <p className={cn(
                  "text-sm font-medium flex items-center",
                  changeType === 'positive' && "text-success",
                  changeType === 'negative' && "text-destructive",
                  changeType === 'neutral' && "text-muted-foreground"
                )}>
                  {change}
                </p>
              )}
            </div>
            
            <div className={cn(
              "h-16 w-16 rounded-xl flex items-center justify-center text-white",
              gradientClasses[gradient]
            )}>
              <Icon className="h-8 w-8" />
            </div>
          </div>
          
          {/* Animated background element */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </CardContent>
      </Card>
    </motion.div>
  );
}