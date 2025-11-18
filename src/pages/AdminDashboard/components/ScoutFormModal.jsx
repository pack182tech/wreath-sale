import React, { useState, useEffect } from 'react';
import './ScoutFormModal.css';

const ScoutFormModal = ({ scout, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    rank: 'Wolf',
    email: '',
    parentName: '',
    parentEmails: '',
    active: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (scout) {
      setFormData({
        name: scout.name || '',
        slug: scout.slug || '',
        rank: scout.rank || 'Wolf',
        email: scout.email || '',
        parentName: scout.parentName || '',
        parentEmails: Array.isArray(scout.parentEmails)
          ? scout.parentEmails.join(', ')
          : (scout.parentEmails || ''),
        active: scout.active !== undefined ? scout.active : true
      });
    }
  }, [scout]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Scout name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    if (!formData.rank) {
      newErrors.rank = 'Rank is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert parent emails string to array
      const parentEmailsArray = formData.parentEmails
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      const scoutData = {
        ...formData,
        parentEmails: parentEmailsArray
      };

      // If editing, include the ID
      if (scout) {
        scoutData.id = scout.id;
      }

      await onSave(scoutData);
      onClose();
    } catch (error) {
      console.error('Failed to save scout:', error);
      setErrors({ submit: 'Failed to save scout. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content scout-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{scout ? 'Edit Scout' : 'Add New Scout'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {errors.submit && (
            <div className="error-alert">{errors.submit}</div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">
                Scout Name *
                <span className="field-hint">Format: Lastname, Firstname</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="Smith, John"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="slug">
                Slug (URL) *
                <span className="field-hint">Format: firstname-lastname</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className={errors.slug ? 'error' : ''}
                placeholder="john-smith"
              />
              {errors.slug && <span className="error-message">{errors.slug}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rank">Rank *</label>
              <select
                id="rank"
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                className={errors.rank ? 'error' : ''}
              >
                <option value="Lion">Lion</option>
                <option value="Tiger">Tiger</option>
                <option value="Wolf">Wolf</option>
                <option value="Bear">Bear</option>
                <option value="Webelos">Webelos</option>
                <option value="Arrow of Light">Arrow of Light</option>
              </select>
              {errors.rank && <span className="error-message">{errors.rank}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Scout Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="scout@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="parentName">Parent Name</label>
            <input
              type="text"
              id="parentName"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              placeholder="Jane Smith"
            />
          </div>

          <div className="form-group">
            <label htmlFor="parentEmails">
              Parent Emails
              <span className="field-hint">Comma-separated for multiple emails</span>
            </label>
            <input
              type="text"
              id="parentEmails"
              name="parentEmails"
              value={formData.parentEmails}
              onChange={handleChange}
              placeholder="parent1@example.com, parent2@example.com"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              <span>Active</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Saving...
                </>
              ) : (
                scout ? 'Update Scout' : 'Add Scout'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScoutFormModal;
