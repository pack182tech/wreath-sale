/**
 * =====================================================================
 * PACK 182 WREATH SALE - GOOGLE APPS SCRIPT BACKEND
 * =====================================================================
 *
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code in Code.gs
 * 4. Copy and paste this ENTIRE file into Code.gs
 * 5. Update the EMAIL_FROM constant with your email
 * 6. Deploy as Web App:
 *    - Click "Deploy" > "New deployment"
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click "Deploy"
 * 7. Copy the deployment URL and update your .env file:
 *    VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 *
 * REQUIRED SHEETS IN YOUR GOOGLE SPREADSHEET:
 * - Scouts (columns: id, name, slug, rank, email, parentName, parentEmails, active)
 * - Orders (columns: orderId, customerName, customerEmail, customerPhone, scoutId, scoutName, supportingScout, items, total, isDonation, orderDate, paymentStatus)
 * - Config (columns: key, value) - Optional, for storing configuration
 *
 * =====================================================================
 */

// ============= CONFIGURATION =============
const EMAIL_FROM = 'pack182tech@gmail.com';
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// ============= MAIN HANDLER =============
function doGet(e) {
  const action = e.parameter.action;

  try {
    switch (action) {
      case 'healthCheck':
        return jsonResponse({ status: 'ok', message: 'Apps Script backend is running' });

      case 'getScouts':
        return jsonResponse({ scouts: getScouts() });

      case 'getOrders':
        return jsonResponse({ orders: getOrders() });

      case 'getConfig':
        return jsonResponse({ config: getConfig() });

      default:
        return jsonResponse({ error: 'Unknown action' }, 400);
    }
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return jsonResponse({ error: error.toString() }, 500);
  }
}

function doPost(e) {
  const action = e.parameter.action;

  try {
    const data = JSON.parse(e.postData.contents);

    switch (action) {
      case 'createOrder':
        return jsonResponse(createOrder(data));

      case 'sendOrderConfirmationEmail':
        return jsonResponse(sendOrderConfirmationEmail(data));

      case 'sendScoutWelcomeEmail':
        return jsonResponse(sendScoutWelcomeEmail(data));

      case 'updateOrderStatus':
        return jsonResponse(updateOrderStatus(data.orderId, data.status));

      default:
        return jsonResponse({ error: 'Unknown action' }, 400);
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return jsonResponse({ error: error.toString() }, 500);
  }
}

// ============= UTILITY FUNCTIONS =============
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name);
}

// ============= SCOUT FUNCTIONS =============
function getScouts() {
  const sheet = getSheet('Scouts');
  if (!sheet) {
    Logger.log('Scouts sheet not found');
    return [];
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const scouts = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue; // Skip empty rows

    const scout = {};
    headers.forEach((header, index) => {
      if (header === 'parentEmails' && row[index]) {
        // Parse JSON array for parent emails
        try {
          scout[header] = JSON.parse(row[index]);
        } catch (e) {
          scout[header] = [row[index]];
        }
      } else {
        scout[header] = row[index];
      }
    });
    scouts.push(scout);
  }

  Logger.log(`Loaded ${scouts.length} scouts from sheet`);
  return scouts;
}

// ============= ORDER FUNCTIONS =============
function getOrders() {
  const sheet = getSheet('Orders');
  if (!sheet) {
    Logger.log('Orders sheet not found');
    return [];
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const orders = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue; // Skip empty rows

    const order = {};
    headers.forEach((header, index) => {
      if (header === 'items' && row[index]) {
        // Parse JSON array for items
        try {
          order[header] = JSON.parse(row[index]);
        } catch (e) {
          order[header] = [];
        }
      } else if (header === 'isDonation') {
        order[header] = row[index] === true || row[index] === 'TRUE';
      } else if (header === 'total') {
        order[header] = Number(row[index]);
      } else {
        order[header] = row[index];
      }
    });
    orders.push(order);
  }

  Logger.log(`Loaded ${orders.length} orders from sheet`);
  return orders;
}

function createOrder(orderData) {
  const sheet = getSheet('Orders');
  if (!sheet) {
    throw new Error('Orders sheet not found');
  }

  // Get scout name if scout ID is provided
  let scoutName = '';
  if (orderData.scoutId) {
    const scouts = getScouts();
    const scout = scouts.find(s => s.id === orderData.scoutId);
    scoutName = scout ? scout.name : 'SCOUT_NOT_FOUND';
  }

  const row = [
    orderData.orderId,
    orderData.customer.name,
    orderData.customer.email,
    orderData.customer.phone,
    orderData.scoutId || '',
    scoutName,
    orderData.supportingScout || '',
    JSON.stringify(orderData.items),
    orderData.total,
    orderData.isDonation || false,
    orderData.orderDate,
    orderData.paymentStatus || 'pending',
    orderData.customer.comments || ''
  ];

  sheet.appendRow(row);
  Logger.log(`Created order ${orderData.orderId}`);

  return { success: true, orderId: orderData.orderId };
}

