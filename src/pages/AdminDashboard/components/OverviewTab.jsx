import React from 'react';
import StatCard from '../../../components/admin/StatCard';
import Badge from '../../../components/admin/Badge';
import './OverviewTab.css';

const OverviewTab = ({ stats, orders = [], scouts = [], onViewOrder }) => {
  // CRITICAL: Ensure we have valid arrays BEFORE any operations
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeScouts = Array.isArray(scouts) ? scouts : [];

  // Get last 10 orders
  const recentOrders = safeOrders.slice(0, 10);

  // Get scout name by ID
  const getScoutName = (scoutId) => {
    if (!scoutId) return 'No Attribution';
    const scout = safeScouts.find(s => s?.id === scoutId);
    return scout ? scout.name : 'Unknown Scout';
  };

  return (
    <div className="overview-tab">
      {/* Statistics Grid */}
      <div className="stats-grid">
        <StatCard
          icon="💰"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          label="Total Revenue"
          color="revenue"
        />
        <StatCard
          icon="📦"
          value={stats.totalUnits}
          label="Units Sold"
          color="units"
        />
        <StatCard
          icon="🎯"
          value={stats.totalOrders}
          label="Total Orders"
          color="orders"
        />
        <StatCard
          icon="👥"
          value={stats.activeScouts}
          label="Active Scouts"
          color="scouts"
        />
      </div>

      {/* Recent Orders */}
      <div className="recent-activity">
        <h2>Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="no-data">No orders yet.</p>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Scout</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order?.orderId}>
                    <td className="order-id">{order?.orderId}</td>
                    <td>{order?.customer?.name || 'N/A'}</td>
                    <td>{getScoutName(order?.scoutId)}</td>
                    <td className="order-total">${(order?.total || 0).toFixed(2)}</td>
                    <td>
                      <Badge status={order?.status || 'pending'} type="status" />
                    </td>
                    <td>{new Date(order?.createdAt || order?.orderDate).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-view-small"
                        onClick={() => onViewOrder(order)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;
