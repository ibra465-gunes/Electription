import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-copyright">© 2025 E-Oylama Sistemi. Tüm hakları saklıdır.</p>
          <div className="footer-links">
            <a href="/privacy" className="footer-link">Gizlilik Politikası</a>
            <a href="/terms" className="footer-link">Kullanım Şartları</a>
            <a href="/help" className="footer-link">Yardım</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
