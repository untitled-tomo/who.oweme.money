import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Summary from './Summary';
import { ThemeProvider, createTheme } from '@mui/material';
import * as imageUtils from '../../utils/imageUtils';

// Mock imageUtils functions
vi.mock('../../utils/imageUtils', () => ({
  elementToDataUrl: vi.fn().mockImplementation(() => Promise.resolve('mock-data-url')),
  shareImage: vi.fn().mockResolvedValue(undefined)
}));

// Mock ShareCard component with proper types
vi.mock('../../components/ShareCard/ShareCard', () => ({
  default: (props: {
    people: Record<string, string>;
    menu: Array<{ name: string; amount: number; peopleInvolved: string[] }>;
    taxRate: number;
    payer: string;
    onShareImage: (element: HTMLElement) => void;
  }) => {
    const { people, menu, taxRate, payer, onShareImage } = props;
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

// Helper function to select a payer in the MUI select component
const selectPayer = async (payerName: string) => {
  // Find the select by its text and open it
  const selectElement = screen.getByText('Who Paid the Bill?').closest('div');
  if (!selectElement) {
    throw new Error('Could not find select element');
  }
  
  // Click on the select element to open the dropdown
  fireEvent.mouseDown(selectElement.querySelector('[role="combobox"]') as HTMLElement);
  
  // Wait for the dropdown to appear
  await waitFor(() => {
    const options = document.querySelectorAll('[role="option"]');
    expect(options.length).toBeGreaterThan(0);
  });
  
  // Find and click the option using role instead of just text
  const options = document.querySelectorAll('[role="option"]');
  const option = Array.from(options).find(opt => opt.textContent === payerName);
  
  if (!option) {
    throw new Error(`Could not find option for ${payerName}`);
  }
  
  fireEvent.click(option);
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
    await selectPayer('Alice');
    
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
    // Mock the Date object
    const mockDate = new Date('2024-03-15T14:30:00');
    const realDate = global.Date;
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }
    } as any;

    renderWithTheme(
      <Summary
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
      />
    );
    
    // Select a payer
    await selectPayer('Alice');
    
    // Find and click the share button
    const shareButton = screen.getByTestId('share-button');
    await userEvent.click(shareButton);
    
    // Check if image utilities are called
    expect(imageUtils.elementToDataUrl).toHaveBeenCalled();
    expect(imageUtils.shareImage).toHaveBeenCalledWith(
      'mock-data-url',
      'who_oweme_money_2024_03_15_14_30.png'
    );
    
    // Check if success message is shown
    await waitFor(() => {
      expect(screen.getByText('Summary shared successfully!')).toBeInTheDocument();
    });

    // Restore the real Date object
    global.Date = realDate;
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
    await selectPayer('Alice');
    
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
    await selectPayer('Alice');
    
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

  it('calculates owed amounts correctly', async () => {
    renderWithTheme(
      <Summary
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
      />
    );
    
    // Select a payer
    await selectPayer('Alice');
    
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
    
    // Find and check rows
    const bobRow = dataRows.find(row => row.textContent?.includes('Bob'));
    expect(bobRow).toBeDefined();
    expect(bobRow?.textContent).toContain('16.50');
    
    const charlieRow = dataRows.find(row => row.textContent?.includes('Charlie'));
    expect(charlieRow).toBeDefined();
    expect(charlieRow?.textContent).toContain('5.50');
  });
}); 