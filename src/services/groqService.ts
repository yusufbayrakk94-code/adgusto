import { GROQ_API_KEY, GROQ_API_URL } from '../config/groq';
import { ServiceAnalysis } from '../types';

interface AdCopy {
  headline: string;
  description: string;
  callToAction: string;
  platform: string;
}

export class GroqService {
  private apiKey = GROQ_API_KEY;

  async generateAdCopies(service: string, selectedPlatforms: string[]): Promise<AdCopy[]> {
    console.log('=== GROQ SERVICE START ===');
    console.log('API Key:', this.apiKey ? 'EXISTS' : 'MISSING');
    console.log('Service:', service);
    console.log('Platforms:', selectedPlatforms);

    if (!this.apiKey) {
      throw new Error('GROQ API anahtarı bulunamadı');
    }

    const platformMap: { [key: string]: string } = {
      'facebook': 'Facebook',
      'instagram': 'Instagram',
      'google': 'Google Ads',
      'linkedin': 'LinkedIn',
      'tiktok': 'TikTok',
      'youtube': 'YouTube'
    };

    const platformNames = selectedPlatforms.map(id => platformMap[id]).filter(Boolean);
    console.log('Platform Names:', platformNames);

    const prompt = `Sen reklam metni yazarısın. "${service}" hizmeti için ${platformNames.join(', ')} platformlarında kullanılacak reklam metinleri oluştur.

Her platform için 2 farklı reklam metni varyasyonu yaz. Toplam ${platformNames.length * 2} adet metin oluştur.

ÖNEMLI:
- SADECE aşağıdaki JSON formatında yanıt ver
- Hiç açıklama ekleme, sadece JSON
- Tüm metinler TÜRKÇE olmalı

[
  {
    "headline": "Çekici başlık",
    "description": "Açıklama metni",
    "callToAction": "Eylem çağrısı",
    "platform": "Platform adı"
  }
]`;

    console.log('Prompt ready, making API call...');

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      console.log('API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        console.error('API Error Status:', response.status);

        let errorMessage = `API hatası: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error?.message) {
            errorMessage = `GROQ API Hatası: ${errorJson.error.message}`;
          }
        } catch (e) {
          // JSON parse hatası, devam et
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API Response Data:', data);

      const content = data.choices?.[0]?.message?.content;
      console.log('Content:', content);

      if (!content) {
        throw new Error('API yanıtı boş');
      }

      let cleanContent = content.trim();

      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const arrayStart = cleanContent.indexOf('[');
      const arrayEnd = cleanContent.lastIndexOf(']') + 1;

      if (arrayStart !== -1 && arrayEnd > arrayStart) {
        cleanContent = cleanContent.substring(arrayStart, arrayEnd);
      }

      console.log('Clean Content:', cleanContent);

      const result = JSON.parse(cleanContent);
      console.log('Parsed Result:', result);
      console.log('Is Array?', Array.isArray(result));
      console.log('Array Length:', result.length);
      console.log('=== GROQ SERVICE END ===');

      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('=== GROQ SERVICE ERROR ===');
      console.error('Error:', error);
      throw error;
    }
  }

  async analyzeService(service: string, sector?: string): Promise<ServiceAnalysis> {
    console.log('=== GROQ SERVICE ANALYZE START ===');
    console.log('API Key:', this.apiKey ? `EXISTS (${this.apiKey.substring(0, 10)}...)` : 'MISSING');
    console.log('Service:', service);
    console.log('Sector:', sector);

    if (!this.apiKey) {
      throw new Error('GROQ API anahtarı bulunamadı. Lütfen .env dosyasındaki VITE_GROQ_API_KEY değerini kontrol edin.');
    }

    if (this.apiKey.length < 20) {
      throw new Error('GROQ API anahtarı çok kısa. Lütfen doğru anahtarı girdiğinizden emin olun.');
    }

    const prompt = `"${service}" hizmeti için detaylı pazarlama stratejisi oluştur. ${sector ? `Sektör: ${sector}.` : ''}

AŞAĞIDAKİ JSON ŞABLONUNDAKİ YAPIYI TAM OLARAK KULLAN:
{
  "service": "${service}",
  "summary": "Bu hizmetin genel pazarlama stratejisi özeti (2-3 cümle)",
  "channels": [
    {"name": "Facebook", "description": "Sosyal medya", "effectiveness": 85, "cost": "Orta", "targetAudience": "18-45 yaş"},
    {"name": "Google Ads", "description": "Arama reklamları", "effectiveness": 90, "cost": "Yüksek", "targetAudience": "Tüm yaş"}
  ],
  "adTypes": [
    {"type": "Carousel", "description": "Çoklu görsel reklam", "bestFor": "Ürün çeşitliliği", "examples": ["Ürün 1", "Ürün 2"]},
    {"type": "Video", "description": "Video reklam", "bestFor": "Hikaye anlatımı", "examples": ["Tanıtım", "Kullanım"]}
  ],
  "copyTexts": [
    {"headline": "Dikkat çekici başlık", "description": "Ürün açıklaması", "callToAction": "Hemen Al", "platform": "Facebook"},
    {"headline": "İkinci başlık", "description": "Farklı açıklama", "callToAction": "Şimdi Dene", "platform": "Instagram"}
  ],
  "budgetRecommendation": {
    "minBudget": 5000,
    "optimalBudget": 15000,
    "budgetDistribution": [
      {"platform": "Facebook", "percentage": 40, "rationale": "En yüksek engagement"},
      {"platform": "Google Ads", "percentage": 35, "rationale": "Yüksek dönüşüm"},
      {"platform": "Instagram", "percentage": 25, "rationale": "Genç hedef kitle"}
    ],
    "expectedResults": "Beklenen sonuçlar açıklaması"
  },
  "organicContent": {
    "blogPosts": [
      {"title": "Blog yazısı başlığı", "summary": "Kısa özet", "keywords": ["anahtar1", "anahtar2"]}
    ],
    "socialMediaPosts": [
      {"platform": "Instagram", "content": "Gönderi metni", "hashtags": ["tag1", "tag2"], "visualSuggestion": "Görsel önerisi"}
    ],
    "contentCalendar": "İçerik takvimi önerisi"
  }
}

KURALLAR:
1. SADECE yukarıdaki JSON yapısını kullan
2. En az 3 channel, 4 adTypes, 6 copyTexts, 3 blogPosts, 4 socialMediaPosts ekle
3. Tüm metinler TÜRKÇE olsun
4. Sayılar tırnak içinde olmasın
5. Hiç açıklama ekleme, sadece JSON döndür`;

    console.log('Prompt ready, making API call...');

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "Sen bir JSON üreteci asistanısın. Her zaman geçerli JSON formatında yanıt verirsin. Hiç açıklama yapmaz, sadece JSON üretirsin. Kullanıcının verdiği JSON şablonuna tamamen sadık kalırsın."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 6000,
          response_format: { type: "json_object" }
        })
      });

      console.log('API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        console.error('API Error Status:', response.status);

        let errorMessage = `API hatası: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error?.message) {
            errorMessage = `GROQ API Hatası: ${errorJson.error.message}`;
          }
        } catch (e) {
          // JSON parse hatası, devam et
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API Response Data:', data);

      const content = data.choices?.[0]?.message?.content;
      console.log('Content:', content);

      if (!content) {
        throw new Error('API yanıtı boş');
      }

      let cleanContent = content.trim();

      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const objectStart = cleanContent.indexOf('{');
      const objectEnd = cleanContent.lastIndexOf('}') + 1;

      if (objectStart !== -1 && objectEnd > objectStart) {
        cleanContent = cleanContent.substring(objectStart, objectEnd);
      }

      cleanContent = cleanContent
        .replace(/,(\s*[}\]])/g, '$1')
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
        .replace(/:\s*'([^']*)'/g, ': "$1"');

      console.log('Clean Content (first 500 chars):', cleanContent.substring(0, 500));
      console.log('Clean Content (last 500 chars):', cleanContent.substring(cleanContent.length - 500));

      let result;
      try {
        result = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Failed content:', cleanContent);

        const errorMatch = parseError instanceof Error && parseError.message.match(/position (\d+)/);
        if (errorMatch) {
          const position = parseInt(errorMatch[1]);
          console.error('Error context:', cleanContent.substring(Math.max(0, position - 100), position + 100));
        }

        throw new Error('Yanıt geçerli JSON formatında değil. Lütfen tekrar deneyin.');
      }

      console.log('Parsed Result:', result);
      console.log('Has budgetRecommendation:', !!result.budgetRecommendation);
      console.log('Has organicContent:', !!result.organicContent);
      console.log('=== GROQ SERVICE ANALYZE END ===');

      return result;
    } catch (error) {
      console.error('=== GROQ SERVICE ANALYZE ERROR ===');
      console.error('Error:', error);
      throw error;
    }
  }

  async analyzeCampaignBrief(brief: string): Promise<{
    name: string;
    objective: string;
    status: string;
    daily_budget: number;
  }> {
    if (!this.apiKey) {
      throw new Error('GROQ API anahtarı bulunamadı');
    }

    const prompt = `Aşağıdaki kampanya brief'ini analiz et ve Meta (Facebook/Instagram) kampanyası için gerekli bilgileri çıkar:

Brief: "${brief}"

SADECE aşağıdaki JSON formatında yanıt ver:
{
  "name": "Kampanya adı (brief'e uygun, kısa ve açıklayıcı)",
  "objective": "Kampanya amacı (OUTCOME_TRAFFIC, OUTCOME_AWARENESS, OUTCOME_ENGAGEMENT, OUTCOME_LEADS veya OUTCOME_SALES)",
  "status": "PAUSED veya ACTIVE",
  "daily_budget": günlük bütçe sayısı (TL cinsinden, eğer belirtilmemişse makul bir öneri)
}

Kurallar:
- objective MUTLAKA yukarıdaki değerlerden biri olmalı
- status MUTLAKA PAUSED veya ACTIVE olmalı
- daily_budget bir sayı olmalı (tırnak içinde olmasın)
- Eğer brief'te bütçe belirtilmemişse, kampanya amacına göre makul bir bütçe öner (örn: farkındalık için 200-500 TL, satış için 500-1000 TL)
- Kampanya adı maksimum 100 karakter olsun
- Hiç açıklama ekleme, sadece JSON döndür`;

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "Sen bir JSON üreteci asistanısın. Her zaman geçerli JSON formatında yanıt verirsin. Hiç açıklama yapmaz, sadece JSON üretirsin."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 500,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API hatası: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('API yanıtı boş');
      }

      let cleanContent = content.trim();

      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const result = JSON.parse(cleanContent);

      const validObjectives = ['OUTCOME_TRAFFIC', 'OUTCOME_AWARENESS', 'OUTCOME_ENGAGEMENT', 'OUTCOME_LEADS', 'OUTCOME_SALES'];
      if (!validObjectives.includes(result.objective)) {
        result.objective = 'OUTCOME_TRAFFIC';
      }

      const validStatuses = ['ACTIVE', 'PAUSED'];
      if (!validStatuses.includes(result.status)) {
        result.status = 'PAUSED';
      }

      if (typeof result.daily_budget !== 'number' || result.daily_budget <= 0) {
        result.daily_budget = 300;
      }

      return result;
    } catch (error) {
      console.error('Brief analiz hatası:', error);
      throw error;
    }
  }
}
