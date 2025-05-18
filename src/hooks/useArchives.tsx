import useSupabaseBrowser from '@/utils/supabase/clients';  
import { useQuery } from "@tanstack/react-query";  
import { COLOR_OPTIONS } from "@/constants" 
import { Tables, TypedSupabaseClient } from '@/utils/supabase/types';

async function fetchFolders(client: TypedSupabaseClient, userId: string) {   
  const { data } = await client 
    .from('folders')
    .select('*')
    .eq('user_id', userId) 
    .throwOnError()    

  return data  
}  

async function fetchFiles(client: TypedSupabaseClient, userId: string) {   
  const { data } = await client 
    .from('files')
    .select('*')
    .eq('user_id', userId) 
    .throwOnError()    
    
  return data  
} 

export type ExtendedFolder = Tables<'folders'> & { color: string; filesCount: number }
export type ExtendedFile = Tables<'files'> & { folderName: string | null; folderColor: string | undefined }
export type ArchivesType = { folders: ExtendedFolder[]; files: ExtendedFile[] }
 
// includes unique color property for each folder & its files
export function useUserArchives(userId?: string | undefined | null) { 
  const supabase = useSupabaseBrowser()  
  return useQuery({
    queryKey: ['archives', userId],
    queryFn: async () => {
      const folders = await fetchFolders(supabase, userId!) 
      const files = await fetchFiles(supabase, userId!) 

      if (folders && files) {
        const fmtedFolders = folders.map((folder, index) => ({
          ...folder, 
          color: COLOR_OPTIONS[index % COLOR_OPTIONS.length].bgMuted,

          filesCount: (files.filter(file => file.folder_id === folder.id)).length
        }));

        const folderMap = new Map(fmtedFolders.map(folder => [folder.id, { name: folder.name, color: folder.color }]));

        const fmtedFiles = files.map(file => {
          const folder = file.folder_id ? folderMap.get(file.folder_id) : null
          return  {
            ...file, 
            folderName: folder?.name || null,
            folderColor: folder?.color 
          }
        }); 

        return { folders: fmtedFolders as ExtendedFolder[], files: fmtedFiles as ExtendedFile[] }
      } 
      return { folders: [], files: [] } 
    },
    enabled: !!userId
  })
}   