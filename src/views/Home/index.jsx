import React, { useEffect, useRef, useState } from 'react';
import './index.scss';
import homeVideo from '../../assets/videos/home.mp4';
import logoCutout from '../../assets/images/logo-cutout.png';
import logoNormal from '../../assets/images/logo-normal.png';

// let atTop = true;
let portrait = false;
let width = window.innerWidth;
let height = window.innerHeight;

function Home() {
  const atTop = useRef(true);
  const featureRef = useRef();
  const image = useRef();
  const image2 = useRef();
  const homeRef = useRef();
  const videoRef = useRef();
  const [active, setActive] = useState(false);

  const setLogo = () => {
    image.current.style.height = `${width}px`;
    image.current.style.width = `${height}px`;
    image2.current.style.height = `${width}px`;
    image2.current.style.width = `${height}px`;
    const transform = `translate(-${atTop.current ? 50 : portrait ? 200 : 150}%, -50%) rotate(${portrait ? '-90' : '0'}deg) scale(${atTop.current ? '1' : '100'})`;
    image.current.style.transform = transform;
    image2.current.style.transform = transform;
    if (image.current.classList.contains('dont-transition')) setTimeout(() => {
      image.current.classList.remove('dont-transition');
      image2.current.classList.remove('dont-transition');
    }, 100);
  };

  const handleResize = () => {
    const { innerWidth, innerHeight } = window;
    if (innerWidth > innerHeight) {
      width = innerWidth * 1.6;
      height = innerWidth * 1.6;
      portrait = false;
      setLogo();
    } else {
      height = innerHeight * 1.6;
      width = innerHeight * 1.6;
      portrait = true;
      setLogo();
    }
  };

  const handleScroll = () => {
    atTop.current = homeRef.current.getBoundingClientRect().top > -150;
    image.current.classList[atTop.current ? 'add' : 'remove']('out');
    image2.current.classList[atTop.current ? 'add' : 'remove']('out');
    featureRef.current.classList[!atTop.current ? 'add' : 'remove']('open');
    setLogo();
  };

  const handlePointerEnter = () => {
    console.log('in');
    setActive(true);
  };

  const handlePointerLeave = () => {
    console.log('out');
    setActive(false);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    addEventListener('resize', handleResize);
    addEventListener('scroll', handleScroll);
    featureRef.current.addEventListener('pointerenter', handlePointerEnter);
    featureRef.current.addEventListener('pointerleave', handlePointerLeave);
    featureRef.current.addEventListener('contextmenu', handleContextMenu);
    handleResize(true);
    return () => {
      removeEventListener('resize', handleResize);
      removeEventListener('scroll', handleScroll);
      featureRef.current.removeEventListener('pointerenter', handlePointerEnter);
      featureRef.current.removeEventListener('pointerleave', handlePointerLeave);
      featureRef.current.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div className="page home" id="home" ref={homeRef}>
      <video
        className="home-video"
        autoPlay
        playsInline
        muted
        loop
        controls={false}
        preload="true"
        src={homeVideo}
        ref={videoRef}
      />
      <div
        className={`home-feature ${active ? 'active' : ''}`}
        ref={featureRef}
        onClick={() => {
          if (videoRef.current.paused) videoRef.current.play();
        }}
      >
        <img
          className="home-feature-logo cutout"
          alt="logo"
          src={logoCutout}
          ref={image}
        />
        <img
          className="home-feature-logo"
          alt="logo"
          src={logoNormal}
          ref={image2}
        />
      </div>
    </div>
  );
}

export default Home;
