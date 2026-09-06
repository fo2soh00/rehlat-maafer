/**
 * Display formatting. Nothing here touches front matter — these run at render
 * time so a value typed loosely in Decap still reads correctly on the page.
 */

/** Western digits → Arabic-Indic (٠١٢٣٤٥٦٧٨٩). */
export const arabicDigits = (s: string | number) =>
  String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])

/**
 * Read time as written in Decap, rendered in Arabic.
 *
 * Some entries were typed in English («2 minutes»), which renders as Latin
 * digits inside an RTL line. Only that exact shape is converted — anything
 * already in Arabic is returned untouched, so hand-written values keep their
 * own wording (both «دقايق» and «دقائق» appear in the corpus).
 */
export function formatReadTime(raw?: string): string {
  if (!raw) return ''
  const m = raw.trim().match(/^(\d+)\s*(min|mins|minute|minutes)$/i)
  if (!m) return raw                       // already Arabic — leave exactly as written

  const n = +m[1]
  if (n === 1) return 'دقيقة'
  if (n === 2) return 'دقيقتين'
  if (n <= 10) return `${arabicDigits(n)} دقائق`
  return `${arabicDigits(n)} دقيقة`
}
