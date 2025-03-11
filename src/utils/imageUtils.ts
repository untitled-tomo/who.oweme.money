/**
 * This file contains utility functions for handling images and sharing capabilities.
 * It requires html2canvas library to be installed:
 * npm install html2canvas
 * or
 * pnpm add html2canvas
 */

// Import html2canvas dynamically from CDN when needed
let html2canvasModule: any = null;

const loadHtml2Canvas = async () => {
  if (html2canvasModule) return html2canvasModule;
  
  // Create a script element to load html2canvas from CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore - html2canvas will be available on window after script loads
      html2canvasModule = window.html2canvas;
      resolve(html2canvasModule);
    };
    script.onerror = (error) => {
      reject(new Error('Failed to load html2canvas from CDN'));
    };
    document.head.appendChild(script);
  });
};

/**
 * Converts a DOM element to a data URL representing a PNG image
 * 
 * @param element - The DOM element to convert
 * @returns Promise with the data URL of the image
 */
export const elementToDataUrl = async (element: HTMLElement): Promise<string> => {
  try {
    const html2canvas = await loadHtml2Canvas();
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2, // Higher scale for better quality
      logging: false,
      useCORS: true,
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Failed to generate image:', error);
    throw error;
  }
};

/**
 * Converts a data URL to a Blob
 * 
 * @param dataUrl - The data URL to convert
 * @returns Blob object
 */
export const dataURLtoBlob = (dataUrl: string): Blob => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

/**
 * Shares an image using the Web Share API if available,
 * or triggers a download if sharing is not supported
 * 
 * @param dataUrl - Data URL of the image to share
 * @param fileName - Name of the file for download fallback
 */
export const shareImage = async (dataUrl: string, fileName: string): Promise<void> => {
  try {
    // Dynamic import FileSaver only when needed
    const { saveAs } = await import('file-saver');
    
    // Convert dataUrl to Blob
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: mimeString });
    
    // Save blob as file
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Failed to save image:', error);
    throw error;
  }
};

/**
 * Downloads an image from a data URL
 * 
 * @param dataUrl - Data URL of the image to download
 * @param fileName - Name of the file to download
 */
export const downloadImage = (dataUrl: string, fileName: string): void => {
  try {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    link.click();
  } catch (error) {
    console.error('Error downloading image:', error);
  }
}; 