"use client" 

import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { SignInButton, useUser, UserButton } from '@clerk/nextjs'
import React from 'react'

function AppHeader() {
  const { isSignedIn } = useUser();

  return (
    <div className='p-3 w-full shadow flex justify-between items-center bg-background'>
      <SidebarTrigger />
      
      {!isSignedIn ? (
        <SignInButton mode="modal">
          <Button size="sm">Sign In</Button>
        </SignInButton>
      ) : (
        <UserButton afterSignOutUrl="/" />
      )}
    </div>
  )
}

export default AppHeader