// Simple in-memory rate limiter for webhook endpoint
const requests = new Map<string, number[]>();

export function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (requests.get(key) ?? []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) return false;
  timestamps.push(now);
  requests.set(key, timestamps);
  return true;
}
