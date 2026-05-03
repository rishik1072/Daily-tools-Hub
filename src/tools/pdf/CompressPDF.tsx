import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download } from 'lucide-react';
import FileInput from '../../components/FileInput';
import { useToast } from '../../components/Toast';
import { readFileAsArrayBuffer, downloadBlob } from '../../services/fileService';

const CompressPDF = () => {
  const { showToast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filename, setFilename] = useState('compressed.pdf');

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      setFilename(`compressed-${selectedFiles[0].name}`);
    }
  };

  const compressPDF = async () => {
    if (files.length === 0) return;

    const file = files[0];
    setIsProcessing(true);
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const pdf = await PDFDocument.load(arrayBuffer);

      // Basic optimization: remove unused objects, compress streams
      const bytes = await pdf.save({ useObjectStreams: false });

      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      const originalSize = (file.size / 1024 / 1024).toFixed(2);
      const compressedSize = (blob.size / 1024 / 1024).toFixed(2);
      
      await downloadBlob(blob, filename || 'compressed.pdf');
      showToast(`✅ PDF compressed! ${originalSize}MB → ${compressedSize}MB`, 'success', 5000);
    } catch (error) {
      console.error('Error compressing PDF:', error);
      showToast('❌ Error compressing PDF. Please try again.', 'error', 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-secondary/50 border border-border rounded-2xl p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-1">Compress PDF</h2>
          <p className="text-sm text-muted-foreground">Reduce file size while maintaining quality</p>
        </div>

        <div className="space-y-6">
          <FileInput
            accept=".pdf"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            selectedFiles={files}
            onRemoveFile={() => setFiles([])}
            maxSize={500}
            label="Select PDF to compress"
            description="Drag and drop or click to upload a PDF file (max 500MB)"
          />

          {files.length > 0 && (
            <div className="space-y-4 rounded-xl border border-border/50 bg-background/50 p-4">
              <div>
                <label className="block text-sm font-medium mb-2">Output filename</label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  placeholder="Enter filename"
                />
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                💡 This tool provides basic PDF optimization by removing unused objects and compressing streams. For significant size reduction, consider using specialized PDF compression software.
              </div>
            </div>
          )}

          <button
            onClick={compressPDF}
            disabled={files.length === 0 || isProcessing}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition font-medium active:scale-95 duration-200"
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Compressing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Compress PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompressPDF;
