'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';

interface DragDropUploadProps {
  onFileUpload: (file: File) => void;
}

export default function DragDropUpload({ onFileUpload }: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);

    // Simulate upload delay for sleek UX
    setTimeout(() => {
      setIsUploading(false);
      onFileUpload(file);
    }, 1500);
  };

  return (
    <div className="w-full mb-4">
      <AnimatePresence mode="wait">
        {!uploadedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-300
              ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800/80'}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none rounded-2xl" />
            <UploadCloud
              className={`w-10 h-10 mb-4 transition-colors ${isDragging ? 'text-blue-400' : 'text-gray-400'}`}
            />
            <h3 className="text-lg font-medium text-gray-200 mb-1">
              Drag & drop your requirements
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Upload PDFs, wireframes, or architecture diagrams. Our AI will analyze them instantly.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-between p-4 bg-gray-800/80 border border-gray-700 rounded-xl"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <File className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-200">{uploadedFile.name}</h4>
                <p className="text-xs text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {isUploading ? (
              <div className="flex items-center space-x-2 text-blue-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Analyzing...</span>
              </div>
            ) : (
              <button
                onClick={() => setUploadedFile(null)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
