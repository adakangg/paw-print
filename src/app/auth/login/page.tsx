
import LoginForm from '@/components/forms/login-form'
import SignupForm from '@/components/forms/signup-form'
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'   
import { login, signup } from './actions'
 
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ demo: string }>}) {    
  const { demo } = await searchParams; 
   
  return (
    <div className='flex-col-center justify-start h-full'> 
      <Card className='flex-col-start w-[420px] px-8 pt-4 pb-8 mt-30 rounded-lg'>
        <p className='text-[1.8rem] font-semibold mb-5'>Welcome</p>

        <Tabs defaultValue={!!demo ? "existing" : "new"} className='w-full'>
          <TabsList className='w-full mb-6'>
            <TabsTrigger value="new"> Sign Up </TabsTrigger>
            <TabsTrigger value="existing"> Login </TabsTrigger>
          </TabsList> 
          <TabsContent value="new"> 
            <SignupForm onSubmitClick={signup} />
          </TabsContent>
          <TabsContent value="existing">   
            <LoginForm onSubmitClick={login} filled={!!demo} />
          </TabsContent>
        </Tabs> 
      </Card> 
    </div>
  )
}