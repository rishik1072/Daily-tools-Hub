import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download, FileText } from 'lucide-react';
import { readFileAsArrayBuffer, downloadBlob } from '../../services/fileService';

const MergePDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filename, setFilename] = useState('merged.pdf');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: 'application/pdf' });
      downloadBlob(blob, filename || 'merged.pdf');
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('Error merging PDFs. Please check the files.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Merge PDF Files</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select PDF files to merge
            </label>
            <input
              type="file"
              multiple
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

          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Selected files:</h3>
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  {file.name}
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
            onClick={mergePDFs}
            disabled={files.length < 2 || isProcessing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            {isProcessing ? (
              'Processing...'
            ) : (
              <>
                <Download className="w-4 h-4" />
                Merge PDFs
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MergePDF;