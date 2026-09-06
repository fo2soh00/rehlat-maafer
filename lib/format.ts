/**
 * Display formatting. Nothing here touches front matter — these run at render
 * time so a value typed loosely in Decap still reads correctly on the page.
 */

/** Western digits → Arabic-Indic (٠١٢٣٤٥٦٧٨٩). */
export const arabicDigits = (s: string | number) =>
  String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])
