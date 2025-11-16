/*import React, { useState } from "react";
import "./operations.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

function OldElection() {
  const [electionName, setElectionName] = useState(""); // 📌 Seçim adı
  const [candidates, setCandidates] = useState([]); // 📌 Aday listesi
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const handleGetCandidates = async () => {
    if (!electionName) {
      setMessage({ type: "error", text: "Seçim adı girilmeli!" });
      return;
    }

    try {
      setIsLoading(true);
      setMessage({ type: "info", text: "Adaylar getiriliyor..." });
      
      const response = await fetch("http://localhost:4000/api/getCandidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ electionName })
      });

      const result = await response.json();
      console.log("API Yanıtı:", result);
      
      // Arama geçmişine ekle (tekrarları önleyerek)
      if (!searchHistory.includes(electionName)) {
        setSearchHistory([electionName, ...searchHistory].slice(0, 5));
      }
      
      if (result.candidates && result.candidates.length > 0) {
        setCandidates(result.candidates); // 📌 Adayları listeye ekle
        setMessage({ type: "success", text: `${result.candidates.length} aday bulundu.` });
      } else {
        setCandidates([]);
        setMessage({ type: "info", text: "Bu seçim için aday bulunamadı." });
      }

    } catch (error) {
      setMessage({ type: "error", text: "Adaylar çekilirken hata oluştu: " + error.message });
      setCandidates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryClick = (name) => {
    setElectionName(name);
    // Otomatik arama yapma
    setTimeout(() => {
      handleGetCandidates();
    }, 100);
  };

  return (
    <>
      <Header title="Geçmiş Seçimler" />
      
      <div className="operations-container page-transition">
        <h2>Geçmiş Seçim Adayları</h2>

        <div className="form-section">
          <h3>Aday Listesi Sorgulama</h3>
          <div className="form-description">
            Geçmiş seçimlere ait adayları görüntülemek için seçim adını girin ve sorgulayın.
            Seçim sonuçlarının sistemde kaydedilmiş olması gerekmektedir.
          </div>
          
          <input
            type="text"
            value={electionName}
            onChange={(e) => setElectionName(e.target.value.slice(0, 16))}
            placeholder="Seçim Adı (max 16 karakter)"
            className="input-field"
          />

          <button 
            onClick={handleGetCandidates}
            disabled={isLoading}
            className="action-button"
          >
            <span className="button-icon">🔍</span> 
            {isLoading ? "Yükleniyor..." : "Adayları Göster"}
          </button>
          
          {searchHistory.length > 0 && (
            <div className="search-history">
              <p className="search-history-title">Son aramalar:</p>
              <div className="history-tags">
                {searchHistory.map((item, index) => (
                  <span 
                    key={index} 
                    className="history-tag" 
                    onClick={() => handleHistoryClick(item)}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {isLoading && <Loading text="Aday listesi getiriliyor..." />}

        {message.text && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}

        {candidates.length > 0 && (
          <div className="card">
            <h3 className="card-title">"{electionName}" Seçimi Aday Listesi</h3>
            <ul className="data-list">
              {candidates.map((candidate, index) => (
                <li key={index}>
                  <strong>{index + 1}.</strong> {candidate}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <Footer />
    </>
  );
}

export default OldElection;*/
import React, { useState, useEffect  } from "react";
import "./operations.css";
import Header from "../components/HeaderAdmin";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

const convertTimestampToDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Saniyeyi milisaniyeye çevir
    return date.toLocaleString(); // Kullanıcı dostu tarih formatı
};

