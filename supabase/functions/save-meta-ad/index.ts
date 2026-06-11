import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { withSecureHandler } from '../_shared/auth.ts';
import { jsonResponse } from '../_shared/cors.ts';
import { createServiceRoleClient } from '../_shared/supabase.ts';

interface SaveAdRequest {
  adData: {
    ad_id: string;
    ad_title?: string;
    ad_text?: string;
    advertiser_name?: string;
    page_name?: string;
    platform?: string;
    image_url?: string;
    video_url?: string;
    cta_text?: string;
    link_url?: string;
    started_running?: string;
    [key: string]: unknown;
  };
  tags?: string[];
  notes?: string;
}

Deno.serve(
  withSecureHandler(async (req, user) => {
    const supabase = createServiceRoleClient();
    const { adData, tags = [], notes = '' }: SaveAdRequest = await req.json();

    if (!adData?.ad_id) {
      return jsonResponse({ success: false, error: 'Ad data with ad_id is required' }, 400);
    }

    let storageUrl = '';

    if (adData.image_url) {
      try {
        const imageResponse = await fetch(adData.image_url);
        if (imageResponse.ok) {
          const imageBlob = await imageResponse.blob();
          const fileName = `${user.uid}/${adData.ad_id}_${Date.now()}.jpg`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('meta-ads')
            .upload(fileName, imageBlob, {
              contentType: 'image/jpeg',
              upsert: false,
            });

          if (uploadError) {
            console.error('Upload error:', uploadError);
          } else if (uploadData) {
            const { data: urlData } = supabase.storage.from('meta-ads').getPublicUrl(fileName);
            storageUrl = urlData.publicUrl;
          }
        }
      } catch (imageError) {
        console.error('Error downloading/uploading image:', imageError);
      }
    }

    const savedAd = {
      user_id: user.uid,
      ad_id: adData.ad_id,
      ad_title: adData.ad_title || adData.adTitle || '',
      ad_text: adData.ad_text || adData.adText || adData.adDescription || '',
      advertiser_name: adData.advertiser_name || adData.advertiserName || adData.pageName || '',
      page_name: adData.page_name || adData.pageName || '',
      platform: adData.platform || 'Facebook',
      image_url: adData.image_url || adData.imageUrl || '',
      storage_url: storageUrl,
      video_url: adData.video_url || adData.videoUrl || null,
      cta_text: adData.cta_text || adData.ctaText || null,
      link_url: adData.link_url || adData.linkUrl || adData.adUrl || null,
      started_running: adData.started_running || adData.startedRunning || null,
      tags,
      notes,
      raw_data: adData,
    };

    const { data: insertedAd, error: insertError } = await supabase
      .from('saved_meta_ads')
      .insert(savedAd)
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return jsonResponse({ success: false, error: 'This ad is already saved' }, 409);
      }
      throw insertError;
    }

    return jsonResponse({ success: true, data: insertedAd });
  }, { methods: ['POST'] }),
);
