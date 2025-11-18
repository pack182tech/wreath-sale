import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './ScoutQRModal.css';

const ScoutQRModal = ({ scout, onClose, onEmailClick }) => {
  if (!scout) return null;

  const getScoutUrl = () => {
    const baseUrl = window.location.origin + import.meta.env.BASE_URL;
    return `${baseUrl}?scout=${scout.slug}`;
  };

  const scoutUrl = getScoutUrl();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const svg = document.querySelector('.qr-code-display svg');
    if (!svg) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${scout.slug}-qr-code.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Parse scout name from "Lastname, Firstname" to "Firstname Lastname"
  const getDisplayName = () => {
    if (!scout.name) return 'Scout';
    const parts = scout.name.split(',').map(p => p.trim());
    if (parts.length === 2) {
      return `${parts[1]} ${parts[0]}`;
    }
    return scout.name;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{getDisplayName()} - QR Code</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body qr-modal-body">
          <div className="qr-code-display">
            <QRCodeSVG
              value={scoutUrl}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="scout-info-section">
            <div className="info-row">
              <span className="info-label">Scout:</span>
              <span className="info-value">{getDisplayName()}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Rank:</span>
              <span className="info-value">{scout.rank}</span>
            </div>
            {scout.parentName && (
              <div className="info-row">
                <span className="info-label">Parent:</span>
                <span className="info-value">{scout.parentName}</span>
              </div>
            )}
            <div className="info-row">
              <span className="info-label">URL:</span>
              <span className="info-value url-value">{scoutUrl}</span>
            </div>
          </div>

          <div className="instructions-section">
            <h3>Instructions</h3>
            <p>
              This QR code is unique to <strong>{getDisplayName()}</strong>.
              When customers scan it or visit the link, all orders will be automatically
              attributed to this scout.
            </p>
            <p>
              Share this QR code with family, friends, and neighbors. You can print it,
              download it, or email it to the scout's parents.
            </p>
          </div>

          <div className="qr-actions">
            <button className="btn btn-primary" onClick={handlePrint}>
              Print QR Code
            </button>
            <button className="btn btn-primary" onClick={handleDownload}>
              Download QR Code
            </button>
            <button className="btn btn-secondary" onClick={() => onEmailClick(scout)}>
              Email to Parent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoutQRModal;
