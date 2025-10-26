import { describe, it, expect } from 'vitest'
import { render, screen } from '../test/test-utils'
import { EmptyState } from '../components/ui/Skeleton'

describe('EmptyState Component', () => {
  it('renders with default props', () => {
    render(<EmptyState />)

    expect(screen.getByText('No items found')).toBeInTheDocument()
    expect(screen.getByText('There are no items to display at the moment.')).toBeInTheDocument()
  })

  it('displays custom title and description', () => {
    render(
      <EmptyState
        title="No courses available"
        description="Check back later for new courses"
      />
    )

    expect(screen.getByText('No courses available')).toBeInTheDocument()
    expect(screen.getByText('Check back later for new courses')).toBeInTheDocument()
  })

  it('renders action button when actionText and onAction provided', () => {
    const handleAction = vi.fn()

    render(
      <EmptyState
        title="No assignments"
        actionText="Create Assignment"
        onAction={handleAction}
      />
    )

    const button = screen.getByRole('button', { name: /create assignment/i })
    expect(button).toBeInTheDocument()
  })

  it('renders custom icon when provided', () => {
    const CustomIcon = () => <div data-testid="custom-icon">📚</div>

    render(
      <EmptyState
        icon={CustomIcon}
        title="Custom Icon Test"
      />
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <EmptyState
        className="custom-empty-state"
        title="Custom Class Test"
      />
    )

    const container = screen.getByText('Custom Class Test').closest('.custom-empty-state')
    expect(container).toHaveClass('custom-empty-state')
  })
})
