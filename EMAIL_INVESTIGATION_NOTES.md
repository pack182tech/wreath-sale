# Email Investigation Notes - Paused

## Status
Email confirmation not being sent to customers after order placement.

## Facts Confirmed
1. ✅ Apps Script backend version 1.1.0 deployed and responding
2. ✅ healthCheck endpoint returns: `{"status":"ok","version":"1.1.0","hasEmailFunction":true}`
3. ✅ Local APPS_SCRIPT_BACKEND.js file contains sendOrderConfirmationEmail function (line 274-421)
4. ✅ doPost executions showing in Google Apps Script Executions panel
5. ✅ Orders are being saved to Google Sheets successfully

## Issue
- Customer placed order, received alert: "Your order was placed successfully, but we couldn't send the confirmation email"
- No email received at customer email address
- No email in spam/junk folder

## Investigation Attempted
- Tried to view execution logs in Apps Script Executions panel
- Clicking on execution rows does not show details/logs in current UI
- Unable to confirm whether sendOrderConfirmationEmail was actually called

## Next Steps When Resuming
1. Add testEmail() function to Apps Script to manually test email sending
2. Run testEmail() manually to trigger authorization flow if needed
3. Check if GmailApp.sendEmail requires specific permissions
4. Review execution logs using "Execution log" button at top of Apps Script editor
5. Consider using console.log() instead of Logger.log() for persistent logging

## Code Changes Made But Not Yet Tested
- Updated APPS_SCRIPT_BACKEND.js to v1.2.0 with enhanced logging in doPost email case
- Added explicit Logger.log statements before/after sendOrderConfirmationEmail call
- Code is in clipboard but not yet deployed to Apps Script

## Files
- Local: /Users/jimmcgowan/Jim/BoySchools/wreath-site/APPS_SCRIPT_BACKEND.js
- Needs deployment to Google Apps Script with new version
