import { useState } from 'react';
import { Scan, Camera, Copy, Check, UploadCloud } from 'lucide-react';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';

const QRScanner = () => {
  const [scannedText, setScannedText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scanMessage, setScanMessage] = useState('Ready to scan QR codes.');

  const decodeQRImage = async (dataUrl: string): Promise<string | null> => {
    if (typeof window === 'undefined' || !dataUrl) return null;

    if ('BarcodeDetector' in window) {
      try {
        const image = new Image();
        const imageLoaded = new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error('Unable to load image for QR scanning'));
        });
        image.src = dataUrl;
        await imageLoaded;

        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context unavailable');
        ctx.drawImage(image, 0, 0);

        const bitmap = await createImageBitmap(canvas);
        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        const results = await detector.detect(bitmap);
        if (results.length > 0) {
          return results[0].rawValue as string;
        }
      } catch (error) {
        console.warn('QR decode failed:', error);
      }
    }

    return null;
  };

  const handleCameraScan = async () => {
    setIsScanning(true);
    setScanMessage('Opening camera...');

    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        direction: 'rear',
      });

      if (!image.dataUrl) {
        throw new Error('Camera did not return an image');
      }

      setScanMessage('Scanning image...');
      const decoded = await decodeQRImage(image.dataUrl);
      if (decoded) {
        setScannedText(decoded);
        setScanMessage('QR code scanned successfully.');
      } else {
        setScannedText('Unable to decode QR code from the captured image. Please try again or upload an image.');
        setScanMessage('No QR code detected.');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setScanMessage('Camera access failed. Use the image upload fallback below.');
      alert('Unable to access camera. Please check permissions and try again, or upload a QR code image.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleUploadScan = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanMessage('Reading uploaded image...');

    try {
      const reader = new FileReader();
      const loaded = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Unable to read file as data URL'));
          }
        };
        reader.onerror = () => reject(reader.error);
      });

      reader.readAsDataURL(file);
      const dataUrl = await loaded;
      setScanMessage('Scanning uploaded image...');
      const decoded = await decodeQRImage(dataUrl);

      if (decoded) {
        setScannedText(decoded);
        setScanMessage('QR code scanned successfully from upload.');
      } else {
        setScannedText('Unable to decode QR code from the selected image.');
        setScanMessage('Upload complete, but no QR code was found.');
      }
    } catch (error) {
      console.error('Error scanning uploaded image:', error);
      alert('Unable to scan the uploaded image. Please choose another image.');
    } finally {
      setIsScanning(false);
    }
  };

  const copyToClipboard = async () => {
    if (!scannedText) return;

    try {
      await navigator.clipboard.writeText(scannedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      const textArea = document.createElement('textarea');
      textArea.value = scannedText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
        alert('Unable to copy. Please select and copy manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Scan className="w-5 h-5" />
          QR Code Scanner
        </h2>

        <div className="space-y-4">
          <div className="text-center py-8">
            <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">{scanMessage}</p>
            <button
              onClick={handleCameraScan}
              disabled={isScanning}
              className="mb-3 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isScanning ? 'Opening Camera...' : 'Open Camera'}
            </button>
            <div className="mt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-muted-foreground px-4 py-3 border border-border rounded-lg hover:bg-secondary">
                <UploadCloud className="w-4 h-4" />
                Upload QR Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadScan}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {scannedText && (
            <div className="space-y-3">
              <label className="block text-sm font-medium">Scanned Result</label>
              <div className="relative">
                <textarea
                  value={scannedText}
                  readOnly
                  className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-background resize-none pr-10"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-1 hover:bg-secondary rounded"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              {copied && <p className="text-sm text-green-600">Copied to clipboard!</p>}
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p>For best results, use a clear QR code image or the device camera.</p>
            <p>Android WebView may support native BarcodeDetector decoding.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
