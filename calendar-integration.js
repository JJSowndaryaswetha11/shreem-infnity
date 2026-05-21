/**
 * ============================================================
 *  SHREEMINFINITY — Google Calendar Integration
 *  Handles:
 *  1. "Add to My Calendar" link for the CLIENT after booking
 *  2. Google Calendar Embed (read-only availability view)
 *  3. Optional: Google Calendar API (OAuth) for OWNER auto-event creation
 * ============================================================
 *
 *  SETUP INSTRUCTIONS
 *  ------------------
 *  A) SIMPLE MODE (no backend, works on static sites)
 *     - Uses Google Calendar Event URL to let owner/client add events
 *     - No API key needed
 *     - Just drop this file in and call initCalendarIntegration()
 *
 *  B) EMBEDDED CALENDAR (show studio availability)
 *     - Go to Google Calendar → Settings → your calendar → "Integrate calendar"
 *     - Copy the "Embed code" src URL
 *     - Paste it into CALENDAR_EMBED_SRC below
 *     - Make the calendar PUBLIC first (Settings → Access permissions → "Make available to public")
 *
 *  C) FULL API MODE (auto-create events in studio's Google Calendar)
 *     - Requires a Google Cloud project + OAuth2 credentials
 *     - See the GoogleCalendarAPI section below
 *     - Recommended for production use
 * ============================================================
 */

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const CALENDAR_CONFIG = {
  // B) Paste your Google Calendar embed src URL here (from Calendar Settings)
  // Example: 'https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID&ctz=Asia%2FKolkata'
  EMBED_SRC: 'https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID_HERE&ctz=Asia%2FKolkata&showTitle=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0&mode=MONTH',

  // C) Google Calendar API credentials (for full API mode)
  // Create at: https://console.cloud.google.com/
  CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  API_KEY: 'YOUR_GOOGLE_API_KEY',
  CALENDAR_ID: 'primary', // or 'YOUR_STUDIO_CALENDAR_ID@group.calendar.google.com'

  // Studio timezone
  TIMEZONE: 'Asia/Kolkata',

  // Studio name (appears in calendar events)
  STUDIO_NAME: 'Shreeminfinity Studio',
  STUDIO_LOCATION: 'Madurai, Tamil Nadu, India',
  STUDIO_PHONE: '+91 98765 43210',
};

// ─── TIME SLOT MAPPING ────────────────────────────────────────────────────────

const TIME_SLOT_MAP = {
  'Early Morning (4–6 AM)': { start: '04:00', end: '06:00' },
  'Morning (6–9 AM)':        { start: '06:00', end: '09:00' },
  'Mid Morning (9–11 AM)':   { start: '09:00', end: '11:00' },
  'Afternoon (11 AM–2 PM)':  { start: '11:00', end: '14:00' },
  'Evening (2–6 PM)':        { start: '14:00', end: '18:00' },
  'Night (6–8 PM)':          { start: '18:00', end: '20:00' },
};

// ─── HELPER: Build Google Calendar Event URL (no API needed) ──────────────────

/**
 * Generates a Google Calendar "Add Event" URL.
 * Works for both client and studio owner.
 *
 * @param {Object} booking - booking data collected from the form
 * @returns {string} URL to open Google Calendar with pre-filled event
 */
