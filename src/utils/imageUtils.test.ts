import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { elementToDataUrl, dataURLtoBlob, shareImage, downloadImage } from './imageUtils';

// Mock browser APIs
global.URL.createObjectURL = vi.fn();
global.URL.revokeObjectURL = vi.fn();

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
      // Mock canvas and html2canvas
      const mockCanvas = {
        toDataURL: vi.fn().mockReturnValue(mockDataUrl)
      };
      
      // Mock dynamic import of html2canvas
      vi.mock('html2canvas', async () => {
        const actual = await vi.importActual('html2canvas');
        return {
          default: vi.fn().mockResolvedValue(mockCanvas)
        };
      });
      
      const result = await elementToDataUrl(mockElement);
      
      // Check that html2canvas was dynamically imported and called
      const html2canvasModule = await import('html2canvas');
      expect(html2canvasModule.default).toHaveBeenCalledWith(mockElement, expect.objectContaining({
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null
      }));
      
      // Check that toDataURL was called on the canvas
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
      
      // Check the returned data URL
      expect(result).toBe(mockDataUrl);
    });

    it('should handle errors', async () => {
      // Mock html2canvas to throw an error
      vi.mock('html2canvas', async () => {
        return {
          default: vi.fn().mockRejectedValue(new Error('canvas error'))
        };
      });
      
      // Mock console.error to prevent actual error logs in test output
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
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
      
      // Mock the created anchor element
      const mockAnchor = {
        href: '',
        download: '',
        click: clickSpy
      };
      createElementSpy.mockReturnValue(mockAnchor);
      
      // Call the function
      downloadImage(mockDataUrl, 'test.png');
      
      // Check expectations
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockAnchor.href).toBe(mockDataUrl);
      expect(mockAnchor.download).toBe('test.png');
      expect(clickSpy).toHaveBeenCalled();
    });

    it('should handle errors', () => {
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
    it('should use Web Share API when available', async () => {
      // Mock navigator.share and navigator.canShare
      const shareFunction = vi.fn().mockResolvedValue(undefined);
      const canShareFunction = vi.fn().mockReturnValue(true);
      
      global.navigator.share = shareFunction;
      global.navigator.canShare = canShareFunction;
      
      // Mock File constructor
      global.File = vi.fn().mockImplementation((bits, name, options) => ({
        bits,
        name,
        type: options.type
      }));
      
      await shareImage(mockDataUrl, 'test.png');
      
      // Check that canShare was called with a file
      expect(canShareFunction).toHaveBeenCalledWith({
        files: [expect.objectContaining({ name: 'test.png', type: 'image/png' })]
      });
      
      // Check that share was called with the right arguments
      expect(shareFunction).toHaveBeenCalledWith({
        title: 'Bill Summary',
        text: 'My bill splitting summary from Who Owe Me Money app',
        files: [expect.objectContaining({ name: 'test.png', type: 'image/png' })]
      });
    });

    it('should fall back to download when Web Share API is not available', async () => {
      // Mock navigator without share API
      global.navigator.share = undefined;
      global.navigator.canShare = undefined;
      
      // Mock downloadImage function
      const downloadImageMock = vi.fn();
      vi.mock('./imageUtils', async () => {
        const actual = await vi.importActual('./imageUtils');
        return {
          ...actual,
          downloadImage: downloadImageMock
        };
      });
      
      await shareImage(mockDataUrl, 'test.png');
      
      // Check that downloadImage was called as a fallback
      expect(downloadImageMock).toHaveBeenCalledWith(mockDataUrl, 'test.png');
    });

    it('should fall back to download when Web Share API throws an error', async () => {
      // Mock navigator.share to throw an error
      const shareFunction = vi.fn().mockRejectedValue(new Error('share error'));
      const canShareFunction = vi.fn().mockReturnValue(true);
      
      global.navigator.share = shareFunction;
      global.navigator.canShare = canShareFunction;
      
      // Mock File constructor
      global.File = vi.fn().mockImplementation((bits, name, options) => ({
        bits,
        name,
        type: options.type
      }));
      
      // Mock downloadImage function
      const downloadImageMock = vi.fn();
      vi.mock('./imageUtils', async () => {
        const actual = await vi.importActual('./imageUtils');
        return {
          ...actual,
          downloadImage: downloadImageMock
        };
      });
      
      // Mock console.error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      await shareImage(mockDataUrl, 'test.png');
      
      // Check that console.error was called
      expect(consoleSpy).toHaveBeenCalledWith('Error sharing image:', expect.any(Error));
      
      // Check that downloadImage was called as a fallback
      expect(downloadImageMock).toHaveBeenCalledWith(mockDataUrl, 'test.png');
      
      consoleSpy.mockRestore();
    });
  });
}); 