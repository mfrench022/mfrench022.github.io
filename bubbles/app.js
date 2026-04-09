/* ============================================================
   BUBBLES — app.js
   Data, rendering, and interactions.

   Designed to be readable and editable — every section is
   clearly labelled. Change data below to customise the app.
   ============================================================ */


/* ============================================================
   DATA — Current User's Profile
   This is the logged-in user — shown on the "My Profile" page.
   ============================================================ */
const USER_PROFILE = {
  name:      'Michael French',
  email:     'mfrench@gmail.com',
  phone:     '+1 (317) 123-4567',
  color:     '#4A5FA8',         // avatar background colour
  slack:     '@Michael',
  teams:     'michael@michaelfrench.co',
  birthday:  'January 14, 1998',
  instagram: '@michaelfrench.co',
  twitter:   '@michaelfrench.co',
  linkedin:  'linkedin.com/MichaelFrench21',
};


/* ============================================================
   DATA — Contacts
   Add or edit contacts here.
   Optional extra fields (slack, birthday, social, notes) are
   shown on the individual contact detail page when present.
   ============================================================ */
const CONTACTS = [
  { id: 1,  name: 'Jack Granger',
    email: 'jack.granger@gmail.com',      phone: '+1 (555) 123-4567', color: '#8B7355',
    birthday: 'April 3, 1995' },

  { id: 2,  name: 'Jane Worthington',
    email: 'jane.worthington@gmail.com',  phone: '+1 (555) 234-5678', color: '#5D8A72',
    slack: '@JaneW', instagram: '@jane.worthington' },

  { id: 3,  name: 'Andrew Smith',
    email: 'andrew.smith@gmail.com',      phone: '+1 (555) 123-4567', color: '#5E7FA3',
    slack: '@Andrew',
    birthday: 'March 12, 1988',
    instagram: '@andrewsmith1',
    twitter:   '@andrewtennisfan',
    linkedin:  'linkedin.com/AndrewSmith4',
    notes: [
      { date: 'Jan. 14, 2025',       text: 'Met Andrew at design conference' },
      { date: 'February 21, 2025',   text: 'Ran into Andrew again at an event, LIKES SOCCER' },
      { date: 'March 4, 2025',       text: 'Got drinks with mutual friend Andrea' },
    ]
  },

  { id: 4,  name: 'Maya Chen',
    email: 'maya.chen@gmail.com',         phone: '+1 (555) 456-7890', color: '#B07850',
    instagram: '@maya.chen', birthday: 'July 22, 1993' },

  { id: 5,  name: 'David Park',
    email: 'david.park@gmail.com',        phone: '+1 (555) 567-8901', color: '#7B6BB0',
    slack: '@DavidP', linkedin: 'linkedin.com/davidpark' },

  { id: 6,  name: 'Sarah Lee',
    email: 'sarah.lee@gmail.com',         phone: '+1 (555) 678-9012', color: '#A8607A',
    slack: '@SarahL', instagram: '@sarah.lee', birthday: 'December 5, 1991' },

  { id: 7,  name: 'Tom Wright',
    email: 'tom.wright@gmail.com',        phone: '+1 (555) 789-0123', color: '#4E8E72' },

  { id: 8,  name: 'Emma Davis',
    email: 'emma.davis@gmail.com',        phone: '+1 (555) 890-1234', color: '#A06B5A',
    birthday: 'October 18, 1990' },

  { id: 9,  name: 'Ryan Kim',
    email: 'ryan.kim@gmail.com',          phone: '+1 (555) 901-2345', color: '#4A7EA8',
    twitter: '@ryankim', linkedin: 'linkedin.com/ryankim' },

  { id: 10, name: 'Lisa Torres',
    email: 'lisa.torres@gmail.com',       phone: '+1 (555) 012-3456', color: '#9B7040',
    instagram: '@lisatorres', birthday: 'March 30, 1987' },

  { id: 11, name: 'Chris Nakamura',
    email: 'chris.n@gmail.com',           phone: '+1 (555) 111-2233', color: '#6B8E55',
    slack: '@ChrisN' },

  { id: 12, name: 'Priya Patel',
    email: 'priya.patel@gmail.com',       phone: '+1 (555) 222-3344', color: '#9060A0',
    linkedin: 'linkedin.com/priyapatel', birthday: 'February 8, 1994' },
];

