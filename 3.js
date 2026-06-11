/* World Cup Staff — Chime Payment Page */

const CONFIG = {
  chimePhoneNumber: "+1 (513) 628-6294",
  organizerEmail:   "payments@yourevent.com",
};

/* ── ICONS ─────────────────────────────────────────────────── */
const ICONS = {
  id:       `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/></svg>`,
  shield:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  medical:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  training: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  shirt:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>`,
  star:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  truck:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  food:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  ops:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>`,
  hotel:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  people:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
};

/* ── ROLE FEE DEFINITIONS ──────────────────────────────────────
   URL key → fee breakdown
   Link format: payment.html?role=KEY&applicationId=APP-XXXXX
───────────────────────────────────────────────────────────────*/
const ROLE_FEES = {

  /* ── $28/hr ROLES ── */

  catering_coordinator: {
    name: "Catering Coordinator, Match Day Only",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & food safety check", desc: "Mandatory background and food handling compliance check",         amount: 30, deposit: false },
      { icon: "medical",  label: "Food handler medical certificate",      desc: "Health clearance required for all food service staff",           amount: 25, deposit: false },
      { icon: "training", label: "Catering operations training",          desc: "Food safety, venue procedures, and service standards",           amount: 20, deposit: false },
      { icon: "shirt",    label: "Catering uniform & equipment deposit",  desc: "Chef whites, apron, and ID — returned after event",              amount: 20, deposit: true  },
    ]
  },

  fan_ops_venue: {
    name: "FIFA Fan Operations Venue Coordinator, Match Day Only",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & security clearance",desc: "Mandatory for all fan-facing venue personnel",                   amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening / fitness check",    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Fan operations & venue training",      desc: "Crowd flow, fan engagement, and emergency procedures",           amount: 15, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  fan_ops_gate: {
    name: "FIFA Fan Operations Gate Supervisor, Match Day Only",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & security clearance",desc: "Mandatory for all gate and access control personnel",            amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening / fitness check",    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Gate operations & access control training", desc: "Ticketing, crowd flow, and emergency procedures",           amount: 15, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  fb_coordinator: {
    name: "Food & Beverage Coordinator",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & food safety check", desc: "Mandatory background and food handling compliance check",         amount: 30, deposit: false },
      { icon: "medical",  label: "Food handler medical certificate",      desc: "Health clearance required for all food service staff",           amount: 25, deposit: false },
      { icon: "training", label: "F&B operations training",              desc: "Food safety, hygiene standards, and service protocols",          amount: 20, deposit: false },
      { icon: "shirt",    label: "F&B uniform & equipment deposit",      desc: "Apron, cap, and ID — returned after event",                     amount: 20, deposit: true  },
    ]
  },

  guest_ops_outer: {
    name: "Guest Operations Outer Area Coordinator, Match Day Only",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & security clearance",desc: "Mandatory for all outer area personnel",                         amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening / fitness check",    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Guest operations training",            desc: "Guest services, crowd management, and emergency protocols",      amount: 15, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  ticketing_resolution: {
    name: "Ticketing Resolution Assistant, Match Day Only",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check",                     desc: "Mandatory for all ticketing and access personnel",               amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Ticketing systems & resolution training", desc: "Dispute handling, system training, and fan communication",    amount: 15, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  /* ── $29/hr ROLES ── */

  volunteer_coordinator: {
    name: "Coordinator, Host City Volunteer",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check",                     desc: "Mandatory for all volunteer-facing staff",                       amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Volunteer coordination training",      desc: "Volunteer management, scheduling, and communication protocols",  amount: 20, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  /* ── $31/hr ROLES ── */

  youth_coordinator: {
    name: "Youth Program Coordinator",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & child safety check",desc: "Enhanced check mandatory for all youth-facing roles",            amount: 35, deposit: false },
      { icon: "medical",  label: "Medical screening / fitness check",    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Youth program & safeguarding training",desc: "Child protection, program delivery, and emergency procedures",   amount: 25, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  team_hotel_coord: {
    name: "Team Hotel Coordinator",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & security clearance",desc: "Enhanced clearance required for team hotel access",              amount: 35, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Hotel operations & team services training", desc: "Protocol, confidentiality, and team liaison procedures",    amount: 20, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  transport_hotline: {
    name: "Transport Hotline Coordinator",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check",                     desc: "Mandatory for all transport operations personnel",               amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Transport systems & hotline training", desc: "Dispatch systems, communication protocols, and incident handling", amount: 20, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  teams_transport_coord: {
    name: "Teams Transport Coordinator",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & security clearance",desc: "Enhanced check required for team transport access",              amount: 35, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Teams transport & protocol training",  desc: "VIP transport procedures, team liaison, and security protocols", amount: 20, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  biz_ops_coord: {
    name: "Coordinator, Business Operations",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check",                     desc: "Mandatory for all business operations personnel",                amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Business operations training",         desc: "Systems, reporting, and operational procedures",                 amount: 20, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  parking_coord: {
    name: "Sr. Parking Coordinator",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check",                     desc: "Mandatory for all external venue operations personnel",          amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Parking & traffic management training",desc: "Lot management, crowd flow, and emergency procedures",           amount: 15, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  /* ── $34/hr ROLES ── */

  security_exterior: {
    name: "Manager, Stadium Exterior Security, Match Day Only",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Comprehensive check required for all security management roles", amount: 45, deposit: false },
      { icon: "medical",  label: "Physical fitness assessment",          desc: "Active duty fitness evaluation required for security managers",  amount: 25, deposit: false },
      { icon: "training", label: "Security management certification",    desc: "Crowd control, command protocols, and emergency response",       amount: 40, deposit: false },
      { icon: "shirt",    label: "Security uniform & equipment deposit", desc: "Uniform, vest, radio holster, and ID — returned after event",    amount: 30, deposit: true  },
    ]
  },

  crowd_management: {
    name: "Specialist, Stadium Crowd Management, Match Day Only",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & security clearance",desc: "Required for all stadium crowd management personnel",            amount: 40, deposit: false },
      { icon: "medical",  label: "Physical fitness assessment",          desc: "Fitness check required for active crowd management duties",      amount: 25, deposit: false },
      { icon: "training", label: "Crowd management & safety training",   desc: "Crowd dynamics, de-escalation, and emergency evacuation",        amount: 35, deposit: false },
      { icon: "shirt",    label: "Security uniform & equipment deposit", desc: "Uniform, vest, and ID — returned after event",                  amount: 30, deposit: true  },
    ]
  },

  hospitality_security: {
    name: "Specialist, Stadium Hospitality Security, Match Day Only",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & security clearance",desc: "Enhanced check required for VIP hospitality area access",        amount: 45, deposit: false },
      { icon: "medical",  label: "Physical fitness assessment",          desc: "Fitness check required for active security duties",              amount: 25, deposit: false },
      { icon: "training", label: "Hospitality security training",        desc: "VIP protocols, conflict resolution, and emergency response",     amount: 35, deposit: false },
      { icon: "shirt",    label: "Security uniform & equipment deposit", desc: "Formal security attire and ID — returned after event",           amount: 30, deposit: true  },
    ]
  },

  pitch_security: {
    name: "Specialist, Stadium Pitch & Competition Security, Match Day Only",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Comprehensive check required for all pitch-side personnel",      amount: 50, deposit: false },
      { icon: "medical",  label: "Physical fitness assessment",          desc: "Active duty fitness required for pitch-side security roles",     amount: 25, deposit: false },
      { icon: "training", label: "Pitch & competition security training",desc: "FIFA competition rules, pitch access protocols, and response",   amount: 40, deposit: false },
      { icon: "shirt",    label: "Security uniform & equipment deposit", desc: "Full pitch-side security kit — returned after event",            amount: 30, deposit: true  },
    ]
  },

  psa_vsa: {
    name: "Specialist, Stadium PSA/VSA, Match Day Only",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Comprehensive check required for PSA/VSA designated roles",      amount: 50, deposit: false },
      { icon: "medical",  label: "Physical fitness assessment",          desc: "Active fitness required for stadium safety officer duties",      amount: 25, deposit: false },
      { icon: "training", label: "PSA/VSA certification training",       desc: "Stadium safety certification and emergency response protocols",  amount: 40, deposit: false },
      { icon: "shirt",    label: "Security uniform & equipment deposit", desc: "Full safety officer kit — returned after event",                 amount: 30, deposit: true  },
    ]
  },

  /* ── $36/hr ROLES ── */

  commercial_fan_exp: {
    name: "Commercial Stadium Fan Experience Management",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check",                     desc: "Mandatory for all commercial and fan experience personnel",      amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Fan experience & commercial training", desc: "Brand standards, fan engagement, and commercial delivery",       amount: 25, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  tournament_ops: {
    name: "Tournament Operations Event Roles",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & security clearance",desc: "Mandatory for all tournament operations personnel",              amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Tournament operations training",       desc: "Venue procedures, coordination systems, and emergency protocols",amount: 25, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  team_services_venue: {
    name: "Team Services Venue Officer",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Enhanced clearance required for direct team-side access",        amount: 40, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Team services & venue protocol training", desc: "Team liaison, confidentiality, and venue operations",         amount: 25, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  guest_relations: {
    name: "Guest Relations",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check",                     desc: "Mandatory for all guest-facing personnel",                       amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Guest relations & hospitality training","desc": "Service standards, VIP handling, and communication protocols",amount: 25, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  airport_supervisor: {
    name: "Airport Supervisor",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Airport-level security clearance required",                      amount: 45, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Airport operations training",          desc: "Airside protocols, delegation handling, and customs liaison",    amount: 25, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  fleet_shuttle_supervisor: {
    name: "Fleet & Shuttle Supervisor",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check",                     desc: "Mandatory for all transport operations personnel",               amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Fleet management & driver safety training", desc: "Fleet coordination, shuttle scheduling, and safety protocols", amount: 25, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  ceremonies_production: {
    name: "Ceremonies Production Integration",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & security clearance",desc: "Mandatory for all pitch-adjacent ceremonies personnel",          amount: 35, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Ceremonies production training",       desc: "Broadcast integration, pitch protocols, and rehearsal procedures",amount: 30, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  vvip_hotel_supervisor: {
    name: "Supervisor, Guests VVIP/VIP Hotels",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Comprehensive check required for VVIP hotel access",             amount: 50, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "VVIP hospitality & protocol training", desc: "VIP service standards, confidentiality, and security procedures",amount: 30, deposit: false },
      { icon: "shirt",    label: "Formal uniform & equipment deposit",   desc: "VVIP-grade uniform and ID — returned after event",               amount: 25, deposit: true  },
    ]
  },

  medical_care_navigator: {
    name: "Medical Care Navigator, MOC",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & clearance",         desc: "Mandatory for all medical operations centre personnel",          amount: 30, deposit: false },
      { icon: "medical",  label: "Medical credential verification",      desc: "License and qualification verification",                         amount: 35, deposit: false },
      { icon: "training", label: "MOC navigation & protocol training",   desc: "Medical coordination, triage routing, and communications",       amount: 25, deposit: false },
      { icon: "shirt",    label: "Medical uniform & equipment deposit",  desc: "Scrubs, badge, and basic kit — returned after event",            amount: 25, deposit: true  },
    ]
  },

  transport_ref_supervisor: {
    name: "Supervisor, Transport Client Services Referees",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Enhanced check required for referee transport escort roles",     amount: 45, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "VIP transport & referee protocol training", desc: "Escort procedures, confidentiality, and security protocols",amount: 25, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  toc_services: {
    name: "TOC Support - Services Technology Systems Manager, Match Day Only",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & security clearance",desc: "Mandatory for all tournament operations centre personnel",       amount: 35, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "TOC systems & technology training",    desc: "Operations centre systems, technology protocols, and procedures",amount: 30, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  venue_transport_supervisor: {
    name: "Venue Transport Supervisor",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check",                     desc: "Mandatory for all venue transport operations personnel",         amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Venue transport & logistics training", desc: "Fleet management, scheduling, and emergency procedures",         amount: 25, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  teams_transport_supervisor: {
    name: "Teams Transport Supervisor",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Enhanced check required for team transport management",          amount: 45, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Teams transport management training",  desc: "VIP transport supervision, team protocols, and security",        amount: 25, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  training_site_transport: {
    name: "Supervisor, Training Site Venue Transport",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Required for training site access and team transport",           amount: 40, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Training site transport training",     desc: "Secure transport procedures, team protocols, and logistics",     amount: 25, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  transport_side_events: {
    name: "Transport Side Events Supervisor",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check",                     desc: "Mandatory for all transport operations personnel",               amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Side events transport training",       desc: "Multi-venue scheduling, VIP logistics, and coordination",        amount: 25, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  live_stream_tech: {
    name: "Live & VOD Stream Operations Technician",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & security clearance",desc: "Mandatory for all broadcast and technical operations personnel", amount: 30, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Broadcast systems & streaming training","desc": "Live streaming, VOD systems, and technical protocols",         amount: 30, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  transport_guests_supervisor: {
    name: "Supervisor, Transport Client Services Guests",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Enhanced check required for guest transport management",         amount: 40, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Guest transport & service training",   desc: "VIP client services, scheduling, and logistics protocols",       amount: 25, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  /* ── $38/hr ROLES ── */

  toc_integration_mgr: {
    name: "TOC Services Teams & Referees Integration Manager",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Comprehensive check required for TOC management role",           amount: 45, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "TOC integration & management training","desc": "Teams/referees integration, systems management, and protocols", amount: 35, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  /* ── $40/hr ROLES ── */

  vip_lounge_mgr: {
    name: "VIP Lounge Manager, Match Day Only",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Comprehensive check required for VIP lounge management",         amount: 50, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "VIP lounge management training",       desc: "Luxury hospitality standards, VIP handling, and protocols",      amount: 35, deposit: false },
      { icon: "shirt",    label: "Formal uniform & equipment deposit",   desc: "VIP-grade uniform and ID — returned after event",                amount: 30, deposit: true  },
    ]
  },

  /* ── $41/hr ROLES ── */

  commercial_ops_specialist: {
    name: "Specialist, Commercial Operations",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check",                     desc: "Mandatory for all commercial operations personnel",              amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Commercial operations training",       desc: "Commercial rights delivery, brand compliance, and operations",   amount: 30, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  biz_ops_finance: {
    name: "Specialist, Business Operations - Finance",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & financial check",   desc: "Enhanced check required for all finance personnel",              amount: 40, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Finance operations training",          desc: "Financial systems, compliance, and reporting procedures",        amount: 30, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  /* ── $45/hr ROLES ── */

  deputy_workforce_mgr: {
    name: "Deputy Workforce Manager",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Senior-level comprehensive check required",                      amount: 50, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Workforce management training",        desc: "HR systems, staff scheduling, compliance, and leadership",       amount: 40, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  commercial_rights_mgr: {
    name: "Manager, Commercial Rights Delivery",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check",                     desc: "Mandatory for all commercial rights personnel",                  amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Commercial rights & delivery training","desc": "FIFA commercial protocols, rights management, and compliance", amount: 40, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  warehouse_mgr: {
    name: "Manager, Warehouse",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check",                     desc: "Mandatory for all warehouse operations personnel",               amount: 25, deposit: false },
      { icon: "medical",  label: "Medical screening / fitness check",    desc: "Physically active role — fitness check required",                amount: 20, deposit: false },
      { icon: "training", label: "Warehouse management & safety training","desc": "Inventory systems, health & safety, and logistics protocols", amount: 35, deposit: false },
      { icon: "shirt",    label: "Uniform & equipment deposit",          desc: "Hi-vis vest, safety equipment, and ID — returned after event",   amount: 25, deposit: true  },
    ]
  },

  venue_hotel_mgr: {
    name: "Venue Hotel Manager",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Comprehensive check required for venue hotel management",        amount: 50, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Venue hotel management training",      desc: "Hotel operations, VIP standards, and stakeholder protocols",     amount: 40, deposit: false },
      { icon: "shirt",    label: "Formal uniform & equipment deposit",   desc: "Management-grade uniform and ID — returned after event",         amount: 25, deposit: true  },
    ]
  },

  vip_hotel_mgr: {
    name: "V.I.P Hotel Manager",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Comprehensive check required for VIP hotel management",          amount: 55, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "VIP hotel management training",        desc: "Luxury standards, VVIP protocols, and stakeholder management",   amount: 45, deposit: false },
      { icon: "shirt",    label: "Formal uniform & equipment deposit",   desc: "VIP-grade management uniform and ID — returned after event",     amount: 30, deposit: true  },
    ]
  },

  venue_infrastructure_mgr: {
    name: "Venue Infrastructure Manager",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & security clearance",desc: "Mandatory for all venue infrastructure personnel",               amount: 35, deposit: false },
      { icon: "medical",  label: "Medical screening / fitness check",    desc: "Active role — fitness check required",                           amount: 20, deposit: false },
      { icon: "training", label: "Venue infrastructure management training","desc": "Infrastructure systems, safety standards, and operations",   amount: 40, deposit: false },
      { icon: "shirt",    label: "Uniform & PPE deposit",                desc: "Safety gear and ID — returned after event",                     amount: 25, deposit: true  },
    ]
  },

  venue_ops_mgr: {
    name: "Venue Operations Manager",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Senior-level check required for venue operations management",    amount: 50, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Venue operations management training", desc: "Full venue systems, team oversight, and emergency management",   amount: 40, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

  /* ── $46/hr ROLES ── */

  senior_catering_coord: {
    name: "Senior Coordinator, Catering",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Background check & food safety check", desc: "Senior-level background and food handling compliance check",     amount: 35, deposit: false },
      { icon: "medical",  label: "Food handler medical certificate",      desc: "Senior health clearance required for catering management",      amount: 25, deposit: false },
      { icon: "training", label: "Senior catering operations training",  desc: "Management-level food safety, team supervision, and standards",  amount: 30, deposit: false },
      { icon: "shirt",    label: "Management uniform & equipment deposit","desc": "Senior catering kit and ID — returned after event",            amount: 25, deposit: true  },
    ]
  },

  transport_ref_coord: {
    name: "Coordinator, Transport Client Services Referees",
    fees: [
      { icon: "id",       label: "Staff registration & admin fee",       desc: "Onboarding, ID card, lanyard, and contract processing",          amount: 30, deposit: false },
      { icon: "shield",   label: "Enhanced background & security check", desc: "Enhanced check required for referee transport coordination",     amount: 45, deposit: false },
      { icon: "medical",  label: "Medical screening",                    desc: "Required for event insurance compliance",                        amount: 20, deposit: false },
      { icon: "training", label: "Referee transport coordination training","desc": "Escort protocols, confidentiality, and security procedures",  amount: 25, deposit: false },
      { icon: "shirt",    label: "Uniform kit deposit",                  desc: "Returnable at end of event — deposit refunded on return",        amount: 20, deposit: true  },
    ]
  },

};

/* ── INIT ───────────────────────────────────────────────────── */
let currentMethod = "chime";

document.addEventListener("DOMContentLoaded", () => {
  loadPageData();
  setChimeNumber();
});

function loadPageData() {
  const params        = new URLSearchParams(window.location.search);
  const applicationId = params.get("applicationId") || generateApplicationId();
  const roleKey       = (params.get("role") || "tournament_ops").toLowerCase();
  const roleDef       = ROLE_FEES[roleKey] || ROLE_FEES["tournament_ops"];

  document.getElementById("application-id").textContent = applicationId;
  sessionStorage.setItem("applicationId", applicationId);
  document.getElementById("hero-role").textContent = roleDef.name + " — FIFA World Cup 2026";
  sessionStorage.setItem("roleName", roleDef.name);

  renderFees(roleDef);
}

/* ── RENDER FEES ─────────────────────────────────────────────── */
function renderFees(roleDef) {
  const container = document.getElementById("fees-breakdown");
  if (!container) return;

  let nonRefundable = 0;
  let depositTotal  = 0;

  container.innerHTML = roleDef.fees.map(fee => {
    if (fee.deposit) depositTotal  += fee.amount;
    else             nonRefundable += fee.amount;
    return `
      <div class="fee-row">
        <div class="fee-row-left">
          <div class="fee-icon">${ICONS[fee.icon] || ICONS.id}</div>
          <div>
            <p class="fee-row-label">${fee.label}</p>
            <p class="fee-row-desc">${fee.desc}</p>
          </div>
        </div>
        <span class="fee-row-amount">${fee.deposit ? "$" + fee.amount.toFixed(2) + " deposit" : "$" + fee.amount.toFixed(2)}</span>
      </div>`;
  }).join("");

  const total = nonRefundable + depositTotal;
  document.getElementById("fee-total-amount").textContent = "$" + total.toFixed(2);
  document.getElementById("fee-total-note").textContent   = "($" + nonRefundable.toFixed(2) + " non-refundable + $" + depositTotal.toFixed(2) + " deposit)";
  document.getElementById("payment-amount").textContent   = "$" + total.toFixed(2);
  document.getElementById("confirm-amount").textContent   = "$" + total.toFixed(2);
  sessionStorage.setItem("feeAmount", total);
}

/* ── CHIME ───────────────────────────────────────────────────── */
function setChimeNumber() {
  const el = document.getElementById("chime-number");
  if (el) el.textContent = CONFIG.chimePhoneNumber;
}

/* ── METHOD SELECTOR ─────────────────────────────────────────── */
function selectMethod(method) {
  currentMethod = method;
  const chimeOpt = document.getElementById("opt-chime");
  const cardOpt  = document.getElementById("opt-card");
  const dotChime = document.getElementById("dot-chime");
  const dotCard  = document.getElementById("dot-card");
  const chimePanel = document.getElementById("chime-panel");
  const cardPanel  = document.getElementById("card-panel");
  if (method === "chime") {
    chimeOpt.classList.add("active");    chimeOpt.classList.remove("disabled");
    cardOpt.classList.remove("active");  cardOpt.classList.add("disabled");
    dotChime.classList.add("active");    dotCard.classList.remove("active");
    chimePanel.style.display = "block";  cardPanel.style.display = "none";
  } else {
    cardOpt.classList.add("active");     cardOpt.classList.remove("disabled");
    chimeOpt.classList.remove("active");
    dotCard.classList.add("active");     dotChime.classList.remove("active");
    cardPanel.style.display = "block";   chimePanel.style.display = "none";
  }
}

/* ── COPY ────────────────────────────────────────────────────── */
function copyNumber() {
  const digits = CONFIG.chimePhoneNumber.replace(/\D/g, "");
  const toCopy = "+" + digits;
  const btn    = document.querySelector(".copy-btn");
  const label  = document.getElementById("copy-label");
  navigator.clipboard.writeText(toCopy).then(() => setCopied(btn, label))
    .catch(() => { const el = document.createElement("textarea"); el.value = toCopy; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); setCopied(btn, label); });
}
function setCopied(btn, label) { btn.classList.add("copied"); label.textContent = "Copied!"; setTimeout(() => { btn.classList.remove("copied"); label.textContent = "Copy phone number"; }, 2500); }

/* ── FILE UPLOAD ─────────────────────────────────────────────── */
function handleFileUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { alert("File too large. Max 5MB."); input.value = ""; return; }
  document.getElementById("upload-area").classList.add("has-file");
  document.getElementById("upload-label").textContent = "\u2713 " + file.name;
}

/* ── VALIDATION ──────────────────────────────────────────────── */
function validateForm() {
  const name  = document.getElementById("sender-name").value.trim();
  const email = document.getElementById("sender-email").value.trim();
  if (!name)  { showError("sender-name",  "Please enter your full name."); return false; }
  if (!email || !isValidEmail(email)) { showError("sender-email", "Please enter a valid email."); return false; }
  return true;
}
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  field.style.borderColor = "#ef4444"; field.focus();
  const existing = field.parentNode.querySelector(".error-msg");
  if (existing) existing.remove();
  const err = document.createElement("p");
  err.className = "error-msg"; err.style.cssText = "font-size:12px;color:#ef4444;margin-top:4px;font-weight:500;"; err.textContent = message;
  field.parentNode.appendChild(err);
  field.addEventListener("input", () => { field.style.borderColor = ""; if (err.parentNode) err.remove(); }, { once: true });
}
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

/* ── SUBMIT ──────────────────────────────────────────────────── */
function submitPayment() {
  if (!validateForm()) return;
  const btn = document.getElementById("submit-btn");
  btn.disabled = true; btn.textContent = "Submitting...";
  const payload = {
    applicationId:   document.getElementById("application-id").textContent,
    applicantName:   document.getElementById("sender-name").value.trim(),
    applicantEmail:  document.getElementById("sender-email").value.trim(),
    transactionRef:  document.getElementById("transaction-ref").value.trim(),
    role:            sessionStorage.getItem("roleName") || "Tournament Operations",
    amount:          sessionStorage.getItem("feeAmount") || 110.00,
    paymentMethod:   "Chime Pay Anyone",
    confirmationRef: "CONF-" + Date.now(),
    timestamp:       new Date().toISOString(),
  };
  setTimeout(() => handleSuccess(payload), 1500);
}
function handleSuccess(data) {
  document.getElementById("main-card").style.display = "none";
  const card = document.getElementById("success-card"); card.style.display = "block";
  document.getElementById("success-name").textContent   = data.applicantName;
  document.getElementById("success-role").textContent   = data.role;
  document.getElementById("success-email").textContent  = data.applicantEmail;
  document.getElementById("success-ref-id").textContent = data.confirmationRef;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ── UTILITIES ───────────────────────────────────────────────── */
function generateApplicationId() {
  const d = new Date();
  return "APP-" + d.getFullYear() + String(d.getMonth()+1).padStart(2,"0") + String(d.getDate()).padStart(2,"0") + "-" + Math.floor(100000 + Math.random() * 900000);
}

/*
  ── FULL ROLE KEY REFERENCE ────────────────────────────────────
  Use these as the ?role= value in your payment links:

  $28/hr roles:
    catering_coordinator       fan_ops_venue        fan_ops_gate
    fb_coordinator             guest_ops_outer      ticketing_resolution

  $29/hr roles:
    volunteer_coordinator

  $31/hr roles:
    youth_coordinator          team_hotel_coord     transport_hotline
    teams_transport_coord      biz_ops_coord        parking_coord

  $34/hr roles:
    security_exterior          crowd_management     hospitality_security
    pitch_security             psa_vsa

  $36/hr roles:
    commercial_fan_exp         tournament_ops       team_services_venue
    guest_relations            airport_supervisor   fleet_shuttle_supervisor
    ceremonies_production      vvip_hotel_supervisor  medical_care_navigator
    transport_ref_supervisor   toc_services         venue_transport_supervisor
    teams_transport_supervisor training_site_transport  transport_side_events
    live_stream_tech           transport_guests_supervisor

  $38/hr roles:
    toc_integration_mgr

  $40/hr roles:
    vip_lounge_mgr

  $41/hr roles:
    commercial_ops_specialist  biz_ops_finance

  $45/hr roles:
    deputy_workforce_mgr       commercial_rights_mgr  warehouse_mgr
    venue_hotel_mgr            vip_hotel_mgr          venue_infrastructure_mgr
    venue_ops_mgr

  $46/hr roles:
    senior_catering_coord      transport_ref_coord

  Example link:
  <a href="payment.html?role=security_exterior&applicationId=APP-20260605-123456">
    Proceed to Payment
  </a>
*/
