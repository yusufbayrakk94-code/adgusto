import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  getDocs, 
  where,
  doc,
  deleteDoc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, serverTimestamp } from '../config/firebase';
import type { AnalyticsTokenData, TrafficAnalysis } from '../types/analytics';

export interface AdCopy {
  id?: string;
  prompt: string;
  generatedText: any[];
  createdAt: any;
}

export interface MarketingAnalysis {
  id?: string;
  input: string;
  insights: any;
  createdAt: any;
}

export interface CSVAnalysis {
  id?: string;
  fileName: string;
  summary: string;
  insights: any;
  createdAt: any;
}

export interface ImageGeneration {
  id?: string;
  prompt: string;
  sector: string;
  format: string;
  imageUrl: string;
  createdAt: any;
}

export interface ImageAnalysis {
  id?: string;
  fileName: string;
  analysisResult: any;
  createdAt: any;
}

export interface VideoGeneration {
  id?: string;
  prompt: string;
  sector: string;
  duration: number;
  videoUrl: string;
  createdAt: any;
}

export class FirestoreService {
  // Ad Copies
  static async saveAdCopy(uid: string, prompt: string, generatedText: any[]): Promise<string> {
    console.log('Firestore saveAdCopy çağrıldı', { uid, prompt, generatedText });
    try {
      const docRef = await addDoc(collection(db, 'users', uid, 'adCopies'), {
        prompt,
        generatedText,
        createdAt: serverTimestamp()
      });
      console.log('Ad copy saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving ad copy:', error);
      throw error;
    }
  }

