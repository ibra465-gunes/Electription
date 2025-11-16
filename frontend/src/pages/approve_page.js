import React, { useState, useEffect } from "react";
import "./operations.css";
import Header from "../components/HeaderAdmin";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

function Approve() {
  const [electionName, setElectionName] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [activeElections, setActiveElections] = useState([]); // 📌 API’den gelen seçim listesi
  const [voters, setVoters] = useState([]);
  const [votersWithAddress, setVotersWithAddress] = useState([]);
  const API_BASE_URL = `http://${window.location.hostname}:4000`;

  // 🔹 API’den aktif seçimleri getirme
  useEffect(() => {
    const fetchActiveElections = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/getActiveElections`);
        const result = await response.json();

        if (result.success) {
          setActiveElections(result.activeElections);
        } else {
          setMessage({ type: "error", text: "Aktif seçimler alınamadı!" });
        }
      } catch (error) {
        console.error("Seçimleri getirme hatası:", error);
        setMessage({ type: "error", text: "API'den seçimleri getirme başarısız!" });
      }
    };

    fetchActiveElections();
  }, []);

  // 🔹 Seçime kayıtlı seçmenleri getirme fonksiyonu
  const fetchVoters = async () => {
    if (!electionName) return;
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/voters?electionName=${electionName}`);
      const result = await response.json();

      if (result.success) {
        console.log(result.voters);
        setVotersWithAddress(result.voters); // 🔥 Adresleri içeren veriyi sakla
        const votersWithoutAddress = result.voters.map(({ isim, soyisim }) => ({ isim, soyisim })); // 🛑 Kullanıcıya adres göstermeden veriyi işle
        setVoters(votersWithoutAddress);
      } else {
        setMessage({ type: "error", text: "Seçmen listesi alınamadı!" });
      }
    } catch (error) {
      console.error("Seçmen getirme hatası:", error);
      setMessage({ type: "error", text: "Seçmen getirme işlemi başarısız!" });
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Seçmen Silme İşlemi
  const removeVoter = async (isim) => {
    const voter = votersWithAddress.find(v => v.isim === isim);
    if (!voter) return;
    console.log(voter);
    const addressToDelete = voter.blockchain_adres;
    console.log("Silme için kullanılan adres:", addressToDelete);

    try {
      const payload = { electionName, address: addressToDelete };
      const response = await fetch(`${API_BASE_URL}/api/voter/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setVoters(voters.filter(v => v.isim !== isim));
        setVotersWithAddress(votersWithAddress.filter(v => v.isim !== isim));
      } else {
        setMessage({ type: "error", text: "Silme işlemi başarısız!" });
      }
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  // 🔹 Seçimi Yetkilendirme İşlemi
  const handleElectionSubmit = async () => {
    if (!electionName) {
      setMessage({ type: "error", text: "Seçim adı girilmeli!" });
      return;
    }

    try {
      setIsLoading(true);
      setMessage({ type: "info", text: "Yetkilendirme yapılıyor..." });

      const response = await fetch(`${API_BASE_URL}/api/selectElection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ electionName }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: "Yetkilendirme başarıyla tamamlandı!" });
        fetchVoters(); // 📌 Yetkilendirme sonrası seçmenleri getir
      } else {
        setMessage({ type: "error", text: result.error || "Bir hata oluştu" });
      }
    } catch (error) {
      console.error("Yetkilendirme hatası:", error);
      setMessage({ type: "error", text: "Yetkilendirme işlemi başarısız!" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header title="Yetkilendirme & Seçmen Yönetimi" />

      <div className="operations-container">
        <h2>Seçim Yetkilendirme ve Seçmen Yönetimi</h2>

        <div className="form-section">
          <h3>Seçim Yetkilendirme</h3>

          {/* 🔥 Seçim adı elle girilmiyor, aktif seçimler listeleniyor */}
          <select
            value={electionName}
            onChange={(e) => setElectionName(e.target.value)}
            className="input-field"
          >
            <option value="">Seçim Seçiniz</option>
            {activeElections.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>

          <button onClick={handleElectionSubmit} className="action-button" disabled={isLoading}>
            ✅ {isLoading ? "İşlem Yapılıyor..." : "Yetki Ver"}
          </button>
        </div>

        <div className="form-section">
          <h3>Seçimde Kayıtlı Seçmenler</h3>
          <button onClick={fetchVoters} className="fetch-button">Seçmenleri Getir</button>

          {isLoading && <Loading text="Yetkilendirme işlemi yapılıyor..." />}

          <ul className="voter-list">
            {voters.map((voter, index) => (
              <li key={index}>
                {voter.isim} {voter.soyisim} 
                <button onClick={() => removeVoter(voter.isim)}>🗑 Sil</button>
              </li>
            ))}
          </ul>
        </div>

        {message.text && <div className={`message-box ${message.type}`}>{message.text}</div>}
      </div>

      <Footer />
    </>
  );
}

export default Approve;