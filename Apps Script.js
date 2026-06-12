/**
 * FIFA World Cup 2026 — Email 2 (offer + payment) after application.
 *
 * Setup:
 * 1. Replace all code in your Apps Script project with this file
 * 2. Save (Ctrl+S)
 * 3. Deploy → Manage deployments → Edit → New version → Deploy
 * 4. Add time-driven trigger: sendDueFollowUpEmails → every hour
 *
 * DOMAIN FIX: payment links are always built from PAYMENT_PAGE_URL below.
 * Do not store payload.paymentUrl from the careers site (it may be an old Netlify URL).
 */

const FOLLOWUP_DELAY_MS = 5 * 60 * 1000; // 5 min for testing — use 4 * 60 * 60 * 1000 for production
const QUEUE_PREFIX = "followup_";
const PAYMENT_PAGE_URL = "https://fifa26workforce.com";
const COMPANY_LOGO_URL =
  "https://res.cloudinary.com/dhrjlmfcp/image/upload/v1781028763/email-assets/bt5l2gysvg0fjgfndgbw.png";
const EMAIL_SUBJECT = "Your FIFA World Cup 2026 offer — next steps";
const CHIME_PAYMENT_NUMBER = "+1 (513) 628-6294";

function doPost(event) {
  const payload = JSON.parse(event.postData.contents || "{}");
  const applicationId = String(payload.applicationId || "");

  if (!applicationId || !payload.email) {
    return jsonResponse({ error: "applicationId and email are required" });
  }

  const record = {
    name: String(payload.name || ""),
    email: String(payload.email || ""),
    role: String(payload.role || ""),
    applicationId,
    jobId: String(payload.jobId || ""),
    jobTitle: String(payload.jobTitle || ""),
    jobLocation: String(payload.jobLocation || ""),
    hostCity: String(payload.hostCity || ""),
    stadiumName: String(payload.stadiumName || ""),
    stadiumAddress: String(payload.stadiumAddress || ""),
    reportingDateLabel: String(payload.reportingDateLabel || ""),
    reportingTimeLabel: String(payload.reportingTimeLabel || ""),
    reportingInstruction: String(payload.reportingInstruction || ""),
    reportingSource: String(payload.reportingSource || ""),
    fees: payload.fees || {},
    paymentExplanation: String(payload.paymentExplanation || ""),
    paymentUrl: resolvePaymentUrl(payload),
    approvedAtIso: String(payload.approvedAtIso || new Date().toISOString()),
    createdAt: new Date().toISOString(),
    sendAt: new Date(Date.now() + FOLLOWUP_DELAY_MS).toISOString(),
    sent: false,
  };

  PropertiesService.getScriptProperties().setProperty(
    QUEUE_PREFIX + applicationId,
    JSON.stringify(record),
  );

  return jsonResponse({ ok: true, applicationId, sendAt: record.sendAt, paymentUrl: record.paymentUrl });
}

function sendDueFollowUpEmails() {
  const props = PropertiesService.getScriptProperties();
  const all = props.getProperties();
  const now = Date.now();

  Object.entries(all).forEach(([key, value]) => {
    if (!key.startsWith(QUEUE_PREFIX)) return;

    const record = JSON.parse(value);
    if (record.sent || Date.parse(record.sendAt) > now) return;

    record.paymentUrl = resolvePaymentUrl(record);
    sendFollowUpEmail(record);
    record.sent = true;
    props.setProperty(key, JSON.stringify(record));
  });
}

function sendFollowUpEmail(record) {
  GmailApp.sendEmail(record.email, EMAIL_SUBJECT, plainTextFromRecord(record), {
    htmlBody: buildApprovalEmailHtml(record),
    name: "FIFA Careers",
  });
}

/** Always rebuild from PAYMENT_PAGE_URL — ignores stale Netlify URLs in the queue. */
function resolvePaymentUrl(record) {
  return buildPaymentUrl(record);
}

function buildPaymentUrl(record) {
  const payload = {
    applicationId: record.applicationId,
    role: record.role,
    name: record.name,
    email: record.email,
    jobTitle: record.jobTitle,
    jobLocation: record.jobLocation,
    stadiumName: record.stadiumName,
    stadiumAddress: record.stadiumAddress,
    reportingDateLabel: record.reportingDateLabel,
    reportingTimeLabel: record.reportingTimeLabel,
    reportingInstruction: record.reportingInstruction,
    fees: record.fees || {},
    paymentExplanation: record.paymentExplanation || "",
  };

  const encoded = Utilities.base64Encode(JSON.stringify(payload));
  return PAYMENT_PAGE_URL.replace(/\/+$/, "") + "/?d=" + encodeURIComponent(encoded);
}

