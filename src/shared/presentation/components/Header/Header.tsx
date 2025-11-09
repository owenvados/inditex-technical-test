import { AppLoadingSpinner } from '@shared/presentation/components/AppLoadingSpinner';
import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

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
