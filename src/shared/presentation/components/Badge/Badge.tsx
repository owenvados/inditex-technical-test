import React from 'react';

import './Badge.css';

export interface BadgeProps {
  count: number;
  className?: string;
  dataTestId?: string;
}

/**
 * Badge component that displays a numeric count in a styled pill.
 * Used for displaying counts, notifications, or status indicators.
 *
 * @param props Component props containing count value and optional styling.
 * @returns Badge element displaying the count.
 */
export const Badge: React.FC<BadgeProps> = ({ count, className, dataTestId }) => {
  const containerClass = ['badge', className].filter(Boolean).join(' ');

  return (
    <span className={containerClass} data-testid={dataTestId}>
      {count}
    </span>
  );
};

Badge.displayName = 'Badge';

export default Badge;
