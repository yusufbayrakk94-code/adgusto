# AdGusto

AdGusto is a comprehensive marketing and advertising management platform with AI-powered tools for campaign analysis, content generation, and performance optimization.

## Features

### Public Features
- **Marketing Analysis**: AI-powered analysis of marketing campaigns
- **Ad Copy Generator**: Generate compelling ad copy with AI
- **Image Generator**: Create marketing images with AI
- **Image Analyzer**: Analyze and improve ad images
- **Video Generator**: Generate marketing videos
- **Campaign Analyzer**: Analyze campaign performance
- **CSV Analyzer**: Analyze campaign data from CSV files
- **Meta Ads Library**: Search and save ads from Meta's ad library
- **Google Ads Management**: Connect and manage your Google Ads account

### Internal Tools (Whitelisted Users Only)
- **Internal Google Ads Manager**: Centralized management of all Google Ads accounts under your MCC
  - View all client accounts
  - Monitor campaign metrics (impressions, clicks, cost, conversions)
  - Pause and enable campaigns
  - Track performance insights (CPA, ROAS)

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase Edge Functions
- **Authentication**: Firebase Authentication
- **Database**: Supabase (PostgreSQL)
- **AI Services**:
  - Groq (text analysis)
  - FAL.ai (image generation and analysis)
  - MiniMax/Haiper (video generation)
- **APIs**: Google Ads API, Meta Ads Library API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project
- Supabase project
- Google Ads API access (for internal tools)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd adgusto
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Service Keys
VITE_GROQ_API_KEY=your_groq_api_key
VITE_FAL_API_KEY=your_fal_api_key

# Google Ads API (Internal Tools)
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_CLIENT_ID=your_oauth_client_id
GOOGLE_ADS_CLIENT_SECRET=your_oauth_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_MCC_CUSTOMER_ID=your_mcc_customer_id
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Setup Guides

- **Firebase Setup**: See [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- **Google Ads Setup** (Public): See [GOOGLE_ADS_SETUP.md](GOOGLE_ADS_SETUP.md)
- **Internal Google Ads Setup**: See [INTERNAL_GOOGLE_ADS_SETUP.md](INTERNAL_GOOGLE_ADS_SETUP.md)

## Internal Tools Access

The internal Google Ads management tool is restricted to whitelisted users only. To add users to the whitelist:

1. Access your Supabase dashboard
2. Navigate to the `internal_whitelist` table
3. Add user entries with their email, full name, and role (admin/manager/viewer)

See [INTERNAL_GOOGLE_ADS_SETUP.md](INTERNAL_GOOGLE_ADS_SETUP.md) for detailed instructions.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This project can be deployed to:
- Netlify
- Vercel
- AWS Amplify
- Any static hosting service

Make sure to:
1. Set all environment variables in your hosting platform
2. Configure redirects for SPA routing
3. Deploy Supabase Edge Functions separately

## Project Structure

```
adgusto/
├── src/
│   ├── components/        # React components
│   ├── services/          # API services
│   ├── hooks/            # Custom React hooks
│   ├── config/           # Configuration files
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── supabase/
│   ├── functions/        # Edge Functions
│   └── migrations/       # Database migrations
├── public/               # Static assets
└── dist/                # Build output
```

## Key Components

- **Dashboard**: Main user dashboard
- **InternalGoogleAdsDashboard**: Internal Google Ads management (whitelisted users only)
- **MarketingAnalysis**: AI-powered marketing analysis
- **AdCopyGenerator**: Generate ad copy
- **AdImageAnalyzer**: Analyze and improve ad images
- **MarketingVideoGenerator**: Generate marketing videos
- **MetaAdsLibrary**: Search and save Meta ads
- **CampaignAnalyzer**: Campaign performance analysis

## Security

- Firebase Authentication with email verification
- Row Level Security (RLS) in Supabase
- Whitelist-based access control for internal tools
- Server-side API calls (no credential exposure)
- CORS-protected Edge Functions

## License

Proprietary - All rights reserved

## Support

For questions or issues, contact the development team.
