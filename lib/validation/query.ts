/** Returns `value` only if it is exactly one of `allowed`; anything else (including hand-edited URLs) is ignored. */
export function parseEnum<T extends string>(value: string | null | undefined, allowed: readonly T[]): T | null {
  if (!value) return null;
  return (allowed as readonly string[]).includes(value) ? (value as T) : null;
}