/* ============================================================
   DATA — Bubbles
   Positions are expressed as percentages of the chart area.
   x/y = top-left corner of the bubble, size = diameter.
   All values are 0–100 (percent).

   contactIds = which contacts appear in this bubble.
   subBubbleIds = bubbles nested visually inside this one.
   parentId = the parent bubble (if this is a sub-bubble).
   ============================================================ */
const BUBBLES = [
  {
    id: 'work',
    label: 'Work',
    // Large bubble, left-center
    x: 5,   y: 36,  size: 45,
    contactIds: [1, 2, 3, 4, 5, 8],
    subBubbleIds: ['drinks-crew'],
  },
  {
    id: 'drinks-crew',
    label: 'Drinks\nCrew',
    // Sub-bubble inside Work
    x: 13,  y: 46,  size: 21,
    contactIds: [2, 5, 8],
    parentId: 'work',
  },
  {
    id: 'friends',
    label: 'Friends',
    // Medium bubble, right-center
    x: 49,  y: 44,  size: 37,
    contactIds: [1, 6, 7, 9, 11],
  },
  {
    id: 'soccer',
    label: 'Soccer',
    // Medium bubble, top-center-right
    x: 46,  y: 29,  size: 33,
    contactIds: [3, 4, 7],
  },
  {
    id: 'music',
    label: 'Music',
    // Small bubble, top-left
    x: 29,  y: 28,  size: 18,
    contactIds: [9, 10],
  },
  {
    id: 'design',
    label: 'Design',
    // Small bubble, far right
    x: 76,  y: 40,  size: 16,
    contactIds: [5, 12],
  },
  {
    id: 'wellness',
    label: 'Wellness',
    // Small bubble, bottom-left
    x: 30,  y: 56,  size: 22,
    contactIds: [6, 11],
  },
];


/* ============================================================
   ICONS
   Inline SVG strings for the profile / contact-detail views.
   Using the same stroke style as the rest of the app.
   ============================================================ */
const ICONS = {
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m2 7 10 7 10-7"/>
  </svg>`,

  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.4 2 2 0 0 1 3.59 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91A16 16 0 0 0 14.09 16.09l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>`,

  // Slack — four rounded rectangles forming the # grid
  slack: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.527 2.527 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
  </svg>`,

  // Microsoft Teams — T icon
  teams: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <circle cx="17.5" cy="5.5" r="2" fill="currentColor" stroke="none"/>
    <path d="M15 8.5h5c.8 0 1.5.7 1.5 1.5v5.5a1 1 0 0 1-1 1H19"/>
    <path d="M19 16.5V21"/>
    <path d="M5 7h7M8.5 7v10"/>
    <rect x="2" y="11" width="11" height="8" rx="2"/>
  </svg>`,

  birthday: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 12v10H4V12"/>
    <rect x="2" y="7" width="20" height="5" rx="1"/>
    <path d="M12 22V7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>`,

  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>`,

  twitter: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>`,

  linkedin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="4"/>
    <line x1="7" y1="10" x2="7" y2="17"/>
    <line x1="7" y1="7" x2="7" y2="7.1"/>
    <path d="M11 17v-4a3 3 0 0 1 6 0v4M11 10v7"/>
  </svg>`,

  note: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="13" y2="17"/>
  </svg>`,
};


/* ============================================================
   STATE
   ============================================================ */
let currentView      = 'bubbles';  // 'bubbles' | 'contacts' | 'detail' | 'profile' | 'contact-detail'
let activeBubble     = null;        // bubble id currently in detail view
let activeContactId  = null;        // contact id in contact-detail view
let previousView     = null;        // where to go back to from profile/contact-detail


/* ============================================================
   HELPERS
   ============================================================ */

/** Get contact by id */
function getContact(id) {
  return CONTACTS.find(c => c.id === id);
}

/** Get bubble by id */
function getBubble(id) {
  return BUBBLES.find(b => b.id === id);
}

/** Get initials from a name */
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/**
 * Compute positions for N avatars distributed in a loose cluster
 * within a circle of given radius, centred at (0, 0).
 * Returns array of { x, y } offsets from centre.
 */
