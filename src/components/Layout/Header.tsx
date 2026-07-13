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
            <span>Maya</span>
            <span className="avatar avatar--dark">M</span>
          </button>
          {app.userMenuOpen ? (
            <>
              <button className="menu-scrim" type="button" aria-label="Close user menu" onClick={app.closeUserMenu} />
              <div className="user-menu__panel">
                <div className="user-menu__profile">
                  <span className="avatar avatar--dark">M</span>
                  <span><b>Maya Chen</b><small>MAS Account</small></span>
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
