import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { getConfigSync } from '../../../utils/configLoader';
import './WelcomeEmailModal.css';

const WelcomeEmailModal = ({ scout, onClose }) => {
  if (!scout) return null;

  const config = getConfigSync();

  const getScoutUrl = () => {
    const baseUrl = window.location.origin + import.meta.env.BASE_URL;
    return `${baseUrl}?scout=${scout.slug}`;
  };

  const scoutUrl = getScoutUrl();

  // Parse scout name from "Lastname, Firstname" to "Firstname Lastname"
  const getDisplayName = () => {
    if (!scout.name) return 'Scout';
    const parts = scout.name.split(',').map(p => p.trim());
    if (parts.length === 2) {
      return `${parts[1]} ${parts[0]}`;
    }
    return scout.name;
  };

  const getFirstName = () => {
    const displayName = getDisplayName();
    return displayName.split(' ')[0];
  };

  const getLastName = () => {
    const displayName = getDisplayName();
    const parts = displayName.split(' ');
    return parts[parts.length - 1];
  };

  const parentEmails = Array.isArray(scout.parentEmails)
    ? scout.parentEmails.join(', ')
    : scout.parentEmails || 'N/A';

  const firstName = getFirstName();
  const lastName = getLastName();

  const emailSubject = `Pack 182 Wreath Sale - ${firstName} ${lastName}'s Unique Sales Link & QR Code`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content welcome-email-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Welcome Email Preview - {getDisplayName()}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="email-meta">
            <div className="email-meta-row">
              <strong>To:</strong> {parentEmails}
            </div>
            <div className="email-meta-row">
              <strong>Subject:</strong> {emailSubject}
            </div>
            <div className="email-note">
              <strong>Note:</strong> This is a preview. In production, this email would be sent automatically.
            </div>
          </div>

          <div className="email-preview">
            <div style={{
              fontFamily: 'Arial, sans-serif',
              maxWidth: '600px',
              margin: '0 auto',
              padding: '20px',
              backgroundColor: '#ffffff',
              color: '#333'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #1a472a 0%, #2a5f3d 100%)',
                color: 'white',
                padding: '30px 20px',
                borderRadius: '12px 12px 0 0',
                textAlign: 'center'
              }}>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>
                  {config?.pack?.name || 'Pack 182'} Wreath Sale
                </h1>
                <p style={{ margin: 0, fontSize: '16px', opacity: 0.95 }}>
                  Annual Fundraiser
                </p>
              </div>

              <div style={{ padding: '30px 20px' }}>
                <p style={{ fontSize: '16px', lineHeight: '1.6', marginTop: 0 }}>
                  Dear {scout.parentName || 'Scout Parent'},
                </p>

                <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                  Thank you for supporting {firstName} {lastName} in this year's wreath sale fundraiser!
                  Below is {firstName}'s unique sales link and QR code.
                </p>

                <div style={{
                  background: '#f8fffe',
                  border: '2px solid #d4af37',
                  borderRadius: '8px',
                  padding: '20px',
                  margin: '20px 0',
                  textAlign: 'center'
                }}>
                  <h2 style={{ color: '#1a472a', marginTop: 0 }}>
                    {firstName}'s Sales Link
                  </h2>
                  <p style={{ margin: '10px 0' }}>
                    <a href={scoutUrl} style={{
                      color: '#2563eb',
                      wordBreak: 'break-all',
                      fontSize: '14px'
                    }}>
                      {scoutUrl}
                    </a>
                  </p>
                </div>

                <div style={{ textAlign: 'center', margin: '30px 0' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '20px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <QRCodeSVG
                      value={scoutUrl}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', marginTop: '15px' }}>
                    Scan this QR code to visit {firstName}'s sales page
                  </p>
                </div>

                <div style={{
                  background: '#e3f2fd',
                  borderLeft: '4px solid #2196f3',
                  padding: '15px 20px',
                  borderRadius: '4px',
                  margin: '20px 0'
                }}>
                  <h3 style={{ color: '#1565c0', marginTop: 0 }}>How It Works</h3>
                  <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                    <li style={{ marginBottom: '8px' }}>Share this link or QR code with family, friends, and neighbors</li>
                    <li style={{ marginBottom: '8px' }}>When they make a purchase, {firstName} gets credit automatically</li>
                    <li style={{ marginBottom: '8px' }}>Track sales progress on the leaderboard</li>
                  </ul>
                </div>

                <h3 style={{ color: '#1a472a', borderBottom: '2px solid #d4af37', paddingBottom: '10px' }}>
                  What We're Selling
                </h3>
                <ul style={{ lineHeight: '1.8' }}>
                  {config?.products?.filter(p => p.active).map((product, idx) => (
                    <li key={idx}>
                      <strong>{product.name}</strong> - ${product.price.toFixed(2)}
                    </li>
                  ))}
                </ul>

                <h3 style={{ color: '#1a472a', borderBottom: '2px solid #d4af37', paddingBottom: '10px' }}>
                  Pickup Information
                </h3>
                <p style={{ lineHeight: '1.6' }}>
                  <strong>Date:</strong> {config?.campaign?.pickupDate || 'TBD'}<br />
                  <strong>Time:</strong> {config?.campaign?.pickupTime || 'TBD'}<br />
                  <strong>Location:</strong> {config?.campaign?.pickupLocation || 'TBD'}
                </p>

                <div style={{
                  background: '#fff3e0',
                  borderLeft: '4px solid #ff9800',
                  padding: '15px 20px',
                  borderRadius: '4px',
                  margin: '20px 0'
                }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#e65100' }}>
                    <strong>Important:</strong> All orders must be paid via Zelle. Payment information
                    will be provided at checkout.
                  </p>
                </div>

                <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                  Thank you for your support! If you have any questions, please contact{' '}
                  {config?.pack?.leaderName || 'Pack Leadership'} at{' '}
                  {config?.pack?.leaderEmail || 'pack182tech@gmail.com'}.
                </p>

                <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: 0 }}>
                  Yours in Scouting,<br />
                  <strong>{config?.pack?.name || 'Pack 182'}</strong>
                </p>
              </div>

              <div style={{
                background: '#f5f5f5',
                padding: '20px',
                borderRadius: '0 0 12px 12px',
                textAlign: 'center',
                fontSize: '12px',
                color: '#666'
              }}>
                <p style={{ margin: 0 }}>
                  {config?.pack?.name || 'Pack 182'} • {config?.pack?.location || 'Saratoga, CA'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeEmailModal;
