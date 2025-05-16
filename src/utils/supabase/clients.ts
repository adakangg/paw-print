import { createBrowserClient } from '@supabase/ssr'
import { Database, TypedSupabaseClient } from './types'
// import { useMemo } from 'react' 

let client: TypedSupabaseClient | undefined

function getSupabaseBrowserClient() {
  if (client) { 
    return client 
  } 
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )  
}
function useSupabaseBrowser() { return getSupabaseBrowserClient() }

// function useSupabaseBrowser() { return useMemo(getSupabaseBrowserClient, [])}

export default useSupabaseBrowser