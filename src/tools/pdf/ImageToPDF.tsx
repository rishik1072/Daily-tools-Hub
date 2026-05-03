import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Download, Image as ImageIcon } from 'lucide-react';
import { readFileAsArrayBuffer, downloadBlob } from '../../services/fileService';

const ImageToPDF = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filename, setFilename] = useState('converted.pdf');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const convertToPDF = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        let image;

        // Determine image type and embed accordingly
        if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else {
          // Try JPG as fallback
          image = await pdfDoc.embedJpg(arrayBuffer);
        }

        const page = pdfDoc.addPage();
        const { width, height } = image.scale(0.5); // Scale down to fit
        page.setSize(width, height);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width,
          height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      downloadBlob(blob, filename || 'converted.pdf');
    } catch (error) {
      console.error('Error converting images to PDF:', error);
      alert('Error converting images. Please ensure they are valid image files.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Convert Images to PDF</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select image files
            </label>
            <input
              type="file"
              multiple
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

          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Selected images:</h3>
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <ImageIcon className="w-4 h-4" />
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
            onClick={convertToPDF}
            disabled={files.length === 0 || isProcessing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            {isProcessing ? (
              'Processing...'
            ) : (
              <>
                <Download className="w-4 h-4" />
                Convert to PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageToPDF;