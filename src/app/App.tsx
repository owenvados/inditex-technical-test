import Header from '../shared/presentation/components/Header';

const App: React.FC = () => {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-shell__content">
        <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          Coming soon: Music Podcast
        </p>
      </main>
    </div>
  );
};

export default App;