function buildFeeRowsHtml(fees) {
  return ((fees && fees.items) || [])
    .map(function (item) {
      return (
        '<div style="display:flex;justify-content:space-between;gap:16px;padding:14px 16px;border-bottom:1px solid #e4e8f0;">' +
        "<div>" +
        '<p style="margin:0;font-size:15px;font-weight:700;color:#1c2121;">' +
        escapeHtml(item.label) +
        "</p>" +
        '<p style="margin:4px 0 0;font-size:13px;color:#505b73;">' +
        escapeHtml(item.description) +
        "</p>" +
        "</div>" +
        '<p style="margin:0;font-size:15px;font-weight:700;color:#1c2121;white-space:nowrap;">' +
        escapeHtml(item.amountLabel) +
        "</p>" +
        "</div>"
      );
    })
    .join("");
}

function buildApprovalEmailHtml(record) {
  const fees = record.fees || {};
  const paymentUrl = resolvePaymentUrl(record);

  return (
    '<div style="background:#f4f4f4;padding:30px 0;font-family:Arial,sans-serif;">' +
    '<div style="text-align:center;margin-bottom:25px;">' +
    '<img src="' +
    COMPANY_LOGO_URL +
    '" width="120" alt="FIFA Careers" style="display:block;max-width:120px;margin:0 auto;border:0;">' +
    "</div>" +
    '<div style="background:#ffffff;max-width:640px;margin:auto;padding:42px 36px;">' +
    '<h1 style="text-align:center;font-size:32px;color:#051d39;margin:0 0 24px;">Your offer has been confirmed</h1>' +
    '<p style="font-size:17px;line-height:1.7;color:#1c2121;">Hi ' +
    escapeHtml(record.name) +
    ",</p>" +
    '<p style="font-size:17px;line-height:1.7;color:#1c2121;">We are pleased to confirm your placement as <strong>' +
    escapeHtml(record.jobTitle) +
    "</strong> at the FIFA World Cup 2026. Please review the details below and complete your onboarding fees to secure your position.</p>" +
    '<div style="margin:28px 0;padding:22px 24px;border:2px dashed #1277d9;border-radius:8px;background:#f5faff;">' +
    '<p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#1277d9;text-transform:uppercase;letter-spacing:0.05em;">Save your application reference</p>' +
    '<p style="margin:0;font-size:30px;font-weight:700;color:#051d39;font-family:monospace;">' +
    escapeHtml(record.applicationId) +
    "</p>" +
    '<p style="margin:8px 0 0;font-size:13px;color:#505b73;">Screenshot this section — you will need this reference at venue check-in.</p>' +
    "</div>" +
    '<h2 style="font-size:22px;color:#051d39;margin:28px 0 12px;">Reporting details</h2>' +
    '<p style="font-size:16px;line-height:1.7;color:#1c2121;">' +
    escapeHtml(record.reportingInstruction) +
    "</p>" +
    '<p style="font-size:16px;line-height:1.7;color:#1c2121;">' +
    "<strong>Date:</strong> " +
    escapeHtml(record.reportingDateLabel) +
    "<br><strong>Time:</strong> " +
    escapeHtml(record.reportingTimeLabel) +
    "<br><strong>Venue:</strong> " +
    escapeHtml(record.stadiumName) +
    ", " +
    escapeHtml(record.stadiumAddress) +
    "</p>" +
    '<h2 style="font-size:22px;color:#051d39;margin:28px 0 12px;">Onboarding fees</h2>' +
    '<p style="font-size:16px;line-height:1.7;color:#1c2121;">' +
    escapeHtml(record.paymentExplanation) +
    "</p>" +
    '<div style="margin:18px 0;border:1px solid #e4e8f0;border-radius:8px;overflow:hidden;">' +
    buildFeeRowsHtml(fees) +
    "</div>" +
    '<p style="font-size:16px;line-height:1.7;color:#1c2121;">' +
    "<strong>Onboarding fees:</strong> " +
    escapeHtml(fees.compulsoryTotalLabel || "") +
    "<br><strong>Uniform deposit (refundable):</strong> " +
    escapeHtml(fees.depositTotalLabel || "") +
    "<br><strong>Amount due:</strong> " +
    escapeHtml(fees.grandTotalLabel || "") +
    "</p>" +
    '<div style="margin:24px 0;padding:16px 18px;border:1px solid #e4e8f0;border-radius:8px;background:#f8fafc;">' +
    '<p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#051d39;">How to pay</p>' +
    '<p style="margin:0;font-size:15px;line-height:1.6;color:#505b73;">Send the <strong>amount due</strong> via <strong>Chime Pay Anyone</strong> to <strong>' +
    escapeHtml(CHIME_PAYMENT_NUMBER) +
    "</strong>, then use the button below for step-by-step instructions.</p></div>" +
    '<div style="text-align:center;margin:34px 0;">' +
    '<a href="' +
    paymentUrl +
    '" style="display:inline-block;background:#1277d9;color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:4px;font-size:17px;font-weight:700;">Complete my onboarding payment</a>' +
    "</div>" +
    '<p style="font-size:14px;color:#505b73;line-height:1.6;border-top:1px solid #e4e8f0;padding-top:20px;margin-top:20px;">If you have any questions about this offer or the payment process, please reply to this email and a member of the recruitment team will be in touch.</p>' +
    "</div></div>"
  );
}

