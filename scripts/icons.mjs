/**
 * Rasterise app/icon.svg to the PNG variants Next cannot generate itself.
 * Run: npm run icons   (only needed when the mark changes)
 */
import fs   from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const SRC  = path.join(ROOT, 'app', 'icon.svg')

if (!fs.existsSync(SRC)) {
  console.error(`✗ missing ${path.relative(ROOT, SRC)}`)
  process.exit(1)
}

// public/og/ is written by scripts/og.mjs; make sure it exists so a fresh
// clone can build before the OG cards have been generated.
fs.mkdirSync(path.join(ROOT, 'public', 'og'), { recursive: true })

const svg = fs.readFileSync(SRC)
const out = path.join(ROOT, 'app', 'apple-icon.png')

await sharp(svg, { density: 384 }).resize(180, 180).png().toFile(out)

console.log(`✓ ${path.relative(ROOT, out)}  180×180`)
