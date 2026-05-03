import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
// @ts-ignore
import SignatureCanvas from 'react-signature-canvas';
import { Download } from 'lucide-react';
import { readFileAsArrayBuffer, downloadBlob } from '../../services/fileService';

const SignPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const signPDF = async () => {
    if (!file || !sigCanvasRef.current) return;

    setIsProcessing(true);
    try {
      const signatureDataURL = sigCanvasRef.current.toDataURL();
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Convert signature to image and embed
      const signatureImage = await pdfDoc.embedPng(signatureDataURL);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width } = firstPage.getSize();

      firstPage.drawImage(signatureImage, {
        x: width - 200,
        y: 50,
        width: 150,
        height: 75,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      downloadBlob(blob, 'signed.pdf');
    } catch (error) {
      console.error('Error signing PDF:', error);
      alert('Error signing PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearSignature = () => {
    sigCanvasRef.current?.clear();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Sign PDF</h2>

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
              Draw your signature
            </label>
            <div className="border border-border rounded-lg p-4 bg-white">
              <SignatureCanvas
                ref={sigCanvasRef}
                canvasProps={{
                  width: 400,
                  height: 200,
                  className: 'signature-canvas border border-gray-300 rounded',
                }}
                backgroundColor="white"
              />
            </div>
            <button
              onClick={clearSignature}
              className="mt-2 px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded hover:bg-accent"
            >
              Clear
            </button>
          </div>

          <button
            onClick={signPDF}
            disabled={!file || isProcessing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            {isProcessing ? (
              'Processing...'
            ) : (
              <>
                <Download className="w-4 h-4" />
                Sign PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignPDF;