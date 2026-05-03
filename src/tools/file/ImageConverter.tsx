import { useState, useRef } from 'react';
import { Shuffle, Download } from 'lucide-react';
import { downloadBlob } from '../../services/fileService';

const ImageConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpg'>('jpg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filename, setFilename] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');
      setFilename(`${baseName}.${targetFormat}`);
    }
  };

  const convertImage = async () => {
    if (!file || !canvasRef.current) return;

    setIsProcessing(true);
    try {
      const img = new Image();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            downloadBlob(blob, filename || `converted.${targetFormat}`);
          }
          setIsProcessing(false);
        }, `image/${targetFormat}`, targetFormat === 'jpg' ? 0.9 : undefined);
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error converting image:', error);
      alert('Error converting image.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shuffle className="w-5 h-5" />
          Image Converter
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select image file
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Convert to
            </label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value as 'png' | 'jpg')}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
            </select>
          </div>

          {file && (
            <div>
              <label className="block text-sm font-medium mb-2">Output filename</label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                placeholder="Enter filename"
              />
            </div>
          )}

          <button
            onClick={convertImage}
            disabled={!file || isProcessing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            {isProcessing ? (
              'Converting...'
            ) : (
              <>
                <Download className="w-4 h-4" />
                Convert Image
              </>
            )}
          </button>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;