'use client'
import { redirect } from "next/navigation";
import Image from "next/image"; 
import { BorderedImageText } from "@/components/ui/border-image"

export default function ErrorPage() {
  return (
    <div className='w-fit mt-30 mx-auto'>
      <BorderedImageText
        img={<Image src='/fishbowl_crack.png' alt='fish bowl' width={330} height={330} />}
        className='bg-primary'
        title={'Oops Something\nWent Wrong Here'}
        subtitle='Click Here to Return Home' 
        onClick={() => redirect('/')}
      /> 
    </div> 
  )
}