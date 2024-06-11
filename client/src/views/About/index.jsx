import React, { useEffect, useRef, useState } from 'react';
import bioPic from '../../assets/images/bio-pic-1.jpg';

// import * as instagram from '../../assets/scripts/instagram';
import './index.scss';

function About() {
  const insta = useRef();

  const resize = () => {
    setTimeout(() => {
      const instagramFrame = insta.current.querySelector('iframe');
      if (instagramFrame) {
        const { width } = instagramFrame.getBoundingClientRect();
        const aspectRatio = 2 / 3;
        const heightsByBreakpoint = [
          { width: 0, height: 106 },
          { width: 480, height: 136 },
        ];
        let { height } = heightsByBreakpoint[0];
        heightsByBreakpoint.forEach((breakPoint) => {
          if (width > breakPoint.width) {
            height = breakPoint.height; // eslint-disable-line
          }
        });
        instagramFrame.style.marginTop = `-${height}px`;
        instagramFrame.style.height = `${width * aspectRatio + height}px`;
      }
    }, 1000);
  };

  useEffect(() => {
    // check to see if instagram embed has loaded
    const interval = setInterval(() => {
      // instagram frame loaded
      const instagramFrame = insta.current.querySelector('iframe');
      if (instagramFrame) {
        // set internal styling now that the iframe has loaded
        instagramFrame.style.minWidth = '100%';
        resize();
        clearInterval(interval);
      }
    }, 1000);

    addEventListener('resize', resize);
    return (() => {
      clearInterval(interval);
      removeEventListener('resize', resize);
    });
  }, []);

  return (
    <div className="page about" id="about">
      <h2 />
      <div className="about-main">
        <div className="about-main-image">
          <img alt="Chrystelle" src={bioPic} />
        </div>
        <div className="about-main-text">
          <p><b>Bonjour!</b> My name is Chrystelle Guiakam Tonguem Seidman, and <b className="dont-break">Chez Chrsytelle</b> is how I share my home with you!</p>
          <p>I am a 🇨🇲 <b>Proud Cameroonian Mama</b> 🇨🇲 living in Brooklyn with my Husband and three adorable children.</p>
          <p>Our dinner table was always full of fresh, home-made dinners and surrounded by family, good friends and neighbors. A year into the pandemic, I really missed hosting them so I decided to start cooking again.</p>
          <p>Now, every week, in front of our stoop (and sometimes down the block) people gather to pick up their dinners, enjoy a refreshment, and catch up for a few minutes before sharing a wholesome meal with their family.</p>
        </div>
      </div>
      <div
        className="about-main-instagram"
        style={{ width: '100%', maxWidth: '1000px' }}
        ref={insta}
        dangerouslySetInnerHTML={{ __html: '<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/chezchrystelle/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"></blockquote> ' }}
      />
    </div>
  );
}

export default About;
