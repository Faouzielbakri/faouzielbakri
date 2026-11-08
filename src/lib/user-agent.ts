/** Rough device, browser and OS from a user-agent string, for the dashboard. */

export function deviceOf(agent: string) {
  if (/ipad|tablet/i.test(agent)) return "tablet";
  if (/mobi|iphone|android/i.test(agent)) return "mobile";
  return "desktop";
}

export function browserOf(agent: string) {
  if (/edg\//i.test(agent)) return "Edge";
  if (/opr\/|opera/i.test(agent)) return "Opera";
  if (/samsungbrowser/i.test(agent)) return "Samsung Internet";
  if (/firefox|fxios/i.test(agent)) return "Firefox";
  if (/chrome|crios/i.test(agent)) return "Chrome";
  if (/safari/i.test(agent)) return "Safari";
  return "Other";
}

export function osOf(agent: string) {
  if (/iphone|ipad|ipod/i.test(agent)) return "iOS";
  if (/android/i.test(agent)) return "Android";
  if (/windows/i.test(agent)) return "Windows";
  if (/mac os x|macintosh/i.test(agent)) return "macOS";
  if (/linux|x11/i.test(agent)) return "Linux";
  return "Other";
}
