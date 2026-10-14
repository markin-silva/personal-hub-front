import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button component', () => {
  it('should render the button with correct text', () => {
    render(<Button>Start Workout</Button>)

    const button = screen.getByRole('button', { name: /start workout/i })
    expect(button).toBeInTheDocument()
  })

  it('should call onClick callback when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click Here</Button>)

    const button = screen.getByRole('button', { name: /click here/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
