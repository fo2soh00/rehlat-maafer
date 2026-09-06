/**
 * Image hygiene. Run: npm run images
 *
 *  a) build the two portrait variants used by the author strip and About
 *  b) downscale anything in public/images/uploads/ wider than 1600px, in place
 *
 * Both steps are idempotent — a second run finds nothing to do.
 */
import fs   from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT       = process.cwd()
const PUBLIC_DIR = path.join(ROOT, 'public')
const UPLOADS    = path.join(PUBLIC_DIR, 'images', 'uploads')
const MAX_WIDTH  = 1600

const kb   = bytes => `${(bytes / 1024).toFixed(0)} KB`
const rows = []

// ── a) Portrait variants ────────────────────────────────────────────────
const portrait = path.join(PUBLIC_DIR, 'moustafa-portrait.jpg')

if (fs.existsSync(portrait)) {
  for (const width of [240, 800]) {
    const out = path.join(PUBLIC_DIR, `moustafa-portrait-${width}.jpg`)
    const before = fs.existsSync(out) ? fs.statSync(out).size : 0
    await sharp(portrait).resize(width).jpeg({ quality: 84 }).toFile(out)
    rows.push([`moustafa-portrait-${width}.jpg`, before, fs.statSync(out).size])
  }
} else {
  console.warn('! public/moustafa-portrait.jpg missing — skipped the variants')
}

// ── b) Downscale oversized uploads ──────────────────────────────────────
const files = fs.existsSync(UPLOADS)
  ? fs.readdirSync(UPLOADS).filter(f => /\.(jpe?g|png)$/i.test(f))
  : []

for (const name of files) {
  const file = path.join(UPLOADS, name)
  const meta = await sharp(file).metadata()
  if (!meta.width || meta.width <= MAX_WIDTH) continue

  const before = fs.statSync(file).size
  const isPng  = /\.png$/i.test(name)

  // sharp cannot read and write the same path in one pass — stage it.
  const tmp = `${file}.tmp`
  const pipe = sharp(file).resize({ width: MAX_WIDTH, withoutEnlargement: true })
  // palette:true keeps flat-colour diagrams indexed; re-encoding one as full
  // RGBA can more than undo the saving from the resize.
  await (isPng ? pipe.png({ compressionLevel: 9, palette: true }) : pipe.jpeg({ quality: 82 })).toFile(tmp)

  // Never make a file worse. A smaller pixel box can still cost more bytes if
  // the original was better encoded than anything we can produce.
  const after = fs.statSync(tmp).size
  if (after >= before) {
    fs.unlinkSync(tmp)
    console.log(`· skipped ${name} — re-encode would grow it ${kb(before)} → ${kb(after)}`)
    continue
  }
  fs.renameSync(tmp, file)

  rows.push([`images/uploads/${name}  (${meta.width}px → ${MAX_WIDTH}px)`, before, after])
}

// ── Report ──────────────────────────────────────────────────────────────
if (!rows.length) {
  console.log('✓ images: nothing to do')
} else {
  const w = Math.max(...rows.map(r => r[0].length))
  console.log(`${'file'.padEnd(w)}   ${'before'.padStart(9)}   ${'after'.padStart(9)}   saved`)
  console.log('-'.repeat(w + 36))
  let saved = 0
  for (const [name, before, after] of rows) {
    saved += before - after
    console.log(`${name.padEnd(w)}   ${kb(before).padStart(9)}   ${kb(after).padStart(9)}   ${before ? kb(before - after) : '—'}`)
  }
  console.log('-'.repeat(w + 36))
  console.log(`total saved: ${kb(saved)}`)
}