function buildGCalURL(booking) {
  const slot = TIME_SLOT_MAP[booking.preferredTime] || { start: '09:00', end: '11:00' };
  const dateStr = booking.preferredDate.replace(/-/g, ''); // YYYYMMDD

  const startDT = `${dateStr}T${slot.start.replace(':', '')}00`;
  const endDT   = `${dateStr}T${slot.end.replace(':', '')}00`;

  const selectedServices = booking.services.length > 0
    ? booking.services.join(', ')
    : 'Beauty Appointment';

  const title = encodeURIComponent(
    `💄 ${CALENDAR_CONFIG.STUDIO_NAME} – ${booking.firstName} (${selectedServices})`
  );

  const details = encodeURIComponent(
    `Client: ${booking.firstName} ${booking.lastName}\n` +
    `Phone: ${booking.phone}\n` +
    `Email: ${booking.email || 'Not provided'}\n` +
    `Event: ${booking.eventType || 'Not specified'}\n` +
    `Tradition: ${booking.tradition || 'Not specified'}\n` +
    `Package: ${booking.package || 'To be discussed'}\n` +
    `Services: ${selectedServices}\n` +
    `Venue: ${booking.venue || 'To be confirmed'}\n` +
    `\nMessage: ${booking.message || 'None'}\n` +
    `\nRef: ${booking.ref}\n` +
    `Studio: ${CALENDAR_CONFIG.STUDIO_PHONE}`
  );

  const location = encodeURIComponent(
    booking.venue || CALENDAR_CONFIG.STUDIO_LOCATION
  );

  const ctz = encodeURIComponent(CALENDAR_CONFIG.TIMEZONE);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDT}/${endDT}&details=${details}&location=${location}&ctz=${ctz}`;
}

// ─── HELPER: Build .ics file (works for Apple Calendar, Outlook, etc.) ────────

/**
 * Generates and downloads an .ics file for cross-platform calendar support.
 * @param {Object} booking
 */
function downloadICS(booking) {
  const slot = TIME_SLOT_MAP[booking.preferredTime] || { start: '09:00', end: '11:00' };
  const dateStr = booking.preferredDate.replace(/-/g, '');

  const startDT = `${dateStr}T${slot.start.replace(':', '')}00`;
  const endDT   = `${dateStr}T${slot.end.replace(':', '')}00`;
  const now     = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const selectedServices = booking.services.join(', ') || 'Beauty Appointment';

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Shreeminfinity//BookingSystem//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `DTSTART;TZID=${CALENDAR_CONFIG.TIMEZONE}:${startDT}`,
    `DTEND;TZID=${CALENDAR_CONFIG.TIMEZONE}:${endDT}`,
    `DTSTAMP:${now}`,
    `UID:${booking.ref}@shreeminfinity.com`,
    `SUMMARY:💄 Shreeminfinity – ${booking.firstName} (${selectedServices})`,
    `DESCRIPTION:Client: ${booking.firstName} ${booking.lastName}\\nPhone: ${booking.phone}\\nEvent: ${booking.eventType}\\nRef: ${booking.ref}`,
    `LOCATION:${booking.venue || CALENDAR_CONFIG.STUDIO_LOCATION}`,
    'STATUS:TENTATIVE',
    'BEGIN:VALARM',
    'TRIGGER:-PT60M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Appointment reminder – Shreeminfinity',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `shreeminfinity-${booking.ref}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── SUCCESS STATE: Inject "Add to Calendar" buttons ──────────────────────────

/**
 * Call this after successful form submission.
 * Injects calendar buttons into the success state div.
 *
 * @param {Object} booking - collected form data
 * @param {string} ref - booking reference (e.g. 'SHR-2025-1234')
 */
