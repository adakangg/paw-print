import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { useSupabaseServer } from '@/utils/supabase/server'
/* eslint-disable react-hooks/rules-of-hooks */

export async function GET(request: NextRequest) {
  const supabase = await useSupabaseServer() 

  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) { 
      redirect(next)
    }
  }
  redirect('/error')
}