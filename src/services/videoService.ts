import { supabase } from '../config/supabase';

export interface VideoRecord {
  id: string;
  user_id: string;
  prompt: string;
  sector: string;
  duration: number;
  video_url: string;
  ai_provider: string;
  created_at: string;
}

export const VideoService = {
  async saveVideo(
    userId: string,
    prompt: string,
    sector: string,
    duration: number,
    videoUrl: string,
    aiProvider: string = 'minimax'
  ): Promise<VideoRecord> {
    const { data, error } = await supabase
      .from('videos')
      .insert({
        user_id: userId,
        prompt,
        sector,
        duration,
        video_url: videoUrl,
        ai_provider: aiProvider,
      })
      .select()
      .single();

    if (error) {
      console.error('Video save error:', error);
      throw new Error(`Failed to save video: ${error.message}`);
    }

    return data;
  },

  async getUserVideos(userId: string): Promise<VideoRecord[]> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch videos error:', error);
      throw new Error(`Failed to fetch videos: ${error.message}`);
    }

    return data || [];
  },

  async getVideoCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Count videos error:', error);
      return 0;
    }

    return count || 0;
  },

  async deleteVideo(videoId: string): Promise<void> {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);

    if (error) {
      console.error('Delete video error:', error);
      throw new Error(`Failed to delete video: ${error.message}`);
    }
  },
};
