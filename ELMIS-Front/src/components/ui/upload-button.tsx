import { UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface UploadButtonProps {
  label?: string;
  tooltip?: string;
  onClick?: () => void;
}

export default function UploadButton({ label = "Import Excel", tooltip = "Import data from Excel", onClick }: UploadButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" className="group hover:border-accent/50" onClick={onClick}>
              <UploadCloud className="h-4 w-4 mr-2 group-hover:text-accent transition-colors" />
              {label}
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
