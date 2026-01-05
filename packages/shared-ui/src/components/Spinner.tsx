import React from 'react';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'current';
  label?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  label = 'Loading...',
  className = '',
}) => {
  const sizeStyles = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
    xl: 'w-12 h-12 border-4',
  };

  const colorStyles = {
    primary: 'border-blue-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    current: 'border-current border-t-transparent',
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className={`${sizeStyles[size]} ${colorStyles[color]} rounded-full animate-spin`}
        role="status"
        aria-label={label}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

Spinner.displayName = 'Spinner';

export interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinnerSize?: SpinnerProps['size'];
  message?: string;
  blur?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  spinnerSize = 'lg',
  message,
  blur = true,
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className={`flex flex-col items-center gap-3 ${blur ? 'backdrop-blur-sm' : ''}`}>
            <Spinner size={spinnerSize} color="primary" />
            {message && <p className="text-sm font-medium text-gray-700">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

LoadingOverlay.displayName = 'LoadingOverlay';

export interface FullPageSpinnerProps {
  message?: string;
  spinnerSize?: SpinnerProps['size'];
}

export const FullPageSpinner: React.FC<FullPageSpinnerProps> = ({
  message = 'Loading...',
  spinnerSize = 'xl',
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Spinner size={spinnerSize} color="primary" />
        <p className="text-lg font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
};

FullPageSpinner.displayName = 'FullPageSpinner';