  static async getAdCopies(uid: string): Promise<AdCopy[]> {
    try {
      const q = query(
        collection(db, 'users', uid, 'adCopies'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const adCopies: AdCopy[] = [];
      
      querySnapshot.forEach((doc) => {
        adCopies.push({
          id: doc.id,
          ...doc.data()
        } as AdCopy);
      });
      
      console.log('Loaded ad copies:', adCopies.length);
      return adCopies;
    } catch (error) {
      console.error('Error fetching ad copies:', error);
      throw error;
    }
  }

  static async deleteAdCopy(uid: string, adCopyId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', uid, 'adCopies', adCopyId));
      console.log('Ad copy deleted:', adCopyId);
    } catch (error) {
      console.error('Error deleting ad copy:', error);
      throw error;
    }
  }

  // Marketing Analyses
  static async saveMarketingAnalysis(uid: string, input: string, insights: any): Promise<string> {
    console.log('Firestore saveMarketingAnalysis çağrıldı', { uid, input, insights });
    try {
      const docRef = await addDoc(collection(db, 'users', uid, 'marketingAnalyses'), {
        input,
        insights,
        createdAt: serverTimestamp()
      });
      console.log('Marketing analysis saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving marketing analysis:', error);
      throw error;
    }
  }

  static async getMarketingAnalyses(uid: string): Promise<MarketingAnalysis[]> {
    try {
      const q = query(
        collection(db, 'users', uid, 'marketingAnalyses'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const analyses: MarketingAnalysis[] = [];
      
      querySnapshot.forEach((doc) => {
        analyses.push({
          id: doc.id,
          ...doc.data()
        } as MarketingAnalysis);
      });
      
      console.log('Loaded marketing analyses:', analyses.length);
      return analyses;
    } catch (error) {
      console.error('Error fetching marketing analyses:', error);
      throw error;
    }
  }

  static async deleteMarketingAnalysis(uid: string, analysisId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', uid, 'marketingAnalyses', analysisId));
      console.log('Marketing analysis deleted:', analysisId);
    } catch (error) {
      console.error('Error deleting marketing analysis:', error);
      throw error;
    }
  }

  // CSV Analyses
  static async saveCSVAnalysis(uid: string, fileName: string, summary: string, insights: any): Promise<string> {
    console.log('Firestore saveCSVAnalysis çağrıldı', { uid, fileName, summary, insights });
    try {
      const docRef = await addDoc(collection(db, 'users', uid, 'csvAnalyses'), {
        fileName,
        summary,
        insights,
        createdAt: serverTimestamp()
      });
      console.log('CSV analysis saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving CSV analysis:', error);
      throw error;
    }
  }

  static async getCSVAnalyses(uid: string): Promise<CSVAnalysis[]> {
    try {
      const q = query(
        collection(db, 'users', uid, 'csvAnalyses'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const analyses: CSVAnalysis[] = [];
      
      querySnapshot.forEach((doc) => {
        analyses.push({
          id: doc.id,
          ...doc.data()
        } as CSVAnalysis);
      });
      
      console.log('Loaded CSV analyses:', analyses.length);
      return analyses;
    } catch (error) {
      console.error('Error fetching CSV analyses:', error);
      throw error;
    }
  }

  static async deleteCSVAnalysis(uid: string, csvId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', uid, 'csvAnalyses', csvId));
      console.log('CSV analysis deleted:', csvId);
    } catch (error) {
      console.error('Error deleting CSV analysis:', error);
      throw error;
    }
  }

  // Google Analytics Token İşlemleri
  static async saveAnalyticsToken(uid: string, tokenData: AnalyticsTokenData): Promise<void> {
    try {
      await setDoc(doc(db, 'users', uid, 'settings', 'analytics'), {
        ...tokenData,
        updatedAt: serverTimestamp()
      });
      console.log('Analytics token saved for user:', uid);
    } catch (error) {
      console.error('Error saving analytics token:', error);
      throw error;
    }
  }

  static async getAnalyticsToken(uid: string): Promise<AnalyticsTokenData | null> {
    try {
      const docRef = doc(db, 'users', uid, 'settings', 'analytics');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as AnalyticsTokenData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching analytics token:', error);
      return null;
    }
  }

  // Google Analytics Analiz Sonuçları
  static async saveTrafficAnalysis(uid: string, propertyId: string, analysis: TrafficAnalysis): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'users', uid, 'trafficAnalyses'), {
        propertyId,
        analysis,
        createdAt: serverTimestamp()
      });
      console.log('Traffic analysis saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving traffic analysis:', error);
      throw error;
    }
  }

  static async getTrafficAnalyses(uid: string): Promise<any[]> {
    try {
      const q = query(
        collection(db, 'users', uid, 'trafficAnalyses'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const analyses: any[] = [];
      
      querySnapshot.forEach((doc) => {
        analyses.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return analyses;
    } catch (error) {
      console.error('Error fetching traffic analyses:', error);
      return [];
    }
  }

  // Image Generations
  static async saveImageGeneration(uid: string, prompt: string, sector: string, format: string, imageUrl: string): Promise<string> {
    console.log('Firestore saveImageGeneration çağrıldı', { uid, prompt, sector, format });
    try {
      const docRef = await addDoc(collection(db, 'users', uid, 'imageGenerations'), {
        prompt,
        sector,
        format,
        imageUrl,
        createdAt: serverTimestamp()
      });
      console.log('Image generation saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving image generation:', error);
      throw error;
    }
  }

  static async getImageGenerations(uid: string): Promise<ImageGeneration[]> {
    try {
      const q = query(
        collection(db, 'users', uid, 'imageGenerations'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const generations: ImageGeneration[] = [];

      querySnapshot.forEach((doc) => {
        generations.push({
          id: doc.id,
          ...doc.data()
        } as ImageGeneration);
      });

      console.log('Loaded image generations:', generations.length);
      return generations;
    } catch (error) {
      console.error('Error fetching image generations:', error);
      throw error;
    }
  }

  static async deleteImageGeneration(uid: string, generationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', uid, 'imageGenerations', generationId));
      console.log('Image generation deleted:', generationId);
    } catch (error) {
      console.error('Error deleting image generation:', error);
      throw error;
    }
  }

  // Image Analyses
  static async saveImageAnalysis(uid: string, fileName: string, analysisResult: any): Promise<string> {
    console.log('Firestore saveImageAnalysis çağrıldı', { uid, fileName });
    try {
      const docRef = await addDoc(collection(db, 'users', uid, 'imageAnalyses'), {
        fileName,
        analysisResult,
        createdAt: serverTimestamp()
      });
      console.log('Image analysis saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving image analysis:', error);
      throw error;
    }
  }

  static async getImageAnalyses(uid: string): Promise<ImageAnalysis[]> {
    try {
      const q = query(
        collection(db, 'users', uid, 'imageAnalyses'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const analyses: ImageAnalysis[] = [];

      querySnapshot.forEach((doc) => {
        analyses.push({
          id: doc.id,
          ...doc.data()
        } as ImageAnalysis);
      });

      console.log('Loaded image analyses:', analyses.length);
      return analyses;
    } catch (error) {
      console.error('Error fetching image analyses:', error);
      throw error;
    }
  }

  static async deleteImageAnalysis(uid: string, analysisId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', uid, 'imageAnalyses', analysisId));
      console.log('Image analysis deleted:', analysisId);
    } catch (error) {
      console.error('Error deleting image analysis:', error);
      throw error;
    }
  }

  // Video Generations
  static async saveVideoGeneration(uid: string, prompt: string, sector: string, duration: number, videoUrl: string): Promise<string> {
    console.log('Firestore saveVideoGeneration çağrıldı', { uid, prompt, sector, duration });
    try {
      const docRef = await addDoc(collection(db, 'users', uid, 'videoGenerations'), {
        prompt,
        sector,
        duration,
        videoUrl,
        createdAt: serverTimestamp()
      });
      console.log('Video generation saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving video generation:', error);
      throw error;
    }
  }

  static async getVideoGenerations(uid: string): Promise<VideoGeneration[]> {
    try {
      const q = query(
        collection(db, 'users', uid, 'videoGenerations'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const generations: VideoGeneration[] = [];

      querySnapshot.forEach((doc) => {
        generations.push({
          id: doc.id,
          ...doc.data()
        } as VideoGeneration);
      });

      console.log('Loaded video generations:', generations.length);
      return generations;
    } catch (error) {
      console.error('Error fetching video generations:', error);
      throw error;
    }
  }

  static async deleteVideoGeneration(uid: string, generationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', uid, 'videoGenerations', generationId));
      console.log('Video generation deleted:', generationId);
    } catch (error) {
      console.error('Error deleting video generation:', error);
      throw error;
    }
  }

  // Get onboarding data
  static async getOnboardingData(uid: string) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // Sadece onboarding ile ilgili alanları döndür
        return {
          businessName: data.businessName,
          industry: data.industry,
          businessSize: data.businessSize,
          monthlyBudget: data.monthlyBudget,
          goals: data.goals,
          challenges: data.challenges,
          onboardingCompleted: data.onboardingCompleted
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
      return null;
    }
  }

  // Get user stats
  static async getUserStats(uid: string) {
    try {
      const [adCopies, marketingAnalyses, csvAnalyses, imageGenerations, imageAnalyses] = await Promise.all([
        this.getAdCopies(uid),
        this.getMarketingAnalyses(uid),
        this.getCSVAnalyses(uid),
        this.getImageGenerations(uid),
        this.getImageAnalyses(uid)
      ]);

      return {
        totalAdCopies: adCopies.length,
        totalMarketingAnalyses: marketingAnalyses.length,
        totalCSVAnalyses: csvAnalyses.length,
        totalImageGenerations: imageGenerations.length,
        totalImageAnalyses: imageAnalyses.length,
        recentActivity: [
          ...adCopies.slice(0, 3).map(item => ({
            ...item,
            type: 'ad-copy',
            title: `${item.prompt.substring(0, 50)}... - Reklam Metni`
          })),
          ...marketingAnalyses.slice(0, 3).map(item => ({
            ...item,
            type: 'marketing',
            title: `${item.input.substring(0, 50)}... - Pazarlama Analizi`
          })),
          ...csvAnalyses.slice(0, 3).map(item => ({
            ...item,
            type: 'csv',
            title: `${item.fileName} - CSV Analizi`
          })),
          ...imageGenerations.slice(0, 3).map(item => ({
            ...item,
            type: 'image-generation',
            title: `${item.prompt.substring(0, 50)}... - Görsel Oluşturma`
          })),
          ...imageAnalyses.slice(0, 3).map(item => ({
            ...item,
            type: 'image-analysis',
            title: `${item.fileName} - Görsel Analizi`
          }))
        ].sort((a, b) => {
          const aTime = a.createdAt?.toDate?.() || new Date(0);
          const bTime = b.createdAt?.toDate?.() || new Date(0);
          return bTime.getTime() - aTime.getTime();
        }).slice(0, 5)
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        totalAdCopies: 0,
        totalMarketingAnalyses: 0,
        totalCSVAnalyses: 0,
        totalImageGenerations: 0,
        totalImageAnalyses: 0,
        recentActivity: []
      };
    }
  }
}

/*
Firestore güvenlik kuralı (Firebase Console > Firestore > Rules):
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{subCollection=**}/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
*/