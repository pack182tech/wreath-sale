import React, { useState } from 'react';
import EmailTemplateEditor from '../../../components/EmailTemplateEditor';
import './EmailTemplatesTab.css';

const EmailTemplatesTab = ({ config, onSaveTemplate, showToast }) => {
  const [isSaving, setIsSaving] = useState(false);

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
