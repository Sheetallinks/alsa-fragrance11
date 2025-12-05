import connectDB from '../lib/mongodb'
import User from '../lib/models/User'
import bcrypt from 'bcryptjs'

async function main() {
  const email = 'admin@alsafragrance.com'
  const password = 'admin123' // Default password - CHANGE THIS IN PRODUCTION!
  const name = 'Admin User'

  try {
    // Connect to MongoDB
    await connectDB()
    console.log('✅ Connected to MongoDB Atlas')

    // Check if admin already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })

    if (existingUser) {
      console.log('Admin user already exists!')
      console.log('Email:', email)
      console.log('To reset password, delete the user first or update manually.')
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin user with explicit admin role
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'admin', // Explicitly set to admin
    })

    console.log('✅ Admin user created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', password)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('⚠️  IMPORTANT: Change the password after first login!')
    console.log('')
    console.log('Access admin panel at: http://localhost:3000/admin/login')
  } catch (error: any) {
    console.error('Error creating admin user:', error)
    throw error
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })

