import { useState } from 'react';
import JSZip from 'jszip';
import { Archive, Download } from 'lucide-react';
import { downloadBlob } from '../../services/fileService';

const FileCompressor = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filename, setFilename] = useState('compressed-files.zip');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const compressFiles = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const zip = new JSZip();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        zip.file(file.name, arrayBuffer);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, filename || 'compressed-files.zip');
    } catch (error) {
      console.error('Error compressing files:', error);
      alert('Error compressing files.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Archive className="w-5 h-5" />
          File Compressor
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select files to compress
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="block w-full text-sm text-muted-foreground
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90"
            />
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Selected files:</h3>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{file.name}</span>
                  <span className="text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1">Output filename</label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  placeholder="Enter filename"
                />
              </div>
            </div>
          )}

          <button
            onClick={compressFiles}
            disabled={files.length === 0 || isProcessing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            {isProcessing ? (
              'Compressing...'
            ) : (
              <>
                <Download className="w-4 h-4" />
                Compress to ZIP
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileCompressor;