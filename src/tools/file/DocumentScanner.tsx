import { useState } from 'react';
import { Camera, Download, Zap, FileText } from 'lucide-react';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { downloadBlob } from '../../services/fileService';

interface ScannedDocument {
  id: string;
  imageData: string;
  timestamp: Date;
  name: string;
}

const DocumentScanner = () => {
  const [scannedDocs, setScannedDocs] = useState<ScannedDocument[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filename, setFilename] = useState('');

  const takePhoto = async () => {
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        direction: 'rear', // Use back camera
      });

      setCurrentImage(image.dataUrl || null);
    } catch (error) {
      console.error('Error taking photo:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const processDocument = async () => {
    if (!currentImage) return;

    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      const document: ScannedDocument = {
        id: Date.now().toString(),
        imageData: currentImage,
        timestamp: new Date(),
        name: `Scanned Document ${scannedDocs.length + 1}`,
      };

      setScannedDocs(prev => [document, ...prev]);
      setCurrentImage(null);
      setIsProcessing(false);
    }, 2000);
  };

  const discardImage = () => {
    setCurrentImage(null);
  };

  const downloadAsImage = async (doc: ScannedDocument) => {
    try {
      // Convert data URL to blob
      const response = await fetch(doc.imageData);
      const blob = await response.blob();
      await downloadBlob(blob, `${doc.name.replace(/\s+/g, '_')}.jpg`);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Error downloading image.');
    }
  };

  const deleteDocument = (id: string) => {
    setScannedDocs(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Document Scanner
        </h2>

        <div className="space-y-6">
          {/* Camera Section */}
          <div className="text-center">
            <button
              onClick={takePhoto}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              <Camera className="w-5 h-5" />
              Take Photo
            </button>
            <p className="text-sm text-muted-foreground mt-2">
              Capture a document using your camera
            </p>
          </div>

          {/* Current Image Preview */}
          {currentImage && (
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-medium mb-2">Captured Image</h3>
                <img
                  src={currentImage}
                  alt="Captured document"
                  className="max-w-full h-auto rounded border"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={processDocument}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Zap className="w-4 h-4 animate-spin inline mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Process Document'
                  )}
                </button>
                <button
                  onClick={discardImage}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-secondary"
                >
                  Discard
                </button>
              </div>
            </div>
          )}

          {/* Scanned Documents List */}
          {scannedDocs.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Scanned Documents</h3>
              <div className="space-y-3">
                {scannedDocs.map((doc) => (
                  <div key={doc.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{doc.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {doc.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <img
                      src={doc.imageData}
                      alt={doc.name}
                      className="w-full h-32 object-cover rounded border mb-3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadAsImage(doc)}
                        className="flex-1 px-3 py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90"
                      >
                        <Download className="w-4 h-4 inline mr-1" />
                        Download
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="px-3 py-2 border border-border text-sm rounded hover:bg-secondary"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {scannedDocs.length === 0 && !currentImage && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No documents scanned yet</p>
              <p className="text-sm">Take a photo to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentScanner;