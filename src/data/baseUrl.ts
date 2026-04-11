/** Prepend the base URL to a path. Handles trailing/leading slashes. */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
