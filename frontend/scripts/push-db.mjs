import { readFileSync } from 'fs'
import { execSync } from 'child_process'

// Read .env.local
const env = readFileSync('.env.local', 'utf8')
const envVars = {}

env.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    envVars[match[1]] = match[2].trim()
  }
})

// Run drizzle-kit push with the env vars
console.log('Pushing schema to Turso...')
try {
  execSync('npx drizzle-kit push', {
    env: { ...process.env, ...envVars },
    stdio: 'inherit'
  })
  console.log('Schema pushed successfully.')
} catch (e) {
  console.error('Error pushing schema:', e.message)
  process.exit(1)
}
