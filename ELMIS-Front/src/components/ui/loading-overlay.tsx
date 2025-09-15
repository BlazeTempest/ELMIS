import { motion } from "framer-motion";

interface LoadingOverlayProps {
  open: boolean;
  label?: string;
}

export default function LoadingOverlay({ open, label = "Loading..." }: LoadingOverlayProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-background/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex flex-col items-center gap-4 rounded-xl border border-primary/20 bg-card/90 px-8 py-6 shadow-xl"
      >
        <motion.div
          className="h-10 w-10 rounded-full border-2 border-current border-t-transparent text-primary"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          aria-label="Loading spinner"
        />
        <span className="text-sm text-muted-foreground">{label}</span>
      </motion.div>
    </div>
  );
}
