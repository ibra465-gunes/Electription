import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Loading from '../components/Loading';
import VoterLogout from '../components/VoterLogout';
import './system.css';
import './voter.css';

function ElectionDetails() {
  const { electionName } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [candidateDetails, setCandidateDetails] = useState([]);
  const [electionEndTime, setElectionEndTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const fetchElectionDetails = async () => {
      try {
        setLoading(true);

        // 1. Get candidates for the election from the API
        const response = await axios.get('http://localhost:8545/api/getCandidates', {
          params: {
            electionName: decodeURIComponent(electionName)
          }
        });

        if (response.data && response.data.success) {
          setCandidates(response.data.candidates);
          
          // 2. For each candidate, fetch their details
          const details = await Promise.all(
            response.data.candidates.map(async (candidateAddress) => {
              try {
                // Get candidate info from our new API endpoint
                const infoResponse = await axios.get('http://localhost:8545/api/getCandidateInfo', {
                  params: {
                    candidateAddress
                  }
                });
                
                if (infoResponse.data && infoResponse.data.success) {
                  const info = infoResponse.data.info;
                  return {
                    address: candidateAddress,
                    name: info.name,
                    age: info.age,
                    gender: info.gender,
                    slogan: info.slogan,
                    voteCount: info.voteCount
                  };
                } else {
                  throw new Error('Candidate info not available');
                }
              } catch (err) {
                console.error(`Error fetching details for candidate ${candidateAddress}:`, err);
                // Fallback to basic info if API fails
                return {
                  address: candidateAddress,
                  name: 'Aday ' + candidateAddress.substr(0, 6),
                  age: 'Bilinmiyor',
                  gender: 'Bilinmiyor',
                  slogan: 'Bilinmiyor',
                  voteCount: 'Bilinmiyor'
                };
              }
            })
          );
          
          setCandidateDetails(details);
          
          // In a real application, get this from the blockchain via an API
          // Try to get duration time from backend (this would be an API call)
          try {
            // This is placeholder - in real application, implement this API endpoint
            // const durationResponse = await axios.get(`/api/getElectionDuration?electionName=${encodeURIComponent(electionName)}`);
            // const endTimestamp = durationResponse.data.endTime;
            // setElectionEndTime(new Date(endTimestamp * 1000));
            
            // For now, set a dummy end time (24 hours from now)
            const endTime = new Date();
            endTime.setHours(endTime.getHours() + 24);
            setElectionEndTime(endTime);
          } catch (durationError) {
            console.error('Error fetching election duration:', durationError);
            const endTime = new Date();
            endTime.setHours(endTime.getHours() + 24);
            setElectionEndTime(endTime);
          }
        } else {
          setError('Seçim bilgileri alınamadı');
        }
      } catch (err) {
        console.error('Error fetching election details:', err);
        setError('Seçim detayları yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchElectionDetails();
  }, [electionName]);

  // Update countdown timer
  useEffect(() => {
    if (!electionEndTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = electionEndTime - now;

      if (diff <= 0) {
        setTimeRemaining('Seçim süresi doldu');
        clearInterval(interval);
        return;
      }

      // Calculate remaining time
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${days}g ${hours}s ${minutes}d ${seconds}sn`);
    }, 1000);

    return () => clearInterval(interval);
  }, [electionEndTime]);

  const handleVoteClick = (candidateAddress) => {
    navigate(`/voting/${encodeURIComponent(electionName)}/${candidateAddress}`);
  };

  if (loading) {
    return <Loading message="Seçim detayları yükleniyor..." />;
  }

  return (
    <div className="system-container">
      <Header title="Seçim Detayları">
        {/* Cüzdan çıkış butonunu kaldırdık */}
      </Header>
      
      <div className="system-content">
        <div className="election-header">
          <h1>{decodeURIComponent(electionName)}</h1>
          
          <div className="election-info">
            <div className="election-time">
              <h3>Kalan Süre</h3>
              <div className="countdown">{timeRemaining}</div>
            </div>
            
            <div className="election-stats">
              <h3>Aday Sayısı</h3>
              <div className="candidate-count">{candidates.length}</div>
            </div>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="back-link">
          <button onClick={() => navigate('/voter-elections')} className="back-button">
            ← Seçimlere Dön
          </button>
        </div>
        
        <h2>Adaylar</h2>
        <div className="candidates-grid">
          {candidateDetails.map((candidate, index) => (
            <Card 
              key={index}
              title={candidate.name}
              description={
                <>
                  <p>Yaş: {candidate.age}</p>
                  <p>Cinsiyet: {candidate.gender}</p>
                  <p>Slogan: "{candidate.slogan}"</p>
                  <p className="vote-count">Alınan Oy: {candidate.voteCount || '0'}</p>
                </>
              }
              buttonText="Oy Ver"
              onClick={() => handleVoteClick(candidate.address)}
            />
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default ElectionDetails;
