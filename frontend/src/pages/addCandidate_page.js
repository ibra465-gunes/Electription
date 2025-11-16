import { useState, useEffect } from "react";
import Header from "../components/HeaderAdmin";
import Loading from "../components/Loading";
import Notification from "../components/Notification";
import "./operations.css";

function AddCandidatePage() {
  const [electionDurationName, setElectionDurationName] = useState("");
  const [electionName, setElectionName] = useState("");
  const [activeElections, setActiveElections] = useState([]);
  const [durationHours, setDurationHours] = useState("");
  const [nameAndSurname, setNameAndSurname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [slogan, setSlogan] = useState("");
  const [notification, setNotification] = useState(null);
  const [isLoadingDuration, setIsLoadingDuration] = useState(false);
  const [isLoadingCandidate, setIsLoadingCandidate] = useState(false);
  useEffect(() => {
    const fetchActiveElections = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/getActiveElections");
            const result = await response.json();

            if (result.success) {
                setActiveElections(result.activeElections);
            } else {
                setNotification({ type: "error", message: "Aktif seçimler alınamadı!" });
            }
        } catch (error) {
            console.error("Seçimleri getirme hatası:", error);
            setNotification({ type: "error", message: "API'den seçimleri getirme başarısız!" });
        }
    };

    fetchActiveElections();
}, []);
  const handleSetDuration = async () => {
    if (!electionDurationName || !durationHours) {
      setNotification({
        type: "error",
        message: "Eksik veri! Seçim adı ve süresi girilmeli."
      });
      return;
    }

    try {
      setIsLoadingDuration(true);

      const response = await fetch("http://localhost:4000/api/setDurationTime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          electionName: electionDurationName,
          durationHours
        })
      });

      const result = await response.json();

      if (result.success) {
        setNotification({
          type: "success",
          message: `Seçim süresi ${durationHours} saat olarak ayarlandı.`
        });
      } else {
        setNotification({
          type: "error",
          message: result.error || "Bir hata oluştu"
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Seçim süresi ayarlanırken hata: " + error.message
      });
    } finally {
      setIsLoadingDuration(false);
    }
  };

  const handleDeployCandidate = async () => {
    if (!electionName || !nameAndSurname || !age || !gender || !slogan) {
      setNotification({
        type: "error",
        message: "Eksik veri! Tüm alanları doldurun."
      });
      return;
    }

    try {
      setIsLoadingCandidate(true);

      const response = await fetch("http://localhost:4000/api/deployCandidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          electionName,
          nameAndSurname,
          age,
          gender,
          slogan
        })
      });

      const result = await response.json();

      if (result.success) {
        setNotification({
          type: "success",
          message: `${nameAndSurname} adlı aday başarıyla eklendi.`
        });
        // Formu temizle
        setNameAndSurname("");
        setAge("");
        setGender("");
        setSlogan("");
      } else {
        setNotification({
          type: "error",
          message: result.error || "Bir hata oluştu"
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Aday eklenirken hata: " + error.message
      });
    } finally {
      setIsLoadingCandidate(false);
    }
  };

  return (
    <>
      <Header title="Aday Ekleme & Seçim Yönetimi" />

      <div className="operations-container">
        <h2>Aday Ekleme & Seçim Süresi Ayarlama</h2>

        <div className="form-section">
          <h3>Seçim Süresi Ayarlama</h3>
          <p className="form-description">
            Seçim adı ve süresini belirleyerek seçim ayarlarını yapılandırabilirsiniz.
          </p>

          <div className="input-group">
            <label htmlFor="electionDurationName">Seçim Adı</label>
            <input
              id="electionDurationName"
              type="text"
              value={electionDurationName}
              onChange={(e) => setElectionDurationName(e.target.value.slice(0, 48))}
              placeholder="Seçim Adı (max 48 karakter)"
              disabled={isLoadingDuration}
            />
            <small className="input-hint">{electionDurationName.length}/48 karakter</small>
          </div>

          <div className="input-group">
            <label htmlFor="durationHours">Seçim Süresi (saat)</label>
            <input
              id="durationHours"
              type="number"
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
              placeholder="Seçim Süresi (saat)"
              disabled={isLoadingDuration}
            />
          </div>

          {isLoadingDuration ? (
            <Loading text="Seçim süresi ayarlanıyor..." />
          ) : (
            <button
              onClick={handleSetDuration}
              className="primary-button"
              disabled={isLoadingDuration}
            >
              <span className="button-icon">⏱️</span>
              Seçim Süresini Ayarla
            </button>
          )}
        </div>

        <hr className="section-divider" />

        <div className="form-section">
          <h3>Aday Bilgileri</h3>
          <p className="form-description">
            Seçime katılacak adayları ekleyebilirsiniz. Tüm alanların doldurulması zorunludur.
          </p>

          <div className="input-group">
            <label htmlFor="electionName">Seçim Adı</label>
            <select
                id="electionName"
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
            <small className="input-hint">{electionName.length}/48 karakter</small>
          </div>

          <div className="input-group">
            <label htmlFor="nameAndSurname">Aday İsmi</label>
            <input
              id="nameAndSurname"
              type="text"
              value={nameAndSurname}
              onChange={(e) => setNameAndSurname(e.target.value.slice(0, 16))}
              placeholder="Aday İsmi (max 16 karakter)"
              disabled={isLoadingCandidate}
            />
            <small className="input-hint">{nameAndSurname.length}/16 karakter</small>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="age">Aday Yaşı</label>
              <input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(Math.max(0, Math.min(255, Number(e.target.value))))}
                placeholder="Aday Yaşı (0-255)"
                disabled={isLoadingCandidate}
              />
            </div>

            <div className="input-group">
              <label htmlFor="gender">Cinsiyet</label>
              <input
                id="gender"
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value.slice(0, 8))}
                placeholder="Cinsiyet (max 8 karakter)"
                disabled={isLoadingCandidate}
              />
              <small className="input-hint">{gender.length}/8 karakter</small>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="slogan">Slogan</label>
            <input
              id="slogan"
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value.slice(0, 48))}
              placeholder="Slogan (max 32 karakter)"
              disabled={isLoadingCandidate}
            />
            <small className="input-hint">{slogan.length}/48 karakter</small>
          </div>

          {isLoadingCandidate ? (
            <Loading text="Aday ekleniyor..." />
          ) : (
            <button
              onClick={handleDeployCandidate}
              className="success-button"
              disabled={isLoadingCandidate}
            >
              <span className="button-icon">👤</span>
              Adayı Ekle
            </button>
          )}
        </div>

        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
    </>
  );
}

export default AddCandidatePage;
