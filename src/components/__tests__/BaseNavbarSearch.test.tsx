import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import BaseNavbarSearch from '../BaseNavbarSearch';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock BaseSelect component
jest.mock('../BaseSelect', () => ({
  __esModule: true,
  default: () => <div data-testid="base-select">BaseSelect</div>,
}));

const mockRouter = {
  push: jest.fn(),
};

const mockSearchParams = new URLSearchParams();

describe('BaseNavbarSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders navbar with brand name', () => {
    render(<BaseNavbarSearch />);
    
    expect(screen.getByText('W Commerce')).toBeInTheDocument();
  });

  it('renders search input when hideControls is false', () => {
    render(<BaseNavbarSearch />);
    
    const input = screen.getByPlaceholderText('Search products...');
    expect(input).toBeInTheDocument();
  });

  it('hides controls when hideControls is true', () => {
    render(<BaseNavbarSearch hideControls={true} />);
    
    const input = screen.queryByPlaceholderText('Search products...');
    expect(input).not.toBeInTheDocument();
  });

  it('renders BaseSelect component when controls are visible', () => {
    render(<BaseNavbarSearch />);
    
    expect(screen.getByTestId('base-select')).toBeInTheDocument();
  });

  it('updates input value on change', () => {
    render(<BaseNavbarSearch />);
    
    const input = screen.getByPlaceholderText('Search products...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test query' } });
    
    expect(input.value).toBe('test query');
  });

  it('debounces search and updates URL after 400ms', async () => {
    render(<BaseNavbarSearch />);
    
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Should not call immediately
    expect(mockRouter.push).not.toHaveBeenCalled();
    
    // Fast-forward time
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/?q=test');
    });
  });

  it('clears search params when input is empty', async () => {
    const params = new URLSearchParams('q=test');
    (useSearchParams as jest.Mock).mockReturnValue(params);
    
    render(<BaseNavbarSearch />);
    
    const input = screen.getByPlaceholderText('Search products...');
    fireEvent.change(input, { target: { value: '' } });
    
    jest.advanceTimersByTime(400);
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('syncs input value with URL search params', () => {
    const params = new URLSearchParams('q=existing');
    (useSearchParams as jest.Mock).mockReturnValue(params);
    
    render(<BaseNavbarSearch />);
    
    const input = screen.getByPlaceholderText('Search products...') as HTMLInputElement;
    expect(input.value).toBe('existing');
  });
});


