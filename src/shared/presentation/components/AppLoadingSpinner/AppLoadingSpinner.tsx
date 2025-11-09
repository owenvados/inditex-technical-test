import { useLoadingState } from '@shared/hooks/useLoadingState';
import React from 'react';

import './AppLoadingSpinner.css';

/**
 * Props for the `AppLoadingSpinner` component.
 */
export interface AppLoadingSpinnerProps {
  className?: string;
  dataTestId?: string;
}

/**
 * Global loading spinner displayed while the application is performing background work.
 *
 * @param props Additional styling and testing helpers.
 * @returns Spinner element when the application is loading, otherwise `null`.
 */
export const AppLoadingSpinner: React.FC<AppLoadingSpinnerProps> = ({ className, dataTestId }) => {
  const { isLoading } = useLoadingState();

  if (!isLoading) {
    return null;
  }

  const containerClass = ['app-loading-spinner', className].filter(Boolean).join(' ');
  const testId = dataTestId ?? 'app-loading-spinner';

  return (
    <div
      className={containerClass}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      data-testid={testId}
    >
      <span className="app-loading-spinner__icon" />
    </div>
  );
};

AppLoadingSpinner.displayName = 'AppLoadingSpinner';

export default AppLoadingSpinner;
