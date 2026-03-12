// Script to generate PWA icons from favicon.svg
import sharp from 'sharp'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
const INPUT_FILE = 'public/favicon.svg'
const OUTPUT_DIR = 'public/icons'

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Read SVG file
const svgBuffer = readFileSync(INPUT_FILE)

// Generate PNG icons for each size
async function generateIcons() {
  console.log('Generating PWA icons...')
  
  for (const size of SIZES) {
    const outputPath = join(OUTPUT_DIR, `icon-${size}x${size}.png`)
    
    await sharp(svgBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 15, g: 15, b: 26, alpha: 1 }
      })
      .png()
      .toFile(outputPath)
    
    console.log(`✓ Created icon-${size}x${size}.png`)
  }
  
  // Create shortcut icons for quantum and cosmos
  const quantumColors = ['#6366f1', '#8b5cf6', '#a855f7']
  const cosmosColors = ['#f59e0b', '#ef4444', '#8b5cf6']
  
  console.log('\nIcons generated successfully!')
}

generateIcons().catch(console.error)
