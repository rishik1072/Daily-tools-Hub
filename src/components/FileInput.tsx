import { useState, useRef } from 'react';
import { Upload, X, File, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';

interface FileInputProps {
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
  maxSize?: number; // in MB
  label?: string;
  description?: string;
}

export const FileInput = ({
  accept = '*',
  multiple = false,
  onFilesSelected,
  selectedFiles = [],
  onRemoveFile,
  maxSize = 500,
  label = 'Upload files',
  description,
}: FileInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    setError('');
    const validFiles: File[] = [];

    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        break;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(multiple ? validFiles : [validFiles[0]]);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('application/pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    return '📦';
  };

  return (
    <div className="space-y-4">
      <div>
        {label && <label className="block text-sm font-medium mb-2">{label}</label>}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'relative rounded-2xl border-2 border-dashed transition-all duration-200 p-8 text-center cursor-pointer',
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-border bg-secondary/50 hover:border-primary/50'
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3">
            <div className={cn('h-12 w-12 rounded-full flex items-center justify-center transition-transform', isDragging ? 'bg-primary/20 scale-110' : 'bg-primary/10')}>
              <Upload className={cn('h-6 w-6', isDragging ? 'text-primary' : 'text-muted-foreground')} />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {isDragging ? 'Drop files here' : 'Drag & drop or click to upload'}
              </p>
              {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
              {maxSize && <p className="text-xs text-muted-foreground mt-1">Max file size: {maxSize}MB</p>}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Selected files ({selectedFiles.length})</label>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/50 p-3 transition-all hover:border-primary/50"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl flex-shrink-0">{getFileIcon(file)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                {onRemoveFile && (
                  <button
                    onClick={() => onRemoveFile(index)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-500 transition flex-shrink-0"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileInput;
