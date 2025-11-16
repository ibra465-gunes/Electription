import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Notification from "../components/Notification";
import "./system.css";

function HomePage() {
  const [elections, setElections] = useState([]);
  const [authorizedElections, setAuthorizedElections] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [voterAddress, setVoterAddress] = useState("");
  const [availableAddresses, setAvailableAddresses] = useState([]);
const API_BASE_URL = `http://${window.location.hostname}`;
useEffect(() => {
  const storedVoterAddress = localStorage.getItem("voterAddress");

  if (storedVoterAddress) {
    setVoterAddress(storedVoterAddress);
    console.log("Seçmen adresi localStorage'dan yüklendi:", storedVoterAddress);
  }
}, []);  
const handleLogin = async (tc_no, sifre) => {
    try {
      const response = await fetch("http://localhost:3003/api/secmen/giris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tc_no, sifre }),
      });

      const result = await response.json();
      console.log("Giriş yanıtı:", result); // Konsolda yanıtı kontrol edelim

      if (result.token) {
        localStorage.setItem("authToken", result.token); // Token'ı kaydediyoruz
        console.log("Token kaydedildi:", localStorage.getItem("authToken")); // Kontrol için ekledik
        window.location.href = "/home"; // Kullanıcıyı yönlendir
      } else {
        alert("Giriş başarısız!");
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
    }
  };
useEffect(() => {
  window.addEventListener("load", () => {
    const activeSession = Object.keys(localStorage).find(key => key.startsWith("authToken_"));
    if (activeSession) {
      localStorage.setItem("activeSession", activeSession); // 🔥 Doğru kullanıcı oturumunu seç
    }
  });
}, []);
useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdFromUrl = urlParams.get("sessionId");
    sessionStorage.setItem("urlSessionId", sessionIdFromUrl);
    const sessionIdFromLocalStorage = localStorage.getItem("activeSessionId");
    console.log("URL’den alınan sessionId:", sessionIdFromUrl);
    console.log("LocalStorage’dan alınan sessionId:", sessionIdFromLocalStorage);
    const sessionId = sessionIdFromUrl || sessionIdFromLocalStorage; // 🔥 Önce URL’den al, yoksa LocalStorage’dan çek
    console.log("Son kullanılan sessionId:", sessionId);
    const token = localStorage.getItem(`authToken_${sessionId}`);
    console.log("Alınan token:", token);
  if (!token) {
    console.error("Token bulunamadı! Kullanıcı giriş yapmamış olabilir.");
    window.location.href = "/giris"; // 🔥 Kullanıcıyı giriş sayfasına yönlendir
    return;
  }

  const fetchVoterAddress = async () => {
    const timestamp = new Date().getTime();
    const response = await fetch(`${API_BASE_URL}:3003/api/secmen/adres?t=${timestamp}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await response.json();
    console.log("API yanıtı:", result);

    if (result.success) {
      setVoterAddress(result.voterAddress);
          localStorage.setItem("voterAddress", result.voterAddress); // 📌 Kesin kaydet!
          console.log("Seçmen adresi localStorage'a kaydedildi:", result.voterAddress);
    } else {
      console.error("Adres getirilemedi!");
    }
  };

  fetchVoterAddress();
}, []);
  useEffect(() => {
  const fetchElections = async () => {
    setIsLoading(true);
    try {
      // Get active elections that haven't been authorized yet
      const activeResponse = await fetch(`${API_BASE_URL}:4000/api/getActiveElections`);
      const activeResult = await activeResponse.json();

      if (activeResult.success && activeResult.activeElections) {
        setElections(activeResult.activeElections);
      }

      // Get authorized elections for which voters can cast votes
      const authorizedResponse = await fetch(`${API_BASE_URL}:4000/api/getAuthorizedElections`);
      const authorizedResult = await authorizedResponse.json();

      if (authorizedResult.success && authorizedResult.authorizedElections) {
        const elections = authorizedResult.authorizedElections;

        const stillAuthorized = [];

        for (const election of elections) {
          try {
            console.log(election);
            const res = await fetch(`${API_BASE_URL}:4000/api/getCandidates`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ electionName: election }),
            });

            const data = await res.json();

            // Eğer aday varsa, bu seçim bitmiş demektir — listeye eklenmez
            if (!data.success || !data.candidates || data.candidates.length === 0) {
              stillAuthorized.push(election); // hâlâ aktif olabilir, eklenir
            }
          } catch (err) {
            // getCandidates çağrısı başarısızsa, seçim geçerli sayılır
            stillAuthorized.push(election);
          }
        }

        setAuthorizedElections(stillAuthorized);
      }
    } catch (error) {
      console.error("Elections fetch error:", error);
      setNotification({
        type: "error",
        message: "Seçimleri yüklerken hata oluştu.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  fetchElections();
}, []);

  // Handle voter selection change
  const handleVoterChange = (e) => {
  const selectedAddress = e.target.value;
  setVoterAddress(selectedAddress);
  localStorage.setItem("voterAddress", selectedAddress);
  console.log("Seçmen adresi kaydedildi:", localStorage.getItem("voterAddress"));
};

  // Register voter for an election
  const registerVoter = async (electionName) => {
    if (!electionName || !voterAddress) {
      setNotification({
        type: "error",
        message: "Seçim adı ve seçmen adresi gerekli!"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}:4000/api/registerVoter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          electionName: electionName,
          voterAddress: voterAddress
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Store the selected election in localStorage for the voting page
        localStorage.setItem("selectedElection", electionName);
        console.log("Kaydedilen Seçim:", localStorage.getItem("selectedElection"));
        console.log("Kaydedilen Seçmen Adresi:", localStorage.getItem("voterAddress"));
        return true;
      } else {
        setNotification({
          type: "error",
          message: result.error || "Seçmen kaydedilirken hata oluştu."
        });
        return false;
      }
    } catch (error) {
      console.error("Voter registration error:", error);
      setNotification({
        type: "error",
        message: "Seçmen kaydedilirken hata: " + error.message
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  // Handle vote button click for active elections - show request notification
  const handleVoteClick = async (electionName) => {
    // Store the selected election name
    localStorage.setItem("selectedElection", electionName);

    // Register the voter
    const registered = await registerVoter(electionName);

    if (registered) {
      // Show request created notification instead of navigating
      setNotification({
        type: "success",
        message: "Oy verme talebi oluşturuldu! Seçim onaylandığında oy verebileceksiniz."
      });
    }
  };
  return (
    <div className="system-container">
      <Header title="Seçmen Anasayfası" />

      <div className="system-content page-transition">
        <Card
          title="Seçmen Kimliği"
          headerIcon="👤"
          variant="primary"
        >
          <div className="form-group-content">
            <label className="form-label">Seçmen Adresi:</label>
            <p className="input-field">{voterAddress || "Adres yükleniyor..."}</p>
            <p className="input-hint">
              Bu adres veritabanı tarafından tahsis edilmiştir.
            </p>
          </div>
        </Card>

        {isLoading ? (
          <Loading text="Seçimler yükleniyor..." />
        ) : (
          <>
            {/* Aktif Seçimler */}
            <Card
              title="Aktif Seçimler"
              headerIcon="🗳️"
              variant="warning"
            >
              {elections.length === 0 ? (
                <p>Şu anda herhangi bir aktif seçim bulunmamaktadır.</p>
              ) : (
                <div className="data-list">
                  {elections.map((election) => (
                    <div key={election} className="election-item">
                      <div className="election-info">
                        <h3 className="election-title">{election}</h3>
                        <p className="election-status">Seçim durumu: Hazırlık aşamasında</p>
                      </div>                      <div className="election-actions">
                        <button
                          className="action-button"
                          onClick={() => handleVoteClick(election)}
                          disabled={!voterAddress}
                        >
                          Oy Kullan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Onaylanmış Seçimler */}
            <Card
              title="Onaylanmış Seçimler"
              headerIcon="✅"
              variant="success"
            >
              {authorizedElections.length === 0 ? (
                <p>Henüz onaylanmış seçim bulunmamaktadır.</p>
              ) : (
                <div className="data-list">
                  {authorizedElections.map((election) => (
                    <div key={election} className="election-item">
                      <div className="election-info">
                        <h3 className="election-title">{election}</h3>
                        <p className="election-status">Seçim durumu: Oylamaya açık</p>
                      </div>
                      <div className="election-actions">
                        <Link
                          to={{
                              pathname: "/voter/vote",
                              search: `?sessionId=${sessionStorage.getItem("urlSessionId")}`
                          }}
                          className="action-button"
                          onClick={() => handleVoteClick(election)}
                          disabled={!voterAddress}
                        >
                          Oy Kullan
                        </Link>
                        <Link
                          to={{
                            pathname: "/voter/results",
                            search: `?sessionId=${sessionStorage.getItem("urlSessionId")}`
                          }}
                          className="action-button success-button"
                          onClick={() => localStorage.setItem("selectedElection", election)}
                        >
                          Sonuçlar
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}

        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
