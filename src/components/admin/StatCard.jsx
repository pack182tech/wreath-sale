import React from 'react';
import './StatCard.css';

const StatCard = ({ icon, value, label, color = 'default' }) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default StatCard;
