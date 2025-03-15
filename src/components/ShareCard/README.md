# ShareCard Feature

This directory contains the ShareCard component and related tests for the "Who Owe Me Money" application. The ShareCard feature allows users to generate and share a visually appealing summary of their bill-splitting calculations.

## Components

- **ShareCard.tsx**: The main component that renders a card with bill-splitting details that can be converted to an image.
- **ShareCard.test.tsx**: Unit tests for the ShareCard component.
- **integration.test.tsx**: Integration tests that verify ShareCard works correctly with the Summary component.
- **accessibility.test.tsx**: Tests that verify the ShareCard component meets accessibility standards.

## Related Files

- **src/utils/imageUtils.ts**: Utility functions for converting DOM elements to images and sharing them.
- **src/utils/imageUtils.test.ts**: Tests for the image utility functions.
- **src/pages/Index/Summary.tsx**: The parent component that integrates the ShareCard.
- **src/pages/Index/Summary.test.tsx**: Tests for the Summary component focusing on ShareCard integration.
- **src/types/global.d.ts**: Type definitions for Web Share API and html2canvas.

## Dependencies

This feature requires the following dependencies:

```bash
pnpm add html2canvas file-saver @types/file-saver
```

For testing, you may also need:

```bash
pnpm add -D jest-axe @types/jest-axe
```

## Feature Flow

1. User completes the bill-splitting flow and reaches the Summary page.
2. User selects who paid the bill from the dropdown.
3. The ShareCard component appears below the summary.
4. User clicks the "Share Summary" button.
5. The app shows a loading indicator while generating the image.
6. The image is shared using the Web Share API if available, or downloaded as a fallback.
7. A success/error notification is shown to the user.

## Test Strategy

The test suite for the ShareCard feature is comprehensive and covers:

### Unit Tests
- Component rendering
- Prop validation
- Button click handlers
- Calculations for amounts owed
- Date formatting

### Integration Tests
- Interaction with the Summary component
- Complete sharing flow
- Error handling
- Loading states
- Notifications

### Accessibility Tests
- ARIA compliance
- Color contrast
- Heading hierarchy
- Tab order
- Button labels

## Usage Example

```tsx
import ShareCard from '../components/ShareCard/ShareCard';
import { elementToDataUrl, shareImage } from '../utils/imageUtils';

// Inside your component
const handleShareImage = async (element: HTMLElement) => {
  try {
    setIsLoading(true);
    const dataUrl = await elementToDataUrl(element);
    await shareImage(dataUrl, 'bill-summary.png');
    showSuccessMessage();
  } catch (error) {
    showErrorMessage();
  } finally {
    setIsLoading(false);
  }
};

// In your render method
return (
  <ShareCard
    people={people}
    menu={menu}
    taxRate={taxRate}
    payer={payerId}
    onShareImage={handleShareImage}
  />
);
``` 