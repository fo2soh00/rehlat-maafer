/**
 * Western digits → Arabic-Indic (٠١٢٣٤٥٦٧٨٩).
 * The site writes every number in Arabic-Indic form, so episode numbers
 * generated in code have to match the numerals in the hand-written copy.
 */
const AR = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

export function arabicDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, d => AR[Number(d)])
}
