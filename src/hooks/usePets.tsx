import useSupabaseBrowser from '@/utils/supabase/clients'; 
import { TypedSupabaseClient } from "@/utils/supabase/types";
import { useQuery } from "@tanstack/react-query";  

async function getPetById(client: TypedSupabaseClient, petId: string) {
  const { data } = await client
    .from('pets')
    .select('*')
    .eq('id', petId) 
    .single()
    .throwOnError()  

  return data
} 
   
export function usePetProfile(petId: string | undefined) { 
  const supabase = useSupabaseBrowser()  
  return useQuery({
    queryKey: ['pet_profile', petId],
    queryFn: async () => getPetById(supabase, petId!),
    enabled: !!petId
  })
}     

async function getConditions(client: TypedSupabaseClient, petId: string) {
  const { data } = await client
    .from('conditions')
    .select('*')
    .eq('pet_id', petId) 
    .throwOnError()  

  return data
}
   
export function useConditions(petId: string | undefined) { 
  const supabase = useSupabaseBrowser()  
  return useQuery({
    queryKey: ['conditions', petId],
    queryFn: () => getConditions(supabase, petId!),
    enabled: !!petId
  })
}     

async function getProcedures(client: TypedSupabaseClient, petId: string) {
  const { data } = await client
    .from('procedures')
    .select('*')
    .eq('pet_id', petId) 
    .throwOnError()  

  return data
}
   
export function useProcedures(petId: string | undefined) { 
  const supabase = useSupabaseBrowser()  
  return useQuery({
    queryKey: ['procedures', petId],
    queryFn: () => getProcedures(supabase, petId!),
    enabled: !!petId
  })
}     

async function getMedications(client: TypedSupabaseClient, petId: string) {
  const { data } = await client
    .from('medications')
    .select('*')
    .eq('pet_id', petId) 
    .throwOnError()  

  return data
}
   
export function useMedications(petId: string | undefined) { 
  const supabase = useSupabaseBrowser()  
  return useQuery({
    queryKey: ['medications', petId],
    queryFn: () => getMedications(supabase, petId!),
    enabled: !!petId
  })
}     

async function getNutrition(client: TypedSupabaseClient, petId: string) {
  const { data } = await client
    .from('nutrition')
    .select('*')
    .eq('pet_id', petId) 
    .throwOnError()  

  return data
}
   
export function useNutrition(petId: string | undefined) { 
  const supabase = useSupabaseBrowser()  
  return useQuery({
    queryKey: ['nutrition', petId],
    queryFn: () => getNutrition(supabase, petId!),
    enabled: !!petId
  })
}  

async function getAllergies(client: TypedSupabaseClient, petId: string) {
  const { data } = await client
    .from('allergies')
    .select('*')
    .eq('pet_id', petId) 
    .throwOnError()  

  return data
}
   
export function useAllergies(petId: string | undefined) { 
  const supabase = useSupabaseBrowser()  
  return useQuery({
    queryKey: ['allergies', petId],
    queryFn: () => getAllergies(supabase, petId!),
    enabled: !!petId
  })
}     