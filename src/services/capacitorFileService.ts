import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

// Check if running on a mobile platform
const isMobile = Capacitor.isNativePlatform();

export const downloadBlob = async (blob: Blob, filename: string) => {
  if (isMobile) {
    try {
      // Convert blob to base64
      const base64Data = await blobToBase64(blob);

      // Use Capacitor Filesystem to save the file as base64
      const result = await Filesystem.writeFile({
        path: filename,
        data: base64Data,
        directory: Directory.Documents,
        recursive: true,
      });

      // Try to open the file if possible
      if (Capacitor.getPlatform() === 'android') {
        // On Android, the file is saved and accessible from the Documents directory.
        try {
          await Filesystem.getUri({
            path: filename,
            directory: Directory.Documents,
          });
        } catch (error) {
          console.log('File saved but could not open automatically');
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error saving file on mobile:', error);
      throw new Error('Error saving file. Please check permissions and try again.');
    }
  } else {
    // Fallback for web browsers
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

// Helper function to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Mobile-specific file picker using Capacitor Filesystem
export const pickFile = async (accept?: string): Promise<File | null> => {
  if (isMobile) {
    try {
      // For mobile, we'll use a different approach
      // Since Capacitor doesn't have a direct file picker, we'll return null
      // and let the component handle it with regular input
      return null;
    } catch (error) {
      console.error('Error picking file on mobile:', error);
      return null;
    }
  } else {
    // For web, return null to use regular file input
    return null;
  }
};