import React, { useEffect, useState, useRef, StrictMode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import Nav from './components/Nav';
import Login from './components/Login';
import Home from './views/Home';
import About from './views/About';
import Menu from './views/Menu';
import Catering from './views/Catering';
import Store from './views/Store';
import Contact from './views/Contact';
import Order from './views/Order';
import Values from './views/Values';
import User from './views/User';
import Admin from './views/Admin';
import Footer from './components/Footer';
import './index.scss';
import { api } from './utils';
import 'react-toastify/dist/ReactToastify.css';
import useStore from './store';

let autoScroll = false;
// gets the last part of the URL
// TODO: replace with the first part of the URL unless the URL starts with "/chez-chrsytelle/"
const getPage = () => location.pathname.split('/')[location.pathname.split('/').length - 1].toLowerCase();
const toTitleCase = str => str.toLowerCase().split(' ').map(word => (word.charAt(0).toUpperCase() + word.slice(1))).join(' ');

function Scroll(props) {
  const { setMobileMenuOpen } = props;
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    if (location.pathname === '/' || location.pathname === '/chez-chrystelle/' || location.pathname.indexOf('/admin') >= 0) {
      return;
    }
    const page = document.querySelector(`#${getPage()}`);
    if (page) {
      page.scrollIntoView({ behavior: 'smooth', block: 'start' });
      autoScroll = true;
      setTimeout(() => { autoScroll = false; }, 1000);
    }
  }, [location]);

  return (<></>); // TODO: replace with functional component?
}

const getClosestPage = (pageArray) => {
  const windowCenter = window.innerHeight / 2;
  const pageCenters = pageArray.map((page) => {
    const id = page.getAttribute('id');
    const { top, height } = page.getBoundingClientRect();
    return { id, distance: Math.abs((top + (height / 2)) - windowCenter) };
  });
  const sortedPageCenters = pageCenters.sort((a, b) => (a.distance > b.distance ? 1 : -1));
  return sortedPageCenters[0].id;
};

function App() {
  const pages = useRef();
  const [orientation, setOrientation] = useState('landscape');
  const [modal, setModal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const { user, setStoreUser } = useStore();


  const handleScroll = () => {
    // setAtTop(Math.abs(pages.current.getBoundingClientRect().top) < 200);
    if (!autoScroll) {
      const closest = getClosestPage(Array.from(pages.current.children));
      if (closest !== getPage()) {
        history.replaceState({}, null, toTitleCase(closest));
      }
    }
  };

  const handleResize = () => {
    setOrientation(innerHeight > innerWidth ? 'portrait' : 'landscape');
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    // TODO: we could techinically cache a lot of things here that are being calculated with every scroll in the getClosestPage method
  };


  // App Start
  useEffect(() => {
    // Check For User
    fetch(`${api}/user`, { credentials: 'include' }).then(res => res.json()).then((user) => {
      if (!user.error) {
        setStoreUser(user);
      }
    });

    addEventListener('scroll', handleScroll);
    addEventListener('resize', handleResize);
    handleResize();

    return () => {
      removeEventListener('scroll', handleScroll);
      removeEventListener('resize', handleResize);
    };
  }, []);

  // useStore(() => {

  // });

  return (
    <StrictMode>
      <Router>
        <Scroll
          pages={pages}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <Routes>
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/user" element={(<User user={user} showLogin={showLogin} />)} />
          <Route
            path="/*"
            element={(
              <div className={`app ${orientation}`}>
                <div className="pages" ref={pages}>
                  <Home />
                  <About />
                  <Menu user={user} setModal={setModal} setShowLogin={setShowLogin} />
                  <Catering />
                  <Store />
                  <Contact />
                </div>
                <Nav mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} showLogin={showLogin} setShowLogin={setShowLogin} />
                <Login user={user} showLogin={showLogin} />
                <Footer setModal={setModal} />
                {modal && (
                  <div className="modals">
                    {modal === 'values' && (<Values modal={modal} setModal={setModal} />)}
                    {modal === 'order' && (<Order modal={modal} setModal={setModal} user={user} />)}
                  </div>
                )}
              </div>
            )}
          />
        </Routes>
      </Router>
      <ToastContainer />

    </StrictMode>
  );
}

export default App;
