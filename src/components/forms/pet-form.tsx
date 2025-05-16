'use client'
import React from 'react'; 
import Image from 'next/image'; 
import { useForm } from 'react-hook-form';
import { z } from "zod" 
import { zodResolver } from "@hookform/resolvers/zod" 
import { useUpsertItems } from '@/hooks/useDatabase';  
import useSupabaseBrowser from '@/utils/supabase/clients';
import { ageUnits, petSexes, petSpecies, weightUnits } from '@/utils/supabase/enums'  
import { processItem, replaceCharsRegex } from '@/utils/supabase/helpers';
import { addStorageFile } from '@/hooks/useDatabase';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormSubmitButton, IconButton } from '../ui/button'; 
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { Input } from '../ui/input';
import { TooltipContent } from '../ui/tooltip';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PET_AVATAR_OPTIONS } from '@/constants';
import { Plus } from 'lucide-react';  
import { useUserProfile } from '@/hooks/useUser';
import { toast } from 'sonner';
import { Tables } from '@/utils/supabase/types';

export default function PetForm({  
    closeForm,
    selected
}: { 
    closeForm: () => void,
    selected?: Tables<'pets'> | null 
}) {    
    const { data: user } = useUserProfile()      
    const upsertItem = useUpsertItems()    
    const supabase = useSupabaseBrowser()  
    const inputRef = React.useRef<HTMLInputElement | null>(null);    
    const [picture, setPicture] = React.useState<{ type: string, url: string }>(
        { 
            type: selected ? (selected.img_path?.startsWith('/avatars') ? 'default' : 'custom') : 'default',
            url: selected?.img_path ?? PET_AVATAR_OPTIONS[0]
        }
    ) 

    const FormSchema = z.object({
        name: z.string().min(1, { message: "Required" }).max(50, { message: "Max limit of 50 characters" }),
        age: z.string().regex(/^(\d*\.?\d*)?$/),
        age_unit: z.enum(ageUnits),
        weight: z.string().regex(/^(\d*\.?\d*)?$/),
        weight_unit: z.enum(weightUnits),
        species: z.enum(petSpecies),
        sex: z.enum(petSexes),
        notes: z.string().max(100, { message: "Max limit of 100 characters" }),
        sterilized: z.boolean(),
        microchip: z.string().max(50, { message: "Max limit of 50 characters" }),
        custom_img: z.instanceof(File).nullable(), 
    })  

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: selected?.name ?? "", 
            age: selected?.age?.toString() ?? "",
            age_unit: selected?.age_unit ?? ageUnits[0],
            weight: selected?.weight?.toString() ?? "",
            weight_unit: z.enum(weightUnits).parse(selected?.weight_unit ?? weightUnits[0]),
            species: selected?.species ?? petSpecies[0],
            sex: z.enum(petSexes).parse(selected?.sex ?? petSexes[0]),
            notes: selected?.notes ?? "",
            sterilized: selected?.sterilized ?? false,
            microchip: selected?.microchip ?? "",
            custom_img: null
        }
    }) 

    async function onSubmit(data: z.infer<typeof FormSchema>) {    
        try {
            if (user) { 
                const { custom_img, ...rest } = data 
                const fmtedItem = { 
                    ...((processItem(rest))), 
                    ...(selected && { id: selected.id }),
                    user_id: user.id, 
                    img_path: await getPicturePath(custom_img) 
                } 
                await upsertItem.mutateAsync({ 
                    upsert: fmtedItem, 
                    table: 'pets', 
                    queryKeyId: user.id,
                    extraQuery: selected ? { name: 'pet_profile', id: selected.id } : undefined
                })
            }  
        } catch(err) { 
            toast("Error occurred")
        }
        closeForm()
    }  

    async function getPicturePath(customImg: File | null) {    
        if (picture.type === "custom") {
            if (customImg) { 
                const addedFilePath = await addStorageFile(customImg, 'profile_pictures', supabase);
                return addedFilePath; 
            } 
            return selected?.img_path
        }  
        return picture.url
    } 

    function openFileSelector(e: React.MouseEvent) { 
        e.preventDefault();
        e.stopPropagation();
        if (inputRef.current) {
            inputRef.current.click(); 
            inputRef.current.focus(); 
        } 
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className='flex-row-center justify-between gap-10 mb-10 px-8'>
                    <Image src={picture.url} alt='pet picture' width={125} height={125} />

                    <div className='flex-row-center flex-wrap gap-4'>
                        { PET_AVATAR_OPTIONS.map((avatar, index) =>
                            <Image 
                                key={avatar}
                                src={avatar}  
                                alt={`avatar option ${index}`}
                                width={60} 
                                height={60} 
                                onClick={() => setPicture({ url: avatar, type: "default"})}
                                className='hover:outline-2 hover:outline-foreground rounded-4xl'
                            /> 
                        )}
                        <IconButton
                            icon={<Plus width={20} height={20} className='text-muted-foreground'/>}
                            className='border rounded-4xl p-2 mx-3' 
                            onClick={openFileSelector} 
                            tooltipContent={
                                <TooltipContent className='bg-orange-primary' arrowClassName='bg-orange-primary fill-orange-primary'>
                                    Upload Picture 
                                </TooltipContent>
                            }
                        /> 
                        <FormField
                            control={form.control}
                            name="custom_img"
                            render={({ field }) => (
                                <FormItem> 
                                    <FormControl>
                                        <Input 
                                            accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
                                            type="file"
                                            ref={inputRef}
                                            onChange={(e) => {
                                                const file = e.target.files ? e.target.files[0] : null  
                                                field.onChange(file)
                                                if (file) setPicture({ url: URL.createObjectURL(file), type: "custom"})
                                           }} 
                                            className='hidden'
                                        /> 
                                    </FormControl>  
                                </FormItem>
                            )}
                        />  
                    </div>
                    

                </div>
                <div className='grid grid-cols-2 gap-6'>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl> 
                                <FormMessage />
                            </FormItem>
                        )}
                    />
            
                    <FormField
                        control={form.control}
                        name="species"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Species</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger  className='w-full'>
                                    <SelectValue placeholder="Select a verified email to display" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    { petSpecies.map((species) => 
                                        <SelectItem value={species} key={species}> 
                                            {replaceCharsRegex(species, "_", " ")}
                                        </SelectItem>
                                    )}  
                                </SelectContent>
                            </Select> 
                            <FormMessage />
                            </FormItem>
                        )}
                    />  

                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl> 
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="age_unit" 
                        render={({ field }) => (
                            <FormItem> 
                                <FormControl>
                                    <ToggleGroup 
                                        type="single"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        className='mt-5'  
                                    >
                                        { ageUnits.map((unit) => 
                                            <ToggleGroupItem value={unit} key={unit}> 
                                                {unit}
                                            </ToggleGroupItem>
                                        )} 
                                    </ToggleGroup>
                                </FormControl>   
                            </FormItem>
                        )}
                    />  

                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Weight</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl> 
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="weight_unit" 
                        render={({ field }) => (
                            <FormItem> 
                                <FormControl>
                                    <ToggleGroup 
                                        type="single"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        className='mt-5'  
                                    >
                                        { weightUnits.map((unit) => 
                                            <ToggleGroupItem value={unit} key={unit}> 
                                                {unit}
                                            </ToggleGroupItem>
                                        )} 
                                    </ToggleGroup>
                                </FormControl>   
                            </FormItem>
                        )}
                    />  

                    <FormField
                        control={form.control}
                        name="sex"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Sex</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger  className='w-full'>
                                    <SelectValue placeholder="Select a verified email to display" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    { petSexes.map((sex) => 
                                        <SelectItem value={sex} key={sex}> 
                                            {sex}
                                        </SelectItem>
                                    )}  
                                </SelectContent>
                            </Select> 
                            <FormMessage />
                            </FormItem>
                        )}
                    />  

                    <FormField
                    control={form.control}
                    name="sterilized"
                    render={({ field }) => (
                        <FormItem className="pt-5">
                        <FormControl className='flex-row-center gap-3'>
                            <div>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                /> 
                                    Spayed/Neutered 
                            </div>
                        </FormControl> 
                        </FormItem>
                    )}
                    />
                </div> 
                <FormField
                        control={form.control}
                        name="microchip"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Microchip #</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl> 
                                <FormMessage />
                            </FormItem>
                        )}
                    /> 
                     <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Type notes here"
                                        className="resize-none min-h-30"
                                        {...field}
                                    />
                                </FormControl> 
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                <FormSubmitButton />
            </form>
      </Form>
    )
}   