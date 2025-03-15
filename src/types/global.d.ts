// Web Share API interface declaration
interface Navigator {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data: ShareData) => boolean;
}

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

// html2canvas module declaration
declare module 'html2canvas';

// Global type declarations

interface Window {
  html2canvas: (element: HTMLElement, options?: any) => Promise<{
    toDataURL: (type?: string, quality?: number) => string;
  }>;
} 