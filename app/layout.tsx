'use client'

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react';

const global_state = {
  player_0: {
    x: 0,
    y: 0,
  },
  player_1: {
    x: 0,
    y: 0,
  }
}

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export function Providers({ children } : { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}

export const GlobalStateContext = React.createContext<any>([]);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [player0X, setPlayer0X] = React.useState(0);
  const [player0Y, setPlayer0Y] = React.useState(0);
  const [player1X, setPlayer1X] = React.useState(0);
  const [player1Y, setPlayer1Y] = React.useState(0);

  return (
    <html className="w-screen h-screen overflow-hidden" lang="en">
      <body className={`${inter.className} w-full h-full`}>
        <GlobalStateContext.Provider value={[
            [player0X, setPlayer0X],
            [player0Y, setPlayer0Y],
            [player1X, setPlayer1X],
            [player1Y, setPlayer1Y],
        ]}>
            {children}
        </GlobalStateContext.Provider>
    </body>
    </html>
  )
}



