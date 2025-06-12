import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types';

type GiftMoney = Database['public']['Tables']['gift_money']['Row'];
type GiftMoneyInsert = Database['public']['Tables']['gift_money']['Insert'];

export const useSupabase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveGiftMoney = useCallback(async (data: Omit<GiftMoneyInsert, 'user_id'>, userId: string): Promise<number | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: result, error: insertError } = await supabase
        .from('gift_money')
        .insert({
          ...data,
          user_id: userId
        })
        .select('id')
        .single();
      
      if (insertError) throw insertError;
      
      setIsLoading(false);
      return result?.id || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '데이터 저장 중 오류가 발생했습니다.';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  const fetchGiftMoney = useCallback(async (userId: string): Promise<GiftMoney[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('gift_money')
        .select('*')
        .eq('user_id', userId)
        .order('captured_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setIsLoading(false);
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '데이터 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
      setIsLoading(false);
      return [];
    }
  }, []);

  const uploadImage = useCallback(async (imageData: string, userId: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const base64Data = imageData.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      
      const fileName = `${userId}_${Date.now()}.jpg`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('gift_images')
        .upload(fileName, buffer, {
          contentType: 'image/jpeg',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('gift_images')
        .getPublicUrl(fileName);
      
      setIsLoading(false);
      return urlData.publicUrl || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이미지 업로드 중 오류가 발생했습니다.';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  return {
    saveGiftMoney,
    fetchGiftMoney,
    uploadImage,
    isLoading,
    error
  };
};