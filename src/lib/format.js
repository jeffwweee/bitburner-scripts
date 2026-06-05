export function formatMoney(value) {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}m`;
  }

  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}k`;
  }

  return `$${value.toFixed(2)}`;
}

export function formatRam(gigabytes) {
  if (gigabytes >= 1024) {
    return `${(gigabytes / 1024).toFixed(2)}TB`;
  }

  return `${gigabytes.toFixed(2)}GB`;
}

export function formatDuration(milliseconds) {
  const seconds = milliseconds / 1000;

  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }

  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = wholeSeconds % 60;

  return `${minutes}m ${remainingSeconds}s`;
}
