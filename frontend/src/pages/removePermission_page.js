import React, { useState, useEffect } from "react";
import "./operations.css";
import Header from "../components/HeaderAdmin";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

function RemovePermission() {
  const [electionName, setElectionName] = useState(""); // 📌 Seçim adı
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [inactiveElections, setInactiveElections] = useState([]);
  useEffect(() => {
        const fetchInactiveElections = async () => {
            try {
                const response = await fetch("http://localhost:4000/api/getInactiveElections");
                const result = await response.json();
    
                if (result.success) {
                    setInactiveElections(result.inactiveElections);
                } else {
                    setMessage({ type: "error", text: "İnaktif seçimler alınamadı!" });
                }
            } catch (error) {
                console.error("Seçimleri getirme hatası:", error);
                setMessage({ type: "error", text: "API'den seçimleri getirme başarısız!" });
            }
        };
    
        fetchInactiveElections();
    }, []);
  const handleRevokePermission = async () => {
    if (!electionName) {
      setMessage({ type: "error", text: "Seçim adı girilmeli!" });
      return;
    }

    // İlk tıklamada onay göster
    if (!showConfirm) {
      setShowConfirm(true);
      setMessage({ type: "warning", text: `"${electionName}" seçimi için yetkileri iptal etmek istediğinizden emin misiniz?` });
      return;
    }

    try {
      setIsLoading(true);
      setMessage({ type: "info", text: "Yetki iptal işlemi yapılıyor..." });
      
      const response = await fetch("http://localhost:4000/api/revokePermission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ electionName })
      });

      const result = await response.json();
      console.log("API Yanıtı:", result);
      
      if (result.success) {
        setMessage({ type: "success", text: `"${electionName}" seçimi için yetkiler başarıyla iptal edildi.` });
        setElectionName(""); // Form temizleme
        setShowConfirm(false); // Onay ekranını sıfırla
      } else {
        setMessage({ type: "error", text: result.error || "Yetki iptal işlemi sırasında bir hata oluştu." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Yetki iptal edilirken hata oluştu: " + error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setMessage({});
  };

  return (
    <>
      <Header title="Yetki İptali" />
      
      <div className="operations-container page-transition">
        <h2>Yetki İptal İşlemi</h2>

        <div className="form-section">
          <h3>Seçim Yetki İptali</h3>
          <div className="form-description">
            Bu işlem, belirtilen seçim için verilmiş olan tüm yetkileri iptal eder.
            İşlem geri alınamaz, dikkatli bir şekilde uygulanmalıdır.
          </div>
          
          <div className="form-group-content">
            <select
                        value={electionName}
                        onChange={(e) => setElectionName(e.target.value)}
                        className="input-field"
                    >
                        <option value="">Seçim Seçiniz</option>
                        {inactiveElections.map((name, index) => (
                            <option key={index} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>

            {!showConfirm ? (
              <button 
                onClick={handleRevokePermission}
                disabled={isLoading || !electionName}
                className="action-button danger"
              >
                <span className="button-icon">🔒</span> 
                {isLoading ? "İşlem Yapılıyor..." : "Yetkileri İptal Et"}
              </button>
            ) : (
              <div className="confirm-actions">
                <button 
                  onClick={handleRevokePermission}
                  disabled={isLoading}
                  className="action-button danger"
                >
                  <span className="button-icon">✓</span> Onayla
                </button>
                <button 
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="action-button secondary"
                >
                  <span className="button-icon">✗</span> İptal
                </button>
              </div>
            )}
          </div>
        </div>
        
        {isLoading && <Loading text="Yetki iptal ediliyor..." />}
        
        {message.text && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <div className="card">
          <div className="card-title">Yetki İptali Hakkında</div>
          <p>Bu işlem, belirtilen seçim için verilmiş olan tüm yetkileri iptal eder. 
          Bu işlem sonrasında:</p>
          <ul style={{paddingLeft: "1.5rem", margin: "1rem 0"}}>
            <li>İlgili seçimle ilgili yetki gerektiren işlemler yapılamaz</li>
            <li>Aday ekleme işlemi gerçekleştirilemez</li>
            <li>Seçim süreçleri durabilir</li>
          </ul>
          <p>Bu işlem genellikle seçim tamamlandıktan veya bir sorun oluştuğunda güvenlik amaçlı kullanılır.</p>
        </div>
      </div>
      
      <Footer />
    </>
  );
}

export default RemovePermission;