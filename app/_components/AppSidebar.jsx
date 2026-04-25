"use client"
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function AppSidebar() {
    const {theme,setTheme} = useTheme()
  return (
    <Sidebar>
      <SidebarHeader />
        <div className="p-3" >
            <div className=" flex  justify-baseline items-center gap-10">
                <div className="flex items-center gap-3">
                <Image src={'/logo.svg'} alt="logo" width={60} height = {60}
                className ="w-[40px] h-[40px]"
                />
                <h2 className="font-bold text-xl">Fusion Ai</h2>
                </div>
                <div>
                    {theme =='light'?  <Button variant={'ghost'} onClick={()=>setTheme('dark')}><Sun /></Button>  
                    :<Button variant= {'ghost'} onClick={()=>setTheme('light')}><Moon /></Button>}
                </div>
             </div>
        <Button className='mt-7 w-full' size='lg'>+ New Chat</Button>
        </div>

      <SidebarContent>
        <SidebarGroup>
            <div  className='p-3'> 
                <h2 className="font-bold text-lg">Chat</h2>
                <p className='text-sm text-gray-400'>Sign in to start chatting with multiple ai model</p>
            </div>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter>
        <div className="p-3 mb-10">
            <Button className={'w-full'}>Sign In/Sign Up</Button>
        </div>
        </SidebarFooter>
    </Sidebar>
  )
}