function OldElection() {
    const [electionName, setElectionName] = useState(""); // 📌 Seçim adı
    const [candidates, setCandidates] = useState([]); // 📌 Aday listesi
    const [adresses, setAdresses] = useState([]);
    const [inactiveElections, setInactiveElections] = useState([]);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [isLoading, setIsLoading] = useState(false);
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
    const handleGetCandidateAddresses = async () => {
        if (!electionName) {
            setMessage({ type: "error", text: "Seçim adı girilmeli!" });
            return;
        }

        try {
            setIsLoading(true);
            setMessage({ type: "info", text: "Aday adresleri getiriliyor..." });

            const response = await fetch("http://localhost:4000/api/getCandidates", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ electionName })
            });

            const result = await response.json();
            console.log("API Yanıtı (Adresler):", result); // Gelen veriyi incele

            if (Array.isArray(result.candidates) && result.candidates.length > 0) {
                setMessage({ type: "success", text: `${result.candidates.length} aday adresi bulundu.` });
                setAdresses(result.candidates);
                handleGetCandidateDetails(electionName); // 📌 Eğer adresler varsa detayları çek
            } else {
                console.log("Aday adresleri hatalı veya boş:", result); // Konsolda hata ayıklama bilgisi
                setMessage({ type: "info", text: "Bu seçim için aday adresi bulunamadı." });
            }

        } catch (error) {
            setMessage({ type: "error", text: "Aday adresleri çekilirken hata oluştu: " + error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetCandidateDetails = async (electionName) => {
        try {
            setMessage({ type: "info", text: "Aday bilgileri getiriliyor..." });

            const response = await fetch("http://localhost:4000/api/getCandidateInfo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ electionName }) 
            });

            const result = await response.json();
            console.log("API Yanıtı (Bilgiler):", result);

            if (result.candidates && result.candidates.length > 0) {
                setCandidates(result.candidates); // 📌 Aday bilgilerini listeye ekle
                setMessage({ type: "success", text: `${result.candidates.length} aday bilgisi bulundu.` });
            } else {
                setMessage({ type: "info", text: "Bu seçim için aday bilgisi bulunamadı." });
            }

        } catch (error) {
            setMessage({ type: "error", text: "Aday bilgileri çekilirken hata oluştu: " + error.message });
        }
    };

    return (
        <>
            <Header title="Geçmiş Seçimler" />

            <div className="operations-container page-transition">
                <h2>Geçmiş Seçim Adayları</h2>

                <div className="form-section">
                    <h3>Aday Listesi Sorgulama</h3>
                    <div className="form-description">
                        Geçmiş seçimlere ait adayları görüntülemek için seçim adını girin ve sorgulayın.
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

                    <button 
                        onClick={handleGetCandidateAddresses}
                        disabled={isLoading}
                        className="action-button"
                    >
                        <span className="button-icon">🔍</span> 
                        {isLoading ? "Yükleniyor..." : "Adayları Göster"}
                    </button>
                </div>

                {isLoading && <Loading text="Aday bilgileri getiriliyor..." />}

                {message.text && (
                    <div className={`message-box ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {candidates.length > 0 && (
                  <>
                    <div className="card">
                        <h3 className="card-title">"{electionName}" Seçimi Aday Adresleri</h3>
                        <ul className="data-list">
                            {adresses.map((address, index) => (
                                <li key={index} className="candidate-item">
                                    <strong>{index + 1}.</strong> {address} {/* 🆕 Doğrudan adresi ekrana bas */}
                                </li>
                            ))}
                        </ul>
                    </div>
                      {/* Aday Detaylarını Gösteren Kart */}
                      <div className="card">
                          <h3 className="card-title">"{electionName}" Seçimi Aday Bilgileri</h3>
                          <ul className="data-list">
                              {candidates.map((candidate, index) => (
                                  <li key={index} className="candidate-item">
                                      <strong>{index + 1}.</strong> {candidate.info.nameAndSurname}
                                      <ul className="candidate-details">
                                          <li><strong>Yaş:</strong> {candidate.info.age}</li>
                                          <li><strong>Cinsiyet:</strong> {candidate.info.gender}</li>
                                          <li><strong>Slogan:</strong> {candidate.info.slogan}</li>
                                          <li><strong>Oy Süresi:</strong> {convertTimestampToDate(candidate.info.votingTime)}</li>
                                          <li><strong>Alınan Oy Miktarı:</strong> {candidate.info.amountToVote}</li>
                                      </ul>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </>
              )}
            </div>
                
            <Footer />
        </>
    );
}

export default OldElection;