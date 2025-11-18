import React, { useState } from 'react';
import Badge from '../../../components/admin/Badge';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import OrderModal from './OrderModal';
import './OrdersTab.css';

const OrdersTab = ({ orders = [], scouts = [], onUpdateOrderStatus, onDeleteOrder, showToast }) => {
  // CRITICAL: Ensure we have valid arrays BEFORE any hooks
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeScouts = Array.isArray(scouts) ? scouts : [];

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const getScoutName = (scoutId) => {
    if (!scoutId) return 'No Attribution';
    const scout = safeScouts.find(s => s?.id === scoutId);
    return scout ? scout.name : 'Unknown Scout';
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      await onUpdateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Failed to update order status:', error);
      showToast('Failed to update order status', 'error');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleDeleteClick = (order) => {
    setDeleteConfirm(order);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await onDeleteOrder(deleteConfirm.orderId);
      showToast('Order deleted successfully', 'success');
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete order:', error);
      showToast('Failed to delete order', 'error');
    }
  };

  return (
    <div className="orders-tab">
      <div className="tab-header">
        <h2>All Orders ({safeOrders.length})</h2>
      </div>

      {safeOrders.length === 0 ? (
        <div className="no-data-card">
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Scout</th>
                <th>Items</th>
                <th>Total</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeOrders.map((order) => (
                <tr key={order?.orderId}>
                  <td className="order-id">{order?.orderId}</td>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-name">{order?.customer?.name || 'N/A'}</div>
                      <div className="customer-email">{order?.customer?.email || ''}</div>
                    </div>
                  </td>
                  <td>{getScoutName(order?.scoutId)}</td>
                  <td>{order?.items?.length || 0} item(s)</td>
                  <td className="order-total">${(order?.total || 0).toFixed(2)}</td>
                  <td>
                    <Badge status={order?.type || 'online'} type="order-type" />
                  </td>
                  <td>
                    <select
                      value={order?.status || 'pending'}
                      onChange={(e) => handleStatusChange(order?.orderId, e.target.value)}
                      disabled={updatingOrder === order?.orderId}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="fulfilled">Fulfilled</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-action btn-action-view"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View
                      </button>
                      <button
                        className="btn-action btn-action-delete"
                        onClick={() => handleDeleteClick(order)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          scouts={safeScouts}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Order"
        message={`Are you sure you want to delete order ${deleteConfirm?.orderId}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
};

export default OrdersTab;
