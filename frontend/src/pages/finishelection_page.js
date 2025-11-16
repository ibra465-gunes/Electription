import React, { useState, useEffect } from "react";
import "./operations.css";
import Header from "../components/HeaderAdmin";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

function Finish() {
  const [electionName, setElectionName] = useState(""); // 📌 Seçim adı
  const [isVotingComplete, setIsVotingComplete] = useState(false); // 📌 İlk işlem tamamlandı mı?
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const [inactiveElections, setInactiveElections] = useState([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
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
  const handleProcessElection = async () => {
    if (!electionName) {
      setMessage({ type: "error", text: "Seçim adı girilmeli!" });
      return;
    }

    try {
      setIsLoadingProcess(true);
      setMessage({ type: "info", text: "Seçim işlemleri yapılıyor..." });
      
      // 📌 Önce oylamayı başlat (setVoting)
      const votingResponse = await fetch("http://localhost:4000/api/setVoting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ electionName })
      });

      const votingResult = await votingResponse.json();
      console.log("Oylama Başlatma Yanıtı:", votingResult);

      // 📌 Ardından adayları ekle (addCandidate)
      const candidateResponse = await fetch("http://localhost:4000/api/addCandidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ electionName })
      });

      const candidateResult = await candidateResponse.json();
      console.log("Aday Ekleme Yanıtı:", candidateResult);

      // 📌 İlk işlem tamamlandı, ikinci buton aktif olsun!
      setIsVotingComplete(true);
      setMessage({ type: "success", text: "Seçim kaydedildi ve adaylar eklendi! Şimdi tokenleri iade edebilirsiniz." });
      
    } catch (error) {
      setMessage({ type: "error", text: "Seçim işlemleri sırasında hata oluştu: " + error.message });
    } finally {
      setIsLoadingProcess(false);
    }
  };

  const handleReturnTokens = async () => {
    if (!electionName) {
      setMessage({ type: "error", text: "Seçim adı girilmeli!" });
      return;
    }

    try {
      setIsLoadingTokens(true);
      setMessage({ type: "info", text: "Tokenler iade ediliyor..." });
      
      const tokenResponse = await fetch("http://localhost:4000/api/returnTokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ electionName })
      });

      const tokenResult = await tokenResponse.json();
      console.log("Token İade Yanıtı:", tokenResult);
      
      if (tokenResult.success) {
        setMessage({ type: "success", text: "Tokenler başarıyla iade edildi!" });
      } else {
        setMessage({ type: "error", text: tokenResult.error || "Token iade işleminde bir hata oluştu" });
      }

    } catch (error) {
      setMessage({ type: "error", text: "Token iade işlemi sırasında hata oluştu: " + error.message });
    } finally {
      setIsLoadingTokens(false);
    }
  };

  return (
    <>
      <Header title="Seçim Sonrası İşlemler" />
      
      <div className="operations-container page-transition">
        <h2>Seçim Sonlandırma İşlemleri</h2>

        <div className="form-section">
          <h3>Seçim Bilgisi</h3>
          <div className="form-description">
            Seçimin tamamlanması ve sonuçların kaydedilmesi için seçim adını girin ve adımları takip edin.
            İşlemleri sırasıyla gerçekleştirmeniz gerekmektedir.
          </div>
          
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

          <div className="button-container">
            {/* İlk işlem butonu: SetVoting ve AddCandidate */}
            <button 
              onClick={handleProcessElection}
              disabled={isLoadingProcess || isVotingComplete}
              className="action-button"
            >
              <span className="button-icon">📋</span> 
              {isLoadingProcess ? "İşlem Yapılıyor..." : "Seçimi Kaydet ve Adayları Ekle"}
            </button>

            {/* İkinci işlem butonu: ReturnTokens (Ancak yalnızca ilk işlem bittikten sonra aktif olacak) */}
            <button 
              onClick={handleReturnTokens} 
              disabled={!isVotingComplete || isLoadingTokens} 
              className={`action-button ${isVotingComplete ? 'success' : ''}`}
            >
              <span className="button-icon">🔄</span> 
              {isLoadingTokens ? "İade Ediliyor..." : "Tokenleri İade Et"}
            </button>
          </div>
        </div>

        {(isLoadingProcess || isLoadingTokens) && 
          <Loading text={isLoadingProcess ? "Seçim kaydediliyor..." : "Tokenler iade ediliyor..."} />
        }

        {message.text && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <div className="card">
          <h3 className="card-title">İşlem Adımları</h3>
          <ol style={{paddingLeft: "1.5rem", margin: "1rem 0", lineHeight: "1.6"}}>
            <li>İlk olarak <strong>Seçimi Kaydet ve Adayları Ekle</strong> butonuna tıklayarak seçim verilerini kaydedebilirsiniz.</li>
            <li>İlk işlem tamamlandıktan sonra <strong>Tokenleri İade Et</strong> butonuna tıklayarak kullanılmamış tokenleri iade edebilirsiniz.</li>
            <li>İşlemler tamamlandıktan sonra seçim sonuçları sisteme kaydedilmiş olacaktır.</li>
          </ol>
        </div>
      </div>
      
      <Footer />
    </>
  );
}

export default Finish;