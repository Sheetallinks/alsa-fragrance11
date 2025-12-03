#!/usr/bin/env tsx
/**
 * Turso Database Setup Script
 * 
 * This script helps set up your Turso database connection.
 * 
 * Usage:
 *   1. Get your Turso connection string from https://turso.tech
 *   2. Run: npm run db:setup-turso
 *   3. Enter your connection string when prompted
 *   4. The script will test the connection and run migrations
 */

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('🚀 Turso Database Setup\n')
  console.log('This script will help you set up your Turso database connection.\n')

  // Get connection string
  const connectionString = await question(
    'Enter your Turso connection string (starts with libsql://): '
  )

  if (!connectionString.startsWith('libsql://')) {
    console.error('❌ Invalid connection string. It should start with libsql://')
    process.exit(1)
  }

  console.log('\n📝 Setting up...\n')

  // Update .env.local file
  const envLocalPath = path.join(process.cwd(), '.env.local')
  let envContent = ''

  if (fs.existsSync(envLocalPath)) {
    envContent = fs.readFileSync(envLocalPath, 'utf-8')
    
    // Update or add DATABASE_URL
    if (envContent.includes('DATABASE_URL=')) {
      envContent = envContent.replace(
        /DATABASE_URL=.*/g,
        `DATABASE_URL="${connectionString}"`
      )
    } else {
      envContent += `\nDATABASE_URL="${connectionString}"\n`
    }
  } else {
    envContent = `DATABASE_URL="${connectionString}"\n`
  }

  fs.writeFileSync(envLocalPath, envContent)
  console.log('✅ Updated .env.local file')

  // Set environment variable for this session
  process.env.DATABASE_URL = connectionString

  try {
    // Generate Prisma client
    console.log('\n📦 Generating Prisma client...')
    execSync('npx prisma generate', { stdio: 'inherit' })
    console.log('✅ Prisma client generated')

    // Run migrations
    console.log('\n🔄 Running database migrations...')
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    console.log('✅ Migrations completed')

    // Test connection
    console.log('\n🔍 Testing database connection...')
    execSync('npx prisma db pull --print', { stdio: 'pipe' })
    console.log('✅ Database connection successful!')

    console.log('\n🎉 Setup complete!\n')
    console.log('Next steps:')
    console.log('1. Add DATABASE_URL to Vercel environment variables:')
    console.log(`   ${connectionString}`)
    console.log('2. Create admin user: npm run db:create-admin')
    console.log('3. Redeploy on Vercel\n')

  } catch (error: any) {
    console.error('\n❌ Error during setup:', error.message)
    console.log('\nTroubleshooting:')
    console.log('1. Verify your connection string is correct')
    console.log('2. Make sure your Turso database is created')
    console.log('3. Check your internet connection')
    process.exit(1)
  }

  rl.close()
}

main().catch((error) => {
  console.error('Unexpected error:', error)
  rl.close()
  process.exit(1)
})

