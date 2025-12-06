import { screen, fireEvent } from '@testing-library/react';
import { useParams, useRouter } from 'next/navigation';
import ProductDetails from '../ProductDetails';
import { Product } from '../../types/product';
import * as api from '../../query/api';
import { renderWithQueryClient } from '../../utils/test-utils';

// Mock Next.js navigation and Image
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

// Mock API
jest.mock('../../query/api', () => ({
  fetchProductDetails: jest.fn(),
}));

const mockRouter = {
  push: jest.fn(),
};

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'This is a test product description',
  price: 99.99,
  thumbnail: 'https://example.com/thumb.jpg',
  rating: 4.5,
  brand: 'Test Brand',
  images: [
    'https://example.com/img1.jpg',
    'https://example.com/img2.jpg',
    'https://example.com/img3.jpg',
  ],
  reviews: [
    {
      comment: 'Great product!',
      rating: 5,
      reviewerEmail: 'reviewer1@example.com',
      reviewerName: 'John Doe',
    },
    {
      comment: 'Not bad',
      rating: 3,
      reviewerEmail: 'reviewer2@example.com',
      reviewerName: 'Jane Smith',
    },
  ],
};

describe('ProductDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('returns null when productId is invalid', () => {
    (useParams as jest.Mock).mockReturnValue({ id: 'invalid' });

    const { container } = renderWithQueryClient(<ProductDetails />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when productId is missing', () => {
    (useParams as jest.Mock).mockReturnValue({});

    const { container } = renderWithQueryClient(<ProductDetails />);
    expect(container.firstChild).toBeNull();
  });

  it('displays loading message when loading', () => {
    (api.fetchProductDetails as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithQueryClient(<ProductDetails />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays error message when query fails', async () => {
    (api.fetchProductDetails as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch')
    );

    renderWithQueryClient(<ProductDetails />);

    const errorMessage = await screen.findByText('Product not found');
    expect(errorMessage).toBeInTheDocument();
  });

  it('displays product details when loaded', async () => {
    (api.fetchProductDetails as jest.Mock).mockResolvedValue(mockProduct);

    renderWithQueryClient(<ProductDetails />);

    expect(await screen.findByText('Test Product')).toBeInTheDocument();
    expect(
      await screen.findByText('This is a test product description')
    ).toBeInTheDocument();
    expect(await screen.findByText('$99.99')).toBeInTheDocument();
    expect(await screen.findByText('Rating: 4.5')).toBeInTheDocument();
    expect(await screen.findByText('Test Brand')).toBeInTheDocument();
  });

  it('displays product thumbnail image', async () => {
    (api.fetchProductDetails as jest.Mock).mockResolvedValue(mockProduct);

    renderWithQueryClient(<ProductDetails />);

    const thumbnail = await screen.findByAltText('Test Product');
    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail).toHaveAttribute('src', 'https://example.com/thumb.jpg');
  });

  it('displays product images', async () => {
    (api.fetchProductDetails as jest.Mock).mockResolvedValue(mockProduct);

    renderWithQueryClient(<ProductDetails />);

    const image1 = await screen.findByAltText('Test Product - Image 1');
    const image2 = await screen.findByAltText('Test Product - Image 2');
    const image3 = await screen.findByAltText('Test Product - Image 3');

    expect(image1).toBeInTheDocument();
    expect(image2).toBeInTheDocument();
    expect(image3).toBeInTheDocument();
  });

  it('displays reviews section when reviews exist', async () => {
    (api.fetchProductDetails as jest.Mock).mockResolvedValue(mockProduct);

    renderWithQueryClient(<ProductDetails />);

    expect(await screen.findByText('Reviews (2)')).toBeInTheDocument();
    expect(await screen.findByText('Great product!')).toBeInTheDocument();
    expect(await screen.findByText('Not bad')).toBeInTheDocument();
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(await screen.findByText('Jane Smith')).toBeInTheDocument();
  });

  it('displays "No reviews yet" when reviews array is empty', async () => {
    const productWithoutReviews = { ...mockProduct, reviews: [] };
    (api.fetchProductDetails as jest.Mock).mockResolvedValue(
      productWithoutReviews
    );

    renderWithQueryClient(<ProductDetails />);

    expect(await screen.findByText('No reviews yet.')).toBeInTheDocument();
  });

  it('navigates back to home when back button is clicked', async () => {
    (api.fetchProductDetails as jest.Mock).mockResolvedValue(mockProduct);

    renderWithQueryClient(<ProductDetails />);

    const backButton = await screen.findByText('← Back');
    fireEvent.click(backButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('handles product without rating', async () => {
    const productWithoutRating = { ...mockProduct, rating: undefined };
    (api.fetchProductDetails as jest.Mock).mockResolvedValue(
      productWithoutRating
    );

    renderWithQueryClient(<ProductDetails />);

    await screen.findByText('Test Product');
    expect(screen.queryByText(/Rating:/)).not.toBeInTheDocument();
  });

  it('handles product without brand', async () => {
    const productWithoutBrand = { ...mockProduct, brand: undefined };
    (api.fetchProductDetails as jest.Mock).mockResolvedValue(
      productWithoutBrand
    );

    renderWithQueryClient(<ProductDetails />);

    await screen.findByText('Test Product');
    expect(screen.queryByText('Test Brand')).not.toBeInTheDocument();
  });

  it('limits displayed images to 8', async () => {
    const productWithManyImages = {
      ...mockProduct,
      images: Array.from({ length: 10 }, (_, i) => `img${i}.jpg`),
    };
    (api.fetchProductDetails as jest.Mock).mockResolvedValue(
      productWithManyImages
    );

    renderWithQueryClient(<ProductDetails />);

    await screen.findByText('Test Product');
    const images = screen.getAllByAltText(/Test Product - Image/);
    expect(images.length).toBe(8);
  });

  it('limits displayed reviews to 10', async () => {
    const productWithManyReviews = {
      ...mockProduct,
      reviews: Array.from({ length: 15 }, (_, i) => ({
        comment: `Review ${i}`,
        rating: 4,
        reviewerEmail: `reviewer${i}@example.com`,
        reviewerName: `Reviewer ${i}`,
      })),
    };
    (api.fetchProductDetails as jest.Mock).mockResolvedValue(
      productWithManyReviews
    );

    renderWithQueryClient(<ProductDetails />);

    expect(await screen.findByText('Reviews (15)')).toBeInTheDocument();
    const reviewComments = screen.getAllByText(/Review \d+/);
    expect(reviewComments.length).toBe(10);
  });
});

