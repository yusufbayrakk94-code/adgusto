import { fal } from "@fal-ai/client";

const FAL_API_KEY = import.meta.env.VITE_FAL_API_KEY;

if (FAL_API_KEY) {
  fal.config({
    credentials: FAL_API_KEY,
  });
}

export interface ImageAnalysisResult {
  composition: string[];
  colors: string[];
  typography: string[];
  callToAction: string[];
  summary: string;
}

export class ImageAnalysisService {
  async uploadImage(imageFile: File): Promise<string> {
    if (!FAL_API_KEY) {
      throw new Error('FAL API anahtarı bulunamadı');
    }

    try {
      console.log('Uploading image to fal.ai...');
      const imageUrl = await fal.storage.upload(imageFile);
      console.log('Image uploaded:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Görsel yüklenirken hata oluştu');
    }
  }

  async analyzeAdImage(imageFile: File): Promise<ImageAnalysisResult> {
    console.log('=== IMAGE ANALYSIS START ===');
    console.log('API Key:', FAL_API_KEY ? 'EXISTS' : 'MISSING');
    console.log('Image File:', imageFile.name, imageFile.type, imageFile.size);

    if (!FAL_API_KEY) {
      throw new Error('FAL API anahtarı bulunamadı');
    }

    try {
      console.log('Uploading image to fal.ai...');
      const imageUrl = await fal.storage.upload(imageFile);
      console.log('Image uploaded:', imageUrl);

      console.log('Analyzing image with LLaVA model...');

      const prompt = `Sen uzman bir reklam ve pazarlama analistisin. Bu reklam görselini analiz et ve spesifik, uygulanabilir iyileştirme önerileri sun.

SADECE aşağıdaki JSON formatında yanıt ver:

{
  "composition": ["Öneri 1", "Öneri 2", "Öneri 3"],
  "colors": ["Renk önerisi 1", "Renk önerisi 2"],
  "typography": ["Yazı önerisi 1", "Yazı önerisi 2"],
  "callToAction": ["CTA önerisi 1", "CTA önerisi 2"],
  "summary": "Genel değerlendirme özeti"
}

Her kategoride 2-3 spesifik öneri sun. Türkçe olarak yaz. Öneriler yapılması gerekenler formatında olsun (örn: "Logo boyutu büyütülmeli", "Renk kontrastı artırılmalı").

ÖNEMLI: SADECE JSON formatında yanıt ver, başka metin ekleme.`;

      const result = await fal.subscribe("fal-ai/llava-next", {
        input: {
          image_url: imageUrl,
          prompt: prompt,
          max_tokens: 2000,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log('Analysis in progress...');
          }
        },
      });

      console.log('LLaVA Response:', result);

      if (!result.data || !result.data.output) {
        throw new Error('LLaVA modelinden yanıt alınamadı');
      }

      const content = result.data.output;
      console.log('Raw Content:', content);

      let jsonContent = content.trim();
      const jsonStart = jsonContent.indexOf('{');
      const jsonEnd = jsonContent.lastIndexOf('}') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        jsonContent = jsonContent.substring(jsonStart, jsonEnd);
      }

      console.log('Cleaned JSON:', jsonContent);

      const parsedResult = JSON.parse(jsonContent);
      console.log('Parsed Result:', parsedResult);
      console.log('=== IMAGE ANALYSIS END ===');

      return parsedResult;
    } catch (error) {
      console.error('=== IMAGE ANALYSIS ERROR ===');
      console.error('Error:', error);

      if (error instanceof Error) {
        throw new Error('Görsel analiz hatası: ' + error.message);
      }
      throw error;
    }
  }
}
