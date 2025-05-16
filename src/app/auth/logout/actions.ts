'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation' 
import { useSupabaseServer as getSupabaseServer } from '@/utils/supabase/server'

export async function logout() {
  const supabase = await getSupabaseServer()  
  const { error } = await supabase.auth.signOut(); 
  if (error) redirect('/error') 
  revalidatePath('/', 'layout')
  redirect('/')
} 