import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { elementToDataUrl, dataURLtoBlob, shareImage, downloadImage } from './imageUtils';

// Setup global mocks
beforeEach(() => {
  // Mock browser APIs
  global.URL.createObjectURL = vi.fn();
  global.URL.revokeObjectURL = vi.fn();

  // Mock window.html2canvas since we're loading it from CDN
  vi.stubGlobal('html2canvas', vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('mock-data-url')
  }));
});

// Mock file-saver outside the tests
vi.mock('file-saver', () => {
  return {
    saveAs: vi.fn()
  };
});

describe('imageUtils', () => {
  // Setup variables
  let mockElement: HTMLDivElement;
  let originalCreateElement: typeof document.createElement;

  // Mock data URL for testing
  const mockDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

  beforeEach(() => {
    // Reset the DOM
    document.body.innerHTML = '';
    vi.clearAllMocks();
    
    // Store original implementation before any mocking
    originalCreateElement = document.createElement.bind(document);
    
    // Create a test element
    mockElement = originalCreateElement('div');
    mockElement.textContent = 'Test Element';
    
    // Mock document.createElement for script tag
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'script') {
        const scriptEl = originalCreateElement('script');
        // Simulate script loading
        setTimeout(() => {
          if (scriptEl.onload) scriptEl.onload(new Event('load'));
        }, 0);
        return scriptEl;
      }
      return originalCreateElement(tagName);
    });
    
    // Mock appendChild to avoid actually appending scripts
    vi.spyOn(document.head, 'appendChild').mockImplementation(() => document.head);
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
      // Test with our new CDN-based approach
      const result = await elementToDataUrl(mockElement);
      expect(result).toBe('mock-data-url');
      
      // Verify html2canvas was called
      expect(window.html2canvas).toHaveBeenCalled();
    });

    it('should handle errors by rethrowing them', async () => {
      // Reset mock to simulate an error
      vi.mocked(window.html2canvas).mockRejectedValueOnce(new Error('canvas error'));
      
      // Mock console.error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Test should throw with the expected error
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
      const mockAnchor = originalCreateElement('a') as HTMLAnchorElement;
      mockAnchor.href = '';
      mockAnchor.download = '';
      mockAnchor.click = clickSpy;
      
      // Override the mock for this specific test
      createElementSpy.mockReturnValueOnce(mockAnchor);
      
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
      createElementSpy.mockImplementationOnce(() => {
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
    it('should use FileSaver to save the image', async () => {
      // Setup test
      const fileSaverModule = await import('file-saver');
      const saveAsSpy = vi.mocked(fileSaverModule.saveAs);
      
      // Call the function
      await shareImage(mockDataUrl, 'test.png');
      
      // Verify saveAs was called with a Blob and filename
      expect(saveAsSpy).toHaveBeenCalledWith(
        expect.any(Blob),
        'test.png'
      );
    });

    it('should handle errors', async () => {
      // Setup test - mock saveAs to throw
      const fileSaverModule = await import('file-saver');
      vi.mocked(fileSaverModule.saveAs).mockImplementation(() => {
        throw new Error('saveAs error');
      });
      
      // Mock console.error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Call should throw as we're now rethrowing errors
      await expect(shareImage(mockDataUrl, 'test.png')).rejects.toThrow('saveAs error');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
}); 