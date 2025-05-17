'use client'  
import React, { use } from 'react';  
import Link from 'next/link'
import { redirect } from 'next/navigation';
import { usePets, useUserProfile } from '@/hooks/useUser';
import { useAllergies, useConditions, useMedications, useNutrition, usePetProfile, useProcedures } from '@/hooks/usePets'; 
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent, 
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconButton } from '@/components/ui/button';
import { FormDialog } from '@/components/ui/dialog';
import PetForm from '@/components/forms/pet-form';
import NutritionForm from '@/components/forms/nutrition-form';
import { TooltipContent } from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import MedicationForm from '@/components/forms/med-form';
import ProcedureForm from '@/components/forms/procedure-form';
import ConditionForm from '@/components/forms/condition-form';
import AllergyForm from '@/components/forms/allergy-form';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FirstAidSvg, FoodSvg, HeartSvg, MedSvg, SirenSvg } from '@/components/icons';
import { Activity, AlertCircle, Bone, Bookmark, Calendar, ChevronDown, Edit, MapPin, PawPrint, PillBottle, Plus, ScanHeart, Search, Stethoscope, Weight } from 'lucide-react';
import { cn } from '@/lib/utils';   
import { COLOR_OPTIONS, SPECIES_ICONS } from '@/constants'; 
import { Tables } from '@/utils/supabase/types';
import { replaceCharsRegex } from '@/utils/supabase/helpers';
import { Avatar } from '@/components/ui/avatar';
type PetDataType = Tables<'conditions'> | Tables<'medications'> | Tables<'nutrition'> | Tables<'procedures'> | Tables<'allergies'>[] | Tables<'pets'>


function ProfileDetail({
    icon,
    title,
    value,
    className
  }: { 
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    title?: string;
    value?: string | null;
    className?: string;   
  }) {  
    return (  
        <div className={cn('flex-col-center break-all', className)}>
            <div className='bg-primary p-[7px] rounded-full text-white'>
                {React.cloneElement(icon, { width: 20, height: 20 })} 
            </div>
            <span className='text-[0.73rem] mt-1'>{title}</span>
            <div className='text-[0.9rem] font-medium'>{value}</div>
        </div> 
    )
} 

function EmptyState({ icon }: { icon: React.ReactElement }) {
    return (
        <div className='flex-col-center justify-center gap-2 h-full w-full mt-1'>
            {icon}
            No Entries Found
        </div>
    )
}

function Section({ children, className }: { children?: React.ReactNode; className?: string }) {  
    return ( 
        <Card className={cn('flex-col-start justify-start p-3 pb-4 rounded-lg bg-card h-full', className)}>
            {children}
        </Card>
    )
} 

function SectionHeader({ 
    icon, 
    title, 
    onAddClick,
    onEditClick
}: { 
    icon: React.ReactElement; 
    title: string; 
    onAddClick?: () => void;
    onEditClick?: () => void; 
}) {
    return (
        <div className='flex-row-between mb-3 pb-3 pl-2 dotted-border'> 
            <div className='flex-row-center'> 
                {icon}
                <span className='text-[1.2rem] font-semibold pl-2'>{title}</span>
            </div>   
        
            { onAddClick && 
                <IconButton
                    icon={ <Plus width={16} height={16} className='text-muted-foreground2'/> }
                    onClick={onAddClick}
                     tooltipContent={
                        <TooltipContent className='bg-primary' arrowClassName='bg-primary fill-primary'>
                            Add Entry
                        </TooltipContent>
                    }
                />
            } 
            { onEditClick && 
                <IconButton
                    icon={ <Edit width={19} height={19} className='text-muted-foreground2'/> }
                    onClick={onEditClick}
                     tooltipContent={
                        <TooltipContent className='bg-primary' arrowClassName='bg-primary fill-primary'>
                            {`Edit ${title}`}
                        </TooltipContent>
                    }
                />
            } 
        </div>
    )   
}
 
