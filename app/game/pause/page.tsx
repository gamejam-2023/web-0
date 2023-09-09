'use client'

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Home() {
    const searchParams = useSearchParams()
    const [url, set_url] = React.useState("/game");

    React.useEffect(() => {
        const urlParams = new URLSearchParams(searchParams.toString());
        const query_url = urlParams.get('url');

        if (query_url) {
            set_url(query_url);
        }
    }, [searchParams])

    return (
        <main className="w-full h-full">
            <div className="absolute top-0 left-0 w-full h-full z-10 bg-black">
                <Link href={url} className="absolute top-8 left-8 w-16 h-16 text-3xl">{"<-"}</Link>
                <div className="flex justify-center items-center w-full h-full">
                    <h2 className="font-semibold text-5xl text-amber-500">GAME PAUSED</h2>
                </div>
            </div>
        </main>
    )
}
