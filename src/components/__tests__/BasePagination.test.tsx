import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import BasePagination from '../BasePagination';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
};

const mockSearchParams = new URLSearchParams();

describe('BasePagination', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it('renders pagination controls', () => {
    render(<BasePagination total={100} page={1} limit={10} />);
    
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('<')).toBeInTheDocument();
    expect(screen.getByText('>')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();
  });

  it('displays correct page numbers', () => {
    render(<BasePagination total={100} page={1} limit={10} />);
    
    // Should show page 1 as active
    const page1Button = screen.getByText('1');
    expect(page1Button).toBeInTheDocument();
    expect(page1Button).toHaveClass('btn-active');
  });

  it('calculates total pages correctly', () => {
    render(<BasePagination total={100} page={1} limit={10} />);
    
    // With 100 items and limit 10, should have 10 pages
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('disables previous buttons on first page', () => {
    render(<BasePagination total={100} page={1} limit={10} />);
    
    const startButton = screen.getByText('Start');
    const prevButton = screen.getByText('<');
    
    expect(startButton).toBeDisabled();
    expect(prevButton).toBeDisabled();
  });

  it('disables next buttons on last page', () => {
    render(<BasePagination total={100} page={10} limit={10} />);
    
    const nextButton = screen.getByText('>');
    const endButton = screen.getByText('End');
    
    expect(nextButton).toBeDisabled();
    expect(endButton).toBeDisabled();
  });

  it('calls router.replace when clicking page number', () => {
    render(<BasePagination total={100} page={1} limit={10} />);
    
    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/?page=2');
  });

  it('removes page param when navigating to page 1', () => {
    const params = new URLSearchParams('page=2');
    (useSearchParams as jest.Mock).mockReturnValue(params);
    
    render(<BasePagination total={100} page={2} limit={10} />);
    
    const page1Button = screen.getByText('1');
    fireEvent.click(page1Button);
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/');
  });

  it('shows ellipsis when there are many pages', () => {
    render(<BasePagination total={100} page={5} limit={10} />);
    
    // Should show ellipsis for pages beyond the window
    const ellipsisButtons = screen.getAllByText('…');
    expect(ellipsisButtons.length).toBeGreaterThan(0);
  });

  it('handles edge case with zero total', () => {
    render(<BasePagination total={0} page={1} limit={10} />);
    
    // Should still render with at least 1 page
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});


