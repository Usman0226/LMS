import React from 'react';
import { cva } from 'class-variance-authority';

const inputVariants = cva(
  'flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-red-500 text-red-900 placeholder-red-300 focus-visible:border-red-500 focus-visible:ring-red-500',
        success: 'border-green-500 text-green-900 placeholder-green-300 focus-visible:border-green-500 focus-visible:ring-green-500',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        md: 'h-10 px-3 py-2 text-sm',
        lg: 'h-12 px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const Input = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <input
      className={inputVariants({ variant, size, className })}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input, inputVariants };
