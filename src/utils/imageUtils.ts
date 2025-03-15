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
 * Attempts to generate an image from an element using multiple methods
 * to maximize compatibility across browsers and scenarios
 * 
 * @param element - The DOM element to convert
 * @returns Promise with the data URL of the image
 */
export const elementToDataUrl = async (element: HTMLElement): Promise<string> => {
  // Try the primary method first (html2canvas with custom configuration)
  try {
    console.log('Attempting primary image generation method');
    const html2canvas = await loadHtml2Canvas();
    console.log('html2canvas loaded', !!html2canvas);
    
    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.appendChild(clonedElement);
    document.body.appendChild(container);
    
    try {
      // Apply more robust configuration for html2canvas
      const canvas = await html2canvas(clonedElement, {
        backgroundColor: null,
        scale: 2, // Higher scale for better quality
        logging: true, // Enable logging for debugging
        useCORS: true,
        allowTaint: true, // Allow tainted canvas if needed (cross-origin content)
        foreignObjectRendering: false, // Disable foreignObject rendering which can cause iframe issues
        ignoreElements: (element: Element) => element.tagName === 'IFRAME', // Ignore iframes
        onclone: (documentClone: Document) => {
          console.log('Document cloned for html2canvas');
          return documentClone;
        },
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      console.log('Image generated successfully with primary method');
      return dataUrl;
    } finally {
      // Cleanup: remove the temporary container
      document.body.removeChild(container);
    }
  } catch (primaryError: unknown) {
    // Log the error from the primary method
    console.error('Primary image generation method failed:', primaryError);
    console.error('Error details:', primaryError instanceof Error ? primaryError.message : String(primaryError));
    
    // Try the secondary method - simpler configuration
    try {
      console.log('Attempting secondary image generation method');
      const html2canvas = await loadHtml2Canvas();
      
      // Try with simpler configuration
      const canvas = await html2canvas(element, {
        backgroundColor: '#FFFFFF',
        scale: 1,
        logging: true,
        useCORS: true,
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      console.log('Image generated successfully with secondary method');
      return dataUrl;
    } catch (secondaryError: unknown) {
      console.error('Secondary image generation method failed:', secondaryError);
      console.error('Error details:', secondaryError instanceof Error ? secondaryError.message : String(secondaryError));
      
      // Re-throw the original error
      throw primaryError;
    }
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
  console.log('Starting image share process');
  
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image')) {
    console.error('Invalid data URL provided:', dataUrl?.substring(0, 20) + '...');
    throw new Error('Invalid image data provided');
  }
  
  try {
    // Try to dynamically import FileSaver
    try {
      console.log('Attempting to use file-saver library');
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
      console.log('Created blob from image data, size:', blob.size);
      
      // Save blob as file
      saveAs(blob, fileName);
      console.log('File saved successfully with file-saver');
      return;
    } catch (fileSaverError: unknown) {
      console.warn('Failed to use file-saver, details:', fileSaverError instanceof Error ? fileSaverError.message : String(fileSaverError));
      console.log('Falling back to basic download method');
      
      // Fall back to basic download method if file-saver import fails
      downloadImage(dataUrl, fileName);
      console.log('Image downloaded using fallback method');
    }
  } catch (error: unknown) {
    console.error('Failed to save or download image:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
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
    console.log('Starting direct download process');
    
    // Create a link element
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    
    // Explicitly append the link to the document
    document.body.appendChild(link);
    
    // Trigger the download
    console.log('Triggering click on download link');
    link.click();
    
    // Remove the link after a short delay to ensure the download starts
    setTimeout(() => {
      document.body.removeChild(link);
      console.log('Download link removed');
    }, 200);
  } catch (error: unknown) {
    console.error('Error in direct download method:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    
    // Ultimate fallback: open the image in a new tab
    try {
      console.log('Attempting ultimate fallback: opening in new tab');
      const newTab = window.open('');
      if (newTab) {
        newTab.document.write(`
          <html>
            <head>
              <title>Download Image - ${fileName}</title>
            </head>
            <body style="margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f5f5f5;">
              <h1 style="font-family: sans-serif; margin-bottom: 20px;">Right-click on the image and select "Save Image As..."</h1>
              <img src="${dataUrl}" alt="Generated Image" style="max-width: 90%; max-height: 70vh; border: 1px solid #ccc; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
              <p style="font-family: sans-serif; margin-top: 20px;">File name: ${fileName}</p>
            </body>
          </html>
        `);
        newTab.document.close();
        console.log('Image opened in new tab for manual download');
      } else {
        console.error('Failed to open new tab for image download');
      }
    } catch (fallbackError: unknown) {
      console.error('Ultimate fallback failed:', fallbackError);
    }
  }
}; 