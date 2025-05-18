'use client'  
import React from 'react'; 
import Image from 'next/image'; 
import Link from 'next/link'; 
import { redirect } from 'next/navigation';
import { usePets, useUserProfile } from '@/hooks/useUser' 
import { useDeleteItems } from '@/hooks/useDatabase'; 
import { Input } from '@/components/ui/input';
import { Button, IconButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BorderedImageText } from '@/components/ui/border-image';
import { FormDialog } from '@/components/ui/dialog';
import PetForm from '@/components/forms/pet-form'; 
import { DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { EllipsisVertical, PawPrint, Plus, Trash } from 'lucide-react';  
import { toast } from 'sonner';
import { Tables } from '@/utils/supabase/types';
import { Avatar } from '@/components/ui/avatar';

export default function Pets() {          
    const { data: user, isError: userError } = useUserProfile()        
    const { data: pets, isFetching, error } = usePets(user?.id);    
    const isLoading = !user || isFetching; 
    if (userError || error) redirect('/error')   
 
    const deleteItem = useDeleteItems()  
    const [formOpen, setFormOpen] = React.useState<boolean>(false);   
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const [matchingResults, setMatchingResults] = React.useState<Tables<'pets'>[] | undefined>([]);    
    
    React.useEffect(() => {  
        if (pets) setMatchingResults(pets)  
    }, [pets]); 
    
    React.useEffect(() => {
        if (searchTerm && pets) { 
            const filteredResults = pets.filter((pet) => {
                pet.name.toLowerCase().includes(searchTerm.toLowerCase())
            });
            setMatchingResults(filteredResults);
        } else {
            setMatchingResults(pets);
        }
    }, [searchTerm, pets]);    

    async function deletePet(pet: Tables<'pets'>) {
        try {
            await deleteItem.mutateAsync({ items: pet, table: 'pets', queryKeyId: user?.id })
        } catch(err) {
            toast("Error occurred")
        } 
    }

    return (
        <div className="flex-col-center py-12">    
            { isLoading && 
                <div className="grid grid-cols-2 gap-5 mt-2 rounded-xl">
                    <Skeleton className="h-[160px] w-[150px]" />
                    <Skeleton className="h-[160px] w-[150px]" />
                    <Skeleton className="h-[160px] w-[150px]" />
                    <Skeleton className="h-[160px] w-[150px]" />
                </div>
            } 
            { !isLoading && 
                <>
                    { (pets && pets.length > 0) || (matchingResults && matchingResults.length > 0) ?
                        <div className="flex-col-center gap-6 px-10"> 
                            <div className="flex-row-center gap-2 bg-foreground text-background w-fit px-3 text-[2.8rem] font-semibold rounded-md">   
                                View All Pets
                            </div>   
                            <div className='flex-row-center justify-center gap-3'>
                                <Input 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by pet name"
                                    className='min-[900px]:w-88'
                                /> 
                                <Button onClick={() => setFormOpen(true)}>  
                                    <Plus />
                                    Add Pet
                                </Button>
                            </div> 

                            <div className="grid  min-[700px]:grid-cols-2 min-[900px]:grid-cols-3 gap-10 w-full mt-5"> 
                                { matchingResults?.map((pet) => 
                                    <Link key={pet.id} href={{ pathname: `/dashboard/pets/${pet.id}` }}>
                                        <Card className='flex-col-center pt-2 pb-4 hover:border-primary rounded-xl min-w-[14rem]'>
                                            <div className='flex w-full justify-end mb-3'>
                                                <IconButton
                                                    icon={ <EllipsisVertical width={18} height={18} className='text-muted-foreground' /> }
                                                    menuContent={
                                                        <DropdownMenuContent side='right' align='start'>  
                                                            <DropdownMenuItem
                                                                onClick={(e) => { 
                                                                    e.preventDefault() 
                                                                    deletePet(pet)
                                                                }}
                                                            >
                                                                <Trash />
                                                                Delete
                                                            </DropdownMenuItem> 
                                                        </DropdownMenuContent>
                                                    } 
                                                    onClick={(e) => e.preventDefault()}  
                                                /> 
                                            </div> 
                                            <Avatar 
                                                src={pet.img_path ?? '/default_avatars/pawprint.png'}
                                                alt='pet' 
                                                className='w-28 h-28'
                                            /> 
                                            <p className='text-[1.3rem] font-medium mt-4'> {pet.name} </p>  
                                        </Card>
                                    </Link>
                                )}
                            </div>
                        </div> 
                        :
                        <div className='mt-25'>
                            <BorderedImageText
                                img={<Image src='/dog_man.png' alt='dog with man' width={330} height={330} />} 
                                title='No Pets Found'
                                subtitle='Click here to add a new pet' 
                                onClick={() => setFormOpen(true)}
                            /> 
                        </div> 
                    }
                    <FormDialog
                        open={formOpen} 
                        onOpenChange={setFormOpen}
                        title='Add Pet'
                        form={<PetForm closeForm={() => setFormOpen(false)} />} 
                    />   
                </> 
            }     
        </div>  
    );
}  