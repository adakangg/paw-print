'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { useSupabaseServer } from '@/utils/supabase/server'   
import { insertItem } from '@/utils/supabase/helpers' 
/* eslint-disable react-hooks/rules-of-hooks */

export async function login(formData: FormData) { 
  const supabase = await useSupabaseServer() 
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }  
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) redirect('/error') 
 
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {  
  const supabase = await useSupabaseServer()  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: userData, error } = await supabase.auth.signUp(data)
  if (error) throw error  
  
  if (userData?.user) {
    try {
      const profile = {
        f_name: formData.get('f_name') as string,
        l_name: formData.get('l_name') as string,
        email: userData.user.email,
        id: userData.user.id
      } 
      insertItem(supabase, [profile], 'profiles')  
    } catch(err) {   
      redirect('/error')
    }  
    revalidatePath('/', 'layout')
    redirect('/')
  } 
}