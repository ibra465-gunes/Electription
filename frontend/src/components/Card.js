import React from 'react';
import './Card.css';

const Card = ({ 
  title, 
  children, 
  actions = null, 
  className = '', 
  headerIcon = null,
  variant = 'default' // Can be 'default', 'primary', 'success', 'warning', 'danger'
}) => {
  return (
    <div className={`app-card ${variant}-card ${className}`}>
      {title && (
        <div className="card-header">
          {headerIcon && <span className="card-header-icon">{headerIcon}</span>}
          <h3 className="card-title">{title}</h3>
        </div>
      )}
      
      <div className="card-content">
        {children}
      </div>
      
      {actions && (
        <div className="card-actions">
          {actions}
        </div>
      )}
    </div>
  );
};

export default Card;
