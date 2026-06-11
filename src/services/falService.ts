import { fal } from "@fal-ai/client";
import { GROQ_API_URL } from '../config/groq';

const FAL_API_KEY = import.meta.env.VITE_FAL_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (FAL_API_KEY) {
  fal.config({
    credentials: FAL_API_KEY,
  });
}

export interface AdImageAnalysis {
  originalImageUrl: string;
  improvedImageUrl?: string;
  suggestions: string[];
  description: string;
  improvements: {
    composition: string[];
    colors: string[];
    typography: string[];
    callToAction: string[];
  };
}

export interface ImageEditRequest {
  imageUrl: string;
  prompt: string;
}

async function uploadImageToFal(file: File): Promise<string> {
  try {
    const imageUrl = await fal.storage.upload(file);
    return imageUrl;
  } catch (error) {
    console.error('Error uploading image to fal.ai:', error);
    throw new Error('Resim yüklenirken hata oluştu');
  }
}

async function analyzeAdImage(imageUrl: string): Promise<string> {
  console.log('analyzeAdImage - GROQ_API_KEY check:', GROQ_API_KEY ? 'Key exists' : 'Key missing');
  console.log('analyzeAdImage - Image URL:', imageUrl);

  if (!GROQ_API_KEY) {
    throw new Error('GROQ API anahtarı bulunamadı. Lütfen .env dosyanızı kontrol edin.');
  }

  const analysisPrompt = `Sen uzman bir reklam ve pazarlama analistisin. Bu reklam görselini analiz et ve spesifik, uygulanabilir iyileştirme önerileri sun.

5-7 iyileştirme önerisi sun, Türkçe olarak ve öneri formatında (yapılması gerekenleri belirt).

Öneri formatı şu şekilde olmalı:
- "Logo boyutu büyütülmeli"
- "Renk kontrast oranı artırılmalı"
- "Ana CTA butonu daha belirgin olmalı"
- "Metin hiyerarşisi düzenlenmeli"

Önerileri kategorilere ayır:
KOMPOZISYON: Yerleşim, hiyerarşi, denge
RENK: Renk psikolojisi ve kontrast
TİPOGRAFİ: Metin okunabilirliği ve yazı tipi seçimleri
HAREKETE GEÇİRİCİ MESAJ: CTA görünürlüğü ve etkinliği

Spesifik ve uygulanabilir ol. Her öneri neyin iyileştirilmesi gerektiğini açıkça belirtmeli.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama-3.2-90b-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: analysisPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq Vision API Error:', errorData);
      throw new Error(`Analiz isteği başarısız: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;

    return analysisText || 'Analiz tamamlandı ancak sonuç alınamadı.';
  } catch (error) {
    console.error('Error analyzing ad image:', error);
    throw new Error('Reklam görseli analiz edilirken hata oluştu');
  }
}

async function improveAdImage(imageUrl: string, improvementPrompt: string): Promise<string> {
  if (!FAL_API_KEY) {
    throw new Error('FAL API anahtarı bulunamadı. Lütfen .env dosyanızı kontrol edin.');
  }

  try {
    console.log('=== NANO-BANANA START ===');
    console.log('FAL API Key:', FAL_API_KEY ? 'EXISTS' : 'MISSING');
    console.log('Image URL:', imageUrl);
    console.log('Prompt:', improvementPrompt);

    const result = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: {
        prompt: improvementPrompt,
        image_urls: [imageUrl],
        num_images: 1,
        aspect_ratio: "auto",
        output_format: "png",
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log('Queue update:', update.status);
        }
      },
    });

    console.log('Nano-banana result:', result);

    if (result.data && result.data.images && result.data.images.length > 0) {
      return result.data.images[0].url;
    }

    throw new Error('İyileştirilmiş görsel oluşturulamadı');
  } catch (error) {
    console.error('Error improving ad image:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw new Error('Reklam görseli iyileştirilirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
  }
}

