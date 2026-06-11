import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = 5000;
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/generate-image', async (req: Request, res: Response) => {
  const { prompt } = req.body as { prompt?: string };

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt alanı gereklidir.' });
  }
  if (!HF_API_KEY) {
    return res.status(500).json({ error: 'API anahtarı eksik.' });
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer',
        validateStatus: () => true // Her durumda yanıtı al
      }
    );

    if (response.status !== 200 || !response.data) {
      let errorMsg = 'Görsel oluşturulamadı.';
      try {
        const errorJson = JSON.parse(Buffer.from(response.data, 'binary').toString('utf8'));
        errorMsg = errorJson.error || errorMsg;
      } catch {}
      return res.status(500).json({ error: errorMsg });
    }

    const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
    res.json({ image: imageBase64 });
  } catch (error: any) {
    console.error('Görsel oluşturma hatası:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Görsel oluşturulamadı.' });
  }
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
