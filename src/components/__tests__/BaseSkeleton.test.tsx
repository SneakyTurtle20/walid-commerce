import { render } from '@testing-library/react';
import BaseSkeleton from '../BaseSkeleton';

describe('BaseSkeleton', () => {
  it('renders loading spinner', () => {
    const { container } = render(<BaseSkeleton />);
    
    const spinner = container.querySelector('.loading.loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('loading', 'loading-spinner', 'loading-xl');
  });

  it('has correct container classes', () => {
    const { container } = render(<BaseSkeleton />);
    
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(
      'min-h-[50vh]',
      'flex',
      'items-center',
      'justify-center',
      'w-full',
      'flex-col',
      'gap-4'
    );
  });

  it('renders without crashing', () => {
    const { container } = render(<BaseSkeleton />);
    expect(container).toBeInTheDocument();
  });
});

