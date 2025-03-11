import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Summary from './Summary';
import { ThemeProvider, createTheme } from '@mui/material';
import * as imageUtils from '../../utils/imageUtils';

// Mock imageUtils functions
vi.mock('../../utils/imageUtils', () => ({
  elementToDataUrl: vi.fn().mockResolvedValue('mock-data-url'),
  shareImage: vi.fn().mockResolvedValue(undefined)
}));

// Mock ShareCard component
vi.mock('../../components/ShareCard/ShareCard', () => ({
  default: ({ people, menu, taxRate, payer, onShareImage }) => {
    return (
      <div data-testid="mock-share-card">
        <button 
          data-testid="share-button"
          onClick={() => onShareImage(document.createElement('div'))}
        >
          Share Summary
        </button>
        <div data-testid="people-data">{JSON.stringify(people)}</div>
        <div data-testid="menu-data">{JSON.stringify(menu)}</div>
        <div data-testid="tax-rate">{taxRate}</div>
        <div data-testid="payer">{payer}</div>
      </div>
    );
  }
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

describe('Summary Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without errors', () => {
    renderWithTheme(
      <Summary
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
      />
    );
    
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Who Paid the Bill?')).toBeInTheDocument();
  });

  it('does not show ShareCard when no payer is selected', () => {
    renderWithTheme(
      <Summary
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
      />
    );
    
    expect(screen.queryByText('Share the Summary')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-share-card')).not.toBeInTheDocument();
  });

  it('shows ShareCard when a payer is selected', async () => {
    renderWithTheme(
      <Summary
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
      />
    );
    
    // Select a payer
    const selectElement = screen.getByLabelText('Who Paid the Bill?');
    fireEvent.mouseDown(selectElement);
    
    // Select Alice from the dropdown
    const aliceOption = screen.getByText('Alice');
    fireEvent.click(aliceOption);
    
    // ShareCard should now be visible
    expect(screen.getByText('Share the Summary')).toBeInTheDocument();
    
    // Check if ShareCard receives the correct props
    expect(screen.getByTestId('mock-share-card')).toBeInTheDocument();
    expect(screen.getByTestId('people-data').textContent).toBe(JSON.stringify(mockPeople));
    expect(screen.getByTestId('menu-data').textContent).toBe(JSON.stringify(mockMenu));
    expect(screen.getByTestId('tax-rate').textContent).toBe(mockTaxRate.toString());
    expect(screen.getByTestId('payer').textContent).toBe('person1');
  });

  it('processes sharing when the share button is clicked', async () => {
    renderWithTheme(
      <Summary
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
      />
    );
    
    // Select a payer
    const selectElement = screen.getByLabelText('Who Paid the Bill?');
    fireEvent.mouseDown(selectElement);
    const aliceOption = screen.getByText('Alice');
    fireEvent.click(aliceOption);
    
    // Find and click the share button
    const shareButton = screen.getByTestId('share-button');
    await userEvent.click(shareButton);
    
    // Check if image utilities are called
    expect(imageUtils.elementToDataUrl).toHaveBeenCalled();
    expect(imageUtils.shareImage).toHaveBeenCalledWith(
      'mock-data-url',
      'who-owe-me-money-summary.png'
    );
    
    // Check if success message is shown
    await waitFor(() => {
      expect(screen.getByText('Summary shared successfully!')).toBeInTheDocument();
    });
  });

  it('shows error message when sharing fails', async () => {
    // Mock elementToDataUrl to throw an error
    vi.mocked(imageUtils.elementToDataUrl).mockRejectedValueOnce(new Error('Failed to generate image'));
    
    renderWithTheme(
      <Summary
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
      />
    );
    
    // Select a payer
    const selectElement = screen.getByLabelText('Who Paid the Bill?');
    fireEvent.mouseDown(selectElement);
    const aliceOption = screen.getByText('Alice');
    fireEvent.click(aliceOption);
    
    // Find and click the share button
    const shareButton = screen.getByTestId('share-button');
    await userEvent.click(shareButton);
    
    // Check if image utilities are called
    expect(imageUtils.elementToDataUrl).toHaveBeenCalled();
    expect(imageUtils.shareImage).not.toHaveBeenCalled();
    
    // Check if error message is shown
    await waitFor(() => {
      expect(screen.getByText('Failed to share summary. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows loading state while processing the image', async () => {
    // Mock elementToDataUrl to delay execution
    const delayedPromise = new Promise<string>(resolve => {
      setTimeout(() => resolve('mock-data-url'), 100);
    });
    vi.mocked(imageUtils.elementToDataUrl).mockReturnValueOnce(delayedPromise);
    
    renderWithTheme(
      <Summary
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
      />
    );
    
    // Select a payer
    const selectElement = screen.getByLabelText('Who Paid the Bill?');
    fireEvent.mouseDown(selectElement);
    const aliceOption = screen.getByText('Alice');
    fireEvent.click(aliceOption);
    
    // Find and click the share button
    const shareButton = screen.getByTestId('share-button');
    await userEvent.click(shareButton);
    
    // Check if loading state is shown
    expect(screen.getByText('Generating shareable summary...')).toBeInTheDocument();
    
    // Wait for processing to complete
    await waitFor(() => {
      expect(screen.queryByText('Generating shareable summary...')).not.toBeInTheDocument();
    });
    
    // Check if success message is shown
    expect(screen.getByText('Summary shared successfully!')).toBeInTheDocument();
  });

  it('calculates owed amounts correctly', () => {
    renderWithTheme(
      <Summary
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
      />
    );
    
    // Select a payer
    const selectElement = screen.getByLabelText('Who Paid the Bill?');
    fireEvent.mouseDown(selectElement);
    const aliceOption = screen.getByText('Alice');
    fireEvent.click(aliceOption);
    
    // Get the amount owed table
    const tableRows = screen.getAllByRole('row');
    
    // Skip header row
    const dataRows = tableRows.slice(1);
    
    // Check amount calculations
    // Expected calculations:
    // Pizza ($20) split between Alice and Bob = $10 each
    // Salad ($10) split between Bob and Charlie = $5 each
    // Alice owes: $10 (Pizza) = $10 + $1 (10% tax) = $11 (shown as 0 because she's the payer)
    // Bob owes: $10 (Pizza) + $5 (Salad) = $15 + $1.5 (10% tax) = $16.5
    // Charlie owes: $5 (Salad) = $5 + $0.5 (10% tax) = $5.5
    
    // Find Alice's row (should show 0)
    const aliceRow = dataRows.find(row => row.textContent?.includes('Alice'));
    expect(aliceRow).toBeDefined();
    expect(aliceRow?.textContent).toContain('0.00');
    
    // Find Bob's row
    const bobRow = dataRows.find(row => row.textContent?.includes('Bob'));
    expect(bobRow).toBeDefined();
    expect(bobRow?.textContent).toContain('16.50');
    
    // Find Charlie's row
    const charlieRow = dataRows.find(row => row.textContent?.includes('Charlie'));
    expect(charlieRow).toBeDefined();
    expect(charlieRow?.textContent).toContain('5.50');
  });
}); 