function SectionList({
    items, 
    type,
    onEdit, 
    chipProperty,
    colorIndex,
    icon
}: {
    items: any[] | undefined;  
    type: string;
    onEdit: (formType: string, selected: PetDataType) => void; 
    chipProperty?: string;
    colorIndex: number;
    icon: React.ReactElement; 
}) {    
    const color = COLOR_OPTIONS[colorIndex % COLOR_OPTIONS.length]
    return ( 
        <div className='flex-col-start h-full gap-2 px-2'> 
            { items && items.length > 0 ? 
                items.map((item) => 
                    <div 
                        key={item.id} 
                        onClick={() => onEdit(type, item)} 
                        className={`flex-col-start py-2 pr-2 pl-3 gap-1 rounded-[3px] hover border border-muted-background border-l-4 ${color.borderL} ${color.hoverBorder}`}
                    >   
                        <div className='flex-row-between flex-wrap font-medium'>
                            {item.name} 
                            { chipProperty && item[chipProperty] &&
                              <Badge className={`text-[0.7rem] font-semibold ${color.bgMuted} py-[1px] px-2`}>
                                    <div className={`w-[5px] h-[5px] rounded-full ${color.bgText}`}/>
                                    {item[chipProperty]}
                                </Badge>   
                            }   
                        </div> 
                        <div className='flex-col-start gap-1 text-[0.8rem] text-muted-foreground'>
                            {item.date && 
                                <div className='flex-row-center gap-1.5'>
                                    <Calendar width={12} height={12} />
                                    {item.date} 
                                </div>
                            } 
                            {item.description}
                        </div>
                    </div>
                )
                : 
                <EmptyState icon={icon} />
            }
        </div> 
    )
}

function SectionSkeleton() {
    return(
        <div className='w-full'>
            <Skeleton className="h-[45px] mb-2 rounded-sm" />
            <Skeleton className="h-[45px] rounded-sm" />
        </div>
    )
}

function formatWithUnit(value: number | string | null, unit?: string | null) { 
    return value ? `${value} ${ unit ?? ''}` : '. . .'
}

