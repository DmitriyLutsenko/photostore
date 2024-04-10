'use client'

import { Toaster } from "react-hot-toast";
import Aside from "../_components/aside";
import { Montserrat } from "next/font/google";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Navbar from "../_components/navbar";

const montserrat = Montserrat({ subsets: ['latin'] })

export default function PanelLayout({ children, session }: { children: React.ReactNode, session: Session }) {

    return <>
        <SessionProvider session={session} refetchInterval={5 * 60}>
            <div className={"flex w-full " + montserrat.className}>
                <Aside />

                <div className='flex-1'>
                    <Navbar />
                    <div className="h-[calc(100vh-64px)] w-[100vw] min-w-[380px] lg:w-[calc(100vw-440px)] overflow-y-auto bg-blue-100/30 rounded-2xl pt-4 pb-4 px-4">
                        {children}
                    </div>
                </div>
            </div>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={
                    {
                        className: montserrat.className
                    }
                }
            />
        </SessionProvider>
    </>
}