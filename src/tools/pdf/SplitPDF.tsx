import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download } from 'lucide-react';
import { readFileAsArrayBuffer, downloadBlob } from '../../services/fileService';

const SplitPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filename, setFilename] = useState('split.pdf');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilename(`split-${selectedFile.name}`);
    }
  };

  const splitPDF = async () => {
    if (!file || !pages) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const pdf = await PDFDocument.load(arrayBuffer);
      const totalPages = pdf.getPageCount();

      const pageIndices = pages.split(',').map(p => {
        const trimmed = p.trim();
        if (trimmed.includes('-')) {
          const [start, end] = trimmed.split('-').map(n => parseInt(n) - 1);
          return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        }
        return [parseInt(trimmed) - 1];
      }).flat().filter(i => i >= 0 && i < totalPages);

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach(page => newPdf.addPage(page));

      const bytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      downloadBlob(blob, filename || 'split.pdf');
    } catch (error) {
      console.error('Error splitting PDF:', error);
      alert('Error splitting PDF. Please check the page numbers.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Split PDF</h2>

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
              Pages to extract (e.g., 1,3-5,8)
            </label>
            <input
              type="text"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="1,3-5,8"
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
            onClick={splitPDF}
            disabled={!file || !pages || isProcessing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            {isProcessing ? (
              'Processing...'
            ) : (
              <>
                <Download className="w-4 h-4" />
                Split PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitPDF;