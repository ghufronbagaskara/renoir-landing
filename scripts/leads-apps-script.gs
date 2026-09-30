// Lead sink for the contact form: appends a row to this Google Sheet and emails the owner.
// Not part of the build. Install once:
//   1. Create a Google Sheet → Extensions → Apps Script → paste this file.
//   2. Project Settings → Script properties: LEADS_SECRET (long random string), NOTIFY_EMAIL (owner inbox).
//   3. Deploy → New deployment → Web app · Execute as: Me · Who has access: Anyone → copy the /exec URL.
//   4. Set LEADS_WEBHOOK_URL (the /exec URL) and LEADS_WEBHOOK_SECRET (same secret) in .env / GitHub secrets.
// Re-deploy (Manage deployments → Edit → New version) after changing this code; the URL stays the same.

const COLUMNS = ["receivedAt", "build_type", "budget", "timeline", "name", "company", "email", "locale", "source", "message", "status", "replied_at", "next_step"];

function doPost(e) {
  const props = PropertiesService.getScriptProperties();
  let lead;
  try {
    lead = JSON.parse(e.postData.contents);
  } catch (_) {
    return json({ ok: false });
  }
  if (!lead.secret || lead.secret !== props.getProperty("LEADS_SECRET")) return json({ ok: false });

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
  // status / replied_at / next_step are filled in by hand while following up.
  sheet.appendRow(COLUMNS.map((c) => (c === "status" ? "new" : cell(lead[c]))));

  const to = props.getProperty("NOTIFY_EMAIL");
  if (to) MailApp.sendEmail({ to, replyTo: lead.email, subject: "New enquiry from " + String(lead.name).replace(/[\r\n]/g, " "), body: lead.text });

  return json({ ok: true });
}

// Visitor text starting with = + - @ would run as a Sheets formula; a leading ' stores it as plain text.
function cell(value) {
  const s = value == null ? "" : String(value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
