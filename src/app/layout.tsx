'use client'
import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import './globals.css'

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-background text-foreground min-h-screen flex">
        <QueryClientProvider client={queryClient}>
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-6 md:p-10">
              {children}
            </main>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  )
}
