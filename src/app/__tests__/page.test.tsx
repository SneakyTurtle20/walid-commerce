import { render, screen } from '@testing-library/react';
import Home from '../page';
import * as api from '../../query/api';

// Type helper for searchParams - Next.js 15 uses Promise<SearchParams>
type SearchParams = {
  q?: string;
  category?: string;
  sortBy?: string;
  order?: string;
  page?: string;
};

// Helper to create searchParams for tests
const createSearchParams = (params: SearchParams): Promise<SearchParams> => Promise.resolve(params);

// Mock child components
jest.mock('../../components/BaseNavbarSearch', () => ({
  __esModule: true,
  default: ({ hideControls }: { hideControls: boolean }) => (
    <div data-testid="navbar-search">Navbar Search - hideControls: {String(hideControls)}</div>
  ),
}));

jest.mock('src/components/BaseDrawer', () => ({
  __esModule: true,
  default: ({
    searchTerm,
    categorySlug,
    categories,
  }: {
    searchTerm?: string;
    categorySlug?: string;
    categories?: unknown[];
  }) => (
    <div data-testid="base-drawer">
      Drawer - search: {searchTerm || 'none'}, category: {categorySlug || 'none'}, categories: {categories?.length || 0}
    </div>
  ),
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
jest.mock('../../query/api', () => ({
  fetchProducts: jest.fn(),
  fetchCategories: jest.fn(),
}));

const mockCategories = [
  { slug: 'electronics', name: 'Electronics', url: '/electronics' },
  { slug: 'clothing', name: 'Clothing', url: '/clothing' },
];

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.fetchProducts as jest.Mock).mockResolvedValue({
      products: [],
      total: 0,
    });
    (api.fetchCategories as jest.Mock).mockResolvedValue(mockCategories);
  });

  it('renders BaseNavbarSearch with hideControls false', async () => {
    const searchParams: SearchParams = {};
    const page = await Home({ searchParams: createSearchParams(searchParams) } as Parameters<typeof Home>[0]);

    render(page);

    expect(screen.getByTestId('navbar-search')).toBeInTheDocument();
    expect(screen.getByText(/hideControls: false/)).toBeInTheDocument();
  });

  it('renders BaseDrawer component', async () => {
    const searchParams: SearchParams = {};
    const page = await Home({ searchParams: createSearchParams(searchParams) } as Parameters<typeof Home>[0]);

    render(page);

    expect(screen.getByTestId('base-drawer')).toBeInTheDocument();
  });

  it('passes searchTerm to BaseDrawer when provided', async () => {
    const searchParams: SearchParams = { q: 'laptop' };
    const page = await Home({ searchParams: createSearchParams(searchParams) } as Parameters<typeof Home>[0]);

    render(page);

    expect(screen.getByText(/search: laptop/)).toBeInTheDocument();
  });

  it('passes categorySlug to BaseDrawer when provided', async () => {
    const searchParams: SearchParams = { category: 'electronics' };
    const page = await Home({ searchParams: createSearchParams(searchParams) } as Parameters<typeof Home>[0]);

    render(page);

    expect(screen.getByText(/category: electronics/)).toBeInTheDocument();
  });

  it('passes categories to BaseDrawer', async () => {
    const searchParams: SearchParams = {};
    const page = await Home({ searchParams: createSearchParams(searchParams) } as Parameters<typeof Home>[0]);

    render(page);

    expect(screen.getByText(/categories: 2/)).toBeInTheDocument();
  });

  it('handles multiple search params', async () => {
    const searchParams: SearchParams = {
      q: 'laptop',
      category: 'electronics',
      sortBy: 'price',
      order: 'asc',
      page: '2',
    };
    const page = await Home({ searchParams: createSearchParams(searchParams) } as Parameters<typeof Home>[0]);

    render(page);

    expect(screen.getByText(/search: laptop/)).toBeInTheDocument();
    expect(screen.getByText(/category: electronics/)).toBeInTheDocument();
  });

  it('prefetches products query', async () => {
    const searchParams: SearchParams = { q: 'laptop' };
    await Home({ searchParams: createSearchParams(searchParams) } as Parameters<typeof Home>[0]);

    expect(api.fetchProducts).toHaveBeenCalledWith(
      'laptop',
      undefined,
      undefined,
      undefined,
      1,
      10
    );
  });

  it('prefetches products with category', async () => {
    const searchParams: SearchParams = { category: 'electronics' };
    await Home({ searchParams: createSearchParams(searchParams) } as Parameters<typeof Home>[0]);

    expect(api.fetchProducts).toHaveBeenCalledWith(
      undefined,
      'electronics',
      undefined,
      undefined,
      1,
      10
    );
  });

  it('prefetches products with sortBy and order', async () => {
    const searchParams: SearchParams = {
      sortBy: 'price',
      order: 'asc',
    };
    await Home({ searchParams: createSearchParams(searchParams) } as Parameters<typeof Home>[0]);

    expect(api.fetchProducts).toHaveBeenCalledWith(
      undefined,
      undefined,
      'price',
      'asc',
      1,
      10
    );
  });

  it('handles page parameter correctly', async () => {
    const searchParams: SearchParams = { page: '3' };
    await Home({ searchParams: createSearchParams(searchParams) } as Parameters<typeof Home>[0]);

    expect(api.fetchProducts).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      undefined,
      3,
      10
    );
  });

  it('defaults to page 1 when page is invalid', async () => {
    const searchParams: SearchParams = { page: 'invalid' };
    await Home({ searchParams: createSearchParams(searchParams) } as Parameters<typeof Home>[0]);

    expect(api.fetchProducts).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      undefined,
      1,
      10
    );
  });

  it('defaults to page 1 when page is less than 1', async () => {
    const searchParams: SearchParams = { page: '0' };
    await Home({ searchParams: createSearchParams(searchParams) } as Parameters<typeof Home>[0]);

    expect(api.fetchProducts).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      undefined,
      1,
      10
    );
  });

  it('fetches categories', async () => {
    const searchParams: SearchParams = {};
    await Home({ searchParams: createSearchParams(searchParams) } as Parameters<typeof Home>[0]);

    expect(api.fetchCategories).toHaveBeenCalled();
  });

  it('wraps content in HydrationBoundary', async () => {
    const searchParams: SearchParams = {};
    const page = await Home({ searchParams: createSearchParams(searchParams) } as Parameters<typeof Home>[0]);

    render(page);

    expect(screen.getByTestId('hydration-boundary')).toBeInTheDocument();
  });
});

