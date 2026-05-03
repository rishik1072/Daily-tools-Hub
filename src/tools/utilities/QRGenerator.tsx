import { useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download } from 'lucide-react';
import { downloadBlob } from '../../services/fileService';

const QRGenerator = () => {
  const [text, setText] = useState('');
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [filename, setFilename] = useState('qrcode.png');

  const generateQR = async () => {
    if (!text) return;

    try {
      const dataURL = await QRCode.toDataURL(text, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeDataURL(dataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQR = async () => {
    if (!qrCodeDataURL) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeDataURL);
      const blob = await response.blob();
      await downloadBlob(blob, filename || 'qrcode.png');
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          QR Code Generator
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Text or URL
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or URL to encode"
              className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-background resize-none"
            />
          </div>

          <button
            onClick={generateQR}
            disabled={!text}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90"
          >
            Generate QR Code
          </button>

          {qrCodeDataURL && (
            <div className="text-center space-y-4">
              <img
                src={qrCodeDataURL}
                alt="QR Code"
                className="mx-auto border border-border rounded"
              />
              <div>
                <label className="block text-sm font-medium mb-2">Filename</label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background mb-2"
                  placeholder="Enter filename"
                />
              </div>
              <button
                onClick={downloadQR}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;