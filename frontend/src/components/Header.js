import { useNavigate } from 'react-router-dom';
import ElectryptionLogo from './ElectryptionLogo';
import './Header.css';

const Header = ({ title, showBackButton = true, children }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
;
  return (
    <header className="admin-header">
      <div className="header-container">
        <div className="header-left">
          <ElectryptionLogo size="small" variant="favicon" className="header-logo" />
          {showBackButton && (
            <button className="back-button" onClick={handleBack}>
              ← Geri
            </button>
          )}
        </div>
        <h1 className="header-title">{title}</h1>
        <div className="header-actions">
          {children ? (
            children
          ) : (
            <button
              className="home-button"
              onClick={() => navigate(`/voter?sessionId=${sessionStorage.getItem("urlSessionId")}`)}
              title="Ana Panel"
            >
              🏠
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
