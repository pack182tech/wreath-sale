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
 * =======================================================``==============
 */

// ============= CONFIGURATION =============
const EMAIL_FROM = 'pack182tech@gmail.com';
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const BACKEND_VERSION = '1.2.0'; // Version tracking - increment when deploying

// ============= MAIN HANDLER =============
function doGet(e) {
  const action = e.parameter.action;

  try {
    switch (action) {
      case 'healthCheck':
        return jsonResponse({
          status: 'ok',
          message: 'Apps Script backend is running',
          version: BACKEND_VERSION,
          timestamp: new Date().toISOString(),
          hasEmailFunction: typeof sendOrderConfirmationEmail === 'function'
        });

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
        Logger.log('[doPost] Calling sendOrderConfirmationEmail with data: ' + JSON.stringify(data).substring(0, 100));
        const emailResult = sendOrderConfirmationEmail(data);
        Logger.log('[doPost] Email result: ' + JSON.stringify(emailResult));
        return jsonResponse(emailResult);

      case 'sendScoutWelcomeEmail':
        return jsonResponse(sendScoutWelcomeEmail(data));

      case 'updateOrderStatus':
        return jsonResponse(updateOrderStatus(data.orderId, data.status));

      case 'deleteOrder':
        return jsonResponse(deleteOrder(data.orderId));

      case 'createScout':
        return jsonResponse(createScout(data));

      case 'updateScout':
        return jsonResponse(updateScout(data));

      case 'deleteScout':
        return jsonResponse(deleteScout(data.scoutId));

      case 'saveConfig':
        return jsonResponse(saveConfig(data));

      case 'saveEmailTemplate':
        return jsonResponse(saveEmailTemplate(data.templateKey, data.templateData));

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

function deleteOrder(orderId) {
  const sheet = getSheet('Orders');
  if (!sheet) {
    throw new Error('Orders sheet not found');
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const orderIdColumnIndex = headers.indexOf('orderId');

  if (orderIdColumnIndex === -1) {
    throw new Error('orderId column not found in Orders sheet');
  }

  for (let i = 1; i < data.length; i++) {
    if (data[i][orderIdColumnIndex] === orderId) {
      sheet.deleteRow(i + 1);
      Logger.log(`Deleted order ${orderId}`);
      return { success: true, orderId };
    }
  }

  throw new Error(`Order ${orderId} not found`);
}

// ============= SCOUT CRUD FUNCTIONS =============
function createScout(scoutData) {
  const sheet = getSheet('Scouts');
  if (!sheet) {
    throw new Error('Scouts sheet not found');
  }

  // Generate ID if not provided
  const id = scoutData.id || 'scout-' + new Date().getTime();

  const row = [
    id,
    scoutData.name,
    scoutData.slug,
    scoutData.rank,
    scoutData.email || '',
    scoutData.parentName || '',
    JSON.stringify(scoutData.parentEmails || []),
    scoutData.active !== undefined ? scoutData.active : true
  ];

  sheet.appendRow(row);
  Logger.log(`Created scout ${id}`);

  return { success: true, scoutId: id };
}

function updateScout(scoutData) {
  const sheet = getSheet('Scouts');
  if (!sheet) {
    throw new Error('Scouts sheet not found');
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idColumnIndex = headers.indexOf('id');

  if (idColumnIndex === -1) {
    throw new Error('id column not found in Scouts sheet');
  }

  for (let i = 1; i < data.length; i++) {
    if (data[i][idColumnIndex] === scoutData.id) {
      // Update each column based on headers
      headers.forEach((header, index) => {
        if (header === 'parentEmails') {
          sheet.getRange(i + 1, index + 1).setValue(JSON.stringify(scoutData.parentEmails || []));
        } else if (scoutData[header] !== undefined) {
          sheet.getRange(i + 1, index + 1).setValue(scoutData[header]);
        }
      });

      Logger.log(`Updated scout ${scoutData.id}`);
      return { success: true, scoutId: scoutData.id };
    }
  }

  throw new Error(`Scout ${scoutData.id} not found`);
}

function deleteScout(scoutId) {
  const sheet = getSheet('Scouts');
  if (!sheet) {
    throw new Error('Scouts sheet not found');
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idColumnIndex = headers.indexOf('id');

  if (idColumnIndex === -1) {
    throw new Error('id column not found in Scouts sheet');
  }

  for (let i = 1; i < data.length; i++) {
    if (data[i][idColumnIndex] === scoutId) {
      sheet.deleteRow(i + 1);
      Logger.log(`Deleted scout ${scoutId}`);
      return { success: true, scoutId };
    }
  }

  throw new Error(`Scout ${scoutId} not found`);
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

function saveConfig(configData) {
  const sheet = getSheet('Config');
  if (!sheet) {
    throw new Error('Config sheet not found');
  }

  // Save config as JSON in cell B2
  // Row 1: Headers (Key | Value)
  // Row 2: "siteConfig" | {entire JSON config object}
  sheet.getRange('B2').setValue(JSON.stringify(configData));
  Logger.log('Successfully saved config to Sheets');

  return { success: true };
}

function saveEmailTemplate(templateKey, templateData) {
  // Get current config
  const config = getConfig();
  if (!config) {
    throw new Error('Config not found');
  }

  // Update email template in config
  if (!config.emailTemplates) {
    config.emailTemplates = {};
  }

  config.emailTemplates[templateKey] = {
    ...config.emailTemplates[templateKey],
    ...templateData
  };

  // Save updated config
  return saveConfig(config);
}

// ============= EMAIL FUNCTIONS =============
function sendOrderConfirmationEmail(orderData) {
  Logger.log('[Email] Starting sendOrderConfirmationEmail');
  Logger.log('[Email] Order ID: ' + orderData.orderId);
  Logger.log('[Email] Recipient: ' + orderData.customer.email);

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
        <p style="margin: 0 0 10px 0; font-size: 20px; color: #1a472a;"><strong>Thank You for Your Generous Donation!</strong></p>
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
        <p style="margin: 0; font-size: 14px; color: #1565c0; line-height: 1.6;"><strong>Alternative Payment Option:</strong> If you are unable to use Zelle, you may pay ${scoutFirstName}'s parents directly.</p>
      </div>
      <div style="background: linear-gradient(135deg, #1a472a 0%, #2a5f3d 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
        <p style="margin: 0; font-size: 18px; color: white; font-weight: bold;">Thank you for supporting ${scoutName}!</p>
      </div>
    `;
  }

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 10px;">
      <div style="background: linear-gradient(135deg, #1a472a 0%, #2a5f3d 100%); padding: 25px; text-align: center; border-radius: 8px; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
      </div>

      <p style="font-size: 16px; line-height: 1.6; color: #333;">Dear <strong>${orderData.customer.name}</strong>,</p>
      <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for your order! Your order has been received and will be ready for pickup on <strong style="color: #1a472a;">${pickupDate}</strong>.</p>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #1a472a;">
        <h3 style="color: #1a472a; margin: 0 0 15px 0; font-size: 18px;">Order Details</h3>
        <p style="margin: 8px 0; color: #555;"><strong>Order Number:</strong> <span style="color: #1a472a; font-weight: bold;">${orderData.orderId}</span></p>
        <p style="margin: 8px 0; color: #555;"><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString()}</p>
      </div>

      <div style="background: white; padding: 20px; border: 2px solid #e0e0e0; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #1a472a; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Items Ordered</h3>
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
        <h3 style="color: #1a472a; margin: 0 0 15px 0; font-size: 18px;">Payment Instructions</h3>
        <p style="margin: 0 0 15px 0; color: #555; line-height: 1.6;">Please send payment via <strong>Zelle</strong> to complete your order:</p>
        <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p style="margin: 8px 0; color: #333;"><strong>First name:</strong> ${zelle.recipientFirstName || 'Boy Scouts'}</p>
          <p style="margin: 8px 0; color: #333;"><strong>Last name:</strong> ${zelle.recipientLastName || 'of America'}</p>
          <p style="margin: 8px 0; color: #333;"><strong>Email/Phone:</strong> <span style="color: #1a472a; font-weight: bold;">${zelle.recipientContact || 'threebridgespack182@gmail.com'}</span></p>
          <p style="margin: 8px 0; color: #333;"><strong>Memo:</strong> <span style="background: #ffeb3b; padding: 3px 8px; border-radius: 4px; font-weight: bold;">${orderData.orderId}</span></p>
        </div>
        <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 6px; padding: 12px; margin-top: 15px;">
          <p style="margin: 0; color: #856404; font-weight: bold; font-size: 14px;">IMPORTANT: Please include your order number (<strong>${orderData.orderId}</strong>) in the Zelle memo field.</p>
        </div>
      </div>

      ${scoutSection}

      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2196f3;">
        <h3 style="color: #1a472a; margin: 0 0 15px 0; font-size: 18px;">Pickup Information</h3>
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
    Logger.log('[Email] About to call GmailApp.sendEmail');
    Logger.log('[Email] From: ' + EMAIL_FROM);
    Logger.log('[Email] To: ' + recipient);
    Logger.log('[Email] Subject: ' + subject);

    // Send email to customer
    GmailApp.sendEmail(recipient, subject, '', {
      from: EMAIL_FROM,
      htmlBody: htmlBody,
      name: 'Pack 182 Wreath Sale'
    });

    Logger.log('[Email] SUCCESS: Sent order confirmation email to ' + recipient + ' for order ' + orderData.orderId);

    // If order is attributed to a scout, also send to scout's parents
    if (scoutName && scoutName !== 'SCOUT_NOT_FOUND') {
      const scouts = getScouts();
      const scout = scouts.find(s => s.id === orderData.scoutId);

      if (scout && scout.parentEmails && scout.parentEmails.length > 0) {
        const parentEmails = Array.isArray(scout.parentEmails) ? scout.parentEmails : [scout.parentEmails];
        const parentSubject = `Order for ${scoutName} - ${orderData.orderId}`;
        const parentNote = `<div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2196f3;"><p style="margin: 0; font-size: 14px; color: #1565c0; line-height: 1.6;"><strong>Parent Notification:</strong> This is a copy of the order confirmation sent to ${orderData.customer.name}. An order has been placed and attributed to ${scoutName}!</p></div>`;

        parentEmails.forEach(parentEmail => {
          try {
            GmailApp.sendEmail(parentEmail, parentSubject, '', {
              from: EMAIL_FROM,
              htmlBody: parentNote + htmlBody,
              name: 'Pack 182 Wreath Sale'
            });
            Logger.log(`Sent parent notification to ${parentEmail} for scout ${scoutName}`);
          } catch (parentEmailError) {
            Logger.log(`Failed to send parent email to ${parentEmail}: ${parentEmailError.toString()}`);
            // Don't fail the whole operation if parent email fails
          }
        });
      }
    }

    Logger.log('[Email] Returning success response');
    return { success: true, recipient };
  } catch (error) {
    Logger.log('[Email] ERROR: ' + error.toString());
    Logger.log('[Email] Error stack: ' + error.stack);
    throw new Error(`Failed to send email: ${error.toString()}`);
  }
}

function sendScoutWelcomeEmail(emailData) {
  Logger.log('[WelcomeEmail] Starting sendScoutWelcomeEmail');
  Logger.log('[WelcomeEmail] Scout: ' + emailData.scoutName);
  Logger.log('[WelcomeEmail] Parent Emails: ' + JSON.stringify(emailData.parentEmails));

  try {
    const config = getConfig();
    const firstName = emailData.firstName;
    const lastName = emailData.lastName;
    const scoutUrl = emailData.scoutUrl;
    const parentName = emailData.parentName;

    // Prepare recipient list
    const recipients = Array.isArray(emailData.parentEmails)
      ? emailData.parentEmails
      : [emailData.parentEmails];

    const subject = emailData.subject;

    // Build HTML email body
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; color: #333;">
        <div style="background: linear-gradient(135deg, #1a472a 0%, #2a5f3d 100%); color: white; padding: 30px 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="margin: 0 0 10px 0; font-size: 28px;">${config.pack.name} Wreath Sale</h1>
          <p style="margin: 0; font-size: 16px; opacity: 0.95;">Annual Fundraiser</p>
        </div>

        <div style="padding: 30px 20px;">
          <p style="font-size: 16px; line-height: 1.6; margin-top: 0;">Proud Scouting Parent,</p>

          <p style="font-size: 16px; line-height: 1.6;">
            Thank you for supporting ${firstName} ${lastName} in this year's wreath sale fundraiser!
            Below is ${firstName}'s unique sales link.
          </p>

          <div style="background: #f8fffe; border: 2px solid #d4af37; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <h2 style="color: #1a472a; margin-top: 0;">${firstName}'s Sales Link</h2>
            <p style="margin: 10px 0;">
              <a href="${scoutUrl}" style="color: #2563eb; word-break: break-all; font-size: 14px;">${scoutUrl}</a>
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${scoutUrl}" alt="QR Code for ${firstName}'s sales page" width="200" height="200" style="display: block;" />
            </div>
            <p style="font-size: 14px; color: #666; margin-top: 15px;">
              Scan this QR code to visit ${firstName}'s sales page
            </p>
          </div>

          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px 20px; border-radius: 4px; margin: 20px 0;">
            <h3 style="color: #1565c0; margin-top: 0;">How It Works</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Share this link with family, friends, and neighbors</li>
              <li style="margin-bottom: 8px;">When they make a purchase, ${firstName} gets credit automatically</li>
              <li style="margin-bottom: 8px;">Track sales progress on the leaderboard</li>
            </ul>
          </div>

          <h3 style="color: #1a472a; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">What We're Selling</h3>
          <ul style="line-height: 1.8;">
            ${config.products.filter(p => p.active).map(product =>
              `<li><strong>${product.name}</strong> - $${product.price.toFixed(2)}</li>`
            ).join('')}
          </ul>

          <h3 style="color: #1a472a; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Pickup Information</h3>
          <p style="line-height: 1.6;">
            <strong>Date:</strong> ${config.campaign.pickupDate || 'TBD'}<br />
            <strong>Time:</strong> ${config.campaign.pickupTime || 'TBD'}<br />
            <strong>Location:</strong> ${config.campaign.pickupLocation || 'TBD'}
          </p>

          <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px 20px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #e65100;">
              <strong>Important:</strong> All orders must be paid via Zelle. Payment information will be provided at checkout.
            </p>
          </div>

          <p style="font-size: 16px; line-height: 1.6;">
            Thank you for your support! If you have any questions, please contact ${config.pack.leaderName} at ${config.pack.leaderEmail}.
          </p>

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 0;">
            Yours in Scouting,<br />
            <strong>${config.pack.name}</strong>
          </p>
        </div>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; color: #666;">
          <p style="margin: 0;">${config.pack.name} • ${config.pack.location}</p>
        </div>
      </div>
    `;

    // Send email to all parent emails
    recipients.forEach(recipientEmail => {
      if (recipientEmail && recipientEmail.trim() !== '') {
        Logger.log('[WelcomeEmail] Sending to: ' + recipientEmail);
        GmailApp.sendEmail(recipientEmail, subject, '', {
          from: EMAIL_FROM,
          htmlBody: htmlBody,
          name: config.pack.name + ' Wreath Sale'
        });
        Logger.log('[WelcomeEmail] Successfully sent to: ' + recipientEmail);
      }
    });

    Logger.log('[WelcomeEmail] SUCCESS: Sent welcome email to ' + recipients.join(', '));
    return {
      success: true,
      message: 'Welcome email sent successfully to ' + recipients.join(', ')
    };

  } catch (error) {
    Logger.log('[WelcomeEmail] ERROR: ' + error.toString());
    Logger.log('[WelcomeEmail] Stack: ' + error.stack);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ============= TEST FUNCTIONS =============
// Use this function to test email sending directly from Apps Script
function testEmailSimple() {
  Logger.log('=== EMAIL TEST START ===');

  try {
    const testOrder = {
      orderId: 'MANUAL-TEST-' + Date.now(),
      customer: {
        name: 'Manual Test',
        email: 'jimmcgowan@live.com', // CHANGE THIS TO YOUR EMAIL
        phone: '555-1234'
      },
      items: [
        { name: 'Test Wreath', quantity: 1, price: 30.00 }
      ],
      total: 30.00,
      orderDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isDonation: false,
      scoutId: null
    };

    Logger.log('Calling sendOrderConfirmationEmail...');
    const result = sendOrderConfirmationEmail(testOrder);
    Logger.log('Result: ' + JSON.stringify(result));
    Logger.log('=== EMAIL TEST SUCCESS ===');

    return 'Email test completed. Check logs and your inbox!';
  } catch (error) {
    Logger.log('=== EMAIL TEST FAILED ===');
    Logger.log('Error: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    throw error;
  }
}
