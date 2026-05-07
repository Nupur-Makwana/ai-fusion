"use client"

import React, { useEffect } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import AppHeader from './_components/AppHeader'
import { db } from '@/config/FirebaseConfig'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useUser } from '@clerk/nextjs'

function Provider({ children }) {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      checkAndCreateUser();
    }
  }, [user]);

  const checkAndCreateUser = async () => {
    // 1. Guard clause: Ensure email exists
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;

    try {
      const userRef = doc(db, "users", email);
      const userSnap = await getDoc(userRef);

      // 2. Fix: use .exists() [method] not .exist() [property]
      if (userSnap.exists()) {
        console.log("Existing User");
        return;
      } else {
        // 3. Define userData properly inside this scope
        const userData = {
          name: user?.fullName || "Anonymous",
          email: email,
          createdAt: new Date().toISOString(), // Use a string or serverTimestamp
          remainingMsg: 5,
          plan: "Free",
          credits: 1000
        };
        
        await setDoc(userRef, userData);
        console.log("New user data saved");
      }
    } catch (error) {
      console.error("Error managing user in Firestore:", error);
    }
  };

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
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