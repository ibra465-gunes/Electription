import React from 'react';
import './StatsCard.css';
import Card from './Card';

const StatsCard = ({ title, stats = [], loading = false }) => {
  return (
    <Card
      title={title}
      headerIcon="📊"
      variant="default"
      className="stats-card"
    >
      {loading ? (
        <div className="stats-loading">
          <div className="stats-loading-spinner"></div>
          <p>Veri yükleniyor...</p>
        </div>
      ) : (
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-item" key={index}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              {stat.change && (
                <div className={`stat-change ${stat.change > 0 ? 'positive' : stat.change < 0 ? 'negative' : ''}`}>
                  {stat.change > 0 ? '▲' : stat.change < 0 ? '▼' : '–'} {Math.abs(stat.change)}%
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default StatsCard;
