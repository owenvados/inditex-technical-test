import { SWRProvider } from '@core/providers/SWRProvider';
import AppRouter from '@core/router/AppRouter';
import { LoadingStateProvider } from '@shared/hooks/useLoadingState';
import Header from '@shared/presentation/components/Header';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Root application shell responsible for wiring global providers and layout.
 *
 * @returns {JSX.Element} The application layout containing the header and routed content.
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SWRProvider>
        <LoadingStateProvider>
          <div className="app-container">
            <Header />
            <main className="app-container__content">
              <AppRouter />
            </main>
          </div>
        </LoadingStateProvider>
      </SWRProvider>
    </BrowserRouter>
  );
};

export default App;
