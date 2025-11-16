import { useState } from 'react';
import ElectryptionLogo from '../components/ElectryptionLogo';
import './auth.css';
function LoginPage() {
  const [tcNo, setTcNo] = useState('');
  const [sifre, setSifre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
const API_BASE_URL = `http://${window.location.hostname}:3003`;
  const handleLogin = async (event) => {
    event.preventDefault(); // **Formun otomatik yenilenmesini engelle**
    setLoading(true);

    try {
     const response = await fetch(`${API_BASE_URL}/api/secmen/giris`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tc_no: tcNo, sifre }),
      });

      const result = await response.json();
      console.log("Giriş yanıtı (Frontend):", result);

      if (result.token) {
       console.log("Giriş yanıtı (Frontend):", result);
        console.log("Backend'den gelen token:", result.token);
        const sessionId = `session_${Date.now()}`;
        localStorage.setItem(`authToken_${sessionId}`, result.token);
        localStorage.setItem("activeSessionId", sessionId);
        console.log("Kaydedilen activeSessionId:", localStorage.getItem("activeSessionId"));
        console.log("LocalStorage’a kaydedilen token:", localStorage.getItem(`authToken_${sessionId}`));
        window.location.href = `/voter?sessionId=${sessionId}`;
      } else {
        setError("Giriş başarısız!"); // **Başarısız giriş mesajını ekrana göster**
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
      setError("Sunucu hatası!"); // **Hata mesajı ekrana göster**
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <ElectryptionLogo size="large" />
      </div>
      <h2>Seçmen Girişi</h2>
      <form onSubmit={handleLogin}> {/* **Parametre geçmeden çağırıyoruz** */}
        <div className="input-group">
          <input
            type="text"
            placeholder="TC ID Numarası"
            maxLength="11"
            value={tcNo}
            onChange={(e) => setTcNo(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Şifre"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>
        {error && <div className="message error">{error}</div>}
      </form>
      <div className="auth-links">
        <p>Hesabınız yok mu? <a href="/kayit">Kayıt Ol</a></p>
      </div>
    </div>
  );
}

export default LoginPage;
