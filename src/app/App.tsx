import Header from '@shared/presentation/components/Header';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AppRouter from './router/AppRouter';

/**
 * Root application shell responsible for wiring global providers and layout.
 *
 * @returns {JSX.Element} The application layout containing the header and routed content.
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main className="app-container__content">
          <AppRouter />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
