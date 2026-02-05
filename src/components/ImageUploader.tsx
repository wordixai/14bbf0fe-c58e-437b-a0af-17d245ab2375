import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  isAnalyzing: boolean;
  currentImage: string | null;
  onClear: () => void;
}

export function ImageUploader({
  onImageSelect,
  isAnalyzing,
  currentImage,
  onClear,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file);
        onImageSelect(file, preview);
      }
    },
    [onImageSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        onImageSelect(file, preview);
      }
    },
    [onImageSelect]
  );

  if (currentImage) {
    return (
      <div className="relative animate-scale-in">
        <div className="glass-card overflow-hidden">
          <img
            src={currentImage}
            alt="Selected food"
            className="w-full h-64 sm:h-80 object-cover"
          />
          {!isAnalyzing && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
              onClick={onClear}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-card/60 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin-slow" />
                <p className="text-sm font-medium text-foreground">AI 分析中...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`upload-zone ${isDragging ? "upload-zone-active" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        id="food-image-input"
      />
      <label
        htmlFor="food-image-input"
        className="flex flex-col items-center gap-4 cursor-pointer"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-elegant">
          <Upload className="w-7 h-7 text-primary-foreground" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            上传食物图片
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            拖拽图片到此处，或点击选择
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
          <span>支持 JPG、PNG、WebP 格式</span>
        </div>
      </label>
    </div>
  );
}
