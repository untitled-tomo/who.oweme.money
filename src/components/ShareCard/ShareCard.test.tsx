import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ShareCard from './ShareCard';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock data for testing
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
const mockPayer = 'person1';

// Mock onShareImage function
const mockOnShareImage = vi.fn();

// Create a wrapper component with ThemeProvider
const renderWithTheme = (ui: React.ReactNode) => {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('ShareCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders correctly with all provided props', () => {
    renderWithTheme(
      <ShareCard
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
        payer={mockPayer}
        onShareImage={mockOnShareImage}
      />
    );

    // Check if title and headers are rendered
    expect(screen.getByText('Who Owe Me Money')).toBeInTheDocument();
    expect(screen.getByText(`Bill Split by ${mockPeople[mockPayer]}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockPeople[mockPayer]} paid the bill`)).toBeInTheDocument();

    // Check if menu items are rendered
    mockMenu.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(`$${item.amount.toFixed(2)}`)).toBeInTheDocument();
    });

    // Check if bill details are rendered
    expect(screen.getByText('Subtotal:')).toBeInTheDocument();
    expect(screen.getByText(`Tax (${mockTaxRate}%):`)).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();

    // Check subtotal calculation (sum of all menu items)
    const subtotal = mockMenu.reduce((acc, item) => acc + item.amount, 0);
    expect(screen.getByText(`$${subtotal.toFixed(2)}`)).toBeInTheDocument();

    // Check tax calculation
    const tax = (subtotal * mockTaxRate) / 100;
    expect(screen.getByText(`$${tax.toFixed(2)}`)).toBeInTheDocument();

    // Check total calculation
    const total = subtotal + tax;
    expect(screen.getByText(`$${total.toFixed(2)}`)).toBeInTheDocument();

    // Check if share button is rendered
    expect(screen.getByRole('button', { name: /share summary/i })).toBeInTheDocument();
  });

  it('calls onShareImage when the Share Summary button is clicked', async () => {
    const user = userEvent.setup();
    
    renderWithTheme(
      <ShareCard
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
        payer={mockPayer}
        onShareImage={mockOnShareImage}
      />
    );

    const shareButton = screen.getByRole('button', { name: /share summary/i });
    await user.click(shareButton);

    // Check if onShareImage was called
    expect(mockOnShareImage).toHaveBeenCalled();
  });

  it('calculates owed amounts correctly', () => {
    renderWithTheme(
      <ShareCard
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
        payer={mockPayer}
        onShareImage={mockOnShareImage}
      />
    );

    // Expected calculations:
    // Pizza ($20) split between Alice and Bob = $10 each
    // Salad ($10) split between Bob and Charlie = $5 each
    // Drinks ($15) split between Alice, Bob, and Charlie = $5 each
    // Alice owes: $10 (Pizza) + $5 (Drinks) = $15 + $1.5 (10% tax) = $16.5 (but she's the payer, so not displayed)
    // Bob owes: $10 (Pizza) + $5 (Salad) + $5 (Drinks) = $20 + $2 (10% tax) = $22
    // Charlie owes: $5 (Salad) + $5 (Drinks) = $10 + $1 (10% tax) = $11

    // Find the amount owed cells in the table
    const tableRows = screen.getAllByRole('row');
    
    // Skip header row
    const dataRows = tableRows.slice(1);
    
    // Find Bob's row and check amount
    const bobRow = dataRows.find(row => row.textContent?.includes('Bob'));
    expect(bobRow).toBeDefined();
    expect(bobRow?.textContent).toContain('$22.00');
    
    // Find Charlie's row and check amount
    const charlieRow = dataRows.find(row => row.textContent?.includes('Charlie'));
    expect(charlieRow).toBeDefined();
    expect(charlieRow?.textContent).toContain('$11.00');
  });

  it('does not show the payer in the amount owed list', () => {
    renderWithTheme(
      <ShareCard
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
        payer={mockPayer}
        onShareImage={mockOnShareImage}
      />
    );

    // The table should only show people who owe money (not the payer)
    const tableRows = screen.getAllByRole('row');
    
    // Skip header row
    const dataRows = tableRows.slice(1);
    
    // There should be 2 rows (for Bob and Charlie), not 3
    expect(dataRows.length).toBe(2);
    
    // Alice (payer) should not appear in the owed amounts list
    const aliceRow = dataRows.find(row => row.textContent?.includes('Alice'));
    expect(aliceRow).toBeUndefined();
  });

  it('formats the date correctly', () => {
    // Mock Date.toLocaleDateString to return a fixed date for testing
    const originalDate = global.Date;
    const mockDate = new Date('2023-04-15T12:00:00Z');
    
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);
    
    renderWithTheme(
      <ShareCard
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
        payer={mockPayer}
        onShareImage={mockOnShareImage}
      />
    );
    
    // Check for the formatted date (April 15, 2023)
    expect(screen.getByText('April 15, 2023')).toBeInTheDocument();
    
    // Restore the original Date implementation
    global.Date = originalDate;
  });
}); 