import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../components/ui/Button'

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="secondary">Secondary Button</Button>)

    const button = screen.getByRole('button', { name: /secondary button/i })
    expect(button).toHaveClass('bg-gray-600', 'hover:bg-gray-700')
  })

  it('applies size classes correctly', () => {
    render(<Button size="sm">Small Button</Button>)

    const button = screen.getByRole('button', { name: /small button/i })
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)

    const button = screen.getByRole('button', { name: /disabled button/i })
    expect(button).toBeDisabled()
  })
})
