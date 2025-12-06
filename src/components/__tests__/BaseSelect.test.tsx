import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import BaseSelect from '../BaseSelect';
import { SelectOption } from '../../types/common';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockRouter = {
  replace: jest.fn(),
};

const mockSearchParams = new URLSearchParams();

const mockSelectOptions: SelectOption[] = [
  { label: 'Option 1', value: 'value1' },
  { label: 'Option 2', value: 'value2' },
  { label: 'Price Low to High', value: 'price-asc' },
];

describe('BaseSelect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it('renders select component with label', () => {
    render(<BaseSelect selectOptions={mockSelectOptions} />);
    
    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays all select options', () => {
    render(<BaseSelect selectOptions={mockSelectOptions} />);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Price Low to High')).toBeInTheDocument();
  });

  it('shows "None" option by default', () => {
    render(<BaseSelect selectOptions={mockSelectOptions} />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('');
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('updates URL params when option is selected', () => {
    render(<BaseSelect selectOptions={mockSelectOptions} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'price-asc' } });
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/?sortBy=price&order=asc');
  });

  it('handles option with dash-separated value correctly', () => {
    render(<BaseSelect selectOptions={mockSelectOptions} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'price-asc' } });
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/?sortBy=price&order=asc');
  });

  it('clears params when "None" is selected', () => {
    const params = new URLSearchParams('sortBy=price&order=asc');
    (useSearchParams as jest.Mock).mockReturnValue(params);
    
    render(<BaseSelect selectOptions={mockSelectOptions} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '' } });
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/');
  });

  it('displays current selection from URL params', () => {
    const params = new URLSearchParams('sortBy=price&order=asc');
    (useSearchParams as jest.Mock).mockReturnValue(params);
    
    render(<BaseSelect selectOptions={mockSelectOptions} />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('price-asc');
  });
});


