import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="app-header__content">
        <a className="app-header__title" href="/">
          Podcaster
        </a>
      </div>
    </header>
  );
};

export default Header;
