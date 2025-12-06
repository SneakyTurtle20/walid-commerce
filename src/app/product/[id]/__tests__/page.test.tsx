import { render, screen } from '@testing-library/react';
import ProductPage from '../page';
import * as api from '../../../../query/api';

// Mock child components
jest.mock('src/components/BaseNavbarSearch', () => ({
  __esModule: true,
  default: ({ hideControls }: { hideControls: boolean }) => (
    <div data-testid="navbar-search">Navbar Search - hideControls: {String(hideControls)}</div>
  ),
}));

jest.mock('src/layouts/ProductDetails', () => ({
  __esModule: true,
  default: () => <div data-testid="product-details">Product Details</div>,
}));

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn().mockImplementation(() => ({
    prefetchQuery: jest.fn(async (options) => {
      if (options.queryFn) {
        await options.queryFn();
      }
      return undefined;
    }),
  })),
  dehydrate: jest.fn(() => ({ queries: [] })),
  HydrationBoundary: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="hydration-boundary">{children}</div>
  ),
}));

// Mock API functions
jest.mock('../../../../query/api', () => ({
  fetchProductDetails: jest.fn(),
}));

const mockProduct = {
  id: 1,
  title: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  thumbnail: 'https://example.com/image.jpg',
  rating: 4.5,
  brand: 'Test Brand',
  images: [],
  reviews: [],
};

describe('ProductPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.fetchProductDetails as jest.Mock).mockResolvedValue(mockProduct);
  });

  it('renders BaseNavbarSearch with hideControls true', async () => {
    const params = { id: '1' };
    const page = await ProductPage({ params });

    render(page);

    expect(screen.getByTestId('navbar-search')).toBeInTheDocument();
    expect(screen.getByText(/hideControls: true/)).toBeInTheDocument();
  });

  it('renders ProductDetails component', async () => {
    const params = { id: '1' };
    const page = await ProductPage({ params });

    render(page);

    expect(screen.getByTestId('product-details')).toBeInTheDocument();
  });

  it('prefetches product details with correct id', async () => {
    const params = { id: '123' };
    await ProductPage({ params });

    expect(api.fetchProductDetails).toHaveBeenCalledWith(123);
  });

  it('handles valid product ID', async () => {
    const params = { id: '42' };
    const page = await ProductPage({ params });

    render(page);

    expect(screen.getByTestId('product-details')).toBeInTheDocument();
    expect(api.fetchProductDetails).toHaveBeenCalledWith(42);
  });

  it('displays error message for invalid product ID', async () => {
    const params = { id: 'invalid' };
    const page = await ProductPage({ params });

    render(page);

    expect(screen.getByText('Invalid product ID')).toBeInTheDocument();
    expect(screen.queryByTestId('product-details')).not.toBeInTheDocument();
  });

  it('displays error message for non-numeric product ID', async () => {
    const params = { id: 'abc123' };
    const page = await ProductPage({ params });

    render(page);

    expect(screen.getByText('Invalid product ID')).toBeInTheDocument();
  });

  it('handles negative product ID (treated as valid by parseInt)', async () => {
    const params = { id: '-1' };
    const page = await ProductPage({ params });

    render(page);

    // parseInt('-1', 10) returns -1, which is finite, so it's treated as valid
    expect(screen.getByTestId('product-details')).toBeInTheDocument();
    expect(api.fetchProductDetails).toHaveBeenCalledWith(-1);
  });

  it('handles zero product ID (treated as valid by parseInt)', async () => {
    const params = { id: '0' };
    const page = await ProductPage({ params });

    render(page);

    // parseInt('0', 10) returns 0, which is finite, so it's treated as valid
    expect(screen.getByTestId('product-details')).toBeInTheDocument();
    expect(api.fetchProductDetails).toHaveBeenCalledWith(0);
  });

  it('wraps content in HydrationBoundary', async () => {
    const params = { id: '1' };
    const page = await ProductPage({ params });

    render(page);

    expect(screen.getByTestId('hydration-boundary')).toBeInTheDocument();
  });

  it('does not prefetch when product ID is invalid', async () => {
    const params = { id: 'invalid' };
    await ProductPage({ params });

    expect(api.fetchProductDetails).not.toHaveBeenCalled();
  });
});

