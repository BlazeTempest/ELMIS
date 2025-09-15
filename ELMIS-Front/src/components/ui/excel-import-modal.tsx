import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
  title: string;
  acceptedFileTypes?: string;
  sampleData?: any[];
}

export function ExcelImportModal({ 
  isOpen, 
  onClose, 
  onImport, 
  title,
  acceptedFileTypes = '.xlsx,.csv',
  sampleData = []
}: ExcelImportModalProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    const validTypes = acceptedFileTypes.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: `Please select a file with one of these extensions: ${acceptedFileTypes}`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setUploadStatus('idle');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const simulateProcessing = async () => {
    setIsProcessing(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Success
    setUploadStatus('success');
    setIsProcessing(false);
    
    // Generate mock data based on the sample data provided
    const mockImportedData = sampleData.length > 0 ? [
      ...sampleData.slice(0, 2), // Use first 2 existing items as base
      ...Array.from({ length: 3 }, (_, index) => ({
        ...sampleData[0],
        id: `imported-${Date.now()}-${index}`,
        name: `Imported Item ${index + 1}`,
        email: `imported${index + 1}@library.com`,
      }))
    ] : [];

    onImport(mockImportedData);
    
    toast({
      title: "Import Successful",
      description: `Successfully imported ${mockImportedData.length} records from ${selectedFile?.name}`,
    });

    // Reset after success
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setUploadProgress(0);
    setUploadStatus('idle');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card/95 backdrop-blur border-primary/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-accent" />
            Import {title}
          </DialogTitle>
          <DialogDescription>
            Upload an Excel (.xlsx) or CSV file to import {title.toLowerCase()} data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Area */}
          <motion.div
            className={`
              relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
              ${isDragOver 
                ? 'border-accent bg-accent/10 scale-[1.02]' 
                : selectedFile 
                  ? 'border-success bg-success/10' 
                  : 'border-muted-foreground/50 hover:border-accent/50 hover:bg-accent/5'
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <input
              type="file"
              accept={acceptedFileTypes}
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            
            <AnimatePresence mode="wait">
              {selectedFile ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="space-y-2"
                >
                  <CheckCircle className="h-12 w-12 mx-auto text-success" />
                  <p className="font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="space-y-2"
                >
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="font-medium text-foreground">
                    {isDragOver ? 'Drop your file here' : 'Choose file or drag and drop'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports {acceptedFileTypes.replace(/\./g, '').toUpperCase()} files
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Upload Progress */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {uploadStatus === 'uploading' ? 'Processing...' : 'Complete'}
                  </span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                {uploadStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-success text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Import completed successfully!</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={simulateProcessing}
              disabled={!selectedFile || isProcessing}
              className="hover:scale-105 transition-transform"
            >
              {isProcessing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"
                />
              ) : (
                <UploadCloud className="h-4 w-4 mr-2" />
              )}
              {isProcessing ? 'Processing...' : 'Import Data'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}