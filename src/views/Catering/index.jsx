import React, { useEffect, useState } from 'react';
import cateringPhoto from '../../assets/images/salads-1.jpg';
import './index.scss';

function Catering() {
  return (
    <div className="page catering" id="catering">
      <h2>Catering</h2>
      <div className="catering-main">
        <div className="catering-main-image">
          <img src={cateringPhoto} alt="salads" />
        </div>
        <div className="catering-main-text">
          <p>Cameroonians love to party and we've got it down to a science! We cater parties of all kinds and sizes, from small coorporate lunches to 300-person weddings. All my meals and sides are mostly gluten-free and many of them vegan, but all can be adjusted to your tastes or needs. Use the contact form below and bring some traditional African Cuisine to your next event! 🌍</p>
          <p>If you have a small group but haven't picked out a venue, our intimate backyard gaden can host up to 12 guests plus children. Just bring your own drinks and prepare for an unforgettable evening!</p>
        </div>
      </div>
    </div>
  );
}

export default Catering;
