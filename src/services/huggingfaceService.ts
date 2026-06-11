export async function generateImage(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_HF_API_KEY;
  const endpoint = 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputs: prompt })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Görsel oluşturulamadı.');
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
