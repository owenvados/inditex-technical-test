import { buildHomeRoute } from '@core/router/routes';
import React from 'react';
import { Link } from 'react-router-dom';

import './NotFoundPage.css';

/**
 * Page component displayed when a route is not found (404 error).
 * Provides a link back to the home page.
 *
 * @returns NotFound page component with error message and navigation link.
 */
export const NotFoundPage: React.FC = () => {
  return (
    <section className="not-found-page" data-testid="not-found-page">
      <div className="not-found-page__content">
        <h1 className="not-found-page__title">404</h1>
        <p className="not-found-page__message">Page not found</p>
        <p className="not-found-page__description">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to={buildHomeRoute()} className="not-found-page__link">
          Go back to home
        </Link>
      </div>
    </section>
  );
};

NotFoundPage.displayName = 'NotFoundPage';

export default NotFoundPage;
