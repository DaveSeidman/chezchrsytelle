import React, { useEffect } from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.svg';
import menuToggle from '../../assets/images/menu-toggle.svg';
import boxImage from '../../assets/images/box2.svg';
import useStore from '../../store';

function Nav(props) {
  // const [open, setOpen] = useState(false);
  const { setMobileMenuOpen, mobileMenuOpen, showLogin, setShowLogin } = props;

  const prefix = location.pathname.indexOf('chez-chrystelle') >= 0 ? 'chez-chrystelle/' : '';

  // TODO: pull from config file?
  const pages = [
    'About',
    'Menu',
    'Catering',
    'Store',
    'Contact',
  ];

  useEffect(() => {
    const { user } = useStore.getState();
    // Sets mobile menu size based on elements
    // TODO: should be possible with only css
    document.documentElement.style.setProperty('--nav-height', `${pages.length * 48}px`);
  }, []);

  return (
    <div className={(`nav ${mobileMenuOpen ? 'open' : ''}`).trim()}>
      <Link className="nav-logo" to={`${prefix}Home`}>
        <img src={logo} alt="logo" />
      </Link>
      <div className="nav-links">
        {
          pages.map(page => (<Link key={page} to={`${prefix}/${page}`}>{page}</Link>))
        }
      </div>
      <button
        type="button"
        className="nav-user"
        onClick={() => { setShowLogin(!showLogin); }}
      >
        <img src={boxImage} />
        <span className="nav-user-order">{ }</span>
      </button>
      <button
        type="button"
        className="nav-toggle"
        onClick={() => {
          setMobileMenuOpen(!mobileMenuOpen);
        }}
      >
        <img src={menuToggle} alt="menu toggle" />
      </button>
    </div>
  );
}

export default Nav;
