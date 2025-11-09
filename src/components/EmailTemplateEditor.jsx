import { useState, useMemo, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './EmailTemplateEditor.css'

function EmailTemplateEditor({ templates, onSave }) {
  const templateKeys = Object.keys(templates)
  const [selectedTemplate, setSelectedTemplate] = useState(templateKeys[0] || 'orderConfirmation')
  const [subject, setSubject] = useState('')
  const [htmlBody, setHtmlBody] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  // Load template when selection changes
  useEffect(() => {
    if (templates[selectedTemplate]) {
      setSubject(templates[selectedTemplate].subject || '')
      setHtmlBody(templates[selectedTemplate].htmlBody || '')
    }
  }, [selectedTemplate, templates])

  // Available placeholders for email templates
  const placeholders = [
    { label: 'Customer Name', value: '{{customerName}}', description: 'Full customer name' },
    { label: 'Parent Name', value: '{{parentName}}', description: 'Scout parent name' },
    { label: 'Order ID', value: '{{orderId}}', description: 'Unique order number' },
    { label: 'Order Total', value: '{{total}}', description: 'Total order amount' },
    { label: 'Order Date', value: '{{orderDate}}', description: 'Date order was placed' },
    { label: 'Order Items Table', value: '{{orderItemsTable}}', description: 'Table of ordered items' },
    { label: 'Scout Full Name', value: '{{scoutName}}', description: 'Full name of scout' },
    { label: 'Scout First Name', value: '{{scoutFirstName}}', description: 'First name of scout only' },
    { label: 'Scout Link', value: '{{scoutLink}}', description: 'Scout\'s unique sales link' },
    { label: 'Scout QR Code URL', value: '{{scoutQRCodeUrl}}', description: 'Scout\'s QR code image URL' },
    { label: 'Campaign Name', value: '{{campaignName}}', description: 'Name of the campaign' },
    { label: 'Sale Start Date', value: '{{saleStartDate}}', description: 'Campaign start date' },
    { label: 'Sale End Date', value: '{{saleEndDate}}', description: 'Campaign end date' },
    { label: 'Pickup Date', value: '{{pickupDate}}', description: 'Pickup date from campaign settings' },
    { label: 'Pickup Time', value: '{{pickupTime}}', description: 'Pickup time from campaign settings' },
    { label: 'Pickup Location', value: '{{pickupLocation}}', description: 'Pickup location from campaign settings' },
    { label: 'Donation Recipient', value: '{{donationRecipient}}', description: 'Name of donation recipient organization' },
    { label: 'Is Donation', value: '{{isDonation}}', description: 'True if order is a donation (use with #if)' },
    { label: 'Zelle First Name', value: '{{zelleRecipientFirstName}}', description: 'Zelle recipient first name' },
    { label: 'Zelle Last Name', value: '{{zelleRecipientLastName}}', description: 'Zelle recipient last name' },
    { label: 'Zelle Contact', value: '{{zelleContact}}', description: 'Zelle email/phone' },
    { label: 'Leader Email', value: '{{leaderEmail}}', description: 'Pack leader email' },
    { label: 'Pack Name', value: '{{packName}}', description: 'Scout pack name' },
    { label: 'QR Code', value: '{{qrCode}}', description: 'Zelle payment QR code image' },
  ]

  // Custom toolbar with placeholder insertion
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ]
    }
  }), [])

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image'
  ]

  const handleSave = () => {
    onSave(selectedTemplate, {
      subject,
      htmlBody
    })
  }

  const currentTemplate = templates[selectedTemplate] || {}

  const insertPlaceholder = (placeholder) => {
    // Insert placeholder at cursor position
    setHtmlBody(prev => prev + ' ' + placeholder + ' ')
  }

  // Generate preview with sample data
  const getPreviewHtml = () => {
    const sampleOrderItemsTable = `
      <tr>
        <td style="padding: 0.5rem; border-bottom: 1px solid #ddd;">Red Bow Wreath</td>
        <td style="padding: 0.5rem; border-bottom: 1px solid #ddd; text-align: center;">x2</td>
        <td style="padding: 0.5rem; border-bottom: 1px solid #ddd; text-align: right;">$70.00</td>
      </tr>
      <tr>
        <td style="padding: 0.5rem; border-bottom: 1px solid #ddd;">6" Red Poinsettia</td>
        <td style="padding: 0.5rem; border-bottom: 1px solid #ddd; text-align: center;">x5</td>
        <td style="padding: 0.5rem; border-bottom: 1px solid #ddd; text-align: right;">$35.00</td>
      </tr>
    `

    return htmlBody
      .replace(/\{\{customerName\}\}/g, 'John Doe')
      .replace(/\{\{parentName\}\}/g, 'Jane Anderson')
      .replace(/\{\{orderId\}\}/g, '123456')
      .replace(/\{\{total\}\}/g, '105.00')
      .replace(/\{\{orderDate\}\}/g, new Date().toLocaleDateString())
      .replace(/\{\{orderItemsTable\}\}/g, sampleOrderItemsTable)
      .replace(/\{\{scoutName\}\}/g, 'Tommy Anderson')
      .replace(/\{\{scoutFirstName\}\}/g, 'Tommy')
      .replace(/\{\{scoutLink\}\}/g, 'https://pack182tech.github.io/wreath-sale/#/?scout=tommy-anderson')
      .replace(/\{\{scoutQRCodeUrl\}\}/g, 'https://pack182tech.github.io/wreath-sale/images/qr-codes/tommy-anderson.png')
      .replace(/\{\{campaignName\}\}/g, 'Pack 182 Wreath Sale')
      .replace(/\{\{saleStartDate\}\}/g, 'November 8, 2025')
      .replace(/\{\{saleEndDate\}\}/g, 'December 5, 2025')
      .replace(/\{\{pickupDate\}\}/g, 'December 15, 2025')
      .replace(/\{\{pickupTime\}\}/g, '10:00 AM - 2:00 PM')
      .replace(/\{\{pickupLocation\}\}/g, 'Readington Elementary School Parking Lot')
      .replace(/\{\{donationRecipient\}\}/g, 'Three Bridges Reformed Church')
      .replace(/\{\{zelleRecipientFirstName\}\}/g, 'Boy Scouts')
      .replace(/\{\{zelleRecipientLastName\}\}/g, 'of America')
      .replace(/\{\{zelleContact\}\}/g, 'threebridgespack182@gmail.com')
      .replace(/\{\{leaderEmail\}\}/g, 'threebridgespack182@gmail.com')
      .replace(/\{\{packName\}\}/g, 'Cub Scout Pack 182')
      .replace(/\{\{qrCode\}\}/g, '<div style="text-align: center; margin: 20px 0;"><img src="/wreath-site/images/zelle/zelle-qrcode.png" alt="Zelle QR Code" style="max-width: 200px;" /></div>')
      .replace(/\{\{#if scoutName\}\}/g, '')
      .replace(/\{\{#if isDonation\}\}/g, '')
      .replace(/\{\{\/if\}\}/g, '')
  }

  return (
    <div className="email-template-editor">
      <div className="editor-header">
        <div className="editor-header-left">
          <h3>Email Template Editor</h3>
          {currentTemplate.description && (
            <p className="template-description">{currentTemplate.description}</p>
          )}
        </div>
        <div className="editor-actions">
          <button
            className={`btn ${showPreview ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Template
          </button>
        </div>
      </div>

      {/* Template Selector */}
      <div className="template-selector">
        <label htmlFor="template-select"><strong>Select Template:</strong></label>
        <select
          id="template-select"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="template-select-dropdown"
        >
          {templateKeys.map(key => (
            <option key={key} value={key}>
              {templates[key].name || key}
            </option>
          ))}
        </select>
      </div>

      {!showPreview ? (
        <>
          <div className="form-group">
            <label>Email Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Order Confirmation - {{orderId}}"
              className="subject-input"
            />
            <small>Use placeholders like {'{{orderId}}'} or {'{{customerName}}'}</small>
          </div>

          <div className="placeholders-panel">
            <h4>Available Placeholders</h4>
            <p className="placeholders-help">Click to insert into email body:</p>
            <div className="placeholder-buttons">
              {placeholders.map(ph => (
                <button
                  key={ph.value}
                  className="placeholder-button"
                  onClick={() => insertPlaceholder(ph.value)}
                  title={ph.description}
                >
                  <span className="placeholder-label">{ph.label}</span>
                  <code className="placeholder-code">{ph.value}</code>
                </button>
              ))}
            </div>
            <div className="conditional-info">
              <p><strong>Conditional Content:</strong></p>
              <p>Use <code>{'{{#if scoutName}}'}...{'{{/if}}'}</code> to show content only when a scout is attributed.</p>
              <p>Use <code>{'{{#if isDonation}}'}...{'{{/if}}'}</code> to show content only for donation orders.</p>
            </div>
          </div>

          <div className="form-group editor-container">
            <label>Email Body (HTML)</label>
            <ReactQuill
              theme="snow"
              value={htmlBody}
              onChange={setHtmlBody}
              modules={modules}
              formats={formats}
              placeholder="Compose your email template..."
              className="email-editor"
            />
          </div>

          <div className="editor-tips">
            <h4>Tips:</h4>
            <ul>
              <li>Use placeholders to insert dynamic content (customer name, order details, etc.)</li>
              <li>The QR code placeholder {'{{qrCode}}'} will insert the Zelle payment QR code</li>
              <li>Wrap scout-specific content with {'{{#if scoutName}}'}...{'{{/if}}'} to hide when no scout is attributed</li>
              <li>Use the formatting toolbar to style your email</li>
              <li>Click "Preview" to see how the email will look with sample data</li>
            </ul>
          </div>
        </>
      ) : (
        <div className="email-preview">
          <div className="preview-header">
            <h4>Email Preview (with sample data)</h4>
            <p className="preview-subject"><strong>Subject:</strong> {subject.replace(/\{\{orderId\}\}/g, 'ORD-123456')}</p>
          </div>
          <div className="preview-body" dangerouslySetInnerHTML={{ __html: getPreviewHtml() }} />
        </div>
      )}
    </div>
  )
}

export default EmailTemplateEditor
