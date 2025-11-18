import React from 'react';
import Badge from '../../../components/admin/Badge';
import './OrderModal.css';

const OrderModal = ({ order, scouts = [], onClose }) => {
  if (!order) return null;

  // Defensive check
  if (!Array.isArray(scouts)) {
    console.error('OrderModal: scouts is not an array', scouts);
  }

  const getScoutName = (scoutId) => {
    if (!scoutId) return 'No Attribution';
    const scout = scouts.find(s => s?.id === scoutId);
    return scout ? scout?.name : 'Unknown Scout';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content order-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="order-detail-section">
            <h3>Order Information</h3>
            <div className="detail-row">
              <span className="detail-label">Order ID:</span>
              <span className="detail-value order-id">{order?.orderId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">
                {new Date(order?.createdAt || order?.orderDate).toLocaleString()}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <Badge status={order?.status || 'pending'} type="status" />
            </div>
            <div className="detail-row">
              <span className="detail-label">Type:</span>
              <Badge status={order?.type || 'online'} type="order-type" />
            </div>
            <div className="detail-row">
              <span className="detail-label">Scout:</span>
              <span className="detail-value">{getScoutName(order?.scoutId)}</span>
            </div>
            {order?.isDonation && (
              <div className="detail-row">
                <span className="detail-label">Donation:</span>
                <span className="detail-value donation-badge">✓ Donation Order</span>
              </div>
            )}
          </div>

          <div className="order-detail-section">
            <h3>Customer Information</h3>
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{order.customer?.name || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{order.customer?.email || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{order.customer?.phone || 'N/A'}</span>
            </div>
            {order?.customer?.comments && (
              <div className="detail-row">
                <span className="detail-label">Comments:</span>
                <span className="detail-value">{order?.customer?.comments}</span>
              </div>
            )}
          </div>

          <div className="order-detail-section">
            <h3>Order Items</h3>
            {order?.items && order?.items.length > 0 ? (
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item?.name}</td>
                      <td>{item?.quantity}</td>
                      <td>${item?.price.toFixed(2)}</td>
                      <td>${((item?.quantity || 0) * (item?.price || 0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No items in this order.</p>
            )}
          </div>

          <div className="order-total-section">
            <div className="total-row">
              <span className="total-label">Total:</span>
              <span className="total-value">${(order?.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
