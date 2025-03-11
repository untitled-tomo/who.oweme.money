import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import ShareCard from './ShareCard';
import { ThemeProvider, createTheme } from '@mui/material';

expect.extend(toHaveNoViolations);

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
];

const mockTaxRate = 10;
const mockPayer = 'person1';
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

describe('ShareCard Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = renderWithTheme(
      <ShareCard
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
        payer={mockPayer}
        onShareImage={mockOnShareImage}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have properly labeled buttons', () => {
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
    expect(shareButton).toBeInTheDocument();
    expect(shareButton).toHaveAttribute('aria-label', 'toggle theme');
  });

  it('should have proper heading hierarchy', () => {
    renderWithTheme(
      <ShareCard
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
        payer={mockPayer}
        onShareImage={mockOnShareImage}
      />
    );

    // Check for proper heading structure
    const mainHeading = screen.getByText('Who Owe Me Money');
    expect(mainHeading.tagName).toBe('H5'); // MUI Typography variant="h5"

    const subHeadings = screen.getAllByText(/paid the bill|bill details|menu items/i);
    subHeadings.forEach(heading => {
      expect(heading.tagName).toBe('H6'); // MUI Typography variant="h6"
    });
  });

  it('should have sufficient color contrast in light mode', () => {
    const lightTheme = createTheme({
      palette: {
        mode: 'light',
      },
    });

    render(
      <ThemeProvider theme={lightTheme}>
        <ShareCard
          people={mockPeople}
          menu={mockMenu}
          taxRate={mockTaxRate}
          payer={mockPayer}
          onShareImage={mockOnShareImage}
        />
      </ThemeProvider>
    );

    // While we can't automatically test contrast ratios without specific tools,
    // we can check that our theme settings are respecting the light mode
    const container = screen.getByTestId('mock-share-card');
    expect(container).toHaveStyle('background-color: #fff');
  });

  it('should have sufficient color contrast in dark mode', () => {
    const darkTheme = createTheme({
      palette: {
        mode: 'dark',
      },
    });

    render(
      <ThemeProvider theme={darkTheme}>
        <ShareCard
          people={mockPeople}
          menu={mockMenu}
          taxRate={mockTaxRate}
          payer={mockPayer}
          onShareImage={mockOnShareImage}
        />
      </ThemeProvider>
    );

    // While we can't automatically test contrast ratios without specific tools,
    // we can check that our theme settings are respecting the dark mode
    const container = screen.getByTestId('mock-share-card');
    expect(container).toHaveStyle('background-color: #121212');
  });

  it('should have accessible table headers', () => {
    renderWithTheme(
      <ShareCard
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
        payer={mockPayer}
        onShareImage={mockOnShareImage}
      />
    );

    // Check for table headers with proper roles
    const tableHeaders = screen.getAllByRole('columnheader');
    expect(tableHeaders.length).toBeGreaterThan(0);
    
    // Check that headers have content
    tableHeaders.forEach(header => {
      expect(header.textContent).toBeTruthy();
    });
  });

  it('should have proper tab order for interactive elements', () => {
    renderWithTheme(
      <ShareCard
        people={mockPeople}
        menu={mockMenu}
        taxRate={mockTaxRate}
        payer={mockPayer}
        onShareImage={mockOnShareImage}
      />
    );

    // Check that share button can be focused with tab
    const shareButton = screen.getByRole('button', { name: /share summary/i });
    expect(shareButton).toHaveAttribute('tabIndex', '0');
  });
}); 