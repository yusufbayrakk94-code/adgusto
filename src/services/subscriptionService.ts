import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Subscription {
  id?: string;
  userId: string;
  isActive: boolean;
  plan: 'starter' | 'pro' | null;
  status: 'active' | 'trialing' | 'expired' | 'cancelled' | null;
  trialEndsAt: Date | null;
  subscriptionId: string | null;
  renewsAt: Date | null;
  userEmail: string;
  createdAt: any;
  updatedAt: any;
}

export class SubscriptionService {
  // Get user subscription
  static async getUserSubscription(userId: string): Promise<Subscription | null> {
    try {
      const docRef = doc(db, 'subscriptions', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Subscription;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  }

  // Create or update subscription
  static async upsertSubscription(userId: string, subscriptionData: Partial<Subscription>): Promise<void> {
    try {
      const docRef = doc(db, 'subscriptions', userId);
      const existingDoc = await getDoc(docRef);
      
      if (existingDoc.exists()) {
        // Update existing subscription
        await updateDoc(docRef, {
          ...subscriptionData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new subscription
        await setDoc(docRef, {
          userId,
          ...subscriptionData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error upserting subscription:', error);
      throw error;
    }
  }

  // Check if user has active subscription
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      return subscription?.isActive === true;
    } catch (error) {
      console.error('Error checking active subscription:', error);
      return false;
    }
  }

  // Check if user is in trial
  static async isInTrial(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription || subscription.status !== 'trialing') return false;
      
      if (subscription.trialEndsAt) {
        return new Date() < new Date(subscription.trialEndsAt);
      }
      
      return false;
    } catch (error) {
      console.error('Error checking trial status:', error);
      return false;
    }
  }

  // Get subscription status display
  static getSubscriptionStatusDisplay(subscription: Subscription | null): {
    status: 'Free' | 'Aktif' | 'Deneme' | 'Pasif';
    color: string;
    bgColor: string;
  } {
    if (!subscription) {
      return {
        status: 'Free',
        color: 'text-[#0c4650]',
        bgColor: 'bg-[#94fa01]/20'
      };
    }

    if (subscription.status === 'trialing' && subscription.trialEndsAt) {
      const isTrialActive = new Date() < new Date(subscription.trialEndsAt);
      if (isTrialActive) {
        return {
          status: 'Deneme',
          color: 'text-[#0c4650]',
          bgColor: 'bg-[#94fa01]/30'
        };
      }
    }

    if (subscription.isActive && subscription.status === 'active') {
      return {
        status: 'Aktif',
        color: 'text-[#0c4650]',
        bgColor: 'bg-[#94fa01]/40'
      };
    }

    return {
      status: 'Free',
      color: 'text-[#0c4650]',
      bgColor: 'bg-[#94fa01]/20'
    };
  }
}