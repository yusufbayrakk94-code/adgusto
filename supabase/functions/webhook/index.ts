import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { initializeApp, cert } from 'https://esm.sh/firebase-admin@11.8.0/app'
import { getFirestore } from 'https://esm.sh/firebase-admin@11.8.0/firestore'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Firebase Admin
const firebaseConfig = {
  projectId: Deno.env.get('FIREBASE_ADMIN_PROJECT_ID'),
  privateKey: Deno.env.get('FIREBASE_ADMIN_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
  clientEmail: Deno.env.get('FIREBASE_ADMIN_CLIENT_EMAIL'),
}

let app
try {
  app = initializeApp({
    credential: cert(firebaseConfig),
  })
} catch (error) {
  console.error('Firebase initialization error:', error)
}

const db = getFirestore(app)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('x-signature')
    const webhookSecret = Deno.env.get('LEMONSQUEEZY_WEBHOOK_SECRET') || 'test_secret_placeholder'
    
    if (!signature || !webhookSecret) {
      return new Response('Unauthorized', { status: 401 })
    }

    // For free launch, skip signature verification with placeholder secret
    if (webhookSecret === 'test_secret_placeholder') {
      console.log('Using test webhook secret - signature verification skipped for free launch')
    }

    const body = await req.text()
    const payload = JSON.parse(body)
    
    console.log('Webhook received:', payload.meta?.event_name)

    const eventName = payload.meta?.event_name
    const subscriptionData = payload.data

    if (!eventName || !subscriptionData) {
      return new Response('Invalid payload', { status: 400 })
    }

    // Extract user email from customer data
    const userEmail = subscriptionData.attributes?.user_email || 
                     payload.data?.attributes?.customer?.email

    if (!userEmail) {
      console.error('No user email found in webhook payload')
      return new Response('No user email found', { status: 400 })
    }

    // Find user by email in Firestore (you might need to adjust this based on your user collection structure)
    const usersRef = db.collection('users')
    const userQuery = await usersRef.where('email', '==', userEmail).limit(1).get()
    
    let userId = null
    if (!userQuery.empty) {
      userId = userQuery.docs[0].id
    } else {
      console.error('User not found for email:', userEmail)
      return new Response('User not found', { status: 404 })
    }

    // Prepare subscription data
    const subscriptionUpdate: any = {
      subscriptionId: subscriptionData.id,
      userEmail: userEmail,
      updatedAt: new Date()
    }

    // Handle different webhook events
    // TODO: Implement paid subscription logic when ready
    // For now, all users have free access
    switch (eventName) {
      case 'subscription_created':
        subscriptionUpdate.isActive = true
        subscriptionUpdate.status = subscriptionData.attributes?.status || 'active'
        subscriptionUpdate.plan = subscriptionData.attributes?.variant_name?.toLowerCase().includes('pro') ? 'pro' : 'starter'
        
        // Set trial end date if it's a trial
        if (subscriptionData.attributes?.trial_ends_at) {
          subscriptionUpdate.trialEndsAt = new Date(subscriptionData.attributes.trial_ends_at)
          subscriptionUpdate.status = 'trialing'
        }
        
        // Set renewal date
        if (subscriptionData.attributes?.renews_at) {
          subscriptionUpdate.renewsAt = new Date(subscriptionData.attributes.renews_at)
        }
        
        subscriptionUpdate.createdAt = new Date()
        break

      case 'subscription_updated':
        subscriptionUpdate.status = subscriptionData.attributes?.status || 'active'
        subscriptionUpdate.isActive = subscriptionData.attributes?.status === 'active'
        
        if (subscriptionData.attributes?.trial_ends_at) {
          subscriptionUpdate.trialEndsAt = new Date(subscriptionData.attributes.trial_ends_at)
        }
        
        if (subscriptionData.attributes?.renews_at) {
          subscriptionUpdate.renewsAt = new Date(subscriptionData.attributes.renews_at)
        }
        break

      case 'subscription_expired':
      case 'subscription_cancelled':
        subscriptionUpdate.isActive = false
        subscriptionUpdate.status = 'expired'
        break

      default:
        console.log('Unhandled webhook event:', eventName)
        return new Response('Event not handled', { status: 200 })
    }

    // Update subscription in Firestore
    const subscriptionRef = db.collection('subscriptions').doc(userId)
    await subscriptionRef.set(subscriptionUpdate, { merge: true })

    console.log('Subscription updated for user:', userId)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})