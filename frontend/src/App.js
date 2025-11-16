import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Candidate from "./pages/addCandidate_page";
import AdminLoginPage from './pages/admin_login_page';
import Approve from "./pages/approve_page";
import DeployPage from "./pages/deploy_page";
import Finish from "./pages/finishelection_page";
import LandingPage from './pages/landing_page';
import LoginPage from './pages/login_page';
import OldElection from "./pages/oldelection_page";
import RegisterPage from './pages/register_page';
import RemovePermission from "./pages/removePermission_page";
import System from './pages/system_page';
import VoterHome from "./pages/voter_page";
import VoterResultsPage from "./pages/VoterResultsPage";
import VoterVotePage from "./pages/VotingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/giris" element={<LoginPage />} />
        <Route path="/kayit" element={<RegisterPage />} />
        <Route path="/admin-giris" element={<AdminLoginPage />} />
        <Route path="/admin-dashboard" element={<System />} />

        {/* Seçmen Sayfaları */}
        <Route path="/dashboard" element={<VoterHome />} />
        <Route path="/voter" element={<VoterHome />} />
        <Route path="/voter/vote" element={<VoterVotePage />} />
        <Route path="/voter/results" element={<VoterResultsPage />} />

        {/* 📌 SystemPage'den dallanan sayfalar */}
        <Route path="/deploy_page" element={<DeployPage />} />
        <Route path="/addCandidate_page" element={<Candidate />} />
        <Route path="/approve_page" element={<Approve />} />
        <Route path="/finish_page" element={<Finish />} />
        <Route path="/oldelection_page" element={<OldElection />} />
        <Route path="/removePermission_page" element={<RemovePermission />} />
      </Routes>
    </Router>
  );
}

export default App;
