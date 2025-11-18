import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getScouts, getOrders, updateOrderStatus, deleteOrder, saveScout, deleteScout, saveConfig, saveEmailTemplate } from '../../utils/dataService';
import { getConfig, getConfigSync, clearConfigCache } from '../../utils/configLoader';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import { ToastContainer } from '../../components/admin/Toast';
import { useToast } from '../../hooks/useToast';
import OverviewTab from './components/OverviewTab';
import OrdersTab from './components/OrdersTab';
import ScoutsTab from './components/ScoutsTab';
import EmailTemplatesTab from './components/EmailTemplatesTab';
import ConfigTab from './components/ConfigTab';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  // Active tab state
  const [activeTab, setActiveTab] = useState('overview');

  // Data state
  const [scouts, setScouts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [config, setConfig] = useState(getConfigSync());
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUnits: 0,
    activeScouts: 0
  });

  // Loading state
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Calculate stats whenever orders or scouts change
  useEffect(() => {
    calculateStats();
  }, [orders, scouts]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [scoutsData, ordersData] = await Promise.all([
        getScouts(),
        getOrders()
      ]);

      setScouts(scoutsData || []);
      setOrders(ordersData || []);
      setConfig(getConfigSync());
    } catch (error) {
      console.error('Failed to load data:', error);
      showError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    // Defensive: ensure arrays exist before calculating
    const safeOrders = Array.isArray(orders) ? orders : [];
    const safeScouts = Array.isArray(scouts) ? scouts : [];

    const totalRevenue = safeOrders.reduce((sum, order) => sum + (order?.total || 0), 0);
    const totalOrders = safeOrders.length;
    const totalUnits = safeOrders.reduce((sum, order) =>
      sum + (order?.items?.reduce((itemSum, item) => itemSum + (item?.quantity || 0), 0) || 0), 0
    );
    const activeScouts = safeScouts.filter(s => s?.active).length;

    setStats({
      totalRevenue,
      totalOrders,
      totalUnits,
      activeScouts
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    // Reload data to reflect changes
    await loadData();
  };

  const handleDeleteOrder = async (orderId) => {
    await deleteOrder(orderId);
    // Reload data to reflect changes
    await loadData();
  };

  const handleSaveScout = async (scoutData) => {
    await saveScout(scoutData);
    // Reload data to reflect changes
    await loadData();
  };

  const handleDeleteScout = async (scoutId) => {
    await deleteScout(scoutId);
    // Reload data to reflect changes
    await loadData();
  };

  const handleSaveTemplate = async (templateKey, templateData) => {
    await saveEmailTemplate(templateKey, templateData);
    // Clear cache and reload config to reflect changes
    clearConfigCache();
    const freshConfig = await getConfig();
    setConfig(freshConfig);
  };

  const handleSaveConfig = async (newConfig) => {
    await saveConfig(newConfig);
    // Clear cache and reload config to reflect changes
    clearConfigCache();
    const freshConfig = await getConfig();
    setConfig(freshConfig);
  };

  // Strict null checks - prevent rendering until ALL data is ready
  if (loading || !scouts || !orders || !config) {
    return <LoadingSpinner size="large" text="Loading dashboard..." />;
  }

  // Double-check that scouts and orders are arrays (defensive programming)
  if (!Array.isArray(scouts) || !Array.isArray(orders)) {
    console.error('Data validation failed:', { scouts, orders });
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Data Loading Error</h2>
        <p>Failed to load dashboard data. Please refresh the page.</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="header-subtitle">Pack 182 Wreath Sale Management</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`tab-button ${activeTab === 'scouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('scouts')}
        >
          Scouts
        </button>
        <button
          className={`tab-button ${activeTab === 'email-templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('email-templates')}
        >
          Email Templates
        </button>
        <button
          className={`tab-button ${activeTab === 'config' ? 'active' : ''}`}
          onClick={() => setActiveTab('config')}
        >
          Site Configuration
        </button>
      </nav>

      {/* Tab Content */}
      <main className="dashboard-content">
        {activeTab === 'overview' && (
          <OverviewTab
            stats={stats}
            orders={orders}
            scouts={scouts}
            onViewOrder={(order) => {
              setActiveTab('orders');
              // You could add state to auto-open the order modal here
            }}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersTab
            orders={orders}
            scouts={scouts}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            showToast={(message, type) => {
              if (type === 'success') showSuccess(message);
              else if (type === 'error') showError(message);
              else showInfo(message);
            }}
          />
        )}

        {activeTab === 'scouts' && (
          <ScoutsTab
            scouts={scouts}
            orders={orders}
            onSaveScout={handleSaveScout}
            onDeleteScout={handleDeleteScout}
            showToast={(message, type) => {
              if (type === 'success') showSuccess(message);
              else if (type === 'error') showError(message);
              else showInfo(message);
            }}
          />
        )}

        {activeTab === 'email-templates' && (
          <EmailTemplatesTab
            config={config}
            onSaveTemplate={handleSaveTemplate}
            showToast={(message, type) => {
              if (type === 'success') showSuccess(message);
              else if (type === 'error') showError(message);
              else showInfo(message);
            }}
          />
        )}

        {activeTab === 'config' && (
          <ConfigTab
            config={config}
            onSaveConfig={handleSaveConfig}
            showToast={(message, type) => {
              if (type === 'success') showSuccess(message);
              else if (type === 'error') showError(message);
              else showInfo(message);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <button
          onClick={() => navigate('/')}
          className="btn btn-secondary-outline"
        >
          ← Back to Store
        </button>
        <button
          onClick={() => navigate('/leaderboard')}
          className="btn btn-secondary-outline"
        >
          View Leaderboard
        </button>
      </footer>
    </div>
  );
};

export default AdminDashboard;