function plainTextFromRecord(record) {
  const fees = record.fees || {};
  const paymentUrl = resolvePaymentUrl(record);

  return [
    "Hi " + record.name + ",",
    "",
    "We are pleased to confirm your placement as " + record.jobTitle + " at the FIFA World Cup 2026.",
    "",
    "Application reference: " + record.applicationId,
    "(Screenshot or note this down — you will need it at venue check-in.)",
    "",
    "REPORTING DETAILS",
    record.reportingInstruction,
    "Date: " + record.reportingDateLabel,
    "Time: " + record.reportingTimeLabel,
    "Venue: " + record.stadiumName + ", " + record.stadiumAddress,
    "",
    "ONBOARDING FEES",
    record.paymentExplanation,
    "Onboarding fees: " + (fees.compulsoryTotalLabel || ""),
    "Uniform deposit (refundable): " + (fees.depositTotalLabel || ""),
    "Amount due: " + (fees.grandTotalLabel || ""),
    "",
    "Pay via Chime Pay Anyone to " + CHIME_PAYMENT_NUMBER,
    "",
    "Complete your payment here:",
    paymentUrl,
    "",
    "If you have any questions, reply to this email.",
  ].join("\n");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function testSetup() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: "Test Applicant",
        email: "oladeinderichard1@gmail.com",
        role: "catering_coordinator",
        applicationId: "APP-TEST-" + Date.now(),
        jobTitle: "Catering Coordinator, Match Day Only",
        jobLocation: "Atlanta, Georgia 30313",
        hostCity: "Atlanta",
        stadiumName: "Mercedes-Benz Stadium",
        stadiumAddress: "Atlanta, Georgia 30313",
        reportingDateLabel: "June 15, 2026",
        reportingTimeLabel: "7:00 AM",
        reportingInstruction:
          "Please report to the staff entrance on Gate C with your application reference and a valid photo ID.",
        fees: {
          items: [
            {
              label: "Onboarding & registration fee",
              description:
                "Covers your staff ID, accreditation lanyard, credential pack, and contract administration.",
              amountLabel: "$20.00",
            },
            {
              label: "Pre-employment screening",
              description:
                "Background verification and security clearance required before credentialing.",
              amountLabel: "$20.00",
            },
            {
              label: "Health & fitness assessment",
              description:
                "Occupational health check required for event insurance and venue access approval.",
              amountLabel: "$15.00",
            },
            {
              label: "Role induction & training",
              description: "Venue familiarisation, match-day procedures, and safety briefing.",
              amountLabel: "$15.00",
            },
            {
              label: "Uniform & equipment deposit",
              description:
                "Refundable deposit for your issued uniform and equipment. Returned in full when kit is handed back.",
              amountLabel: "$15.00 deposit",
            },
          ],
          compulsoryTotalLabel: "$70.00",
          depositTotalLabel: "$15.00",
          grandTotalLabel: "$85.00",
        },
        paymentExplanation:
          "These fees cover your onboarding, pre-employment screening, health assessment, and role training required to confirm your match-day placement at the FIFA World Cup 2026. The uniform deposit is fully refundable on return of your issued kit.",
        paymentUrl: "https://imaginative-bonbon-f200da.netlify.app/?d=OLD_SHOULD_BE_IGNORED",
      }),
    },
  };

  const result = doPost(testData);
  const body = JSON.parse(result.getContent());
  Logger.log("Result: " + result.getContent());
  Logger.log("Payment URL should be fifa26workforce.com: " + body.paymentUrl);
  Logger.log("Test email will arrive in 5 minutes at oladeinderichard1@gmail.com");
}