function updateOrderStatus(orderId, newStatus) {
  const sheet = getSheet('Orders');
  if (!sheet) {
    throw new Error('Orders sheet not found');
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const statusColumnIndex = headers.indexOf('paymentStatus');
  const orderIdColumnIndex = headers.indexOf('orderId');

  if (statusColumnIndex === -1 || orderIdColumnIndex === -1) {
    throw new Error('Required columns not found in Orders sheet');
  }

  for (let i = 1; i < data.length; i++) {
    if (data[i][orderIdColumnIndex] === orderId) {
      sheet.getRange(i + 1, statusColumnIndex + 1).setValue(newStatus);
      Logger.log(`Updated order ${orderId} status to ${newStatus}`);
      return { success: true, orderId, newStatus };
    }
  }

  throw new Error(`Order ${orderId} not found`);
}

// ============= CONFIG FUNCTIONS =============
function getConfig() {
  const sheet = getSheet('Config');
  if (!sheet) {
    Logger.log('Config sheet not found, returning empty config');
    return null;
  }

  // Config is stored as a single JSON object in cell B2
  // Row 1: Headers (Key | Value)
  // Row 2: "siteConfig" | {entire JSON config object}
  const configCell = sheet.getRange('B2').getValue();

  if (!configCell) {
    Logger.log('No config found in B2');
    return null;
  }

  try {
    const config = JSON.parse(configCell);
    Logger.log('Successfully loaded config from Sheets');
    return config;
  } catch (error) {
    Logger.log('Error parsing config JSON: ' + error.toString());
    return null;
  }
}

// ============= EMAIL FUNCTIONS =============
function sendOrderConfirmationEmail(orderData) {
  const recipient = orderData.customer.email;
  const subject = `Order Confirmation - ${orderData.orderId}`;

  // Build items table HTML
  let itemsTable = '';
  orderData.items.forEach(item => {
    const itemTotal = (item.price * item.quantity).toFixed(2);
    itemsTable += `
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 10px;">${item.name}</td>
        <td style="padding: 10px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; text-align: right; font-weight: bold;">$${itemTotal}</td>
      </tr>
    `;
  });

  // Get config for campaign details (fallback to defaults if config not available)
  const config = getConfig() || {};
  const campaign = config.campaign || {};
  const pack = config.pack || {};
  const zelle = config.zelle || {};
  const donationRecipient = config.donation?.recipient || 'Three Bridges Reformed Church';

  const pickupDate = campaign.pickupDate || 'TBD';
  const pickupTime = campaign.pickupTime || '10:00 AM - 2:00 PM';
  const pickupLocation = campaign.pickupLocation || 'Readington Elementary School Parking Lot';

  // Build donation section if applicable
  let donationSection = '';
  if (orderData.isDonation) {
    donationSection = `
      <div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); padding: 20px; border-radius: 10px; margin: 25px 0; border: 2px solid #4caf50; text-align: center;">
        <p style="margin: 0 0 10px 0; font-size: 20px; color: #1a472a;"><strong>🙏 Thank You for Your Generous Donation!</strong></p>
        <p style="margin: 0; color: #2e7d32; font-size: 16px; line-height: 1.6;">Your contribution to <strong>${donationRecipient}</strong> helps us show gratitude for their generosity to Pack 182. We deeply appreciate your support!</p>
      </div>
    `;
  }

  // Build scout attribution section if applicable
  let scoutSection = '';
  const scoutName = orderData.scoutId ? (getScouts().find(s => s.id === orderData.scoutId)?.name || '') : '';
  const scoutFirstName = scoutName.split(' ')[0];

  if (scoutName && scoutName !== 'SCOUT_NOT_FOUND') {
    scoutSection = `
      <div style="background: linear-gradient(135deg, #e3f2fd 0%, #d1e7ff 100%); padding: 15px; border-radius: 8px; margin: 20px 0; border: 2px solid #2196f3;">
        <p style="margin: 0; font-size: 14px; color: #1565c0; line-height: 1.6;"><strong>💡 Alternative Payment Option:</strong> If you are unable to use Zelle, you may pay ${scoutFirstName}'s parents directly.</p>
      </div>
      <div style="background: linear-gradient(135deg, #1a472a 0%, #2a5f3d 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
        <p style="margin: 0; font-size: 18px; color: white; font-weight: bold;">🎗️ Thank you for supporting ${scoutName}!</p>
      </div>
    `;
  }

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px;">
      <div style="background: linear-gradient(135deg, #1a472a 0%, #2a5f3d 100%); padding: 25px; text-align: center; border-radius: 8px; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">✅ Order Confirmed!</h1>
      </div>

      <p style="font-size: 16px; line-height: 1.6; color: #333;">Dear <strong>${orderData.customer.name}</strong>,</p>
      <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for your order! Your order has been received and will be ready for pickup on <strong style="color: #1a472a;">${pickupDate}</strong>.</p>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #1a472a;">
        <h3 style="color: #1a472a; margin: 0 0 15px 0; font-size: 18px;">📦 Order Details</h3>
        <p style="margin: 8px 0; color: #555;"><strong>Order Number:</strong> <span style="color: #1a472a; font-weight: bold;">${orderData.orderId}</span></p>
        <p style="margin: 8px 0; color: #555;"><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString()}</p>
      </div>

      <div style="background: white; padding: 20px; border: 2px solid #e0e0e0; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #1a472a; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">🛍️ Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsTable}
          <tr style="border-top: 3px solid #1a472a;">
            <td colspan="3" style="padding: 15px 10px; font-weight: bold; font-size: 16px; color: #1a472a;">Total:</td>
            <td style="padding: 15px 10px; text-align: right; font-weight: bold; color: #c41e3a; font-size: 22px;">$${orderData.total.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      ${donationSection}

      <div style="background: linear-gradient(135deg, #fffbeb 0%, #fff9e6 100%); padding: 20px; border-radius: 8px; margin: 25px 0; border: 2px solid #d4af37;">
        <h3 style="color: #1a472a; margin: 0 0 15px 0; font-size: 18px;">💳 Payment Instructions</h3>
        <p style="margin: 0 0 15px 0; color: #555; line-height: 1.6;">Please send payment via <strong>Zelle</strong> to complete your order:</p>
        <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p style="margin: 8px 0; color: #333;"><strong>First name:</strong> ${zelle.recipientFirstName || 'Boy Scouts'}</p>
          <p style="margin: 8px 0; color: #333;"><strong>Last name:</strong> ${zelle.recipientLastName || 'of America'}</p>
          <p style="margin: 8px 0; color: #333;"><strong>Email/Phone:</strong> <span style="color: #1a472a; font-weight: bold;">${zelle.recipientContact || 'threebridgespack182@gmail.com'}</span></p>
          <p style="margin: 8px 0; color: #333;"><strong>Memo:</strong> <span style="background: #ffeb3b; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${orderData.orderId}</span></p>
        </div>
        <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 6px; padding: 12px; margin-top: 15px;">
          <p style="margin: 0; color: #856404; font-weight: bold; font-size: 14px;">⚠️ Important: Please include your order number (<strong>${orderData.orderId}</strong>) in the Zelle memo field.</p>
        </div>
      </div>

      ${scoutSection}

      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2196f3;">
        <h3 style="color: #1a472a; margin: 0 0 15px 0; font-size: 18px;">📍 Pickup Information</h3>
        <p style="margin: 8px 0; color: #555;"><strong>Date:</strong> <span style="color: #1a472a;">${pickupDate}</span></p>
        <p style="margin: 8px 0; color: #555;"><strong>Time:</strong> <span style="color: #1a472a;">${pickupTime}</span></p>
        <p style="margin: 8px 0; color: #555;"><strong>Location:</strong> <span style="color: #1a472a;">${pickupLocation}</span></p>
      </div>

      <div style="border-top: 3px solid #e0e0e0; margin-top: 30px; padding-top: 20px; text-align: center;">
        <p style="margin: 10px 0; color: #666; font-size: 14px;">If you have any questions, please contact us at <a href="mailto:${pack.leaderEmail || 'threebridgespack182@gmail.com'}" style="color: #1a472a; text-decoration: none; font-weight: bold;">${pack.leaderEmail || 'threebridgespack182@gmail.com'}</a></p>
        <p style="margin: 10px 0; color: #1a472a; font-size: 16px; font-weight: bold;">Thank you for supporting ${pack.name || 'Cub Scout Pack 182'}!</p>
      </div>
    </div>
  `;

  try {
    GmailApp.sendEmail(recipient, subject, '', {
      from: EMAIL_FROM,
      htmlBody: htmlBody,
      name: 'Pack 182 Wreath Sale'
    });
    Logger.log(`Sent order confirmation email to ${recipient} for order ${orderData.orderId}`);
    return { success: true, recipient };
  } catch (error) {
    Logger.log(`Failed to send email: ${error.toString()}`);
    throw new Error(`Failed to send email: ${error.toString()}`);
  }
}

function sendScoutWelcomeEmail(data) {
  const scout = data.scout;
  // Note: qrCodeUrl and saleLink would be used when implementing full welcome email template

  // This would require implementing the welcome email template
  // For now, return success
  Logger.log(`Scout welcome email would be sent to ${scout.email}`);
  return { success: true, message: 'Scout welcome email functionality not yet implemented' };
}
