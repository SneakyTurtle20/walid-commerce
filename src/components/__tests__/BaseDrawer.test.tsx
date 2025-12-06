import { render, screen } from '@testing-library/react';
import BaseDrawer from '../BaseDrawer';
import { Category } from '../../types/product';

// Mock child components
jest.mock('src/layouts/Categories', () => ({
  __esModule: true,
  default: ({ categorySlug, searchTerm, data }: {
    data?: Category[];
    searchTerm?: string;
    categorySlug?: string;
  }) => (
    <div data-testid="categories">
      Categories - slug: {categorySlug}, search: {searchTerm}, count: {data?.length || 0}
    </div>
  ),
}));

jest.mock('src/layouts/Products', () => ({
  __esModule: true,
  default: ({ searchTerm, categorySlug }: {
    searchTerm?: string;
    categorySlug?: string;
  }) => (
    <div data-testid="products">
      Products - search: {searchTerm}, category: {categorySlug || 'none'}
    </div>
  ),
}));

const mockCategories: Category[] = [
  { slug: 'electronics', name: 'Electronics', url: '/electronics' },
  { slug: 'clothing', name: 'Clothing', url: '/clothing' },
];

describe('BaseDrawer', () => {
  it('renders drawer component', () => {
    const { container } = render(<BaseDrawer />);
    
    const drawer = container.querySelector('.drawer');
    expect(drawer).toBeInTheDocument();
  });

  it('renders drawer toggle checkbox', () => {
    render(<BaseDrawer />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('id', 'my-drawer-2');
  });

  it('renders Products component with correct props', () => {
    render(<BaseDrawer searchTerm="test" categorySlug="electronics" />);
    
    const products = screen.getByTestId('products');
    expect(products).toBeInTheDocument();
    expect(products).toHaveTextContent('Products - search: test, category: electronics');
  });

  it('passes empty string to Products when searchTerm is undefined', () => {
    render(<BaseDrawer />);
    
    const products = screen.getByTestId('products');
    expect(products).toHaveTextContent('Products - search: , category: none');
  });

  it('renders Categories component with correct props', () => {
    render(
      <BaseDrawer
        searchTerm="test"
        categorySlug="electronics"
        categories={mockCategories}
      />
    );
    
    const categories = screen.getByTestId('categories');
    expect(categories).toBeInTheDocument();
    expect(categories).toHaveTextContent('Categories - slug: electronics, search: test, count: 2');
  });

  it('handles undefined categories', () => {
    render(<BaseDrawer />);
    
    const categories = screen.getByTestId('categories');
    expect(categories).toHaveTextContent('count: 0');
  });

  it('passes all props correctly to child components', () => {
    render(
      <BaseDrawer
        searchTerm="laptop"
        categorySlug="electronics"
        categories={mockCategories}
      />
    );
    
    const products = screen.getByTestId('products');
    const categories = screen.getByTestId('categories');
    
    expect(products).toHaveTextContent('laptop');
    expect(products).toHaveTextContent('electronics');
    expect(categories).toHaveTextContent('laptop');
    expect(categories).toHaveTextContent('electronics');
    expect(categories).toHaveTextContent('count: 2');
  });
});


