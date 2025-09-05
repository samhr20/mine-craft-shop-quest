import React, { useState, useRef } from 'react';
import { Button } from './button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  placeholder = "Upload an image or enter URL",
  className = ""
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreview(url);
    onChange(url);
  };

  const clearImage = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-minecraft-grass bg-minecraft-grass/10' 
            : 'border-minecraft-stone/30 hover:border-minecraft-grass/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-minecraft-stone/30"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 w-6 h-6"
                onClick={clearImage}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground font-minecraft">
              Image uploaded successfully
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-minecraft text-gray-800 mb-2">
                Drag & drop an image here, or click to select
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="font-minecraft"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <label className="text-sm font-minecraft text-gray-800">
          Or enter image URL:
        </label>
        <input
          type="url"
          value={value || ''}
          onChange={handleUrlChange}
          placeholder="https://example.com/image.jpg"
          className="w-full p-2 border border-minecraft-stone/30 rounded-md font-minecraft bg-white focus:outline-none focus:ring-2 focus:ring-minecraft-grass focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
