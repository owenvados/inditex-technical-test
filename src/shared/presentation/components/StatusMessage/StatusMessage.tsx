import React from 'react';

import './StatusMessage.css';

/**
 * Props for the `StatusMessage` component.
 */
export interface StatusMessageProps {
  message: string;
  children?: React.ReactNode;
  className?: string;
  dataTestId?: string;
}

/**
 * Generic placeholder used to render empty, loading, or error states.
 */
export const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  children,
  className,
  dataTestId,
}) => {
  const containerClassName = ['status-message', className].filter(Boolean).join(' ');

  return (
    <div className={containerClassName} data-testid={dataTestId}>
      <span className="status-message__text">{message}</span>
      {children ? <div className="status-message__content">{children}</div> : null}
    </div>
  );
};

StatusMessage.displayName = 'StatusMessage';

export default StatusMessage;
