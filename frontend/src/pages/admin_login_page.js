import axios from 'axios';
import { useState } from 'react';
import ElectryptionLogo from '../components/ElectryptionLogo';
import './auth.css';

function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Backend'e admin giriş isteği gönder
      const response = await axios.post('http://localhost:3003/api/admin/giris', {
        kullanici_adi: username,
        sifre: password
      });

      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('userRole', 'admin');
        window.location.href = '/admin-dashboard';
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Geçersiz admin bilgileri');
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <ElectryptionLogo size="large" />
      </div>
      <h2>👨‍💼 Admin Girişi</h2>
      <form onSubmit={handleAdminLogin}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Giriş Yapılıyor...' : 'Admin Girişi'}
        </button>
        {error && <div className="message error">{error}</div>}
      </form>
      <div className="auth-links">
        <p><a href="/giris">← Seçmen Girişi'ne Dön</a></p>
        <p className="admin-note">🔒 Güvenli Yönetici Erişimi</p>
      </div>
    </div>
  );
}

export default AdminLoginPage;
