import axios from 'axios';
import { useState } from 'react';
import ElectryptionLogo from '../components/ElectryptionLogo';
import './auth.css';

function RegisterPage() {
  const [isim, setIsim] = useState('');
  const [soyisim, setSoyisim] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [sifre, setSifre] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post('http://localhost:3003/api/secmen/kayit', {
        isim,
        soyisim,
        tc_no: tcNo,
        sifre
      });

      setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => {
        window.location.href = '/giris';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Bir hata oluştu');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <ElectryptionLogo size="large" />
      </div>
      <h2>Seçmen Kaydı</h2>
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Adı"
            value={isim}
            onChange={(e) => setIsim(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="Soyadı"
            value={soyisim}
            onChange={(e) => setSoyisim(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="TC ID Numarası"
            maxLength="11"
            value={tcNo}
            onChange={(e) => setTcNo(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Şifre"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            required
          />
        </div>
        <button type="submit">Kayıt Ol</button>
        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}
      </form>
      <div className="auth-links">
        <p>Zaten bir hesabınız var mı? <a href="/giris">Giriş Yap</a></p>
      </div>
    </div>
  );
}

export default RegisterPage;

