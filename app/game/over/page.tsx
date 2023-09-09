'use client'

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Home() {
    const searchParams = useSearchParams()
    const [url, set_url] = React.useState("/game");
    const [loser, set_loser] = React.useState("");

    React.useEffect(() => {
        const urlParams = new URLSearchParams(searchParams.toString());
        const query_url = urlParams.get('url');
        const query_loser = urlParams.get('loser');

        if (query_url) {
            set_url(query_url);
        }

        if (query_loser) {
            set_loser(query_loser);
        }
    }, [searchParams])

    return (
        <main className="w-full h-full">
            <div className="absolute top-0 left-0 w-full h-full z-10 bg-black">
                <Link href={url} className="absolute top-8 left-8 w-16 h-16 text-3xl">{"<-"}</Link>
                <div className="flex justify-center items-center w-full h-full">
                    {loser.length > 0 &&
                        <h2 className="font-semibold text-5xl text-amber-500">{loser.toUpperCase()} LOST</h2>
                    }
                </div>
            </div>
        </main>
    )
}
