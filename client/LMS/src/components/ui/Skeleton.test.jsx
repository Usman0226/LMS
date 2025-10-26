import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Skeleton } from './Skeleton'

describe('Skeleton Component', () => {
  it('renders with default styling', () => {
    render(<Skeleton />)

    const skeleton = screen.getByRole('generic') || document.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('animate-pulse', 'bg-gray-200', 'rounded')
  })

  it('applies custom className', () => {
    render(<Skeleton className="w-32 h-8" />)

    const skeleton = document.querySelector('.animate-pulse')
    expect(skeleton).toHaveClass('w-32', 'h-8')
  })

  it('passes through additional props', () => {
    render(<Skeleton data-testid="custom-skeleton" />)

    const skeleton = screen.getByTestId('custom-skeleton')
    expect(skeleton).toBeInTheDocument()
  })
})
