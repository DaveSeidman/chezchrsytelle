import React, { useEffect, useState } from 'react';
import './index.scss';
import { Link } from 'react-router-dom';

function Nav(props) {
  const { setModal } = props;
  // console.log('Footer');

  return (
    <div className="footer">
      <p>© Chez Chrystelle LLC</p>
      <a onClick={() => { setModal('values'); }}>Our Core Values</a>
      <div className="footer-socials">
        <a target="_blank" href="https://www.instagram.com/chezchrystelle/" rel="noreferrer"><span className="footer-socials-social instagram" /></a>
        <a target="_blank" href="https://www.facebook.com/chrystelle.tonguemseidman" rel="noreferrer"><span className="footer-socials-social facebook" /></a>
        <span className="footer-socials-social youtube" />
      </div>
    </div>
  );
}

export default Nav;
