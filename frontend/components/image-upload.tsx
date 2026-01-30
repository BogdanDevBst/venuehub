'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

export function ImageUpload({
  images,
  onChange,
  maxImages = 10,
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file';
    }

    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return `Image size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setError(null);

      // Check if adding these files would exceed max images
      if (images.length + files.length > maxImages) {
        setError(`Maximum ${maxImages} images allowed`);
        return;
      }

      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validationError = validateFile(file);

        if (validationError) {
          setError(validationError);
          return;
        }

        try {
          const base64 = await convertToBase64(file);
          newImages.push(base64);
        } catch (err) {
          setError('Failed to process image');
          return;
        }
      }

      onChange([...images, ...newImages]);
    },
    [images, onChange, maxImages, maxSizeMB]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles]
  );

  const removeImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
      setError(null);
    },
    [images, onChange]
  );

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
          images.length >= maxImages && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          type="file"
          id="image-upload"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          disabled={images.length >= maxImages}
        />

        <div className="flex flex-col items-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">
              {isDragging ? 'Drop images here' : 'Drag and drop images here'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or{' '}
              <label
                htmlFor="image-upload"
                className={cn(
                  'text-primary hover:underline cursor-pointer',
                  images.length >= maxImages && 'cursor-not-allowed opacity-50'
                )}
              >
                browse files
              </label>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Max {maxImages} images, up to {maxSizeMB}MB each
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
          {error}
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
            >
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                  className="gap-1"
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="text-center py-8 border rounded-lg bg-muted/20">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
