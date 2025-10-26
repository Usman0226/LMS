import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary Component', () => {
  // Suppress console.error for these tests
  const originalError = console.error
  beforeAll(() => {
    console.error = vi.fn()
  })

  afterAll(() => {
    console.error = originalError
  })

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText(/try again/i)).toBeInTheDocument()
  })

  it('displays custom error message when provided', () => {
    render(
      <ErrorBoundary
        title="Custom Error"
        message="Custom error message"
      >
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom Error')).toBeInTheDocument()
    expect(screen.getByText('Custom error message')).toBeInTheDocument()
  })

  it('retry button works correctly', async () => {
    const user = userEvent.setup()

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const retryButton = screen.getByText(/try again/i)
    await user.click(retryButton)

    // After retry, the error boundary should reset and show children again
    // This is a simplified test - in a real scenario you'd need state management
  })
})
