import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Categories from '../Categories';
import { Category } from '../../types/product';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockRouter = {
  push: jest.fn(),
};

const mockCategories: Category[] = [
  { slug: 'electronics', name: 'Electronics', url: '/category/electronics' },
  { slug: 'clothing', name: 'Clothing', url: '/category/clothing' },
  { slug: 'books', name: 'Books', url: '/category/books' },
];

describe('Categories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('Rendering', () => {
    it('renders categories list', () => {
      render(<Categories data={mockCategories} />);
      
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Clothing')).toBeInTheDocument();
      expect(screen.getByText('Books')).toBeInTheDocument();
    });

    it('displays "No categories found" when data is empty', () => {
      render(<Categories data={[]} />);
      
      expect(screen.getByText('No categories found.')).toBeInTheDocument();
    });

    it('does not display "No categories found" when data is undefined', () => {
      render(<Categories data={undefined} />);
      
      // When data is undefined, the component doesn't render the "No categories found" message
      expect(screen.queryByText('No categories found.')).not.toBeInTheDocument();
    });

    it('checks the checkbox for the selected category', () => {
      render(<Categories data={mockCategories} categorySlug="electronics" />);
      
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
    });
  });

  describe('Navigation', () => {
    it('navigates to category page when category is clicked', () => {
      render(<Categories data={mockCategories} />);
      
      const electronicsCheckbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(electronicsCheckbox);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/?category=electronics');
    });

    it('removes category from URL when same category is clicked again', () => {
      render(<Categories data={mockCategories} categorySlug="electronics" />);
      
      const electronicsCheckbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(electronicsCheckbox);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });

    it('preserves search term when navigating to category', () => {
      render(<Categories data={mockCategories} searchTerm="laptop" />);
      
      const electronicsCheckbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(electronicsCheckbox);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/?q=laptop&category=electronics');
    });

    it('preserves search term when deselecting category', () => {
      render(
        <Categories
          data={mockCategories}
          searchTerm="laptop"
          categorySlug="electronics"
        />
      );
      
      const electronicsCheckbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(electronicsCheckbox);
      
      expect(mockRouter.push).toHaveBeenCalledWith('/?q=laptop');
    });
  });
});

