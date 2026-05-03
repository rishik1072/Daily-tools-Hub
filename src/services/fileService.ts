import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

const isNativePlatform = typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform();

export const downloadBlob = async (blob: Blob, filename: string): Promise<void> => {
  if (isNativePlatform) {
    try {
      const base64Data = await blobToBase64(blob);
      const result = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true,
      });

      let filePath = result.uri;
      try {
        const uriResult = await Filesystem.getUri({
          path: filename,
          directory: Directory.Documents,
        });
        filePath = uriResult.uri || result.uri;
      } catch {
        filePath = result.uri;
      }

      return Promise.resolve();
    } catch (error) {
      console.error('Error saving file on mobile:', error);
      throw new Error('Unable to save file. Please ensure storage permissions are enabled and try again.');
    }
  }

  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return Promise.resolve();
  } catch (error) {
    console.error('Error triggering browser download:', error);
    throw new Error('Unable to download file. Please try again or use a different device.');
  }
};

export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;
      if (!result) {
        reject(new Error('Unable to read blob as base64'));
        return;
      }
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};