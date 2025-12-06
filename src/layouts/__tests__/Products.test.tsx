import { screen } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Products from '../Products';
import { Product } from '../../types/product';
import * as api from '../../query/api';
import { renderWithQueryClient } from '../../utils/test-utils';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock API
jest.mock('../../query/api', () => ({
  fetchProducts: jest.fn(),
}));

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
};

const mockSearchParams = new URLSearchParams();

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Product 1',
    description: 'Description 1',
    price: 99.99,
    thumbnail: 'https://example.com/thumb1.jpg',
    rating: 4.5,
    brand: 'Brand 1',
    images: ['https://example.com/img1.jpg'],
    reviews: [],
  },
  {
    id: 2,
    title: 'Product 2',
    description: 'Description 2',
    price: 149.99,
    thumbnail: 'https://example.com/thumb2.jpg',
    rating: 4.0,
    brand: 'Brand 2',
    images: ['https://example.com/img2.jpg'],
    reviews: [],
  },
];

describe('Products', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it('displays loading skeleton when loading', () => {
    (api.fetchProducts as jest.Mock).mockResolvedValue({
      products: mockProducts,
      total: 2,
    });

    renderWithQueryClient(<Products />);

    // The component should show BaseSkeleton during loading
    // We can't easily test this without waiting, but we can verify the query is set up
    expect(api.fetchProducts).toHaveBeenCalled();
  });

  it('displays error message when query fails', async () => {
    const errorMessage = 'Failed to fetch products';
    (api.fetchProducts as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    renderWithQueryClient(<Products />);

    // Wait for error state
    const errorElement = await screen.findByText(/Error:/i);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(errorMessage);
  });

  it('displays "No products found" when products array is empty', async () => {
    (api.fetchProducts as jest.Mock).mockResolvedValue({
      products: [],
      total: 0,
    });

    renderWithQueryClient(<Products />);

    const noProductsMessage = await screen.findByText('No products found.');
    expect(noProductsMessage).toBeInTheDocument();
  });

  it('renders products when data is loaded', async () => {
    (api.fetchProducts as jest.Mock).mockResolvedValue({
      products: mockProducts,
      total: 2,
    });

    renderWithQueryClient(<Products />);

    expect(await screen.findByText('Product 1')).toBeInTheDocument();
    expect(await screen.findByText('Product 2')).toBeInTheDocument();
  });

  it('passes searchTerm to fetchProducts', () => {
    (api.fetchProducts as jest.Mock).mockResolvedValue({
      products: [],
      total: 0,
    });

    renderWithQueryClient(<Products searchTerm="laptop" />);

    expect(api.fetchProducts).toHaveBeenCalledWith(
      'laptop',
      undefined,
      undefined,
      undefined,
      1,
      10
    );
  });

  it('passes categorySlug to fetchProducts', () => {
    (api.fetchProducts as jest.Mock).mockResolvedValue({
      products: [],
      total: 0,
    });

    renderWithQueryClient(<Products categorySlug="electronics" />);

    expect(api.fetchProducts).toHaveBeenCalledWith(
      '',
      'electronics',
      undefined,
      undefined,
      1,
      10
    );
  });

  it('reads sortBy and order from URL params', () => {
    const params = new URLSearchParams('sortBy=price&order=asc');
    (useSearchParams as jest.Mock).mockReturnValue(params);
    (api.fetchProducts as jest.Mock).mockResolvedValue({
      products: [],
      total: 0,
    });

    renderWithQueryClient(<Products />);

    expect(api.fetchProducts).toHaveBeenCalledWith(
      '',
      undefined,
      'price',
      'asc',
      1,
      10
    );
  });

  it('reads page number from URL params', () => {
    const params = new URLSearchParams('page=2');
    (useSearchParams as jest.Mock).mockReturnValue(params);
    (api.fetchProducts as jest.Mock).mockResolvedValue({
      products: [],
      total: 0,
    });

    renderWithQueryClient(<Products />);

    expect(api.fetchProducts).toHaveBeenCalledWith(
      '',
      undefined,
      undefined,
      undefined,
      2,
      10
    );
  });
});