function getSpeciesIcon(species: string, size?: number | undefined) {
    const icon = SPECIES_ICONS.get(species)
    if (icon) return React.cloneElement(icon, { width: size ?? 20, height: size ?? 20 })
    return <PawPrint width={20} height={20} />
}

  
export default function Pets({ params }: { params: Promise<{ id: string }> }) {    
    const { id: petId } = use(params)  
    const { data: user, isError: userError } = useUserProfile()       
    const { data: pets, error: petsError } = usePets(user?.id)  
    const { data: selectedPet, isFetching: fetchingProfile, error: profileError } = usePetProfile(petId!)     
    const { data: conditions, isFetching: fetchingConditions } = useConditions(selectedPet?.id)
    const { data: nutrition, isFetching: fetchingNutrition } = useNutrition(selectedPet?.id)
    const { data: medications, isFetching: fetchingMeds } = useMedications(selectedPet?.id)
    const { data: procedures, isFetching: fetchingProcedures } = useProcedures(selectedPet?.id)
    const { data: allergies, isFetching: fetchingAllergies } = useAllergies(selectedPet?.id)
    if (userError || petsError || profileError) { redirect('/error') }  

    type FormType = { type: string | null, selected: PetDataType | null | undefined};
    const [formData, setFormData] = React.useState<FormType>({ type: null, selected: null }); 
    const [formOpen, setFormOpen] = React.  useState<boolean>(false);  
    function openForm(formType: FormType["type"], selected: FormType["selected"]) { 
        setFormData({ type: formType, selected: selected }) 
        setFormOpen(true)
    }
    function closeForm() {
        setFormData({ type: null, selected: null })
        setFormOpen(false)
    }  
    function getFormType() {
        const formProps = { petId: petId, closeForm: closeForm }  
        switch (formData.type) {
            case "Profile": 
                return <PetForm {...formProps} selected={formData.selected as Tables<'pets'>}/>
            case "Nutrition":
                return <NutritionForm {...formProps} selected={formData.selected as Tables<'nutrition'>}/>
            case "Medication":
                return <MedicationForm {...formProps} selected={formData.selected as Tables<'medications'>}/>
            case "Procedure":
                return <ProcedureForm {...formProps} selected={formData.selected as Tables<'procedures'>}/>
            case "Condition":
                return <ConditionForm {...formProps} selected={formData.selected as Tables<'conditions'>}/>
            case "Allergies":
                return <AllergyForm {...formProps} selected={formData.selected as Tables<'allergies'>[]}/> 
        }
    }  
  
    return ( 
        <div className='flex-col-center w-full px-10 py-10'> 
             { selectedPet &&
                <div className="flex-col-center min-[900px]:w-5/6 gap-4">   
                    <div className='flex-row-between flex-wrap gap-5'>
                        <div className='text-[2.2rem] font-semibold '>
                            {`${selectedPet.name}'s Health Record`}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className='flex-row-center gap-3 w-fit text-[0.9rem] rounded-md px-2 py-1 hover:cursor-pointer'>
                                    {`Selected: ${selectedPet.name}`}
                                    <ChevronDown width={15} height={15} />
                                </div> 
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end"> 
                                { pets?.map((pet, index) =>
                                    <Link key={pet.id} href={{ pathname: `/dashboard/pets/${pet.id}` }}>
                                        <DropdownMenuCheckboxItem checked={petId === pet.id} className='text-[0.9rem] py-[2px]'> 
                                            {pet.name}
                                        </DropdownMenuCheckboxItem>
                                        { index < pets.length-1 && <DropdownMenuSeparator /> } 
                                    </Link>
                                )}
                            </DropdownMenuContent> 
                        </DropdownMenu> 
                    </div>

                    <div className='flex-col-center w-full min-[900px]:flex-row-start gap-8'>  
                        <Section className='flex-col-center w-full min-[900px]:w-[390px] gap-4'>
                            { !fetchingProfile ? 
                                <>
                                    <SectionHeader
                                        icon={<PawPrint width={22} height={22} /> }
                                        title='Profile'
                                        onEditClick={() => openForm('Profile', selectedPet)}
                                    />  
                                    <Avatar 
                                        src={selectedPet.img_path ?? '/default_avatars/pawprint.png'}
                                        alt='pet' 
                                        className='w-40 h-40'
                                    />
                                    <p className='text-[1.8rem] font-semibold -mt-1'>{selectedPet.name}</p>

                                    <div className='grid grid-cols-3 gap-y-5 w-full mb-16 mt-8'>
                                        <ProfileDetail
                                            title='Age'
                                            icon={<Calendar/>}
                                            value={ formatWithUnit(selectedPet.age, selectedPet.age_unit) }  
                                            className='-ml-5'
                                        /> 
                                        <ProfileDetail
                                            title='Weight'
                                            icon={<Weight/>}
                                            value={ formatWithUnit(selectedPet.weight, selectedPet.weight_unit) }
                                        /> 
                                        <ProfileDetail
                                            title='Sex'
                                            icon={<Search/>}
                                            value={ selectedPet.sex }  
                                            className='-mr-5'
                                        />    
                                        <ProfileDetail
                                            title='Species' 
                                            icon={getSpeciesIcon(selectedPet.species)}
                                            value={replaceCharsRegex(selectedPet.species, "_", " ")}
                                            className='-ml-5'
                                        />   
                                        <ProfileDetail
                                            title='Spay/Neuter'
                                            icon={<Stethoscope/>}
                                            value={ selectedPet.sterilized ? 'Yes' : (selectedPet.sterilized === false ? 'No' : 'Unknown') }
                                        />  
                                        <ProfileDetail
                                            title='Microchip #'
                                            icon={<MapPin/>}
                                            value={formatWithUnit(selectedPet.microchip)}  
                                            className='-mr-5'
                                        />   
                                    </div> 
                                    
                                    <SectionHeader
                                        icon={<Bookmark width={22} height={22} /> }
                                        title='Notes'
                                    /> 
                                    <Textarea value={selectedPet.notes ?? ''} placeholder={`About ${selectedPet.name}...`}/> 
                                </>
                                :
                                <div className='py-5 flex-col-center w-full'>
                                    <Skeleton className='w-[150px] h-[150px] rounded-full mb-12' />
                                    <SectionSkeleton />
                                </div> 
                            } 
                        </Section>   
    
                        <div className='flex flex-1 w-full grid min-[1150px]:grid-cols-2 gap-5'>
                            <Section>
                                <SectionHeader
                                    icon={<Bone width={22} height={22} /> }
                                    title='Nutrition'
                                    onAddClick={() => openForm('Nutrition', null)}
                                /> 
                                { !fetchingNutrition ?
                                    <SectionList 
                                        items={nutrition}
                                        type='Nutrition'
                                        chipProperty='schedule'
                                        colorIndex={0}
                                        icon={<FoodSvg className={"fill-foreground stroke-foreground"} style={{width:75, height:75}} />} 
                                        onEdit={openForm} 
                                    />              
                                    :
                                    <SectionSkeleton />
                                }
                            </Section>
                            <Section>
                                <SectionHeader
                                    icon={<PillBottle width={22} height={22} /> }
                                    title='Medications'
                                    onAddClick={() => openForm('Medication', null)}
                                /> 
                                { !fetchingMeds ? 
                                    <SectionList 
                                        items={medications}
                                        type='Medication'
                                        chipProperty='dosage'
                                        colorIndex={1}
                                        icon={<MedSvg className={"fill-foreground stroke-foreground"} style={{width:75, height:75}} />} 
                                        onEdit={openForm} 
                                    />
                                    :
                                    <SectionSkeleton />
                                }
                            </Section>
                            <Section>
                                <SectionHeader
                                    icon={<ScanHeart width={22} height={22} /> }
                                    title='Procedures'
                                    onAddClick={() => openForm('Procedure', null)}
                                /> 
                                { !fetchingProcedures ?
                                    <SectionList 
                                        items={procedures}
                                        type='Procedure'
                                        chipProperty='type'
                                        colorIndex={2}
                                        icon={<FirstAidSvg className={"fill-foreground stroke-foreground"} style={{width:75, height:75}} />}
                                        onEdit={openForm} 
                                    /> 
                                    :
                                    <SectionSkeleton />
                                }
                            </Section>
                            <Section>
                                <SectionHeader
                                    icon={<Activity width={22} height={22} /> }
                                    title='Conditions'
                                    onAddClick={() => openForm('Condition', null)}
                                /> 
                                { !fetchingConditions ? 
                                    <SectionList 
                                        items={conditions} 
                                        type='Condition'
                                        colorIndex={3}
                                        icon={<HeartSvg className={"fill-foreground stroke-foreground"} style={{width:75, height:75}} />}
                                        onEdit={openForm} 
                                    />
                                    :
                                    <SectionSkeleton />
                                }
                            </Section>
                            <Section>
                                <SectionHeader
                                    icon={<AlertCircle width={22} height={22} /> }
                                    title='Allergies'
                                    onEditClick={() => openForm('Allergies', allergies)}
                                /> 
                                { !fetchingAllergies ? 
                                    <>
                                        { allergies && allergies.length > 0 ?
                                            <div className='flex-row-center flex-wrap gap-5 px-2'>  
                                                { allergies?.map((allergy) =>
                                                    <Badge key={allergy.id} className='bg-blue-background text-[0.9rem] font-medium'>
                                                        <div className='w-1.5 h-1.5 rounded-full bg-blue-text' />
                                                        {allergy.name}
                                                    </Badge> 
                                                )}
                                            </div> 
                                            :
                                            <div className='flex-row-center'>
                                                <EmptyState 
                                                    icon={<SirenSvg className={"fill-foreground stroke-foreground rotate-5"} style={{width:75, height:75}} />}
                                                />
                                            </div>
                                        }   
                                    </>
                                    :
                                    <SectionSkeleton /> 
                                } 
                            </Section>
                        </div> 
                    </div>
                    
                    <FormDialog
                        open={formOpen} 
                        onOpenChange={setFormOpen}
                        title={`${formData.selected === null ? 'Add' : 'Edit'} ${formData.type}`}
                        form={getFormType()}
                    />   
                </div>  
            } 
        </div> 
    );
} 