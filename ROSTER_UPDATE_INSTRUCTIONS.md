# Roster Update Instructions

## Files Generated

The new roster from `updated_roster.html` has been parsed and converted to:

1. **scouts-data.json** - JSON format with 46 scouts
2. **scouts-data.csv** - CSV format ready for Google Sheets import

## Update Steps

### Option 1: Import CSV to Google Sheets (Recommended)

1. Open your Pack 182 Wreath Sale Google Spreadsheet
2. Navigate to the "Scouts" sheet
3. **Important**: Before replacing data, you may want to:
   - Review the existing scouts to see if any have sales data
   - Consider backing up the current sheet
4. Clear all existing data in the Scouts sheet (or delete and create new sheet)
5. Import the CSV file:
   - File → Import → Upload → Select `scouts-data.csv`
   - Import location: "Replace current sheet"
   - Separator type: "Comma"
   - Convert text to numbers: Uncheck this option
6. Verify the import:
   - Check that parent emails are in the correct format
   - Ensure 46 scouts are imported
   - Verify column headers match: `id,name,slug,rank,email,parentName,parentEmails,active`

### Option 2: Manual Update via Apps Script

If you prefer to update programmatically:

1. Copy the contents of `scouts-data.json`
2. Open your Apps Script project
3. Create a one-time function to replace the data:

```javascript
function updateScoutsFromNewRoster() {
  const scoutsData = [/* paste JSON array here */];

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Scouts');

  // Clear existing data
  sheet.clear();

  // Set headers
  sheet.appendRow(['id', 'name', 'slug', 'rank', 'email', 'parentName', 'parentEmails', 'active']);

  // Add scout data
  scoutsData.forEach(scout => {
    sheet.appendRow([
      scout.id,
      scout.name,
      scout.slug,
      scout.rank,
      scout.email,
      scout.parentName,
      scout.parentEmails.join(';'),
      scout.active
    ]);
  });

  Logger.log('Updated ' + scoutsData.length + ' scouts');
}
```

## New Roster Summary

- **Total Scouts**: 46
- **Scouts with Parent Emails**: All 46 scouts have parent contact info
- **Ranks Breakdown**:
  - Lion: 9 scouts
  - Tiger: 9 scouts
  - Wolf: 8 scouts
  - Bear: 14 scouts
  - Webelos: 6 scouts
- **Dens included**: Lion Den 2, Tiger Den 8, Wolf Den 7, Bear Den 3, Webelos Den 1

## Notable Changes

The new roster includes:
- Updated scout names and ranks
- Current den assignments
- Parent contact information (names and emails)
- All scouts marked as active

## Next Steps After Import

1. Verify the import in the admin dashboard
2. Check that scout slugs are working for URL generation
3. Test welcome email functionality with new scout data
4. Review any scouts that may have incomplete parent information
