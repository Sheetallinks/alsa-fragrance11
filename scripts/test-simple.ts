#!/usr/bin/env tsx
/**
 * Simple test to verify the test runner works
 */

console.log('🧪 Starting simple test...')
console.log('✅ Test runner is working!')
console.log('📍 Testing MongoDB connection...')

import connectDB from '../lib/mongodb'

async function test() {
  try {
    await connectDB()
    console.log('✅ MongoDB connection successful!')
    console.log('✅ All basic tests passed!')
    process.exit(0)
  } catch (error: any) {
    console.error('❌ MongoDB connection failed:', error.message)
    console.error(error)
    process.exit(1)
  }
}

test()

