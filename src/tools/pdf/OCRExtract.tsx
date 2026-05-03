import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { Scan } from 'lucide-react';
import { readFileAsDataURL } from '../../services/fileService';

const OCRExtract = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const extractText = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const worker = await createWorker('eng');
      const dataURL = await readFileAsDataURL(file);
      const { data: { text } } = await worker.recognize(dataURL);
      setExtractedText(text);
      await worker.terminate();
    } catch (error) {
      console.error('Error extracting text:', error);
      alert('Error extracting text from image.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">OCR Text Extraction</h2>

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

          <button
            onClick={extractText}
            disabled={!file || isProcessing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            {isProcessing ? (
              'Processing...'
            ) : (
              <>
                <Scan className="w-4 h-4" />
                Extract Text
              </>
            )}
          </button>

          {extractedText && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Extracted Text
              </label>
              <textarea
                value={extractedText}
                readOnly
                className="w-full h-48 px-3 py-2 border border-border rounded-lg bg-background resize-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCRExtract;