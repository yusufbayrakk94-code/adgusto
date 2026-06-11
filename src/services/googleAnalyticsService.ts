import { auth } from '../config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FirestoreService } from './firestoreService';

const CLIENT_ID = '106129545085-6h3p5gkko439c906otsc9mgvqd560518.apps.googleusercontent.com';
const SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/analytics'
];

export class GoogleAnalyticsService {
  private static async getAccessToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Kullanıcı oturumu bulunamadı');

      // Firestore'dan mevcut token'ı kontrol et
      const tokenData = await FirestoreService.getAnalyticsToken(user.uid);
      
      if (tokenData && tokenData.expiresAt > Date.now()) {
        return tokenData.accessToken;
      }

      // Token yok veya süresi dolmuş, yeni token al
      const provider = new GoogleAuthProvider();
      SCOPES.forEach(scope => provider.addScope(scope));
      
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      
      if (!credential?.accessToken) {
        throw new Error('Google oturum açma başarısız');
      }

      // Token'ı Firestore'a kaydet
      await FirestoreService.saveAnalyticsToken(user.uid, {
        accessToken: credential.accessToken,
        expiresAt: Date.now() + 3600 * 1000 // 1 saat
      });

      return credential.accessToken;
    } catch (error) {
      console.error('Google Analytics token alma hatası:', error);
      return null;
    }
  }

  static async getAccountSummaries(): Promise<any[]> {
    try {
      const accessToken = await this.getAccessToken();
      if (!accessToken) throw new Error('Token alınamadı');

      const response = await fetch(
        'https://analyticsadmin.googleapis.com/v1/accountSummaries',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Analytics hesapları getirilemedi');
      }

      const data = await response.json();
      return data.accountSummaries || [];
    } catch (error) {
      console.error('Account summaries hatası:', error);
      return [];
    }
  }

  static async getAnalyticsData(propertyId: string, startDate: string, endDate: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      if (!accessToken) throw new Error('Token alınamadı');

      const response = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dateRanges: [{ startDate, endDate }],
            metrics: [
              { name: 'sessions' },
              { name: 'screenPageViews' },
              { name: 'bounceRate' },
              { name: 'averageSessionDuration' }
            ],
            dimensions: [
              { name: 'date' },
              { name: 'sessionSource' }
            ]
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Analytics verileri getirilemedi');
      }

      return await response.json();
    } catch (error) {
      console.error('Analytics data hatası:', error);
      throw error;
    }
  }

  static async analyzeTrafficData(propertyId: string): Promise<any> {
    try {
      // Son 30 günün verilerini al
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const analyticsData = await this.getAnalyticsData(propertyId, startDate, endDate);
      
      // GroqService ile analiz et
      const groqService = new GroqService();
      return await groqService.analyzeTrafficData(analyticsData);
    } catch (error) {
      console.error('Trafik analizi hatası:', error);
      throw error;
    }
  }
}