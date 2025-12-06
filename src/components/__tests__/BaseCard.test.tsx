import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import BaseCard from '../BaseCard';
import { Product } from '../../types/product';

// Mock Next.js navigation and Image
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockRouter = {
  push: jest.fn(),
};

const mockSearchParams = new URLSearchParams();

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'This is a test product description',
  price: 99.99,
  thumbnail: 'https://example.com/image.jpg',
  rating: 4.5,
  brand: 'Test Brand',
  images: ['https://example.com/image1.jpg'],
  reviews: [],
};

describe('BaseCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it('renders product information', () => {
    render(<BaseCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('This is a test product description')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('displays product image with correct alt text', () => {
    render(<BaseCard product={mockProduct} />);
    
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders See Details button', () => {
    render(<BaseCard product={mockProduct} />);
    
    const button = screen.getByText('See Details');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn', 'btn-primary');
  });

  it('navigates to product details page when button is clicked', () => {
    render(<BaseCard product={mockProduct} />);
    
    const button = screen.getByText('See Details');
    fireEvent.click(button);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/product/1');
  });

  it('clears search params when navigating to details', () => {
    const params = new URLSearchParams('page=2&category=electronics');
    (useSearchParams as jest.Mock).mockReturnValue(params);
    
    render(<BaseCard product={mockProduct} />);
    
    const button = screen.getByText('See Details');
    fireEvent.click(button);
    
    // Should navigate to product page (params are cleared in the component)
    expect(mockRouter.push).toHaveBeenCalledWith('/product/1');
  });
});


