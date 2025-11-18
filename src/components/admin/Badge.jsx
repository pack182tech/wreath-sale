import React from 'react';
import './Badge.css';

const Badge = ({ status, type = 'status' }) => {
  const getBadgeClass = () => {
    if (type === 'status') {
      switch (status?.toLowerCase()) {
        case 'pending':
          return 'badge-pending';
        case 'paid':
          return 'badge-paid';
        case 'fulfilled':
          return 'badge-fulfilled';
        case 'cancelled':
          return 'badge-cancelled';
        case 'active':
          return 'badge-active';
        case 'inactive':
          return 'badge-inactive';
        default:
          return 'badge-default';
      }
    } else if (type === 'order-type') {
      switch (status?.toLowerCase()) {
        case 'online':
          return 'badge-online';
        case 'offline':
          return 'badge-offline';
        default:
          return 'badge-default';
      }
    }
    return 'badge-default';
  };

  return (
    <span className={`badge ${getBadgeClass()}`}>
      {status}
    </span>
  );
};

export default Badge;
