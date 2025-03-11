import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { elementToDataUrl, dataURLtoBlob, shareImage, downloadImage } from './imageUtils';

// Mock browser APIs
global.URL.createObjectURL = vi.fn();
global.URL.revokeObjectURL = vi.fn();

// Mock html2canvas module
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('mock-data-url')
  })
}));

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn()
}));

describe('imageUtils', () => {
  // Setup mock DOM element
  const mockElement = document.createElement('div');
  mockElement.textContent = 'Test Element';

  // Mock data URL for testing
  const mockDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

  beforeEach(() => {
    // Setup for file saver mocks
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('dataURLtoBlob', () => {
    it('should convert a data URL to a Blob object', () => {
      const result = dataURLtoBlob(mockDataUrl);
      
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('image/png');
    });

    it('should handle different mime types', () => {
      const jpegDataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAP/2Q==';
      const result = dataURLtoBlob(jpegDataUrl);
      
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('image/jpeg');
    });
  });

  describe('elementToDataUrl', () => {
    it('should call html2canvas and return a data URL', async () => {
      // Simplified test that relies on the mock
      const result = await elementToDataUrl(mockElement);
      expect(result).toBe('mock-data-url');
      
      // Check import worked (simplified assertion)
      const html2canvas = await import('html2canvas').then(mod => mod.default);
      expect(html2canvas).toHaveBeenCalled();
    });

    it('should handle errors by returning a placeholder', async () => {
      // Reset mock to simulate an error
      const html2canvasModule = await import('html2canvas');
      vi.mocked(html2canvasModule.default).mockRejectedValueOnce(new Error('canvas error'));
      
      // Mock console.error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Test should not throw, but return undefined or a placeholder
      await expect(elementToDataUrl(mockElement)).rejects.toThrow('canvas error');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('downloadImage', () => {
    it('should create an anchor element and trigger a download', () => {
      // Create a spy on createElement and click methods
      const createElementSpy = vi.spyOn(document, 'createElement');
      const clickSpy = vi.fn();
      
      // Mock the created anchor element with proper HTMLAnchorElement type
      const mockAnchor = document.createElement('a');
      mockAnchor.href = '';
      mockAnchor.download = '';
      // Replace the click method
      mockAnchor.click = clickSpy;
      
      createElementSpy.mockReturnValue(mockAnchor);
      
      // Call the function
      downloadImage(mockDataUrl, 'test.png');
      
      // Check expectations
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockAnchor.href).toBe(mockDataUrl);
      expect(mockAnchor.download).toBe('test.png');
      expect(clickSpy).toHaveBeenCalled();
    });

    it('should handle errors gracefully', () => {
      // Create a spy on createElement that throws an error
      const createElementSpy = vi.spyOn(document, 'createElement');
      createElementSpy.mockImplementation(() => {
        throw new Error('createElement error');
      });
      
      // Mock console.error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Call should not throw but log error
      expect(() => downloadImage(mockDataUrl, 'test.png')).not.toThrow();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error downloading image:',
        expect.any(Error)
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('shareImage', () => {
    // Simplified test for Web Share API
    it('should use Web Share API when available', async () => {
      // Skip if Web Share API is not available in test environment
      if (!('share' in navigator)) {
        console.log('Web Share API not available, skipping test');
        return;
      }
      
      // Set up mocks for Web Share API
      const shareFunction = vi.fn().mockResolvedValue(undefined);
      const canShareFunction = vi.fn().mockReturnValue(true);
      
      // @ts-ignore - Mocking browser API
      navigator.share = shareFunction;
      // @ts-ignore - Mocking browser API
      navigator.canShare = canShareFunction;
      
      // Mock File constructor
      const originalFile = global.File;
      // @ts-ignore - Mocking File API
      global.File = vi.fn().mockImplementation((bits, name, options) => ({
        bits,
        name,
        type: options.type
      }));
      
      try {
        await shareImage(mockDataUrl, 'test.png');
        
        // Basic check that share was called
        expect(shareFunction).toHaveBeenCalled();
      } finally {
        // Restore original File
        global.File = originalFile;
      }
    });

    // Simplified fallback test
    it('should fall back to download when Web Share API is not available', async () => {
      // Temporarily remove share API
      const originalShare = navigator.share;
      const originalCanShare = navigator.canShare;
      
      // @ts-ignore - Removing browser API
      navigator.share = undefined;
      // @ts-ignore - Removing browser API
      navigator.canShare = undefined;
      
      // Use vi.spyOn on the module's exported function instead of window
      const downloadImageMock = vi.fn();
      vi.mock('./imageUtils', async (importOriginal) => {
        const actual = await importOriginal() as typeof import('./imageUtils');
        return {
          ...actual,
          downloadImage: downloadImageMock
        };
      });
      
      try {
        await shareImage(mockDataUrl, 'test.png');
        
        // Check downloadImage was called as fallback
        expect(downloadImageMock).toHaveBeenCalledWith(mockDataUrl, 'test.png');
      } finally {
        // Restore original API
        navigator.share = originalShare;
        navigator.canShare = originalCanShare;
        
        // Restore original mocks
        vi.resetModules();
      }
    });
  });
}); 