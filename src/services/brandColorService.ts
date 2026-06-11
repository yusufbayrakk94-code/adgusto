import { supabase } from '../config/supabase';

export interface BrandColor {
  hex: string;
  label: string;
}

export interface BrandColorPalette {
  id?: string;
  user_id: string;
  palette_name: string;
  colors: BrandColor[];
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export class BrandColorService {
  static async getUserPalettes(userId: string): Promise<BrandColorPalette[]> {
    const { data, error } = await supabase
      .from('brand_colors')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching brand colors:', error);
      throw error;
    }

    return data || [];
  }

  static async getDefaultPalette(userId: string): Promise<BrandColorPalette | null> {
    const { data, error } = await supabase
      .from('brand_colors')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching default palette:', error);
      throw error;
    }

    return data;
  }

  static async createPalette(palette: Omit<BrandColorPalette, 'id' | 'created_at' | 'updated_at'>): Promise<BrandColorPalette> {
    const { data, error } = await supabase
      .from('brand_colors')
      .insert([palette])
      .select()
      .single();

    if (error) {
      console.error('Error creating brand color palette:', error);
      throw error;
    }

    return data;
  }

  static async updatePalette(id: string, userId: string, updates: Partial<Omit<BrandColorPalette, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<BrandColorPalette> {
    const { data, error } = await supabase
      .from('brand_colors')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating brand color palette:', error);
      throw error;
    }

    return data;
  }

  static async deletePalette(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('brand_colors')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting brand color palette:', error);
      throw error;
    }
  }

  static async setDefaultPalette(id: string, userId: string): Promise<void> {
    // First, unset all default palettes for this user
    await supabase
      .from('brand_colors')
      .update({ is_default: false })
      .eq('user_id', userId);

    // Then set the selected palette as default
    const { error } = await supabase
      .from('brand_colors')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error setting default palette:', error);
      throw error;
    }
  }
}
