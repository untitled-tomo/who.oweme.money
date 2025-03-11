import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ShareCard from './ShareCard';
import Summary from '../../pages/Index/Summary';
import { ThemeProvider, createTheme } from '@mui/material';
import * as imageUtils from '../../utils/imageUtils';

// Mock imageUtils functions
vi.mock('../../utils/imageUtils', () => ({
  elementToDataUrl: vi.fn().mockResolvedValue('mock-data-url'),
  shareImage: vi.fn().mockResolvedValue(undefined)
}));

// Test mock data
const mockPeople = {
  'person1': 'Alice',
  'person2': 'Bob',
  'person3': 'Charlie',
};

const mockMenu = [
  {
    name: 'Pizza',
    amount: 20,
    peopleInvolved: ['person1', 'person2'],
  },
  {
    name: 'Salad',
    amount: 10,
    peopleInvolved: ['person2', 'person3'],
  },
  {
    name: 'Drinks',
    amount: 15,
    peopleInvolved: ['person1', 'person2', 'person3'],
  },
];

const mockTaxRate = 10;

// Create a wrapper component with ThemeProvider
const renderWithTheme = (ui: React.ReactNode) => {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('ShareCard Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('integrates with Summary component to provide a complete sharing flow', async () => {
    const user = userEvent.setup();
    
    // Render the Summary component (which contains ShareCard when a payer is selected)
    renderWithTheme(
      <Summary
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
      />
    );
    
    // Verify initial state (no ShareCard visible)
    expect(screen.queryByText('Share the Summary')).not.toBeInTheDocument();
    
    // Select a payer
    await user.click(screen.getByLabelText('Who Paid the Bill?'));
    await user.click(screen.getByText('Alice'));
    
    // Verify ShareCard appears
    expect(screen.getByText('Share the Summary')).toBeInTheDocument();
    
    // Locate and click the share button
    const shareButton = screen.getByRole('button', { name: /share summary/i });
    await user.click(shareButton);
    
    // Verify loading indicator appears
    expect(screen.getByText('Generating shareable summary...')).toBeInTheDocument();
    
    // Wait for the process to complete
    await waitFor(() => {
      expect(screen.queryByText('Generating shareable summary...')).not.toBeInTheDocument();
    });
    
    // Verify image utilities were called with correct parameters
    expect(imageUtils.elementToDataUrl).toHaveBeenCalled();
    expect(imageUtils.shareImage).toHaveBeenCalledWith(
      'mock-data-url',
      'who-owe-me-money-summary.png'
    );
    
    // Verify success message appears
    expect(screen.getByText('Summary shared successfully!')).toBeInTheDocument();
  });
  
  it('handles errors gracefully in the integration flow', async () => {
    const user = userEvent.setup();
    
    // Mock a failure in the image generation
    vi.mocked(imageUtils.elementToDataUrl).mockRejectedValueOnce(new Error('Image generation failed'));
    
    // Render the Summary component
    renderWithTheme(
      <Summary
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
      />
    );
    
    // Select a payer
    await user.click(screen.getByLabelText('Who Paid the Bill?'));
    await user.click(screen.getByText('Alice'));
    
    // Click the share button
    const shareButton = screen.getByRole('button', { name: /share summary/i });
    await user.click(shareButton);
    
    // Wait for the process to complete
    await waitFor(() => {
      expect(screen.queryByText('Generating shareable summary...')).not.toBeInTheDocument();
    });
    
    // Verify error message appears
    expect(screen.getByText('Failed to share summary. Please try again.')).toBeInTheDocument();
  });
  
  it('automatically closes the notification after the timeout', async () => {
    const user = userEvent.setup();
    
    // Render the Summary component
    renderWithTheme(
      <Summary
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
      />
    );
    
    // Select a payer and share
    await user.click(screen.getByLabelText('Who Paid the Bill?'));
    await user.click(screen.getByText('Alice'));
    await user.click(screen.getByRole('button', { name: /share summary/i }));
    
    // Verify the notification appears
    await waitFor(() => {
      expect(screen.getByText('Summary shared successfully!')).toBeInTheDocument();
    });
    
    // Mock the setTimeout callback for autoHideDuration
    vi.useFakeTimers();
    vi.advanceTimersByTime(6000); // The Snackbar has autoHideDuration={6000}
    vi.useRealTimers();
    
    // Wait for notification to disappear
    await waitFor(() => {
      expect(screen.queryByText('Summary shared successfully!')).not.toBeInTheDocument();
    });
  });
  
  it('allows manual closing of the notification', async () => {
    const user = userEvent.setup();
    
    // Render the Summary component
    renderWithTheme(
      <Summary
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
      />
    );
    
    // Select a payer and share
    await user.click(screen.getByLabelText('Who Paid the Bill?'));
    await user.click(screen.getByText('Alice'));
    await user.click(screen.getByRole('button', { name: /share summary/i }));
    
    // Verify the notification appears
    await waitFor(() => {
      expect(screen.getByText('Summary shared successfully!')).toBeInTheDocument();
    });
    
    // Find and click the close button on the notification
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    
    // Verify notification disappears
    expect(screen.queryByText('Summary shared successfully!')).not.toBeInTheDocument();
  });
}); 