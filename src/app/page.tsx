'use client'
import { useRouter } from 'next/navigation' 
import Image from "next/image"; 
import { Bone, Box, Calendar, Cross, LogIn, PawPrint, SendHorizonal, SunMoon, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import { useTheme } from 'next-themes'; 
import { BorderedImage } from '@/components/ui/border-image';
import { Card } from '@/components/ui/card';
import React from 'react';
import { SITE_ATTRIBUTIONS } from '@/constants'; 
import { ArrowSvg, DogInHouseSvg } from '@/components/icons';

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card className='flex-col-start items-start h-full px-8 py-5'> 
      <div className='bg-primary p-2 rounded-full mb-2'>
        {icon}
      </div>
      <p className='text-[1.4rem] font-semibold px-1 border-b-1 border-b-foreground mb-3'>{title}</p>
      <p>{text}</p>
    </Card>
  )
}

export default function Home() { 
  const router = useRouter();
  const { theme, setTheme } = useTheme()  
  const toggleTheme = () => { setTheme(theme === 'dark' ? 'light' : 'dark') }

  return (
    <div className='flex-col-center pb-8'>
      <div className="flex-row-between bg-topbar px-5 py-3">
          <div className="flex-row-center gap-2">
            <Image src='/paw-print.png' alt="pawprint" width={28} height={28} /> 
            <span className="text-[1.5rem] text-white font-semibold">pawprint</span>   
          </div>

          <div className='flex-row-center w-fit'>
            <Button variant="outline" size="icon" onClick={toggleTheme} className='border-muted-background mr-3'>
              <SunMoon className="h-[2rem] w-[2rem] text-muted-foreground"/>
            </Button> 
            <Button onClick={() => router.push("/auth/login")}>
              Sign In 
            <LogIn /> 
          </Button> 
          </div> 
      </div> 
      
      <div className='flex-col-center min-[900px]:flex-row-start gap-10 p-10 pb-[7px] dotted-border'> 
        <div className='flex-col-start min-[900px]:w-1/2 min-[900px]:pr-10'> 
          <div className='flex-row-between mb-4 text-[3.3rem] font-bold leading-15 underline pr-6'>  
            Healthier Pets <br/> Happier Days 
            <DogInHouseSvg className={"fill-foreground stroke-foreground"} style={{width:175, height:175}} />
          </div> 

          <p className='text-[1rem] mb-5'>Stay on top of your pets’ health with a simple, all-in-one tool. Track medical histories, schedule appointments, and keep vital care information, all while staying connected and organized.</p>
          <div className='flex-row-start gap-2'> 
            <Button onClick={() => router.push('/auth/login')}> Get Started </Button>   
            <Button variant='outline' onClick={() => router.push('/auth/login?demo=true')}> 
                Try Demo 
              </Button>    
          </div> 

          <div className='flex-col-start'>
            <div className='flex-row-center'>
              <ArrowSvg 
                className={"fill-foreground stroke-foreground"} 
                style={{ width:50, height:50, transform: "rotate(145deg)", marginTop: "2rem" }} 
              />
              <span className='highlight3 font-semibold'>Multi-Species Support!</span>
            </div> 

            <div className='flex-row-center flex-wrap gap-x-8 gap-y-3 mt-4'> 
              <Image src='/fishbowl.png' alt='fish' width={46} height={46} className='bg-white rounded-full p-1'/> 
              <Image src='/dog.png' alt='dog' width={46} height={46} className='bg-white rounded-full p-1'/> 
              <Image src='/pigeon.png' alt='pigeon' width={46} height={46} className='bg-white rounded-full p-1'/>
              <Image src='/hamster.png' alt='hamster' width={46} height={46} className='bg-white rounded-full p-1'/>
              <Image src='/turtle.png' alt='turtle' width={46} height={46} className='bg-white rounded-full p-1'/>
              <Image src='/cat_sleeping.png' alt='cat' width={48} height={48} className='bg-white rounded-full p-1'/>  
            </div> 
        </div>
        </div> 
        <BorderedImage img={<Image src='/work.png' alt='cat' width={330} height={330}/>}/>  
      </div>      
 
      <div className='flex-col-start pt-8 pb-16 px-10 min-[900px]:px-35 gap-7 dotted-border'>
        <span className='highlight text-[2.2rem] font-semibold'>Features</span> 
        <div className='grid min-[650px]:grid-cols-2 min-[1100px]:grid-cols-3 gap-10 w-full'>
          <FeatureCard
            icon={<PawPrint width={25} height={27} className='text-white'/>}
            title='Pet Profiles'
            text='Create individual profiles for each pet to easily manage health and care information all in one place.'
          />
          <FeatureCard
            icon={<Calendar width={27} height={27} className='text-white'/>}
            title='Appointment Tracking'
            text='Stay on track with a shared calendar of appointments with scheduled reminders.'
          />
          <FeatureCard
            icon={<Box width={27} height={27} className='text-white'/>}
            title='Records Archive'
            text='Store important documents, records, and files for easy access at any time, anywhere.'
          />
          <FeatureCard
            icon={<Bone width={25} height={27} className='text-white'/>}
            title='Routine Schedules'
            text='Set up and monitor medication and feeding schedules, simplifying routine care management for all pets.'
          />
          <FeatureCard
            icon={<Cross width={25} height={27} className='text-white'/>}
            title='Medical History'
            text='Maintain a complete health record for each pet, including chronic conditions, past procedures, and any allergies.'
          />
          <FeatureCard
            icon={<UserRound width={25} height={27} className='text-white'/>}
            title='Care Directory'
            text='Keep a directory with contact details for quick access to all your vets, groomers, boarders, and other personnel.'
          />
        </div>
      </div>

      <div className='flex-col-start pt-8 pb-10 px-10 min-[900px]:px-35 gap-4 dotted-border'>
        <span className='highlight2 text-[2.2rem] font-semibold'>Resources</span>
        <p className='text-[1.3rem] font-semibold'>
          Shoutout to the talented creators whose art and graphics bring this site to life!
        </p> 
        { SITE_ATTRIBUTIONS.map((attribute) => 
          <div key={attribute.name} className='flex-row-center inline-flex flex-wrap items-center gap-1'>
            <SendHorizonal width={13} height={13} className='mr-3' />
            Icons made by 
            <span className="text-[1.05rem] font-bold text-pink-primary whitespace-nowrap">{ attribute.name }</span> 
            from&nbsp; 
            <a href={ attribute.link } target="_blank" className='hover:underline whitespace-nowrap'>
              { attribute.link } 
            </a>  
          </div> 
        )} 
      </div> 
    </div> 
  );
}

 