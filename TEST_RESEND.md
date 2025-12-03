# Testing Resend API Configuration

I've created a test endpoint to check if your Resend API is configured and working.

## How to Test

### Option 1: Check API Status (GET request)

Visit this URL in your browser or use curl:

**Local:**
```
http://localhost:3000/api/test-resend
```

**Production (after deployment):**
```
https://your-domain.vercel.app/api/test-resend
```

This will return JSON showing:
- ✅ `status: "working"` - API is configured and working
- ❌ `status: "not_configured"` - RESEND_API_KEY is missing
- ⚠️ `status: "invalid_format"` - API key format is wrong
- ❌ `status: "api_error"` - API key exists but API calls fail

### Option 2: Test Sending Email (POST request)

Use curl or Postman to send a POST request:

**Local:**
```bash
curl -X POST http://localhost:3000/api/test-resend
```

**Production:**
```bash
curl -X POST https://your-domain.vercel.app/api/test-resend
```

This will attempt to send a test email to `fragrancealsa@gmail.com`.

## Setting Up Resend API Key

1. **Sign up at [resend.com](https://resend.com)**
2. **Get your API key** from the dashboard (starts with `re_`)
3. **Add to Vercel Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `RESEND_API_KEY` = `re_your_api_key_here`
   - Scope: Production, Preview, Development
   - Redeploy your project

4. **For Local Development:**
   - ✅ **CONFIGURED**: `.env.local` file created with API key
   - The API key is set for local development

## Current Status

✅ **Local Development**: Resend API key is configured in `.env.local`
⚠️ **Production (Vercel)**: API key needs to be added to Vercel environment variables

Your contact form will:
- ✅ Use Resend API if `RESEND_API_KEY` is configured (LOCAL: ✅ | PRODUCTION: ⚠️)
- ⚠️ Fall back to mailto link if API key is missing
- ✅ Show appropriate error messages to users

## Next Steps

1. ✅ **Local**: Restart your dev server (`npm run dev`) to load the new API key
2. ✅ **Local**: Test the endpoint: `GET http://localhost:3000/api/test-resend`
3. ⚠️ **IMPORTANT**: Add `RESEND_API_KEY` to Vercel for production:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `RESEND_API_KEY` = `re_cqDrdgLp_Bp4iGdNqyZwRVDdx3gc29WYa`
   - Scope: Production, Preview, Development
   - **Redeploy your project** after adding the variable
4. Test sending: `POST /api/test-resend` (will send test email to fragrancealsa@gmail.com)
5. Try submitting the contact form - it should send emails automatically!

