console.log('TEST STARTING')
console.error('ERROR OUTPUT TEST')

import('./lib/mongodb').then(async (m) => {
  console.log('MongoDB module loaded')
  try {
    await m.default()
    console.log('✅ MongoDB connected!')
    process.exit(0)
  } catch (err: any) {
    console.error('❌ MongoDB error:', err.message)
    process.exit(1)
  }
}).catch((err) => {
  console.error('Import error:', err)
  process.exit(1)
})