function avatarOffsets(count, bubbleRadius, avatarSize) {
  if (count === 0) return [];

  // Place avatars in a natural scattered pattern inside the bubble.
  // The golden angle gives a good distribution.
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const maxR = bubbleRadius * 0.62 - avatarSize / 2;

  const positions = [];
  for (let i = 0; i < count; i++) {
    const t     = (i + 0.5) / count;
    const r     = Math.sqrt(t) * maxR;
    const angle = i * goldenAngle;
    positions.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) });
  }
  return positions;
}

/**
 * Create a DOM element for an avatar circle.
 * avatarSize is in pixels.
 */
function createAvatarEl(contact, avatarSize) {
  const el = document.createElement('div');
  el.className = 'avatar';
  el.style.width  = avatarSize + 'px';
  el.style.height = avatarSize + 'px';
  el.style.background = contact.color;

  if (avatarSize >= 28) {
    el.textContent = initials(contact.name);
  }
  return el;
}

/**
 * Render a single bubble + its avatars into containerEl.
 *
 * containerEl  — the chart div to append into
 * bubble       — BUBBLES entry
 * chartW/H     — pixel dimensions of the chart area
 * avatarScale  — optional multiplier for avatar size
 */
function renderBubble(containerEl, bubble, chartW, chartH, avatarScale = 1) {
  const pxX    = (bubble.x    / 100) * chartW;
  const pxY    = (bubble.y    / 100) * chartH;
  const pxSize = (bubble.size / 100) * chartW;
  const radius = pxSize / 2;
  const cx     = pxX + radius;
  const cy     = pxY + radius;

  // --- Bubble circle div ---
  const bubbleEl = document.createElement('div');
  bubbleEl.className = 'bubble';
  if (bubble.size <= 22) bubbleEl.classList.add('bubble--small');
  if (bubble.parentId)   bubbleEl.classList.add('bubble--sub');

  bubbleEl.style.left   = pxX    + 'px';
  bubbleEl.style.top    = pxY    + 'px';
  bubbleEl.style.width  = pxSize + 'px';
  bubbleEl.style.height = pxSize + 'px';
  bubbleEl.dataset.id   = bubble.id;

  const labelEl = document.createElement('span');
  labelEl.className = 'bubble__label';
  // Support line breaks in label (e.g. "Drinks\nCrew")
  labelEl.innerHTML = bubble.label.replace(/\n/g, '<br>');
  bubbleEl.appendChild(labelEl);

  containerEl.appendChild(bubbleEl);

  // --- Avatars ---
  const rawAvatarSize = Math.max(18, radius * 0.38) * avatarScale;
  const avatarSize    = Math.round(rawAvatarSize);
  const contacts      = bubble.contactIds.map(getContact).filter(Boolean);
  const offsets       = avatarOffsets(contacts.length, radius, avatarSize);

  contacts.forEach((contact, i) => {
    const avatarEl = createAvatarEl(contact, avatarSize);
    // Position relative to chart container
    avatarEl.style.left = (cx + offsets[i].x - avatarSize / 2) + 'px';
    avatarEl.style.top  = (cy + offsets[i].y - avatarSize / 2) + 'px';
    containerEl.appendChild(avatarEl);
  });
}


/* ============================================================
   HELPERS — Profile / Contact Detail
   ============================================================ */

/**
 * Build an info card HTML string.
 * title  — section heading
 * rows   — array of { icon: 'iconKey', text: 'display string' }
 */
function buildInfoCard(title, rows) {
  if (!rows.length) return '';

  const rowsHTML = rows.map(row => `
    <div class="info-row">
      <div class="info-row__icon">${ICONS[row.icon] || ''}</div>
      <span class="info-row__text">${row.text}</span>
    </div>
  `).join('');

  return `
    <div class="info-card">
      <div class="info-card__title">${title}</div>
      ${rowsHTML}
    </div>
  `;
}

/**
 * Build bubble-tag chips HTML for a given list of bubble labels.
 * Shows a "+" chip at the end so the user can add more.
 */
function buildBubbleTags(labels) {
  const chips = labels.map(label =>
    `<button class="bubble-tag">${label}</button>`
  ).join('');
  return `<div class="profile-bubbles">${chips}<button class="bubble-tag bubble-tag--add">+</button></div>`;
}


/* ============================================================
   RENDER — User Profile page
   ============================================================ */
