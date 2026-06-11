const FAL_API_KEY = import.meta.env.VITE_FAL_API_KEY;

export type ImageQuality = 'basic' | 'pro' | 'advanced';

export interface ImageGenerationRequest {
  prompt: string;
  quality: ImageQuality;
  width: number;
  height: number;
}

export class ImageGenerationService {
  private apiKey: string;

  constructor() {
    this.apiKey = FAL_API_KEY || '';
  }

  async generateImage(request: ImageGenerationRequest): Promise<string> {
    console.log('=== IMAGE GENERATION START ===');
    console.log('API Key:', this.apiKey ? 'EXISTS' : 'MISSING');
    console.log('Quality:', request.quality);
    console.log('Dimensions:', `${request.width}x${request.height}`);
    console.log('Prompt:', request.prompt);

    if (!this.apiKey) {
      throw new Error('FAL API anahtarı bulunamadı');
    }

    let endpoint = '';
    let requestBody: any = {
      prompt: request.prompt,
      image_size: {
        width: request.width,
        height: request.height
      },
      num_images: 1
    };

    if (request.quality === 'basic') {
      endpoint = 'https://fal.run/fal-ai/nano-banana';
      requestBody.num_inference_steps = 4;
    } else if (request.quality === 'pro') {
      endpoint = 'https://fal.run/fal-ai/gemini-3-pro-image-preview';
      requestBody.num_inference_steps = 4;
    } else {
      endpoint = 'https://fal.run/fal-ai/flux-pro/v1.1';
      requestBody.num_inference_steps = 28;
      requestBody.guidance_scale = 3.5;
      requestBody.safety_tolerance = '2';
    }

    console.log('Endpoint:', endpoint);
    console.log('Making API call...');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('API Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`API hatası: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response Data:', data);

      if (!data.images || data.images.length === 0) {
        throw new Error('API yanıtında görsel bulunamadı');
      }

      const imageUrl = data.images[0].url;
      console.log('Generated Image URL:', imageUrl);
      console.log('=== IMAGE GENERATION END ===');

      return imageUrl;
    } catch (error) {
      console.error('=== IMAGE GENERATION ERROR ===');
      console.error('Error:', error);
      throw error;
    }
  }
}
