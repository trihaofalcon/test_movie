import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    const baseStyles = 'w-full rounded-lg bg-zinc-800 px-4 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';
    const errorStyles = error ? 'ring-2 ring-red-500' : '';
    
    return (
      <div className="flex flex-1 flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${errorStyles} ${className}`}
          {...props}
        />
        {error && (
          <span className="text-sm text-red-400">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
