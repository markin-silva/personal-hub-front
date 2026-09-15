import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'w-full font-semibold py-2.5 px-4 rounded-lg transition-colors cursor-pointer text-sm flex items-center justify-center gap-2'

  const variants = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-slate-950',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
