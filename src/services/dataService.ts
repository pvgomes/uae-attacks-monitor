import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AttackData {
  date: string;
  uav: number;
  cruise: number;
  ballistic: number;
  'source-link'?: string;
}

/**
 * Fetches attack data from Supabase or falls back to local JSON file
 * 
 * Security Note: The Supabase anon key is safe to expose because:
 * 1. Row Level Security (RLS) restricts it to read-only access
 * 2. No INSERT, UPDATE, or DELETE operations are possible
 * 3. This is how Supabase is designed to be used in frontends
 */
export async function fetchAttackData(): Promise<AttackData[]> {
  // Try Supabase first if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      console.log('Attempting to fetch data from Supabase...');
      
      // Assuming your Supabase table is named 'attacks'
      // Adjust table name and column names as needed
      const { data, error } = await supabase
        .from('attacks')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log('Successfully fetched data from Supabase');
        // Transform data if needed to match the expected format
        return data.map(item => ({
          date: item.date,
          uav: item.uav || 0,
          cruise: item.cruise || 0,
          ballistic: item.ballistic || 0,
          'source-link': item.source_link || item['source-link']
        }));
      }
    } catch (error) {
      console.warn('Failed to fetch from Supabase, falling back to local data:', error);
    }
  } else {
    console.log('Supabase not configured, using local data');
  }

  // Fallback to local JSON file
  try {
    const response = await fetch('./data.json');
    const data = await response.json();
    console.log('Successfully fetched data from local JSON');
    return data;
  } catch (error) {
    console.error('Failed to fetch local data:', error);
    return [];
  }
}

/**
 * Fetches the latest attack data entry
 */
export async function fetchLatestAttackData(): Promise<AttackData | null> {
  const data = await fetchAttackData();
  return data.length > 0 ? data[data.length - 1] : null;
}