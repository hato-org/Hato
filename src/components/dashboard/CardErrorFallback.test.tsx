import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import CardErrorFallback from '@/components/dashboard/CardErrorFallback';

const defaultProps = {
  error: new Error('テストエラー'),
  resetErrorBoundary: vi.fn(),
};

describe('CardErrorFallback', () => {
  it('renders the error message from the error prop', () => {
    renderWithProviders(<CardErrorFallback {...defaultProps} />);
    expect(screen.getByText('テストエラー')).toBeInTheDocument();
  });

  it('renders the fixed error text', () => {
    renderWithProviders(<CardErrorFallback {...defaultProps} />);
    expect(
      screen.getByText('カードの表示中にエラーが発生しました'),
    ).toBeInTheDocument();
  });

  it('renders the retry button', () => {
    renderWithProviders(<CardErrorFallback {...defaultProps} />);
    expect(screen.getByText('再試行')).toBeInTheDocument();
  });

  it('calls resetErrorBoundary when the retry button is clicked', () => {
    const resetErrorBoundary = vi.fn();
    renderWithProviders(
      <CardErrorFallback
        {...defaultProps}
        resetErrorBoundary={resetErrorBoundary}
      />,
    );
    fireEvent.click(screen.getByText('再試行'));
    expect(resetErrorBoundary).toHaveBeenCalledOnce();
  });
});
