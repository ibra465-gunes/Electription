import React from 'react';
import './EmptyState.css';

const EmptyState = ({ 
  icon = "📋", 
  title = "Veri Bulunamadı", 
  description = "Henüz bu bölümde görüntülenecek veri bulunmuyor.", 
  actionText = null, 
  onAction = null 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      
      {actionText && onAction && (
        <button className="empty-state-button" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
