# 🤖 Automated Turso Setup

I've created an automated script to help you set up Turso! Here's how to use it:

## Quick Setup (3 Steps)

### Step 1: Get Your Turso Connection String

1. **Go to:** https://turso.tech
2. **Sign up** (if you haven't already)
3. **Create Database:**
   - Click "Create Database"
   - Name it: `alsa-fragrance`
   - Choose location
   - Click "Create"
4. **Get Connection String:**
   - Click on your database
   - Go to "Connect" tab
   - Copy the connection string (starts with `libsql://`)

### Step 2: Run the Setup Script

Open your terminal in the project folder and run:

```bash
npm run db:setup-turso
```

The script will:
- ✅ Ask for your Turso connection string
- ✅ Update `.env.local` file
- ✅ Generate Prisma client
- ✅ Run database migrations
- ✅ Test the connection

### Step 3: Add to Vercel

After the script completes successfully:

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Select your project**
3. **Go to:** Settings → Environment Variables
4. **Add:**
   - **Key:** `DATABASE_URL`
   - **Value:** Your Turso connection string (same one you used in the script)
   - **Environment:** Select all (Production, Preview, Development)
5. **Save**

### Step 4: Create Admin User

```bash
npm run db:create-admin
```

### Step 5: Redeploy on Vercel

Push to GitHub or manually redeploy from Vercel dashboard.

## What the Script Does

The `setup-turso.ts` script automates:
1. ✅ Updates `.env.local` with your connection string
2. ✅ Generates Prisma client
3. ✅ Runs database migrations
4. ✅ Tests database connection
5. ✅ Provides next steps

## Manual Setup (Alternative)

If you prefer to do it manually, follow `TURSO_SETUP_CHECKLIST.md`.

## Troubleshooting

### Script fails with "Invalid connection string"
- Make sure your connection string starts with `libsql://`
- Copy the entire string from Turso

### Script fails during migration
- Verify your Turso database is created
- Check your internet connection
- Make sure the connection string is correct

### Still getting 404 on Vercel
- Make sure you added `DATABASE_URL` to Vercel environment variables
- Redeploy after adding the variable
- Check Vercel build logs for errors

## Next Steps After Setup

1. ✅ Database is online
2. ✅ Migrations are complete
3. ✅ Admin user created
4. ✅ Add `DATABASE_URL` to Vercel
5. ✅ Redeploy
6. ✅ Test your site!

---

**Ready? Run:** `npm run db:setup-turso` 🚀

