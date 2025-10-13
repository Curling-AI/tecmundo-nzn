import { supabase } from '@/lib/supabase'

interface Country {
  id: number
  name: string
  continent: string
}

export const getCountries = async () => {
  const { data, error } = await supabase
    .from('countries')
    .select('id, name, continent:continents(name)')
  if (error) {
    console.error('Error fetching countries:', error)
    throw error
  }
  return data as unknown as Country[]
}
