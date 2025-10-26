import React from 'react';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
        secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus-visible:ring-gray-200',
        outline: 'border border-gray-200 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-200',
        ghost: 'bg-transparent hover:bg-gray-100 focus-visible:ring-gray-200',
        link: 'bg-transparent text-primary-600 hover:underline hover:text-primary-700 focus-visible:ring-primary-200',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 py-2',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const Button = React.forwardRef(({
  className,
  variant,
  size,
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  ...props
}, ref) => {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      ref={ref}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {LeftIcon && <LeftIcon className="mr-2 h-4 w-4" />}
      {children}
      {RightIcon && <RightIcon className="ml-2 h-4 w-4" />}
    </button>
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
