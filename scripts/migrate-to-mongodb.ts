#!/usr/bin/env tsx
/**
 * Migration Script: Prisma SQLite → MongoDB Atlas
 * 
 * This script copies all data from your Prisma database to MongoDB Atlas
 * 
 * Usage:
 *   1. Set MONGODB_URI in .env file
 *   2. Make sure Prisma database has data
 *   3. Run: npm run db:migrate-to-mongodb
 */

import { PrismaClient } from '../lib/prisma-client/client'
import connectDB from '../lib/mongodb'
import User from '../lib/models/User'
import Product from '../lib/models/Product'

const prisma = new PrismaClient()

async function migrateUsers() {
  console.log('📦 Migrating users...')
  
  const prismaUsers = await prisma.user.findMany()
  console.log(`Found ${prismaUsers.length} users in Prisma database`)

  let migrated = 0
  let skipped = 0

  for (const user of prismaUsers) {
    try {
      // Check if user already exists in MongoDB
      const existingUser = await User.findOne({ email: user.email })
      
      if (existingUser) {
        console.log(`⏭️  User ${user.email} already exists, skipping...`)
        skipped++
        continue
      }

      // Create user in MongoDB
      await User.create({
        email: user.email,
        password: user.password, // Keep hashed password
        name: user.name || undefined,
        role: user.role as 'client' | 'admin',
      })

      migrated++
      console.log(`✅ Migrated user: ${user.email}`)
    } catch (error: any) {
      console.error(`❌ Error migrating user ${user.email}:`, error.message)
    }
  }

  console.log(`\n✅ Users migration complete: ${migrated} migrated, ${skipped} skipped\n`)
  return { migrated, skipped }
}

async function migrateProducts() {
  console.log('📦 Migrating products...')
  
  const prismaProducts = await prisma.product.findMany()
  console.log(`Found ${prismaProducts.length} products in Prisma database`)

  let migrated = 0
  let skipped = 0

  for (const product of prismaProducts) {
    try {
      // Parse JSON fields
      let images: string[] = []
      let notesTop: string[] = []
      let notesMiddle: string[] = []
      let notesBase: string[] = []
      let size: string[] = []

      try {
        if (product.images) images = JSON.parse(product.images)
      } catch (e) {
        console.warn(`Warning: Could not parse images for product ${product.id}`)
      }

      try {
        if (product.notesTop) notesTop = JSON.parse(product.notesTop)
      } catch (e) {
        console.warn(`Warning: Could not parse notesTop for product ${product.id}`)
      }

      try {
        if (product.notesMiddle) notesMiddle = JSON.parse(product.notesMiddle)
      } catch (e) {
        console.warn(`Warning: Could not parse notesMiddle for product ${product.id}`)
      }

      try {
        if (product.notesBase) notesBase = JSON.parse(product.notesBase)
      } catch (e) {
        console.warn(`Warning: Could not parse notesBase for product ${product.id}`)
      }

      try {
        if (product.size) size = JSON.parse(product.size)
      } catch (e) {
        console.warn(`Warning: Could not parse size for product ${product.id}`)
      }

      // Check if product already exists (by name and category)
      const existingProduct = await Product.findOne({ 
        name: product.name,
        category: product.category 
      })
      
      if (existingProduct) {
        console.log(`⏭️  Product "${product.name}" already exists, skipping...`)
        skipped++
        continue
      }

      // Create product in MongoDB
      await Product.create({
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice || undefined,
        salePrice: product.salePrice || undefined,
        salePercent: product.salePercent || undefined,
        rating: product.rating,
        reviews: product.reviews,
        image: product.image,
        images: images.length > 0 ? images : undefined,
        description: product.description,
        notesTop: notesTop.length > 0 ? notesTop : undefined,
        notesMiddle: notesMiddle.length > 0 ? notesMiddle : undefined,
        notesBase: notesBase.length > 0 ? notesBase : undefined,
        size: size.length > 0 ? size : undefined,
        inStock: product.inStock,
        isNew: product.isNew,
        isSale: product.isSale,
        badge: product.badge || undefined,
      })

      migrated++
      console.log(`✅ Migrated product: ${product.name}`)
    } catch (error: any) {
      console.error(`❌ Error migrating product ${product.id} (${product.name}):`, error.message)
    }
  }

  console.log(`\n✅ Products migration complete: ${migrated} migrated, ${skipped} skipped\n`)
  return { migrated, skipped }
}

async function main() {
  console.log('🚀 Starting migration from Prisma to MongoDB Atlas...\n')

  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB Atlas...')
    await connectDB()
    console.log('✅ Connected to MongoDB Atlas\n')

    // Migrate users
    const userStats = await migrateUsers()

    // Migrate products
    const productStats = await migrateProducts()

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 Migration Summary:')
    console.log(`   Users: ${userStats.migrated} migrated, ${userStats.skipped} skipped`)
    console.log(`   Products: ${productStats.migrated} migrated, ${productStats.skipped} skipped`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n✅ Migration completed successfully!')
    console.log('\n⚠️  Next steps:')
    console.log('   1. Update all API routes to use MongoDB')
    console.log('   2. Test your application')
    console.log('   3. Remove Prisma dependencies once confirmed working\n')

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    process.exit(0)
  }
}

main()

