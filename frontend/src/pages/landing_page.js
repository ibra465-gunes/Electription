// pages/landing_page.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ElectryptionLogo from '../components/ElectryptionLogo';
import './landing_page.css';

function LandingPage() {
  const [clicked, setClicked] = useState(null);
  const navigate = useNavigate();

  const handleClick = (type) => {
    setClicked(type);
    setTimeout(() => {

      if (type === 'secmen') {

        navigate('/giris');
      } else {

        navigate('/admin-giris');
      }
    }, 1000);
  };

  return (
    <div className="landing-container">
      <header>
        <div className="logo-container">
          <ElectryptionLogo size="large" />
        </div>
        <h1 className="site-title">Electryption</h1>
        <p className="site-subtitle">Güvenli Blockchain Tabanlı E-Voting Sistemi</p>
      </header>

      <main>
        <div className="button-container">
          <button
            className={`login-button ${clicked === 'secmen' ? 'clicked' : ''}`}
            onClick={() => handleClick('secmen')}
          >
            {clicked === 'secmen' ? 'Yönlendiriliyor...' : '🗳️ Seçmen Girişi'}
          </button>

          <button
            className={`login-button ${clicked === 'admin' ? 'clicked' : ''}`}
            onClick={() => handleClick('admin')}
            style={{ background: clicked !== 'admin' ? '#4f46e5' : '' }}
          >
            {clicked === 'admin' ? 'Giriş Yapılıyor...' : '👨‍💼 Admin Girişi'}
          </button>
        </div>

        <div className="signup-section">
          <p className="signup-text">
            Hesabınız yok mu? <a href="/kayit">Kayıt Ol</a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
