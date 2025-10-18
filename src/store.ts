// Central event store
// Utility function to get IP address
const getIPAddress = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch {
    // console.error('Error fetching IP:', error);
    return "unknown";
  }
};

// Utility function to create hash
export const createHash = async () => {
  const siteAddress = window.location.origin;
  const userAgent = navigator.userAgent;
  const ipAddress = await getIPAddress();

  const stringToHash = `${siteAddress}-${userAgent}-${ipAddress}`;

  // Using SHA-256 for secure hashing
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToHash);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
};

export const eventStore = {
  hash: [] as string[],
  deviceType: [] as string[],
  browserType: [] as string[],
  events: [] as Record<string, string>[],
  addEvent: (event: Record<string, string>) => {
    eventStore.events.push(event);
  },
};

export const trackEvent = (
  trackEvents: Record<string, string>[],
  eventData: Record<string, string>
) => {
  trackEvents.push(eventData);
};

// Function to send batched events
export const sendBatchedEvents = async () => {
  if (eventStore.events.length === 0) return;

  const credibilityClientAppId = document.getElementById(
    "credibility-client-98765"
  )?.dataset.appId;

  const isDevelopment = import.meta.env.DEV;

  const events = [...eventStore.events];

  eventStore.events = []; // Clear the queue
  const apiUrl = isDevelopment
    ? "http://localhost:3002"
    : import.meta.env.VITE_PARITY_SERVER;

  try {
    const currentUrl = window.location.pathname;
    const response = await fetch(`${apiUrl}/api/events?path=${currentUrl}`, {
      method: "POST",
      body: JSON.stringify({ events, appId: credibilityClientAppId }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch {
    eventStore.events = [];
    // If sending fails, add events back to queue
    // eventStore.events = [...eventStore.events, ...events];
  }
};

// Utility functions to detect device and browser
export const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
};

export const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browserName = "unknown";

  if (ua.match(/chrome|chromium|crios/i)) {
    browserName = "chrome";
  } else if (ua.match(/firefox|fxios/i)) {
    browserName = "firefox";
  } else if (ua.match(/safari/i)) {
    browserName = "safari";
  } else if (ua.match(/opr\//i)) {
    browserName = "opera";
  } else if (ua.match(/edg/i)) {
    browserName = "edge";
  }

  return browserName;
};
