// Google Apps Script code to connect your website to Google Sheets
// This code should be deployed as a Web App in Google Apps Script

// SETUP INSTRUCTIONS:
// 1. Go to https://script.google.com/
// 2. Create a new project
// 3. Paste this code
// 4. Click "Deploy" > "New deployment"
// 5. Select type: "Web app"
// 6. Set "Execute as": Me
// 7. Set "Who has access": Anyone
// 8. Click "Deploy" and copy the URL
// 9. Replace 'YOUR_SCRIPT_URL' in script.js with the URL you copied

function doPost(e) {
  try {
    // Get the active spreadsheet (or create one)
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // If this is the first time, add headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Vehicle Number',
        'Mobile Number',
        'Service',
        'Step 1: Front Office 01 - Document Check (sec)',
        'Step 2: Front Office 02 - System Entry (sec)',
        'Step 3: Receive Token/Payment Slip (sec)',
        'Step 4: Bank - Payment (sec)',
        'Step 5: Front Office 03 - Counter Number (sec)',
        'Step 6: Waiting Area - Wait for Call (sec)',
        'Step 7: Front Office 04 - Collect Book (sec)',
        'Total Time (sec)',
        'Total Time (min)'
      ]);
    }
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Calculate total time in minutes
    var totalMinutes = (data.totalTime / 60).toFixed(2);
    
    // Add new row with data
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.vehicleNumber,
      data.mobileNumber,
      data.service,
      data.step1Time,
      data.step2Time,
      data.step3Time,
      data.step4Time,
      data.step5Time,
      data.step6Time,
      data.step7Time,
      data.totalTime,
      totalMinutes
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify the script works
function doGet(e) {
  return ContentService.createTextOutput('Server is running! Use POST to submit data.');
}
