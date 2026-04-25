"use client"

import React, { Children } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'


function Provider({
  children,
  ...props
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      <SidebarProvider>
        <AppSidebar />
        <div className='w-full flex flex-col h-screen overflow-hidden'>
          <AppHeader />
          <main className='flex-1 overflow-hidden relative'>
            {children}
          </main>
        </div>
      </SidebarProvider>
    </NextThemesProvider>
  )
}

export default Provider
