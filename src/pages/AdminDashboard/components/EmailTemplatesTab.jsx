import React, { useState } from 'react';
import EmailTemplateEditor from '../../../components/EmailTemplateEditor';
import { sendOrderConfirmationEmail } from '../../../services/appsScriptService';
import './EmailTemplatesTab.css';

const EmailTemplatesTab = ({ config, onSaveTemplate, showToast }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const handleSave = async (templateKey, templateData) => {
    setIsSaving(true);
    try {
      await onSaveTemplate(templateKey, templateData);
      showToast('Email template saved successfully', 'success');
    } catch (error) {
      console.error('Failed to save template:', error);
      showToast('Failed to save email template', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSendingTest(true);
    try {
      // Create a test order
      const testOrder = {
        orderId: `TEST-${Date.now()}`,
        customer: {
          name: 'Test Customer',
          email: testEmail,
          phone: '555-1234',
          comments: 'This is a test order from the admin dashboard'
        },
        items: [
          { name: 'Mixed Greens Wreath', quantity: 1, price: 30.00 },
          { name: 'Poinsettia', quantity: 2, price: 12.00 }
        ],
        total: 54.00,
        orderDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isDonation: false,
        type: 'online',
        status: 'pending',
        scoutId: null
      };

      console.log('[EmailTest] Sending test email to:', testEmail);
      await sendOrderConfirmationEmail(testOrder);
      showToast(`Test email sent to ${testEmail}! Check your inbox (and spam folder).`, 'success');
      setTestEmail('');
    } catch (error) {
      console.error('[EmailTest] Failed to send test email:', error);
      showToast(`Failed to send test email: ${error.message}`, 'error');
    } finally {
      setIsSendingTest(false);
    }
  };

  const templates = config?.emailTemplates || {};

  return (
    <div className="email-templates-tab">
      <div className="tab-header">
        <div>
          <h2>Email Templates</h2>
          <p className="tab-description">
            Customize email templates with dynamic placeholders. Changes will be reflected in automated emails.
          </p>
        </div>
      </div>

      {/* Email Test Section */}
      <div className="email-test-section" style={{
        background: 'linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%)',
        border: '2px solid #ffc107',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#1a472a' }}>📧 Test Email System</h3>
        <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
          Send a test order confirmation email to verify your email setup is working correctly.
        </p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter email address to receive test"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              disabled={isSendingTest}
            />
          </div>
          <button
            onClick={handleSendTestEmail}
            disabled={isSendingTest}
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap' }}
          >
            {isSendingTest ? 'Sending...' : 'Send Test Email'}
          </button>
        </div>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#856404' }}>
          ⚠️ Check your inbox AND spam folder after sending the test.
        </p>
      </div>

      <div className="email-editor-container">
        {Object.keys(templates).length === 0 ? (
          <div className="no-data-card">
            <p>No email templates configured.</p>
          </div>
        ) : (
          <EmailTemplateEditor
            templates={templates}
            onSave={handleSave}
          />
        )}
      </div>

      {isSaving && (
        <div className="saving-overlay">
          <div className="saving-message">
            <span className="spinner"></span>
            Saving template...
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailTemplatesTab;
