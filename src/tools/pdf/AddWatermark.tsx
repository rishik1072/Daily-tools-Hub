import { useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { Download } from 'lucide-react';
import { readFileAsArrayBuffer, downloadBlob } from '../../services/fileService';

const AddWatermark = () => {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filename, setFilename] = useState('watermarked.pdf');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilename(`watermarked-${selectedFile.name}`);
    }
  };

  const addWatermark = async () => {
    if (!file || !watermarkText) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const fontSize = Math.min(width, height) / 20; // Responsive font size
        const textWidth = watermarkText.length * fontSize * 0.6; // Rough text width
        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: height / 2,
          size: fontSize,
          opacity: 0.3,
          color: rgb(0.5, 0.5, 0.5),
          rotate: Math.PI / 6, // 30 degrees
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      downloadBlob(blob, filename || 'watermarked.pdf');
    } catch (error) {
      console.error('Error adding watermark:', error);
      alert('Error adding watermark to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Add Watermark to PDF</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select PDF file
            </label>
            <input
              type="file"
              accept=".pdf"
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
              Watermark text
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="Enter watermark text"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
            onClick={addWatermark}
            disabled={!file || !watermarkText || isProcessing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            {isProcessing ? (
              'Processing...'
            ) : (
              <>
                <Download className="w-4 h-4" />
                Add Watermark
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddWatermark;