"use client"

import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import { UserDetailContext } from '@/context/UserDetailContext'; 
import { DefaultModel } from '@/shared/AiModelsShared';
import React, { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/AppSidebar';
import AppHeader from './_components/AppHeader';
import { db } from '@/config/FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';

function Provider({ children }) {
  const { user } = useUser();
  const [aiSelectedModels, setAiSelectedModels] = useState(DefaultModel);
  const [userDetail, setUserDetail] = useState();
  const [messages,setMessages]=useState({})

  useEffect(() => {
    if (user) {
      checkAndCreateUser();
    }
  }, [user]);

  const checkAndCreateUser = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return;

    try {
      const userRef = doc(db, "users", email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        console.log("Existing User");
        const userInfo = userSnap.data();
        
        
        if (userInfo?.selectedModelPref) {
          setAiSelectedModels(userInfo.selectedModelPref??DefaultModel);
          setUserDetail(userInfo);
           return;
        }
      
      } else {
        const userData = {
          name: user?.fullName || "Anonymous",
          email: email,
          createdAt: new Date().toISOString(),
          remainingMsg: 5,
          plan: "Free",
          credits: 1000,
          selectedModelPref: DefaultModel 
        };

        await setDoc(userRef, userData);
        setUserDetail(userData); 
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
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <AiSelectedModelContext.Provider value={{ aiSelectedModels, setAiSelectedModels,messages,setMessages }}>
          <SidebarProvider>
            <AppSidebar />
            <div className='w-full flex flex-col h-screen overflow-hidden'>
              <AppHeader />
              <main className='flex-1 overflow-hidden relative'>
                {children}
              </main>
            </div>
          </SidebarProvider>
        </AiSelectedModelContext.Provider>
      </UserDetailContext.Provider>
    </NextThemesProvider>
  );
}

export default Provider;