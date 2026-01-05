import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'small';
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      label,
      error,
      helperText,
      variant = 'default',
      fullWidth = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(7)}`;

    const baseStyles =
      'border rounded transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      default: 'px-3 py-2 text-base',
      small: 'px-2 py-1.5 text-sm',
    };

    const stateStyles = error
      ? 'border-red-300 focus:ring-2 focus:ring-red-500'
      : 'border-gray-300 focus:ring-2 focus:ring-blue-500';

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block font-medium text-gray-700 mb-1 ${
              variant === 'small' ? 'text-xs' : 'text-sm'
            }`}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${baseStyles} ${variantStyles[variant]} ${stateStyles} ${widthStyles} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
