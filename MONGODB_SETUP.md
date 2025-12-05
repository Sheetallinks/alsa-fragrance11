# MongoDB Atlas Setup Guide

## ✅ Migration Complete!

Your project has been migrated from Prisma/SQLite to **MongoDB Atlas**. All API routes now use MongoDB.

---

## Step 1: Create MongoDB Atlas Account & Database

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Sign up** (free account is fine)
3. **Create a Free Cluster:**
   - Choose a cloud provider (AWS, Google Cloud, or Azure)
   - Choose a region close to you
   - Click "Create Cluster" (free tier: M0)

4. **Create Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Username: `alsa-fragrance-admin` (or any name)
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Atlas admin" or "Read and write to any database"
   - Click "Add User"

5. **Whitelist Your IP:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address
   - Click "Confirm"

6. **Get Connection String:**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: "Node.js", Version: "5.5 or later"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - **Replace `<password>` with your actual password** (remove the `< >` brackets)

---

## Step 2: Set Up Environment Variables

### Local Development (.env file)

1. **Open `.env` file** in your project root
2. **Add or update:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/alsa-fragrance?retryWrites=true&w=majority
   ```
   - Replace `username` with your database username
   - Replace `password` with your database password
   - Replace `cluster0.xxxxx` with your actual cluster address
   - The `/alsa-fragrance` part is your database name (you can change it)

3. **Save the file**

### Vercel Production

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Add:**
   - **Name:** `MONGODB_URI`
   - **Value:** Your MongoDB connection string (same as above)
   - **Environment:** Production, Preview, Development
3. **Save**

---

## Step 3: Install Dependencies

In your terminal (Command Prompt), run:

```bash
npm install
```

This will install `mongoose` (MongoDB driver) and remove Prisma dependencies.

---

## Step 4: Migrate Data from Prisma to MongoDB

**Important:** Only run this if you have existing data in your Prisma database that you want to copy to MongoDB.

```bash
npm run db:migrate-to-mongodb
```

This script will:
- ✅ Connect to your Prisma database
- ✅ Connect to MongoDB Atlas
- ✅ Copy all users to MongoDB
- ✅ Copy all products to MongoDB
- ✅ Skip duplicates (won't create duplicates if run multiple times)

**Note:** If you don't have existing data, skip this step.

---

## Step 5: Create Admin User

```bash
npm run db:create-admin
```

This creates:
- **Email:** `admin@alsafragrance.com`
- **Password:** `admin123`

---

## Step 6: Test Locally

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Test the API:**
   - Visit: `http://localhost:3000/api/products`
   - Should return products from MongoDB (or empty array if no products)

3. **Test admin login:**
   - Visit: `http://localhost:3000/admin/login`
   - Login with: `admin@alsafragrance.com` / `admin123`

---

## Step 7: Deploy to Vercel

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Migrate to MongoDB Atlas"
   git push
   ```

2. **Vercel will auto-deploy** (or manually redeploy)

3. **Verify:**
   - Visit your Vercel URL
   - Should work without 404 errors
   - Test admin login

---

## What Changed?

### ✅ Removed:
- Prisma ORM
- SQLite database
- Prisma migrations
- All Prisma dependencies

### ✅ Added:
- MongoDB Atlas (cloud database)
- Mongoose (MongoDB ODM)
- MongoDB models (User, Product)
- Migration script (Prisma → MongoDB)

### ✅ Updated:
- All API routes now use MongoDB
- Authentication uses MongoDB
- Product management uses MongoDB
- Admin creation uses MongoDB

---

## Troubleshooting

### Error: "MONGODB_URI environment variable not found"

**Fix:**
- Make sure `.env` file exists in project root
- Make sure `MONGODB_URI` is set correctly
- Restart your dev server after adding the variable

### Error: "MongoServerError: Authentication failed"

**Fix:**
- Check your MongoDB username and password
- Make sure you replaced `<password>` in the connection string
- Verify database user has correct permissions

### Error: "MongoNetworkError: IP not whitelisted"

**Fix:**
- Go to MongoDB Atlas → Network Access
- Add your IP address or "Allow Access from Anywhere"

### Migration script fails

**Fix:**
- Make sure Prisma database still exists (if migrating)
- Check both connection strings are correct
- Run migration script again (it skips duplicates)

---

## Next Steps

1. ✅ MongoDB Atlas database created
2. ✅ Connection string added to `.env` and Vercel
3. ✅ Dependencies installed
4. ✅ Data migrated (if needed)
5. ✅ Admin user created
6. ✅ Tested locally
7. ✅ Deployed to Vercel

**Your app is now using MongoDB Atlas!** 🎉

---

## Need Help?

If you encounter any issues:
1. Check MongoDB Atlas dashboard for connection status
2. Verify environment variables are set correctly
3. Check Vercel build logs for errors
4. Test MongoDB connection locally first

