# Internal Google Ads Management Setup

This document provides instructions for setting up the internal Google Ads management tool for AdGusto.

## Overview

The internal Google Ads management tool allows whitelisted team members to:
- View all Google Ads accounts under your MCC (Manager Account)
- Monitor campaign performance metrics (impressions, clicks, cost, conversions)
- Pause and enable campaigns
- View performance insights (CPA, ROAS)

## Important Notes

- **This is an INTERNAL-ONLY tool** - only whitelisted team members can access it
- Uses a single MCC account with service-style authentication
- All API calls are server-side (via Supabase Edge Functions)
- No tokens or credentials are exposed to the frontend

## Prerequisites

1. Google Ads Account with MCC (Manager Customer Center)
2. Google Ads API Developer Token (Basic Access is sufficient)
3. OAuth 2.0 Client ID and Secret
4. Refresh Token for your MCC account
5. Supabase project (already configured)
6. Firebase Authentication (already configured)

## Step 1: Get Google Ads API Access

### 1.1 Apply for Developer Token

1. Sign in to your Google Ads MCC account
2. Go to **Tools & Settings** → **Setup** → **API Center**
3. Apply for API access (Basic Access is sufficient for internal use)
4. Wait for approval (usually 24-48 hours)
5. Copy your **Developer Token**

### 1.2 Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Ads API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth 2.0 Client ID**
6. Choose **Web application** as the application type
7. Add authorized redirect URIs:
   - `http://localhost:3000` (for local testing)
   - Your production domain
8. Copy the **Client ID** and **Client Secret**

### 1.3 Generate Refresh Token

You need to generate a refresh token for your MCC account. You can use the Google Ads API OAuth Playground or this script:

```javascript
// generate-refresh-token.js
const readline = require('readline');
const { google } = require('googleapis');

const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3000';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/adwords'];

// Generate auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent'
});

console.log('Authorize this app by visiting this URL:', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the authorization code: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Refresh Token:', tokens.refresh_token);
    rl.close();
  } catch (error) {
    console.error('Error getting tokens:', error);
    rl.close();
  }
});
```

Run this script and follow the instructions to get your refresh token.

### 1.4 Get Your MCC Customer ID

1. Sign in to your Google Ads MCC account
2. Look at the top-right corner - you'll see your Customer ID (format: XXX-XXX-XXXX)
3. Copy this ID (you can include or exclude the hyphens)

## Step 2: Configure Environment Variables

Add these variables to your `.env` file:

```env
# Google Ads API Configuration
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token_here
GOOGLE_ADS_CLIENT_ID=your_oauth_client_id_here
GOOGLE_ADS_CLIENT_SECRET=your_oauth_client_secret_here
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_ADS_MCC_CUSTOMER_ID=123-456-7890

# Supabase Configuration (already configured)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** The Supabase Edge Functions will automatically have access to these environment variables.

## Step 3: Add Whitelisted Users

Users must be added to the `internal_whitelist` table to access the internal tools.

### Via Supabase Dashboard

1. Go to your Supabase dashboard
2. Navigate to **Table Editor** → `internal_whitelist`
3. Click **Insert** → **Insert row**
4. Fill in:
   - `email`: User's email address (must match their Firebase auth email)
   - `full_name`: User's full name
   - `role`: Choose from `admin`, `manager`, or `viewer`
   - `is_active`: Set to `true`
5. Click **Save**

### Via SQL

```sql
INSERT INTO internal_whitelist (email, full_name, role, is_active)
VALUES
  ('user@example.com', 'John Doe', 'admin', true),
  ('manager@example.com', 'Jane Smith', 'manager', true),
  ('viewer@example.com', 'Bob Johnson', 'viewer', true);
```

### Role Permissions

- **admin**: Full access - can view and update campaigns
- **manager**: Full access - can view and update campaigns
- **viewer**: Read-only access - can only view campaigns, cannot pause/enable them

## Step 4: Verify Setup

1. Sign in to your application with a whitelisted email
2. You should see **"Internal Tools"** section in the sidebar with a shield icon
3. Click on **"Internal Google Ads"** to access the internal dashboard
4. You should see:
   - List of accounts under your MCC
   - Campaigns with metrics when you select an account

## Troubleshooting

### "Access denied" error

- Verify the user's email is in the `internal_whitelist` table
- Check that `is_active` is set to `true`
- Ensure the email matches exactly (case-sensitive)

### "Google Ads API credentials not configured"

- Verify all environment variables are set correctly
- Check that there are no extra spaces or quotes in the values
- Restart your Supabase Edge Functions after updating environment variables

### "Invalid grant" or token errors

- Your refresh token might have expired
- Generate a new refresh token following Step 1.3
- Update the `GOOGLE_ADS_REFRESH_TOKEN` environment variable

### No accounts showing

- Verify your MCC Customer ID is correct
- Check that your OAuth token has the correct permissions
- Ensure your developer token is approved and active
- Check the Supabase Edge Function logs for detailed errors

### "Quota exceeded" errors

- Google Ads API has rate limits
- Basic Access allows 15,000 operations per day
- Implement caching or reduce refresh frequency if needed

## API Rate Limits

- **Basic Access**: 15,000 operations per day
- **Standard Access**: Higher limits (requires application approval)
- Each campaign query counts as multiple operations
- Consider implementing caching for better performance

## Security Best Practices

1. **Never commit credentials** to version control
2. **Rotate tokens** periodically (every 3-6 months)
3. **Monitor access logs** in Supabase
4. **Limit whitelist** to essential team members only
5. **Use viewer role** for users who only need to view data
6. **Enable 2FA** on all whitelisted Firebase accounts

## Deployment

When deploying to production:

1. Ensure all environment variables are set in your hosting platform
2. Update OAuth redirect URIs to include production domain
3. Test with a whitelisted account before general rollout
4. Monitor Supabase Edge Function logs for errors

## Support

For issues or questions:
1. Check Supabase Edge Function logs: Dashboard → Edge Functions → Logs
2. Check Firebase Authentication status
3. Verify Google Ads API quotas: Google Ads → Tools → API Center
4. Review this documentation for troubleshooting steps

## Additional Resources

- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
