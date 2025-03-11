/**
 * This file contains utility functions for handling images and sharing capabilities.
 * It requires html2canvas library to be installed:
 * npm install html2canvas
 * or
 * pnpm add html2canvas
 */

// Type declaration for html2canvas if not using TypeScript
declare const html2canvas: any;

/**
 * Converts a DOM element to a data URL representing a PNG image
 * 
 * @param element - The DOM element to convert
 * @returns Promise with the data URL of the image
 */
export const elementToDataUrl = async (element: HTMLElement): Promise<string> => {
  try {
    // Use dynamically imported html2canvas to ensure it's only loaded when needed
    const html2canvasModule = await import('html2canvas');
    const html2canvas = html2canvasModule.default;

    // Set scale for better quality
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: null,
    });
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error converting element to image:', error);
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
export const shareImage = async (dataUrl: string, fileName: string = 'bill-summary.png'): Promise<void> => {
  try {
    const blob = dataURLtoBlob(dataUrl);
    
    // Check if Web Share API is available
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], fileName, { type: 'image/png' });
      
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Bill Summary',
          text: 'My bill splitting summary from Who Owe Me Money app',
          files: [file],
        });
        return;
      }
    }
    
    // Fallback to download if sharing is not supported
    downloadImage(dataUrl, fileName);
  } catch (error) {
    console.error('Error sharing image:', error);
    // Fallback to download on error
    downloadImage(dataUrl, fileName);
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