function parseAnalysisResults(analysisText: string): AdImageAnalysis['improvements'] {
  const improvements = {
    composition: [] as string[],
    colors: [] as string[],
    typography: [] as string[],
    callToAction: [] as string[],
  };

  const lines = analysisText.split('\n');
  let currentCategory = '';

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.toLowerCase().includes('composition') ||
        trimmedLine.toLowerCase().includes('kompozisyon')) {
      currentCategory = 'composition';
    } else if (trimmedLine.toLowerCase().includes('color') ||
               trimmedLine.toLowerCase().includes('renk')) {
      currentCategory = 'colors';
    } else if (trimmedLine.toLowerCase().includes('typography') ||
               trimmedLine.toLowerCase().includes('tipografi') ||
               trimmedLine.toLowerCase().includes('yazı')) {
      currentCategory = 'typography';
    } else if (trimmedLine.toLowerCase().includes('call-to-action') ||
               trimmedLine.toLowerCase().includes('cta') ||
               trimmedLine.toLowerCase().includes('harekete geçirici')) {
      currentCategory = 'callToAction';
    }

    if (trimmedLine.match(/^[-•*]\s+/) || trimmedLine.match(/^\d+\.\s+/)) {
      const suggestion = trimmedLine.replace(/^[-•*]\s+/, '').replace(/^\d+\.\s+/, '');
      if (suggestion && currentCategory) {
        improvements[currentCategory as keyof typeof improvements].push(suggestion);
      }
    }
  }

  return improvements;
}

export async function analyzeAndImproveAdImage(file: File): Promise<AdImageAnalysis> {
  try {
    const imageUrl = await uploadImageToFal(file);

    const analysisText = await analyzeAdImage(imageUrl);

    const improvements = parseAnalysisResults(analysisText);

    const allSuggestions = [
      ...improvements.composition,
      ...improvements.colors,
      ...improvements.typography,
      ...improvements.callToAction,
    ];

    return {
      originalImageUrl: imageUrl,
      description: analysisText,
      suggestions: allSuggestions,
      improvements,
    };
  } catch (error) {
    console.error('Error in analyzeAndImproveAdImage:', error);
    throw error;
  }
}

function translateImprovementToPrompt(improvement: string): string {
  const lowerImprovement = improvement.toLowerCase();

  if (lowerImprovement.includes('logo') || lowerImprovement.includes('boyut')) {
    return 'Significantly increase the logo size by 2-3x, make it the most prominent visual element with bold presence and sharp clarity';
  }
  if (lowerImprovement.includes('kontrast') || lowerImprovement.includes('contrast')) {
    return 'Dramatically increase color contrast ratios to at least 4.5:1, make text pop against background with vibrant, bold colors';
  }
  if (lowerImprovement.includes('cta') || lowerImprovement.includes('buton') || lowerImprovement.includes('button')) {
    return 'Make call-to-action button 50% larger, use bright contrasting colors (like orange, red, or bright blue), add subtle shadow for depth';
  }
  if (lowerImprovement.includes('metin') || lowerImprovement.includes('text') || lowerImprovement.includes('yazı')) {
    return 'Make headlines 40% larger and bold, increase body text size by 20%, use strong font weights for better readability';
  }
  if (lowerImprovement.includes('renk') || lowerImprovement.includes('color')) {
    return 'Transform color palette with vibrant, saturated colors that grab attention, use complementary color schemes for maximum visual impact';
  }
  if (lowerImprovement.includes('kompozisyon') || lowerImprovement.includes('composition')) {
    return 'Reorganize layout with clear focal point, use rule of thirds, increase spacing between elements by 30% for better visual flow';
  }
  if (lowerImprovement.includes('hiyerarşi') || lowerImprovement.includes('hierarchy')) {
    return 'Create strong size contrast between headline (very large), subheadline (medium), and body text (readable), use bold weights strategically';
  }
  if (lowerImprovement.includes('belirgin') || lowerImprovement.includes('prominent') || lowerImprovement.includes('görünür')) {
    return 'Make all key elements 40% more prominent with increased size, bolder typography, and stronger colors';
  }

  return improvement;
}

export async function generateImprovedAdImage(
  originalImageUrl: string,
  selectedImprovements: string[]
): Promise<string> {
  const translatedImprovements = selectedImprovements.map(translateImprovementToPrompt);

  const improvementPrompt = `Transform this advertisement image with these SPECIFIC improvements - apply each change DRAMATICALLY and VISIBLY:

${translatedImprovements.map((imp, idx) => `${idx + 1}. ${imp}`).join('\n\n')}

CRITICAL REQUIREMENTS:
- Make ALL changes BOLD and OBVIOUS - subtle changes are NOT acceptable
- Keep original text content but make typography MUCH stronger
- Preserve brand identity but enhance it significantly
- Use professional, eye-catching design principles
- Ensure changes are immediately noticeable when comparing before/after
- Apply changes with at least 40-50% intensity increase
- Create a polished, premium advertisement that stands out`;

  console.log('Final prompt:', improvementPrompt);
  return await improveAdImage(originalImageUrl, improvementPrompt);
}

export const falService = {
  analyzeAndImproveAdImage,
  generateImprovedAdImage,
};
