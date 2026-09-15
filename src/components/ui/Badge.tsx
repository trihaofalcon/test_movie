import { HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium';
    
    const variantStyles = {
      default: 'bg-zinc-800 text-zinc-300',
      secondary: 'bg-zinc-700 text-zinc-200',
      success: 'bg-green-900/50 text-green-200',
      warning: 'bg-yellow-900/50 text-yellow-200',
      error: 'bg-red-900/50 text-red-200'
    };
    
    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