function renderUserProfile() {
  document.getElementById('profile-title').textContent = "Michael's Profile";
  const content = document.getElementById('profile-content');

  // All top-level bubbles appear on the user's profile
  const bubbleLabels = BUBBLES
    .filter(b => !b.parentId)
    .map(b => b.label.replace(/\n/g, ' '));

  // Contact information rows — only include fields that have a value
  const contactRows = [
    USER_PROFILE.email    && { icon: 'email',    text: USER_PROFILE.email },
    USER_PROFILE.phone    && { icon: 'phone',    text: USER_PROFILE.phone },
    USER_PROFILE.slack    && { icon: 'slack',    text: USER_PROFILE.slack },
    USER_PROFILE.teams    && { icon: 'teams',    text: USER_PROFILE.teams },
    USER_PROFILE.birthday && { icon: 'birthday', text: USER_PROFILE.birthday },
  ].filter(Boolean);

  // Social links rows
  const socialRows = [
    USER_PROFILE.instagram && { icon: 'instagram', text: USER_PROFILE.instagram },
    USER_PROFILE.twitter   && { icon: 'twitter',   text: USER_PROFILE.twitter },
    USER_PROFILE.linkedin  && { icon: 'linkedin',  text: USER_PROFILE.linkedin },
  ].filter(Boolean);

  content.innerHTML = `
    <!-- Profile photo (avatar with initials as fallback) -->
    <div class="profile-avatar" style="background: ${USER_PROFILE.color}">
      ${initials(USER_PROFILE.name)}
    </div>

    <!-- Bubbles this user belongs to -->
    ${buildBubbleTags(bubbleLabels)}

    <!-- Contact information card -->
    ${buildInfoCard('Contact Information', contactRows)}

    <!-- Social links card -->
    ${buildInfoCard('Social Links', socialRows)}

    <!-- Action buttons -->
    <div class="profile-actions">
      <button class="profile-action-btn profile-action-btn--primary">Edit Profile</button>
      <button class="profile-action-btn">Share Contact</button>
    </div>
  `;
}


/* ============================================================
   RENDER — Individual Contact Detail page
   ============================================================ */
function renderContactDetail(contactId) {
  const contact = getContact(contactId);
  if (!contact) return;

  document.getElementById('contact-detail-title').textContent = contact.name;
  const content = document.getElementById('contact-detail-content');

  // Which bubbles is this contact in?
  const contactBubbles = BUBBLES
    .filter(b => b.contactIds.includes(contact.id))
    .map(b => b.label.replace(/\n/g, ' '));

  // Contact information rows
  const contactRows = [
    contact.email    && { icon: 'email',    text: contact.email },
    contact.phone    && { icon: 'phone',    text: contact.phone },
    contact.slack    && { icon: 'slack',    text: 'Message ' + contact.slack },
    contact.birthday && { icon: 'birthday', text: contact.birthday },
  ].filter(Boolean);

  // Social links rows
  const socialRows = [
    contact.instagram && { icon: 'instagram', text: contact.instagram },
    contact.twitter   && { icon: 'twitter',   text: contact.twitter },
    contact.linkedin  && { icon: 'linkedin',  text: contact.linkedin },
  ].filter(Boolean);

  // Notes section — only rendered when the contact has notes
  let notesHTML = '';
  if (contact.notes && contact.notes.length > 0) {
    const noteEntries = contact.notes.map(note => `
      <div class="note-entry">
        <div class="note-entry__icon">${ICONS.note}</div>
        <div class="note-entry__body">
          <div class="note-entry__date">${note.date}</div>
          <div class="note-entry__text">${note.text}</div>
        </div>
      </div>
    `).join('');

    notesHTML = `
      <div class="info-card">
        <div class="info-card__title">Notes</div>
        ${noteEntries}
        <button class="note-add-btn">+ New Note</button>
      </div>
    `;
  }

  content.innerHTML = `
    <!-- Profile photo (avatar with initials) -->
    <div class="profile-avatar" style="background: ${contact.color}">
      ${initials(contact.name)}
    </div>

    <!-- Bubbles this contact shares with the user -->
    ${buildBubbleTags(contactBubbles)}

    <!-- Contact information card -->
    ${buildInfoCard('Contact Information', contactRows)}

    <!-- Social links card (hidden if none) -->
    ${socialRows.length ? buildInfoCard('Social Links', socialRows) : ''}

    <!-- Notes card (hidden if none) -->
    ${notesHTML}

    <!-- Action buttons -->
    <div class="profile-actions">
      <button class="profile-action-btn profile-action-btn--primary">Edit Contact</button>
      <button class="profile-action-btn">Share Contact</button>
    </div>
  `;
}


