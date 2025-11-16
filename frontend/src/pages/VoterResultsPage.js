import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CandidateAvatar from "../components/CandidateAvatar";
import Card from "../components/Card";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Notification from "../components/Notification";
import "./system.css";
import "./voter.css";

function VoterResultsPage() {
  const navigate = useNavigate();
  const [electionName, setElectionName] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [voteCounts, setVoteCounts] = useState({}); const [winningCandidate, setWinningCandidate] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const intervalRef = useRef(null);
  const API_BASE_URL = `http://${window.location.hostname}:4000`;
  // Parse candidate name to get first and last name
  const parseCandidateName = (fullName) => {
    if (!fullName) return { firstName: '', lastName: '' };

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return { firstName, lastName };
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedElection = localStorage.getItem("selectedElection");

    if (storedElection) {
      setElectionName(storedElection);
    } else {
      setNotification({
        type: "warning",
        message: "Seçim bilgisi bulunamadı! Lütfen anasayfadan bir seçim seçin."
      });
    }
  }, []);

  // Fetch candidates when election name is available
  useEffect(() => {
    if (!electionName) return;

    const fetchCandidatesAndResults = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/getCandidateInfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ electionName }),
        });

        const result = await response.json();

        if (result.success) {
          setCandidates(result.candidates);
          await fetchVoteCounts(result.candidates);
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
    };

    fetchCandidatesAndResults();
  }, [electionName]);

  // Fetch vote counts for all candidates
  /*const fetchVoteCounts = async (candidatesList) => {
    const counts = {};
    let total = 0;
    let highestVotes = 0;
    let winner = null;

    for (const candidate of candidatesList) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/voteSupply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            electionName: electionName,
            candidateIndex: candidate.index
          }),
        });

        const result = await response.json();
        if (result.success) {
          const voteCount = parseInt(result.voteCount.toString());
          counts[candidate.index] = voteCount;

          total += voteCount;

          // Track the candidate with the highest votes
          if (voteCount > highestVotes) {
            highestVotes = voteCount;
            winner = candidate;
          }
        }
      } catch (error) {
        console.error(`Error fetching vote count for candidate ${candidate.index}:`, error);
      }
    }

    setVoteCounts(counts);
    setTotalVotes(total);
    setWinningCandidate(winner);
  };*/
  // Calculate percentage of votes for a candidate
  const fetchVoteCounts = async (candidatesList) => {
    const counts = {};
    let total = 0;
    let highestVotes = 0;
    let winners = [];

    for (const candidate of candidatesList) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/voteSupply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    electionName: electionName,
                    candidateIndex: candidate.index
                }),
            });

            const result = await response.json();
            if (result.success) {
                const voteCount = parseInt(result.voteCount.toString());
                counts[candidate.index] = voteCount;
                total += voteCount;

                // Eğer yeni en yüksek oy sayısı bulunursa, kazanan listesini sıfırla
                if (voteCount > highestVotes) {
                    highestVotes = voteCount;
                    winners = [candidate];
                } else if (voteCount === highestVotes) {
                    // Eğer oy sayısı eşitse, kazanan listesine ekle
                    winners.push(candidate);
                }
            }
        } catch (error) {
            console.error(`Error fetching vote count for candidate ${candidate.index}:`, error);
        }
    }

    setVoteCounts(counts);
    setTotalVotes(total);
    setWinningCandidate(winners.length > 1 ? null : winners[0]); // Eğer birden fazla kazanan varsa null bırak
};

useEffect(() => {
    if (!electionName) return;

    const fetchDurationTime = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/duration?electionName=${electionName}`);
            const result = await response.json();

            if (result.success) {
                const endTime = parseInt(result.durationTime); // API’den gelen süreyi sayısal formata çevir

                const updateTime = () => {
                    const currentTime = Math.floor(Date.now() / 1000);
                    const timeLeft = endTime - currentTime;

                    if (timeLeft > 0) {
                        const hours = Math.floor(timeLeft / 3600);
                        const minutes = Math.floor((timeLeft % 3600) / 60);
                        const seconds = timeLeft % 60;

                        setRemainingTime(`${hours}:${minutes}:${seconds}`); // Saat:Dakika:Saniye formatında göstermek
                    } else {
                        setRemainingTime("Oylama süresi sona erdi!");
                        clearInterval(intervalRef.current); // Süre dolunca güncellemeyi durdur
                    }
                };

                updateTime(); // İlk hesaplama
                intervalRef.current = setInterval(updateTime, 1000); // Sürekli güncelleme her saniye

            } else {
                setRemainingTime("Süre bilgisi alınamadı.");
            }
        } catch (error) {
            console.error("Error fetching duration time:", error);
            setRemainingTime("Süre bilgisi alınamadı.");
        }
    };

    fetchDurationTime();

    return () => clearInterval(intervalRef.current); // Bileşen kapanınca temizle
}, [electionName]);
  const calculatePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  return (
    <div className="system-container">
      <Header title="Seçim Sonuçları" />

      <div className="system-content page-transition">
        {isLoading ? (
          <Loading text="Sonuçlar yükleniyor..." />
        ) : (
          <>
            {electionName && (
              <div className="results-summary">
                <h2 className="results-title">{electionName}</h2>
                <div className="results-stats">
                  <div className="stat-box">
                      <div className="stat-value">{remainingTime}</div>
                      <div className="stat-label">Seçim Bitişine Kalan Süre</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">{candidates.length}</div>
                    <div className="stat-label">Toplam Aday</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">{totalVotes}</div>
                    <div className="stat-label">Toplam Oy</div>
                  </div>
                  {winningCandidate && (
                    <div className="stat-box">
                      <div className="stat-value">{winningCandidate.name}</div>
                      <div className="stat-label">Lider Aday</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Card
              title="Seçim Sonuçları"
              headerIcon="📊"
              variant="primary"
            >
              {candidates.length === 0 ? (
                <div className="empty-results">
                  <p>Henüz sonuç bulunmamaktadır veya seçim bilgisi yüklenemedi.</p>
                  <button
                    className="action-button"
                    onClick={() => navigate("/voter")}
                  >
                    Seçmen Anasayfasına Dön
                  </button>
                </div>
              ) : (<div className="candidate-list">                  {candidates.map((candidate) => {
                const voteCount = voteCounts[candidate.index] || 0;
                const percentage = calculatePercentage(voteCount);
                const isWinner = winningCandidate && winningCandidate.index === candidate.index;
                const candidateInfo = candidate.info || {};
                const { firstName, lastName } = parseCandidateName(candidateInfo.nameAndSurname);

                return (
                  <div key={candidate.index} className="candidate-card">
                    {isWinner && <div className="winner-badge">🏆 Kazanan</div>}
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
                          </div>
                        )}
                      </div>
                      <p className="candidate-vote-count">Alınan Oy: {voteCount} ({percentage}%)</p>
                      <div className="vote-percentage">
                        <div
                          className="vote-percentage-bar"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
              )}
            </Card>

            <div className="button-container">
              <button
                className="action-button"
                onClick={() => navigate(`/voter?sessionId=${sessionStorage.getItem("urlSessionId")}`)}
              >
                Seçmen Anasayfasına Dön
              </button>
            </div>
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

export default VoterResultsPage;
