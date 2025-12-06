import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import QueryProvider from '../providers';

// Mock QueryClientProvider to verify it's being used
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn().mockImplementation(() => ({
    getQueryData: jest.fn(),
    setQueryData: jest.fn(),
    invalidateQueries: jest.fn(),
  })),
  QueryClientProvider: jest.fn(({ children }) => <div data-testid="query-provider">{children}</div>),
}));

describe('QueryProvider', () => {
  it('renders children', () => {
    render(
      <QueryProvider>
        <div data-testid="child">Test Child</div>
      </QueryProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('wraps children with QueryClientProvider', () => {
    render(
      <QueryProvider>
        <div data-testid="child">Test Child</div>
      </QueryProvider>
    );

    expect(screen.getByTestId('query-provider')).toBeInTheDocument();
  });

  it('creates a new QueryClient instance', () => {
    render(
      <QueryProvider>
        <div>Test</div>
      </QueryProvider>
    );

    expect(QueryClient).toHaveBeenCalled();
  });

  it('renders multiple children', () => {
    render(
      <QueryProvider>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </QueryProvider>
    );

    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });
});