function injectCalendarButtons(booking, ref) {
  booking.ref = ref;

  // Only inject if a date was chosen
  if (!booking.preferredDate) return;

  const gcalURL  = buildGCalURL(booking);
  const container = document.getElementById('successState');
  if (!container) return;

  // Remove any previous injection
  const existing = document.getElementById('cal-actions');
  if (existing) existing.remove();

  const html = `
    <div id="cal-actions" style="
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.08);
    ">
      <p style="
        font-size: 0.65rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.35);
        font-family: var(--font-sans, 'Raleway', sans-serif);
        font-weight: 600;
        margin-bottom: 1rem;
      ">Add to your calendar</p>

      <div style="display:flex;flex-wrap:wrap;gap:0.7rem;justify-content:center;">

        <!-- Google Calendar -->
        <a href="${gcalURL}" target="_blank" rel="noopener"
           style="
             display:inline-flex;align-items:center;gap:0.5rem;
             padding:0.7rem 1.3rem;
             background:rgba(255,255,255,0.06);
             border:1px solid rgba(255,255,255,0.12);
             color:rgba(255,255,255,0.85);
             font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;
             font-weight:600;font-family:var(--font-sans,'Raleway',sans-serif);
             text-decoration:none;transition:all 0.25s;
             cursor:pointer;
           "
           onmouseover="this.style.background='rgba(255,255,255,0.12)'"
           onmouseout="this.style.background='rgba(255,255,255,0.06)'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Google Calendar
        </a>

        <!-- Apple / Outlook (.ics) -->
        <button onclick="downloadICS(window._lastBooking)"
           style="
             display:inline-flex;align-items:center;gap:0.5rem;
             padding:0.7rem 1.3rem;
             background:rgba(255,255,255,0.06);
             border:1px solid rgba(255,255,255,0.12);
             color:rgba(255,255,255,0.85);
             font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;
             font-weight:600;font-family:var(--font-sans,'Raleway',sans-serif);
             cursor:pointer;transition:all 0.25s;
           "
           onmouseover="this.style.background='rgba(255,255,255,0.12)'"
           onmouseout="this.style.background='rgba(255,255,255,0.06)'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Apple / Outlook (.ics)
        </button>

      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', html);
}

// ─── CALENDAR AVAILABILITY EMBED ──────────────────────────────────────────────

/**
 * Injects the Google Calendar embed into a container element.
 * The calendar must be set to PUBLIC in Google Calendar settings.
 *
 * @param {string} containerId - ID of the HTML element to inject into
 */
function embedCalendar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!CALENDAR_CONFIG.EMBED_SRC || CALENDAR_CONFIG.EMBED_SRC.includes('YOUR_CALENDAR_ID')) {
    container.innerHTML = `
      <div style="
        padding: 2rem;
        text-align: center;
        border: 1px dashed rgba(255,255,255,0.15);
        color: rgba(255,255,255,0.3);
        font-size: 0.7rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-family: var(--font-sans, sans-serif);
      ">
        Google Calendar embed — configure EMBED_SRC in calendar-integration.js
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <iframe
      src="${CALENDAR_CONFIG.EMBED_SRC}"
      style="border:none;width:100%;min-height:500px;border-radius:0;background:transparent;"
      frameborder="0"
      scrolling="no"
      loading="lazy"
      title="Shreeminfinity Availability Calendar">
    </iframe>
  `;
}

// ─── FULL API MODE (Optional — for auto-creating events in studio calendar) ───
// Requires: Google Cloud project, OAuth2, calendar scope enabled
// Uncomment and configure if using full API mode.

/*
const GOOGLE_API = {
  async init() {
    await new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://apis.google.com/js/api.js';
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
    await new Promise(res => gapi.load('client:auth2', res));
    await gapi.client.init({
      apiKey: CALENDAR_CONFIG.API_KEY,
      clientId: CALENDAR_CONFIG.CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: 'https://www.googleapis.com/auth/calendar.events',
    });
  },

  async signIn() {
    return gapi.auth2.getAuthInstance().signIn();
  },

  async createEvent(booking) {
    const slot = TIME_SLOT_MAP[booking.preferredTime] || { start: '09:00', end: '11:00' };
    const event = {
      summary: `💄 ${booking.firstName} ${booking.lastName} – ${booking.services.join(', ')}`,
      location: booking.venue || CALENDAR_CONFIG.STUDIO_LOCATION,
      description: `Phone: ${booking.phone}\nEmail: ${booking.email}\nEvent: ${booking.eventType}\nPackage: ${booking.package}\nRef: ${booking.ref}`,
      start: {
        dateTime: `${booking.preferredDate}T${slot.start}:00`,
        timeZone: CALENDAR_CONFIG.TIMEZONE,
      },
      end: {
        dateTime: `${booking.preferredDate}T${slot.end}:00`,
        timeZone: CALENDAR_CONFIG.TIMEZONE,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 },
        ],
      },
    };
    const response = await gapi.client.calendar.events.insert({
      calendarId: CALENDAR_CONFIG.CALENDAR_ID,
      resource: event,
    });
    console.log('[Shreeminfinity] Event created:', response.result.htmlLink);
    return response.result;
  },
};
*/

// ─── INIT ─────────────────────────────────────────────────────────────────────

/**
 * Call this once on page load.
 * Optionally pass a containerId to embed the availability calendar.
 */
function initCalendarIntegration(embedContainerId) {
  if (embedContainerId) {
    embedCalendar(embedContainerId);
  }
  console.log('[Shreeminfinity] Calendar integration ready.');
}