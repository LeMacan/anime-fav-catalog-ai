const DEVICE_ID_KEY = "deviceId";

/**
 * Gets or generates a device ID stored in localStorage.
 * Generates a UUID v4 on first call, persists for subsequent calls.
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const stored = localStorage.getItem(DEVICE_ID_KEY);
  if (stored) {
    return stored;
  }

  // Generate UUID v4
  const newId = crypto.randomUUID();
  localStorage.setItem(DEVICE_ID_KEY, newId);
  return newId;
}