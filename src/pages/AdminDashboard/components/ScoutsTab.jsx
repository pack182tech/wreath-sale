import React, { useState, useMemo } from 'react';
import Badge from '../../../components/admin/Badge';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import ScoutFormModal from './ScoutFormModal';
import ScoutQRModal from './ScoutQRModal';
import WelcomeEmailModal from './WelcomeEmailModal';
import './ScoutsTab.css';

const ScoutsTab = ({ scouts = [], orders = [], onSaveScout, onDeleteScout, showToast }) => {
  // CRITICAL: Ensure we have valid arrays BEFORE any hooks or useMemo
  const safeScouts = Array.isArray(scouts) ? scouts : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  // State for modals and UI
  const [showScoutForm, setShowScoutForm] = useState(false);
  const [editingScout, setEditingScout] = useState(null);
  const [selectedScoutQR, setSelectedScoutQR] = useState(null);
  const [selectedScoutEmail, setSelectedScoutEmail] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRank, setFilterRank] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Calculate scout statistics
  const getScoutStats = (scoutId) => {
    const scoutOrders = safeOrders.filter(order => order?.scoutId === scoutId);
    const revenue = scoutOrders.reduce((sum, order) => sum + (order?.total || 0), 0);
    const units = scoutOrders.reduce((sum, order) =>
      sum + (order?.items?.reduce((itemSum, item) => itemSum + (item?.quantity || 0), 0) || 0), 0
    );
    return {
      orders: scoutOrders.length,
      revenue,
      units
    };
  };

  // Filter and sort scouts - use safeScouts instead of scouts
  const filteredAndSortedScouts = useMemo(() => {
    let filtered = [...safeScouts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(scout => {
        const parentEmailsMatch = Array.isArray(scout?.parentEmails) &&
          scout?.parentEmails.some(email => email?.toLowerCase().includes(query));
        return (
          scout?.name?.toLowerCase().includes(query) ||
          scout?.parentName?.toLowerCase().includes(query) ||
          parentEmailsMatch ||
          scout?.rank?.toLowerCase().includes(query)
        );
      });
    }

    // Apply rank filter
    if (filterRank) {
      filtered = filtered.filter(scout => scout?.rank === filterRank);
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(scout =>
        filterStatus === 'active' ? scout?.active : !scout?.active
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'name':
          aVal = (a?.name || '').toLowerCase();
          bVal = (b?.name || '').toLowerCase();
          break;
        case 'rank':
          aVal = a?.rank || '';
          bVal = b?.rank || '';
          break;
        case 'parent':
          aVal = (a?.parentName || '').toLowerCase();
          bVal = (b?.parentName || '').toLowerCase();
          break;
        case 'orders':
          aVal = getScoutStats(a?.id).orders;
          bVal = getScoutStats(b?.id).orders;
          break;
        case 'revenue':
          aVal = getScoutStats(a?.id).revenue;
          bVal = getScoutStats(b?.id).revenue;
          break;
        case 'units':
          aVal = getScoutStats(a?.id).units;
          bVal = getScoutStats(b?.id).units;
          break;
        case 'status':
          aVal = a?.active ? 1 : 0;
          bVal = b?.active ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [safeScouts, safeOrders, searchQuery, filterRank, filterStatus, sortBy, sortDirection]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const handleAddScout = () => {
    setEditingScout(null);
    setShowScoutForm(true);
  };

  const handleEditScout = (scout) => {
    setEditingScout(scout);
    setShowScoutForm(true);
  };

  const handleSaveScout = async (scoutData) => {
    try {
      await onSaveScout(scoutData);
      showToast(
        scoutData.id ? 'Scout updated successfully' : 'Scout added successfully',
        'success'
      );
      setShowScoutForm(false);
      setEditingScout(null);
    } catch (error) {
      console.error('Failed to save scout:', error);
      throw error; // Let the form handle the error
    }
  };

  const handleDeleteClick = (scout) => {
    setDeleteConfirm(scout);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await onDeleteScout(deleteConfirm.id);
      showToast('Scout deleted successfully', 'success');
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete scout:', error);
      showToast('Failed to delete scout', 'error');
    }
  };

  const handleEmailClick = (scout) => {
    setSelectedScoutQR(null);
    setSelectedScoutEmail(scout);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterRank('');
    setFilterStatus('');
  };

  const hasActiveFilters = searchQuery || filterRank || filterStatus;

  return (
    <div className="scouts-tab">
      <div className="tab-header">
        <h2>Scout Management ({filteredAndSortedScouts.length} of {safeScouts.length})</h2>
        <button className="btn btn-primary" onClick={handleAddScout}>
          + Add Scout
        </button>
      </div>

      {/* Search and Filters */}
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search scouts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={filterRank}
          onChange={(e) => setFilterRank(e.target.value)}
          className="filter-select"
        >
          <option value="">All Ranks</option>
          <option value="Lion">Lion</option>
          <option value="Tiger">Tiger</option>
          <option value="Wolf">Wolf</option>
          <option value="Bear">Bear</option>
          <option value="Webelos">Webelos</option>
          <option value="Arrow of Light">Arrow of Light</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {hasActiveFilters && (
          <button className="btn-clear-filters" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Scouts Table */}
      {filteredAndSortedScouts.length === 0 ? (
        <div className="no-data-card">
          <p>{hasActiveFilters ? 'No scouts match your filters.' : 'No scouts yet. Add your first scout!'}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table scouts-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Name {getSortIcon('name')}
                </th>
                <th onClick={() => handleSort('rank')} className="sortable">
                  Rank {getSortIcon('rank')}
                </th>
                <th onClick={() => handleSort('parent')} className="sortable">
                  Parent {getSortIcon('parent')}
                </th>
                <th onClick={() => handleSort('orders')} className="sortable">
                  Orders {getSortIcon('orders')}
                </th>
                <th onClick={() => handleSort('revenue')} className="sortable">
                  Revenue {getSortIcon('revenue')}
                </th>
                <th onClick={() => handleSort('units')} className="sortable">
                  Units {getSortIcon('units')}
                </th>
                <th onClick={() => handleSort('status')} className="sortable">
                  Status {getSortIcon('status')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedScouts.map((scout) => {
                const stats = getScoutStats(scout?.id);
                return (
                  <tr key={scout?.id}>
                    <td className="scout-name">{scout?.name}</td>
                    <td>{scout?.rank}</td>
                    <td>
                      <div className="parent-cell">
                        <div className="parent-name">{scout?.parentName || 'N/A'}</div>
                        <div className="parent-emails">
                          {Array.isArray(scout?.parentEmails)
                            ? scout?.parentEmails.join(', ')
                            : (scout?.parentEmails || '')}
                        </div>
                      </div>
                    </td>
                    <td>{stats?.orders}</td>
                    <td className="revenue-cell">${stats?.revenue.toFixed(2)}</td>
                    <td>{stats?.units}</td>
                    <td>
                      <Badge status={scout?.active ? 'active' : 'inactive'} type="status" />
                    </td>
                    <td>
                      <div className="scout-actions">
                        <button
                          className="btn-action btn-action-qr"
                          onClick={() => setSelectedScoutQR(scout)}
                          title="View QR Code & Link"
                        >
                          QR/Link
                        </button>
                        <button
                          className="btn-action btn-action-email"
                          onClick={() => setSelectedScoutEmail(scout)}
                          title="Preview Welcome Email"
                        >
                          Email
                        </button>
                        <button
                          className="btn-action btn-action-edit"
                          onClick={() => handleEditScout(scout)}
                          title="Edit Scout"
                        >
                          Edit
                        </button>
                        <button
                          className="btn-action btn-action-delete"
                          onClick={() => handleDeleteClick(scout)}
                          title="Delete Scout"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Scout Form Modal */}
      {showScoutForm && (
        <ScoutFormModal
          scout={editingScout}
          onSave={handleSaveScout}
          onClose={() => {
            setShowScoutForm(false);
            setEditingScout(null);
          }}
        />
      )}

      {/* QR Code Modal */}
      {selectedScoutQR && (
        <ScoutQRModal
          scout={selectedScoutQR}
          onClose={() => setSelectedScoutQR(null)}
          onEmailClick={handleEmailClick}
        />
      )}

      {/* Welcome Email Modal */}
      {selectedScoutEmail && (
        <WelcomeEmailModal
          scout={selectedScoutEmail}
          onClose={() => setSelectedScoutEmail(null)}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Scout"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
};

export default ScoutsTab;
