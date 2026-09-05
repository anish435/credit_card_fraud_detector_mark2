/**
 * Utility functions for neutral, professional presentation formatting.
 */

/**
 * Format transaction IDs for display.
 * Converts raw internal or legacy IDs (e.g. pay_norm_..., pay_spike_..., tx_172...)
 * into consistent, professional neutral IDs (e.g. txn_8F3A91, txn_71C2DE).
 * Preserves actual ID for lookups while providing a clean operational console aesthetic.
 */
export function formatDisplayTxnId(rawId?: string | null): string {
  if (!rawId) return "txn_000000";

  // If already in clean format like txn_8F3A91, return uppercase
  const cleanMatch = rawId.match(/^txn_([A-Za-z0-9]{6,8})$/);
  if (cleanMatch) {
    return `txn_${cleanMatch[1].toUpperCase()}`;
  }

  // Derive a deterministic 6-character uppercase hex hash from rawId
  let hash = 0;
  for (let i = 0; i < rawId.length; i++) {
    hash = ((hash << 5) - hash + rawId.charCodeAt(i)) | 0;
  }
  const hex = (Math.abs(hash) % 0xffffff)
    .toString(16)
    .toUpperCase()
    .padStart(6, "0");

  return `txn_${hex}`;
}
