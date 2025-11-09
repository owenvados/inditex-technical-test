import { AppLoadingSpinner } from '@shared/presentation/components/AppLoadingSpinner';
import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

/**
 * Application header featuring the brand link and global loading indicator.
 *
 * @returns Fixed header element displayed on every page.
 */
export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="app-header__content">
        <Link className="app-header__title" to="/">
          Podcaster
        </Link>
        <AppLoadingSpinner className="app-header__spinner" />
      </div>
    </header>
  );
};

export default Header;
