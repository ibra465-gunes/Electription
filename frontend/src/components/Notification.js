import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({ type = 'info', message, duration = 4000, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };
  
  if (!visible) return null;
  
  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-icon">
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'warning' && '⚠️'}
        {type === 'info' && 'ℹ️'}
      </div>
      <div className="notification-content">{message}</div>
      <button className="notification-close" onClick={handleClose}>×</button>
    </div>
  );
};

export default Notification;
