import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import ElectryptionLogo from "../components/ElectryptionLogo";
import EmptyState from "../components/EmptyState";
import Footer from "../components/Footer";
import SearchBox from "../components/SearchBox";
import StatsCard from "../components/StatsCard";
import "./system_dashboard.css";

function SystemPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const menuIcons = {
    deploy: "🚀", // Rocket for system launch
    addCandidate: "➕", // Plus for adding
    approve: "✅", // Checkmark for approval
    finish: "🏁", // Finish flag
    oldElections: "📊", // Chart for history
    removePermission: "🔒" // Lock for permissions
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);

    // Simulated search results - in a real app, this would be an API call
    setTimeout(() => {
      if (query.trim().length > 0) {
        const demoResults = [
          { id: 1, name: "Belediye Başkanlığı 2025", date: "18 Mayıs 2025", status: "Aktif" },
          { id: 2, name: "Muhtar Seçimi 2025", date: "10 Nisan 2025", status: "Tamamlandı" },
          { id: 3, name: "Öğrenci Konseyi 2025", date: "5 Mart 2025", status: "Tamamlandı" },
        ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
        setSearchResults(demoResults);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 600);
  };

  const menuItems = [
    {
      id: "deploy", title: "Sistem Kurulumu",
      description: "Akıllı sözleşmeleri dağıtarak seçim sistemini başlatın.",
      icon: menuIcons.deploy,
      path: "/deploy_page",
      variant: "primary"
    },
    {
      id: "addCandidate", title: "Seçim Düzenleme",
      description: "Yeni adaylar ekleyin ve seçim takvimini belirleyin.",
      icon: menuIcons.addCandidate,
      path: "/addCandidate_page",
      variant: "success"
    },
    {
      id: "approve", title: "Yetkilendirme",
      description: "Seçmenlere oy verme yetkisi verin.",
      icon: menuIcons.approve,
      path: "/approve_page",
      variant: "primary"
    },
    {
      id: "finish",
      title: "Seçim Sonrası",
      description: "Seçimi sonlandırın ve sonuçları görüntüleyin.",
      icon: menuIcons.finish,
      path: "/finish_page",
      variant: "warning"
    },
    {
      id: "oldElections",
      title: "Eski Seçimler",
      description: "Geçmiş seçim sonuçlarını inceleyin.",
      icon: menuIcons.oldElections,
      path: "/oldelection_page",
      variant: "default"
    },
    {
      id: "removePermission",
      title: "Yetki Kaldırma",
      description: "Sistemden yetkileri iptal edin.",
      icon: menuIcons.removePermission,
      path: "/removePermission_page",
      variant: "danger"
    }
  ];

  return (<div className="system-container">
    <header className="dashboard-header">
      <div className="dashboard-logo">
        <ElectryptionLogo size="large" />
      </div>
      <h1 className="site-title">Electryption Kontrol Paneli</h1>
      <p className="dashboard-subtitle">Güvenli Blockchain Tabanlı E-Voting Sistemi Yönetimi</p>
    </header>

    <div className="dashboard-grid">
      {menuItems.map(item => (
        <Card
          key={item.id}
          title={item.title}
          headerIcon={item.icon}
          variant={item.variant}
          className="dashboard-card"
        >
          <p className="card-description">{item.description}</p>
          <button
            className={`dashboard-card-button ${item.variant}-button`}
            onClick={() => navigate(item.path)}
          >
            <span className="button-icon">{item.icon}</span>
            {item.title}
          </button>
        </Card>
      ))}      
      </div>      
    <Footer />
  </div>
  );
}

export default SystemPage;