/* ============================================================
   RENDER — Bubble Chart (home view)
   ============================================================ */
function renderBubbleChart() {
  const chart = document.getElementById('bubble-chart');
  // Keep the bg-glow, clear everything else
  const glow = chart.querySelector('.bg-glow');
  chart.innerHTML = '';
  chart.appendChild(glow);

  const chartW = chart.clientWidth;
  const chartH = chart.clientHeight;

  BUBBLES.forEach(bubble => {
    renderBubble(chart, bubble, chartW, chartH);
  });

  // Attach click handlers to bubble elements
  chart.querySelectorAll('.bubble').forEach(el => {
    el.addEventListener('click', () => onBubbleClick(el.dataset.id));
  });
}


/* ============================================================
   RENDER — Bubble Detail (drill-down view)
   ============================================================ */
function renderBubbleDetail(bubbleId) {
  const bubble = getBubble(bubbleId);
  if (!bubble) return;

  document.getElementById('detail-title').textContent = bubble.label.replace(/\n/g, ' ') + ' Bubble';

  const chart = document.getElementById('bubble-detail-chart');
  const glow  = chart.querySelector('.bg-glow');
  chart.innerHTML = '';
  chart.appendChild(glow);

  const chartW = chart.clientWidth;
  const chartH = chart.clientHeight;

  // Scale the selected bubble to fill most of the chart
  const mainSize = Math.min(chartW, chartH) * 0.88;
  const mainX    = (chartW - mainSize) / 2;
  const mainY    = (chartH - mainSize) / 2;

  const scaledBubble = {
    ...bubble,
    x: (mainX / chartW) * 100,
    y: (mainY / chartH) * 100,
    size: (mainSize / chartW) * 100,
    // In the detail view don't recurse into sub-bubbles' contacts —
    // render all contacts directly in the main bubble
  };

  renderBubble(chart, scaledBubble, chartW, chartH, 1.4);

  // Render sub-bubbles if any
  if (bubble.subBubbleIds) {
    bubble.subBubbleIds.forEach(subId => {
      const sub = getBubble(subId);
      if (!sub) return;

      // Place sub-bubble in bottom-left quadrant of the main bubble
      const subSize  = mainSize * 0.42;
      const subX     = mainX + mainSize * 0.08;
      const subY     = mainY + mainSize * 0.50;

      const scaledSub = {
        ...sub,
        x:    (subX / chartW) * 100,
        y:    (subY / chartH) * 100,
        size: (subSize / chartW) * 100,
      };

      renderBubble(chart, scaledSub, chartW, chartH, 1.1);
    });
  }

  // Sub-bubbles in detail can drill further
  chart.querySelectorAll('.bubble--sub').forEach(el => {
    el.addEventListener('click', () => onBubbleClick(el.dataset.id));
  });
}


/* ============================================================
   RENDER — Contacts List
   ============================================================ */
