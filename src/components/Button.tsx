import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn.js';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn('fds-button', `fds-button--${variant}`, className)} {...props} />;
}
