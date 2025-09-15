import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  date: string;
}

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const visibleAnnouncements = announcements.filter(
    announcement => !dismissed.includes(announcement.id)
  );

  const currentAnnouncement = visibleAnnouncements[currentIndex];

  const dismissAnnouncement = (id: string) => {
    setDismissed(prev => [...prev, id]);
    if (currentIndex >= visibleAnnouncements.length - 1) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  if (!currentAnnouncement) return null;

  const typeColors = {
    info: 'from-accent to-accent-glow',
    warning: 'from-warning to-warning/80',
    success: 'from-success to-success/80'
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentAnnouncement.id}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="glass-card border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <div className={`h-1 bg-gradient-to-r ${typeColors[currentAnnouncement.type]}`} />
            
            <div className="p-4 flex items-start space-x-3">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className={`h-10 w-10 rounded-full bg-gradient-to-r ${typeColors[currentAnnouncement.type]} flex items-center justify-center text-white flex-shrink-0`}
              >
                <Megaphone className="h-5 w-5" />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm">{currentAnnouncement.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(currentAnnouncement.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentAnnouncement.message}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => dismissAnnouncement(currentAnnouncement.id)}
                className="h-8 w-8 hover-glow flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {visibleAnnouncements.length > 1 && (
              <div className="px-4 pb-4 flex justify-center space-x-2">
                {visibleAnnouncements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-primary scale-125'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}