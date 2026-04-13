#!/usr/bin/env node
/**
 * Script to generate secure .env.local file from .env.example
 * 
 * Usage:
 *   node scripts/generate-env.js
 * 
 * This script:
 *   1. Reads .env.example
 *   2. Generates secure random values for secrets
 *   3. Writes .env.local with real values
 */

import { readFileSync, writeFileSync, existsSync } from "fs"
import { join } from "path"
import { randomBytes } from "crypto"

const rootDir = join(process.cwd())
const examplePath = join(rootDir, ".env.example")
const outputPath = join(rootDir, ".env.local")

/**
 * Generate a random base64 string
 */
function generateSecret(length = 32) {
  return randomBytes(length).toString("base64")
}

/**
 * Generate a random hex string (for database passwords, etc.)
 */
function generateHexSecret(length = 32) {
  return randomBytes(length).toString("hex")
}

/**
 * Check if a value is a placeholder
 */
function isPlaceholder(value) {
  const placeholders = [
    "your-",
    "change-in-production",
    "DEMO_KEY",
    '"your-',
    "'your-",
    '="your-',
    "='your-",
  ]
  const lowerValue = value.toLowerCase().replace(/['"]/g, "")
  return placeholders.some((p) => lowerValue.includes(p.toLowerCase()))
}

/**
 * Main function
 */
function main() {
  console.log("🔐 Quantum Horizon — Environment Generator\n")

  // Check if .env.example exists
  if (!existsSync(examplePath)) {
    console.error("❌ .env.example file not found")
    process.exit(1)
  }

  // Read .env.example
  console.log("📖 Reading .env.example...")
  const exampleContent = readFileSync(examplePath, "utf-8")
  const lines = exampleContent.split("\n")

  // Process each line
  const outputLines = []
  let generatedSecrets = 0

  for (let line of lines) {
    // Strip CR if present (handle CRLF)
    line = line.replace(/\r$/, "")
    
    // Skip comments and empty lines
    if (line.startsWith("#") || line.trim() === "") {
      outputLines.push(line)
      continue
    }

    // Parse KEY=VALUE
    const match = line.match(/^([^=]+)=(.*)$/)
    if (!match) {
      outputLines.push(line)
      continue
    }

    const key = match[1].trim()
    const value = match[2]
    const trimmedValue = value.trim()
    const unquotedValue = trimmedValue.replace(/^["']|["']$/g, "")

    // Check if this is a secret that needs generation
    if (isPlaceholder(unquotedValue)) {
      let secretValue = ""

      // Generate appropriate secret based on key name
      if (key.includes("SECRET") || key === "NEXTAUTH_SECRET") {
        secretValue = `"${generateSecret(32)}"`
        generatedSecrets++
      } else if (key.includes("PASSWORD") || key.includes("TOKEN")) {
        secretValue = `"${generateHexSecret(32)}"`
        generatedSecrets++
      } else {
        // Keep placeholder for API keys and optional values
        secretValue = trimmedValue
      }

      outputLines.push(`${key}=${secretValue}`)
    } else {
      // Keep existing value
      outputLines.push(line)
    }
  }

  // Write .env.local
  const outputContent = outputLines.join("\n")
  writeFileSync(outputPath, outputContent, "utf-8")

  console.log(`✅ Generated .env.local with ${generatedSecrets} secure secrets\n`)
  console.log("📝 Generated secrets:")
  
  // List what was generated
  for (const line of outputLines) {
    if (
      line.includes("NEXTAUTH_SECRET") &&
      !line.startsWith("#") &&
      !isPlaceholder(line)
    ) {
      console.log("  ✓ NEXTAUTH_SECRET")
    }
    if (
      line.includes("DATABASE_URL") &&
      line.includes("postgresql") &&
      line.includes("password")
    ) {
      console.log("  ⚠ DATABASE_URL — update with your actual database credentials")
    }
  }

  console.log("\n⚠️  Important:")
  console.log("  1. Review .env.local and update DATABASE_URL for your setup")
  console.log("  2. NEVER commit .env.local to version control")
  console.log("  3. Keep .env.local secure and backup safely")
  console.log("\n✨ Done!")
}

// Run
try {
  main()
} catch (error) {
  console.error("❌ Error:", error instanceof Error ? error.message : error)
  process.exit(1)
}
