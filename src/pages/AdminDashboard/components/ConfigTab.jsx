import React, { useState, useEffect } from 'react';
import './ConfigTab.css';

const ConfigTab = ({ config, onSaveConfig, showToast }) => {
  const [siteConfig, setSiteConfig] = useState(config);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setSiteConfig(config);
  }, [config]);

  const handleConfigChange = (section, field, value, index = null) => {
    setSiteConfig(prev => {
      const updated = { ...prev };
      if (index !== null) {
        // Handle array items (FAQ, products)
        if (!Array.isArray(updated[section])) {
          updated[section] = [];
        }
        updated[section][index] = { ...updated[section][index], [field]: value };
      } else if (field) {
        // Handle nested objects
        updated[section] = { ...updated[section], [field]: value };
      } else {
        // Direct assignment
        updated[section] = value;
      }
      return updated;
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveConfig(siteConfig);
      showToast('Configuration saved successfully', 'success');
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save config:', error);
      showToast('Failed to save configuration', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const addFAQItem = () => {
    setSiteConfig(prev => ({
      ...prev,
      content: {
        ...prev.content,
        faq: [...(prev.content?.faq || []), { question: '', answer: '' }]
      }
    }));
    setHasChanges(true);
  };

  const removeFAQItem = (index) => {
    setSiteConfig(prev => ({
      ...prev,
      content: {
        ...prev.content,
        faq: prev.content.faq.filter((_, i) => i !== index)
      }
    }));
    setHasChanges(true);
  };

  return (
    <div className="config-tab">
      <div className="config-sticky-header">
        <div>
          <h2>Site Configuration</h2>
          {hasChanges && (
            <p className="unsaved-changes">You have unsaved changes</p>
          )}
        </div>
        <button
          onClick={handleSave}
          className="btn btn-primary"
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? (
            <>
              <span className="spinner"></span>
              Saving...
            </>
          ) : (
            'Save All Changes'
          )}
        </button>
      </div>

      {/* Campaign Information */}
      <div className="config-section">
        <h3>Campaign Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Campaign Name</label>
            <input
              type="text"
              value={siteConfig.campaign?.name || ''}
              onChange={(e) => handleConfigChange('campaign', 'name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={siteConfig.campaign?.status || 'active'}
              onChange={(e) => handleConfigChange('campaign', 'status', e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={siteConfig.campaign?.startDate || ''}
              onChange={(e) => handleConfigChange('campaign', 'startDate', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={siteConfig.campaign?.endDate || ''}
              onChange={(e) => handleConfigChange('campaign', 'endDate', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Pickup Date</label>
            <input
              type="text"
              value={siteConfig.campaign?.pickupDate || ''}
              onChange={(e) => handleConfigChange('campaign', 'pickupDate', e.target.value)}
              placeholder="December 15, 2025"
            />
          </div>
          <div className="form-group">
            <label>Pickup Time</label>
            <input
              type="text"
              value={siteConfig.campaign?.pickupTime || ''}
              onChange={(e) => handleConfigChange('campaign', 'pickupTime', e.target.value)}
              placeholder="10:00 AM - 2:00 PM"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Pickup Location</label>
          <input
            type="text"
            value={siteConfig.campaign?.pickupLocation || ''}
            onChange={(e) => handleConfigChange('campaign', 'pickupLocation', e.target.value)}
            placeholder="School Parking Lot"
          />
        </div>
      </div>

      {/* Pack Information */}
      <div className="config-section">
        <h3>Pack Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Pack Name</label>
            <input
              type="text"
              value={siteConfig.pack?.name || ''}
              onChange={(e) => handleConfigChange('pack', 'name', e.target.value)}
              placeholder="Pack 182"
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={siteConfig.pack?.location || ''}
              onChange={(e) => handleConfigChange('pack', 'location', e.target.value)}
              placeholder="Saratoga, CA"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Leader Name</label>
            <input
              type="text"
              value={siteConfig.pack?.leaderName || ''}
              onChange={(e) => handleConfigChange('pack', 'leaderName', e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label>Leader Email</label>
            <input
              type="email"
              value={siteConfig.pack?.leaderEmail || ''}
              onChange={(e) => handleConfigChange('pack', 'leaderEmail', e.target.value)}
              placeholder="leader@example.com"
            />
          </div>
        </div>
      </div>

      {/* Scout Attribution Banner */}
      <div className="config-section">
        <h3>Scout Attribution Banner</h3>
        <div className="form-group">
          <label>Banner Text for Scouts (use $scoutname as placeholder)</label>
          <input
            type="text"
            value={siteConfig.scoutAttributionBanner?.scoutText || ''}
            onChange={(e) => handleConfigChange('scoutAttributionBanner', 'scoutText', e.target.value)}
            placeholder="Supporting $scoutname Scouting adventure!"
          />
          <small className="field-hint">
            Example: "Supporting $scoutname Scouting adventure!" → "Supporting Dylan's Scouting adventure!"
          </small>
        </div>

        <div className="form-group">
          <label>Banner Text for Pack (no scout)</label>
          <input
            type="text"
            value={siteConfig.scoutAttributionBanner?.defaultText || ''}
            onChange={(e) => handleConfigChange('scoutAttributionBanner', 'defaultText', e.target.value)}
            placeholder="Supporting Pack 182's Scouting adventure!"
          />
          <small className="field-hint">
            Shown when no scout is specified in the URL
          </small>
        </div>

        <div className="form-group">
          <label>Banner Text for Scout Not Found</label>
          <input
            type="text"
            value={siteConfig.scoutAttributionBanner?.notFoundText || ''}
            onChange={(e) => handleConfigChange('scoutAttributionBanner', 'notFoundText', e.target.value)}
            placeholder="We'll attribute to the correct scout at pickup"
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="config-section">
        <h3>Hero Section</h3>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={siteConfig.content?.heroTitle || ''}
            onChange={(e) => handleConfigChange('content', 'heroTitle', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Subtitle</label>
          <input
            type="text"
            value={siteConfig.content?.heroSubtitle || ''}
            onChange={(e) => handleConfigChange('content', 'heroSubtitle', e.target.value)}
          />
        </div>
      </div>

      {/* About Section */}
      <div className="config-section">
        <h3>About Section</h3>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={siteConfig.content?.aboutTitle || ''}
            onChange={(e) => handleConfigChange('content', 'aboutTitle', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Text</label>
          <textarea
            rows="5"
            value={siteConfig.content?.aboutText || ''}
            onChange={(e) => handleConfigChange('content', 'aboutText', e.target.value)}
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="config-section">
        <h3>FAQ Section</h3>
        <div className="form-group">
          <label>FAQ Title</label>
          <input
            type="text"
            value={siteConfig.content?.faqTitle || ''}
            onChange={(e) => handleConfigChange('content', 'faqTitle', e.target.value)}
          />
        </div>

        <div className="faq-list">
          <h4>FAQ Items</h4>
          {siteConfig.content?.faq?.map((item, index) => (
            <div key={index} className="faq-item-editor">
              <div className="faq-item-header">
                <strong>FAQ {index + 1}</strong>
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeFAQItem(index)}
                >
                  Remove
                </button>
              </div>
              <div className="form-group">
                <label>Question</label>
                <input
                  type="text"
                  value={item.question || ''}
                  onChange={(e) => handleConfigChange('content', 'question', e.target.value, index)}
                  placeholder="Enter question..."
                />
              </div>
              <div className="form-group">
                <label>Answer</label>
                <textarea
                  rows="3"
                  value={item.answer || ''}
                  onChange={(e) => handleConfigChange('content', 'answer', e.target.value, index)}
                  placeholder="Enter answer..."
                />
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addFAQItem}>
            + Add FAQ Item
          </button>
        </div>
      </div>

      {/* Zelle Payment */}
      <div className="config-section">
        <h3>Zelle Payment Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Recipient First Name</label>
            <input
              type="text"
              value={siteConfig.zelle?.recipientFirstName || ''}
              onChange={(e) => handleConfigChange('zelle', 'recipientFirstName', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Recipient Last Name</label>
            <input
              type="text"
              value={siteConfig.zelle?.recipientLastName || ''}
              onChange={(e) => handleConfigChange('zelle', 'recipientLastName', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Recipient Contact (Email or Phone)</label>
          <input
            type="text"
            value={siteConfig.zelle?.recipientContact || ''}
            onChange={(e) => handleConfigChange('zelle', 'recipientContact', e.target.value)}
            placeholder="email@example.com or (555) 123-4567"
          />
        </div>

        <div className="form-group">
          <label>Instructions</label>
          <textarea
            rows="3"
            value={siteConfig.zelle?.instructions || ''}
            onChange={(e) => handleConfigChange('zelle', 'instructions', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>QR Code Text</label>
          <input
            type="text"
            value={siteConfig.zelle?.qrCodeText || ''}
            onChange={(e) => handleConfigChange('zelle', 'qrCodeText', e.target.value)}
            placeholder="Scan to pay with Zelle"
          />
        </div>
      </div>

      {/* Cart Settings */}
      <div className="config-section">
        <h3>Cart/Checkout Settings</h3>
        <div className="form-group">
          <label>Payment Info Message</label>
          <textarea
            rows="2"
            value={siteConfig.cart?.paymentInfoMessage || ''}
            onChange={(e) => handleConfigChange('cart', 'paymentInfoMessage', e.target.value)}
          />
        </div>
      </div>

      {/* Donation Settings */}
      <div className="config-section">
        <h3>Donation Settings</h3>
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={siteConfig.donation?.enabled || false}
              onChange={(e) => handleConfigChange('donation', 'enabled', e.target.checked)}
            />
            <span>Enable Donations</span>
          </label>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Donation Recipient</label>
            <input
              type="text"
              value={siteConfig.donation?.recipient || ''}
              onChange={(e) => handleConfigChange('donation', 'recipient', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={siteConfig.donation?.description || ''}
              onChange={(e) => handleConfigChange('donation', 'description', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Initial Popup Title</label>
          <input
            type="text"
            value={siteConfig.donation?.popupTitle || ''}
            onChange={(e) => handleConfigChange('donation', 'popupTitle', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Initial Popup Text</label>
          <textarea
            rows="3"
            value={siteConfig.donation?.popupText || ''}
            onChange={(e) => handleConfigChange('donation', 'popupText', e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Initial Yes Button</label>
            <input
              type="text"
              value={siteConfig.donation?.popupYesButton || ''}
              onChange={(e) => handleConfigChange('donation', 'popupYesButton', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Initial No Button</label>
            <input
              type="text"
              value={siteConfig.donation?.popupNoButton || ''}
              onChange={(e) => handleConfigChange('donation', 'popupNoButton', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Confirmation Popup Title</label>
          <input
            type="text"
            value={siteConfig.donation?.confirmationTitle || ''}
            onChange={(e) => handleConfigChange('donation', 'confirmationTitle', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Confirmation Popup Text</label>
          <textarea
            rows="3"
            value={siteConfig.donation?.confirmationText || ''}
            onChange={(e) => handleConfigChange('donation', 'confirmationText', e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Confirmation Yes Button</label>
            <input
              type="text"
              value={siteConfig.donation?.confirmationYesButton || ''}
              onChange={(e) => handleConfigChange('donation', 'confirmationYesButton', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Confirmation No Button</label>
            <input
              type="text"
              value={siteConfig.donation?.confirmationNoButton || ''}
              onChange={(e) => handleConfigChange('donation', 'confirmationNoButton', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Product Disclaimer */}
      <div className="config-section">
        <h3>Product Disclaimer</h3>
        <div className="form-group">
          <label>Disclaimer Text</label>
          <textarea
            rows="3"
            value={siteConfig.productDisclaimer || ''}
            onChange={(e) => handleConfigChange('productDisclaimer', null, e.target.value)}
            placeholder="Note: Product photos are examples..."
          />
        </div>
      </div>

      {/* Checkout Button Text */}
      <div className="config-section">
        <h3>Checkout Button Text</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Place Order Button</label>
            <input
              type="text"
              value={siteConfig.checkout?.placeOrderButton || ''}
              onChange={(e) => handleConfigChange('checkout', 'placeOrderButton', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Continue Shopping Button</label>
            <input
              type="text"
              value={siteConfig.checkout?.continueShoppingButton || ''}
              onChange={(e) => handleConfigChange('checkout', 'continueShoppingButton', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Scout Law */}
      <div className="config-section">
        <h3>Scout Law Display</h3>
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={siteConfig.scoutLaw?.enabled || false}
              onChange={(e) => handleConfigChange('scoutLaw', 'enabled', e.target.checked)}
            />
            <span>Display Scout Law Animation</span>
          </label>
        </div>

        <div className="form-group">
          <label>Scout Law Text</label>
          <textarea
            rows="4"
            value={siteConfig.scoutLaw?.text || ''}
            onChange={(e) => handleConfigChange('scoutLaw', 'text', e.target.value)}
            placeholder="A Scout is Trustworthy, Loyal, Helpful..."
          />
        </div>
      </div>

      {/* Products */}
      <div className="config-section">
        <h3>Products</h3>
        {siteConfig.products?.map((product, index) => (
          <div key={index} className="product-editor">
            <h4>Product: {product.name || `Product ${index + 1}`}</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Product ID (read-only)</label>
                <input
                  type="text"
                  value={product.id || ''}
                  disabled
                  style={{ backgroundColor: '#f5f5f5' }}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={product.category || ''}
                  onChange={(e) => handleConfigChange('products', 'category', e.target.value, index)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={product.name || ''}
                  onChange={(e) => handleConfigChange('products', 'name', e.target.value, index)}
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={product.price || 0}
                  onChange={(e) => handleConfigChange('products', 'price', parseFloat(e.target.value), index)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="2"
                value={product.description || ''}
                onChange={(e) => handleConfigChange('products', 'description', e.target.value, index)}
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={product.active || false}
                  onChange={(e) => handleConfigChange('products', 'active', e.target.checked, index)}
                />
                <span>Active</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfigTab;
