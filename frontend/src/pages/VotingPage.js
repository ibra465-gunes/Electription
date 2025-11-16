import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CandidateAvatar from "../components/CandidateAvatar";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Notification from "../components/Notification";
import "./system.css";
import "./voter.css";

function VoterVotePage() {
  const navigate = useNavigate();
  const [electionName, setElectionName] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(null);  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = `http://${window.location.hostname}:4000`;
  // Parse candidate name to get first and last name
  const parseCandidateName = (fullName) => {
    if (!fullName) return { firstName: '', lastName: '' };

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return { firstName, lastName };
  };
  useEffect(() => {
  if (selectedCandidateIndex !== null) {
    setNotification(null); // Eğer bir aday seçildiyse hata mesajını kaldır
  }
}, [selectedCandidateIndex]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedElection = localStorage.getItem("selectedElection");
    const storedVoterAddress = localStorage.getItem("voterAddress");
    console.log("Seçmen adresi:",storedVoterAddress);
    if (!storedElection) {
    localStorage.setItem("selectedElection", "Varsayılan Seçim"); // Varsayılan seçim adını ekleyin
    storedElection = "Varsayılan Seçim";
  }

    if (!storedElection || !storedVoterAddress) {
      setNotification({
        type: "error",
        message: "Seçim veya seçmen bilgisi bulunamadı! Anasayfaya yönlendiriliyorsunuz."
      });

      // Redirect to home page after 2 seconds if election or voter info is missing
      setTimeout(() => {
        navigate("/voter");
      }, 2000);
      return;
    }

    setElectionName(storedElection);
    setVoterAddress(storedVoterAddress);
  }, [navigate]);

  // Fetch candidates when election name is available
  useEffect(() => {
    if (!electionName) return;

    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/getCandidateInfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ electionName }),
        });

        const result = await response.json();        if (result.success) {
          setCandidates(result.candidates);
        } else {
          setNotification({
            type: "error",
            message: result.error || "Adaylar yüklenemedi."
          });
        }
      } catch (error) {
        console.error("Candidates fetch error:", error);
        setNotification({
          type: "error",
          message: "Adayları getirirken hata: " + error.message
        });
      } finally {
        setIsLoading(false);
      }
    };    fetchCandidates();
  }, [electionName]);

  // Handle vote submission
  const handleVote = async () => {
    if (selectedCandidateIndex === null) {
      setNotification({
        type: "error",
        message: "Lütfen bir aday seçin."
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/voting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          electionName: electionName,
          voterAddress: voterAddress,
          candidateIndex: selectedCandidateIndex
        }),
      });

      const result = await response.json();

      if (result.success) {
        setNotification({
          type: "success",
          message: "Oyunuz başarıyla kullanıldı! Sonuçlar sayfasına yönlendiriliyorsunuz."
        });

        // Redirect to results page after successful vote
        setTimeout(() => {
          navigate("/voter/results");
        }, 2000);
      } else {
        setNotification({
          type: "error",
          message: result.error || "Oy kullanırken hata oluştu."
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: "Oy kullanırken hata: " + error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="system-container">
      <Header title="Oy Kullanma" />

      <div className="system-content page-transition">
        <Card
          title={`${electionName} Seçimi`}
          headerIcon="🗳️"
          variant="primary"
        >
          <div className="card-description">
            <p>Oy vermek istediğiniz adayı seçin ve "Oy Kullan" butonuna tıklayın. Oylamadan sonra sonuçlar sayfasına yönlendirileceksiniz.</p>
          </div>

          {isLoading ? (
            <Loading text="Adaylar yükleniyor..." />
          ) : (            <div className="candidate-list">              {candidates.map((candidate) => {
            const candidateInfo = candidate.info || {};
            const { firstName, lastName } = parseCandidateName(candidateInfo.nameAndSurname);

            return (
              <div
                key={candidate.index}
                className={`candidate-card ${selectedCandidateIndex === candidate.index ? 'selected' : ''}`}
                onClick={() => setSelectedCandidateIndex(candidate.index)}
              >
                <div className="candidate-header">
                  <div className="candidate-avatar-section">
                    <CandidateAvatar name={candidateInfo.nameAndSurname} size="medium" />
                    <div className="candidate-name-section">
                      <h3 className="candidate-name">
                        {firstName}
                        {lastName && <span className="candidate-surname">{lastName}</span>}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="candidate-content">
                  <div className="candidate-details">
                    <p className="candidate-info">
                      <span className="info-label">Yaş:</span>
                      <span className="info-value">{candidateInfo.age || "Belirtilmemiş"}</span>
                    </p>
                    <p className="candidate-info">
                      <span className="info-label">Cinsiyet:</span>
                      <span className="info-value">{candidateInfo.gender || "Belirtilmemiş"}</span>
                    </p>
                    {candidateInfo.slogan && (
                      <div className="candidate-slogan">
                        <span className="slogan-label">Slogan:</span>
                        <p className="slogan-text">"{candidateInfo.slogan}"</p>
                      </div>                    )}
                  </div>
                </div>
                <div className="vote-actions">
                  <button
                    className={`action-button ${selectedCandidateIndex === candidate.index ? 'success-button' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCandidateIndex(candidate.index);
                      handleVote();
                    }}
                  >
                    {selectedCandidateIndex === candidate.index ? 'Seçildi ✓' : 'Bu Adaya Oy Ver'}
                  </button>
                </div>
              </div>
            );
          })}
          </div>
          )}
        </Card>

        {candidates.length > 0 && (
          <div className="button-container">
            <button
              className="action-button primary-button"
              onClick={handleVote}
              disabled={selectedCandidateIndex === null || isLoading}
            >
              {isLoading ? 'İşleniyor...' : 'Seçilen Adaya Oy Ver'}
            </button>
            <button
              className="action-button secondary"
              onClick={() => navigate(`/voter?sessionId=${sessionStorage.getItem("urlSessionId")}`)}
              disabled={isLoading}
            >
              Vazgeç
            </button>
          </div>
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

export default VoterVotePage;