function renderContactsList() {
  const list = document.getElementById('contacts-list');
  list.innerHTML = '';

  CONTACTS.forEach(contact => {
    const card = document.createElement('div');
    card.className = 'contact-card';
    card.dataset.contactId = contact.id;  // used by the click handler below
    card.innerHTML = `
      <div class="contact-card__avatar" style="background:${contact.color}">
        ${initials(contact.name)}
      </div>
      <div class="contact-card__info">
        <div class="contact-card__name">${contact.name}</div>
        <div class="contact-card__row">
          <svg class="contact-card__row-icon" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/>
            <path d="M2 8l10 6 10-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <span class="contact-card__row-text">${contact.email}</span>
        </div>
        <div class="contact-card__row">
          <svg class="contact-card__row-icon" viewBox="0 0 24 24" fill="none">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C9.6 21 3 14.4 3 6c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="contact-card__row-text">${contact.phone}</span>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}


/* ============================================================
   VIEW SWITCHING
   ============================================================ */
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('view--active');
  });
  const target = document.getElementById(viewId);
  if (target) target.classList.add('view--active');
  currentView = viewId.replace('view-', '');
}

function goToBubbles() {
  showView('view-bubbles');
  document.getElementById('bubbles-title').textContent = 'Your Bubbles';
  renderBubbleChart();
}

function goToContacts() {
  showView('view-contacts');
  renderContactsList();
}

function goToDetail(bubbleId) {
  activeBubble = bubbleId;
  showView('view-detail');
  renderBubbleDetail(bubbleId);
}

function goToProfile() {
  previousView = currentView;   // remember where we came from
  showView('view-profile');
  renderUserProfile();
}

function goToContactDetail(contactId) {
  previousView    = currentView; // remember where we came from
  activeContactId = contactId;
  showView('view-contact-detail');
  renderContactDetail(contactId);
}

/** Go back to whatever view was active before opening a profile/contact page */
function goBack() {
  if (previousView === 'contacts')       goToContacts();
  else if (previousView === 'detail')    goToDetail(activeBubble);
  else                                   goToBubbles();
}


/* ============================================================
   EVENT HANDLERS
   ============================================================ */

/** Clicking a bubble on the home chart */
function onBubbleClick(bubbleId) {
  goToDetail(bubbleId);
}

/** Mode toggle buttons (both views share this logic) */
function bindToggle(toggleEl) {
  toggleEl.querySelectorAll('.mode-toggle__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;

      // Update active state on all toggles
      document.querySelectorAll('.mode-toggle__btn').forEach(b => {
        b.classList.remove('mode-toggle__btn--active');
        if (b.dataset.mode === mode) b.classList.add('mode-toggle__btn--active');
      });

      if (mode === 'bubble')  goToBubbles();
      if (mode === 'contact') goToContacts();
    });
  });
}

/** Back button in bubble-detail view */
document.getElementById('back-btn').addEventListener('click', () => {
  goToBubbles();
});

/** Back button on User Profile view */
document.getElementById('profile-back-btn').addEventListener('click', () => {
  goBack();
});

/** Back button on Contact Detail view */
document.getElementById('contact-detail-back-btn').addEventListener('click', () => {
  goBack();
});

// Bind toggles on all views
bindToggle(document.getElementById('toggle-bubbles'));
bindToggle(document.getElementById('toggle-contacts'));
bindToggle(document.getElementById('toggle-detail'));

/**
 * Profile icon in EVERY bottom nav opens the user's profile.
 * We wire up all profile buttons at once using the aria-label selector.
 */
document.querySelectorAll('.bottom-nav__btn[aria-label="Profile"]').forEach(btn => {
  btn.addEventListener('click', () => {
    // Don't navigate if we're already on the profile page
    if (currentView !== 'profile') goToProfile();
  });
});

/**
 * Contact cards in the contacts list open the contact detail page.
 * We use event delegation on the list container so it works even
 * after the list is re-rendered by renderContactsList().
 */
document.getElementById('contacts-list').addEventListener('click', e => {
  const card = e.target.closest('.contact-card');
  if (!card) return;
  const contactId = parseInt(card.dataset.contactId, 10);
  if (contactId) goToContactDetail(contactId);
});


/* ============================================================
   INITIAL RENDER
   Re-render bubble chart if window resizes (e.g. orientation change)
   ============================================================ */
window.addEventListener('resize', () => {
  if (currentView === 'bubbles') renderBubbleChart();
  if (currentView === 'detail' && activeBubble) renderBubbleDetail(activeBubble);
});

// Boot
goToBubbles();

// Service worker for Progressive Web App (register URL relative to this page so it works under a subpath, e.g. GitHub Pages /repo-name/)
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  function directoryBaseHref() {
    const u = new URL(window.location.href);
    const last = u.pathname.split("/").pop() ?? "";
    if (last.includes(".")) {
      u.pathname = u.pathname.slice(0, u.pathname.lastIndexOf("/") + 1);
    } else if (!u.pathname.endsWith("/")) {
      u.pathname += "/";
    }
    return u.href;
  }

  globalThis.addEventListener("load", () => {
    const swUrl = new URL("serviceworker.js", directoryBaseHref());
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log("SW registered:", registration.scope);
      })
      .catch((error) => {
        console.error("SW registration failed:", error);
      });
  });
}

registerServiceWorker();
