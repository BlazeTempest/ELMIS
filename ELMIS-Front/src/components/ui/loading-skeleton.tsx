import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  rows?: number;
  showHeader?: boolean;
  type?: 'table' | 'cards';
}

export function LoadingSkeleton({ rows = 5, showHeader = true, type = 'table' }: LoadingSkeletonProps) {
  const shimmerVariants = {
    initial: { opacity: 0.3 },
    animate: { 
      opacity: [0.3, 0.8, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity
      }
    }
  };

  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: rows }).map((_, index) => (
          <motion.div
            key={index}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            className="p-6 rounded-lg border bg-card/50 backdrop-blur space-y-4"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Skeleton className="h-4 w-3/4 bg-gradient-to-r from-muted/50 via-muted to-muted/50" />
            <Skeleton className="h-4 w-1/2 bg-gradient-to-r from-muted/50 via-muted to-muted/50" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full bg-gradient-to-r from-muted/50 via-muted to-muted/50" />
              <Skeleton className="h-3 w-2/3 bg-gradient-to-r from-muted/50 via-muted to-muted/50" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <motion.div
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          className="flex items-center justify-between p-4 bg-card/50 backdrop-blur rounded-lg border"
        >
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 bg-gradient-to-r from-muted/50 via-muted to-muted/50" />
            <Skeleton className="h-4 w-32 bg-gradient-to-r from-muted/50 via-muted to-muted/50" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 bg-gradient-to-r from-muted/50 via-muted to-muted/50" />
            <Skeleton className="h-10 w-40 bg-gradient-to-r from-muted/50 via-muted to-muted/50" />
          </div>
        </motion.div>
      )}
      
      <div className="bg-card/50 backdrop-blur rounded-lg border overflow-hidden">
        {/* Table Header */}
        <motion.div
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          className="border-b p-4"
        >
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton 
                key={index}
                className="h-4 bg-gradient-to-r from-muted/50 via-muted to-muted/50" 
              />
            ))}
          </div>
        </motion.div>
        
        {/* Table Rows */}
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, index) => (
            <motion.div
              key={index}
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              className="p-4"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <Skeleton 
                    key={colIndex}
                    className="h-4 bg-gradient-to-r from-muted/50 via-muted to-muted/50" 
                    style={{ width: colIndex === 0 ? '80%' : colIndex === 4 ? '60%' : '100%' }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}