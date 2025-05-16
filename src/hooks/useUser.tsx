import useSupabaseBrowser from '@/utils/supabase/clients'; 
import { TypedSupabaseClient } from "@/utils/supabase/types";
import { useQuery } from "@tanstack/react-query";   

async function getProfileById(client: TypedSupabaseClient, profileId: string) { 
  const { data } = await client
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single()
    .throwOnError()     

  return data 
}    
 
export function useUserProfile() {    
  const supabase = useSupabaseBrowser()   
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {     
      const { data, error } = await supabase.auth.getUser()    
      const userId = data?.user?.id  
      if (error || !userId) throw new Error('No user found');
      if (!userId) throw new Error('No user found');
      return getProfileById(supabase, userId)  
    }
  })
} 

export async function fetchPets(client: TypedSupabaseClient, userId: string) {   
  const { data } = await client 
    .from('pets')
    .select('*')
    .eq('user_id', userId) 
    .throwOnError()     

  return data
}   

export function usePets(userId: string | undefined | null) {  
  const supabase = useSupabaseBrowser()  
  return useQuery({
    queryKey: ['pets', userId],
    queryFn: () => fetchPets(supabase, userId!),
    enabled: !!userId
  })
} 


export async function fetchPersonnel(client: TypedSupabaseClient, userId: string) {   
  const { data } = await client 
    .from('personnel')
    .select('*')
    .eq('user_id', userId) 
    .throwOnError()     
    
  return data;
}   

export function usePersonnel(userId: string | undefined | null) {  
  const supabase = useSupabaseBrowser()  
  return useQuery({
    queryKey: ['personnel', userId],
    queryFn: () => fetchPersonnel(supabase, userId!),
    enabled: !!userId
  })
} 

export async function fetchAppointments(client: TypedSupabaseClient, userId: string) {   
  const { data } = await client 
    .from('appointments')
    .select('*')
    .eq('user_id', userId) 
    .throwOnError()    
  return data  
}   

export function useAppointments(userId: string | undefined | null) {  
  const supabase = useSupabaseBrowser()  
  return useQuery({
    queryKey: ['appointments', userId],
    queryFn: () => fetchAppointments(supabase, userId!),
    enabled: !!userId
  })
} 