import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider shadow-brand-black/20 shadow-lg rounded-xl',
  {
    variants: {
      variant: {
        primary: 'bg-brand-black text-brand-white hover:bg-brand-black/90',
        outline: 'border border-brand-black bg-transparent hover:bg-brand-black hover:text-brand-white',
        secondary: 'bg-brand-gray-light text-brand-black hover:bg-brand-gray',
        ghost: 'hover:bg-brand-gray-light hover:text-brand-black',
        link: 'text-brand-yellow underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-14 px-6 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-16 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  to?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, to, ...props }, ref) => {
    if (asChild && to) {
      return (
        <Link to={to} className={cn(buttonVariants({ variant, size }), className)} {...props} />
      );
    }

    const Comp = asChild ? 'span' : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
