import React, { useState } from "react";
import "./operations.css";
import Header from "../components/HeaderAdmin";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

function DeployPage() {
  const [voteCount, setVoteCount] = useState(10);
  const [message, setMessage] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState("");
  
  const handleStartSystem = async () => {
    try {
      setIsLoading(true);
      setMessage({type: "info", text: "Sistem başlatılıyor..."});      // Voting Register'ı deploy et
      const registerResponse = await fetch("http://localhost:4000/api/deployVoteRegister", { method: "POST" });
      // Register data will be used in future implementations
      // eslint-disable-next-line no-unused-vars
      const registerData = await registerResponse.json();
      
      // Vote Token'ı deploy et
      const tokenResponse = await fetch("http://localhost:4000/api/deployVoteToken", { 
        method: "POST", 
        body: JSON.stringify({ voteCount: voteCount }), 
        headers: { "Content-Type": "application/json" }
      });
      const tokenData = await tokenResponse.json();
      
      setDeployedAddress(tokenData.address);
      setMessage({
        type: "success", 
        text: "Sistem başarıyla başlatıldı!"
      });
      
    } catch (error) {
      setMessage({type: "error", text: "Hata: " + error.message});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header title="Sistemi Başlatma" />
      
      <div className="operations-container page-transition">
        <h2>E-Oylama Sistemini Başlat</h2>
        
        <div className="form-section">
          <h3>Oy Sayısını Belirle</h3>
          <div className="form-description">
            Sistemde yer alacak toplam oy sayısını belirleyin. Bu, seçmenlere dağıtılacak token sayısını ifade eder.
          </div>
          <input 
            type="number" 
            value={voteCount} 
            onChange={(e) => setVoteCount(Math.max(1, parseInt(e.target.value) || 1))} 
            placeholder="Oy sayısını gir"
            className="input-field"
            min="1"
          />
          <button 
            onClick={handleStartSystem} 
            disabled={isLoading}
            className="action-button"
          >
            <span className="button-icon">🚀</span>
            {isLoading ? "Başlatılıyor..." : "Sistemi Başlat"}
          </button>
        </div>
        
        {isLoading && <Loading text="Sistem başlatılıyor, lütfen bekleyiniz..." />}
        
        {message.text && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}
        
        {deployedAddress && (
          <div className="card">
            <h3 className="card-title">Başarılı Kurulum</h3>
            <div className="card-content">
              <p><strong>Token Adresi:</strong> {deployedAddress}</p>
              <p>Sistem başarıyla başlatıldı ve oy tokenleri oluşturuldu.</p>
              <p>Artık seçim için aday ekleyebilir ve yetkilendirme işlemleri yapabilirsiniz.</p>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
}

export default DeployPage;