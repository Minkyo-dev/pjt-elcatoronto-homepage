import 'server-only';

/** Current time for content status. ELCA_NOW (ISO) pins it for tests/demos; otherwise real time. */
export function currentTime(): Date {
  const pinned = process.env.ELCA_NOW;
  return pinned ? new Date(pinned) : new Date();
}
