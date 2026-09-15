import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button component', () => {
  it('should render the button with correct text', () => {
    render(<Button>Iniciar Treino</Button>)

    const button = screen.getByRole('button', { name: /iniciar treino/i })
    expect(button).toBeInTheDocument()
  })

  it('should call onClick callback when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Clique Aqui</Button>)

    const button = screen.getByRole('button', { name: /clique aqui/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
