import { NavLink } from 'react-router-dom';
import BrandMark from '../Common/BrandMark';

function Header({ app }) {
  if (!app.loggedIn) return null;

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <BrandMark />
        <nav className="app-nav" aria-label="Primary">
          <NavLink className={({ isActive }) => `app-nav__item ${isActive || app.navDisc ? 'app-nav__item--active' : ''}`} to="/discover">Discover</NavLink>
          <NavLink className={({ isActive }) => `app-nav__item ${isActive || app.navCol ? 'app-nav__item--active' : ''}`} to="/collections">Collections</NavLink>
        </nav>
        <div className="user-menu">
          <button className="user-menu__trigger" type="button" onClick={app.toggleUserMenu}>
            <span>Mayathunnadase</span>
            <span className="avatar avatar--dark">M</span>
          </button>
          {app.userMenuOpen ? (
            <>
              <button className="menu-scrim" type="button" aria-label="Close user menu" onClick={app.closeUserMenu} />
              <div className="user-menu__panel">
                <div className="user-menu__profile">
                  <span className="avatar avatar--dark">M</span>
                  <span><b title="Mayathisisfortes Chenisfortest">Mayathisisfortes Chenisfortest</b><small>MAS Account</small></span>
                  <div className="theme-toggle" aria-label="Theme">
                    <button className={!app.isDarkTheme ? 'active' : ''} type="button" onClick={() => app.setTheme('light')} aria-label="Use light mode" title="Light mode">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
                    </button>
                    <button className={app.isDarkTheme ? 'active' : ''} type="button" onClick={() => app.setTheme('dark')} aria-label="Use dark mode" title="Dark mode">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 13.3A8 8 0 1 1 10.7 3a6.2 6.2 0 0 0 10.3 10.3Z" /></svg>
                    </button>
                  </div>
                </div>
                <button className="user-menu__logout" type="button" onClick={app.logout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>
                  Log out
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;
