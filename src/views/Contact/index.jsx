import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './index.scss';

function Contact() {
  const submitForm = () => {
    toast('Sorry, this form isn\'t set up yet');
  };

  return (
    <div className="page contact" id="contact">
      <h2>Contact</h2>
      <div className="contact-main">
        <a href="mailto:bonjour@chezchrystelle.com">bonjour@chezchrystelle.com</a>
        <form>
          <label>Your name:<input type="text" /></label>
          <label>Your email:<input type="text" /></label>
          <textarea placeholder="Type your message here" />
          <div>
            <label htmlFor="newsletter">Receive the occasional email<input name="newsletter" type="checkbox" /></label>
            <button type="button" className="primary" onClick={submitForm}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;
