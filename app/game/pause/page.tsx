'use client'

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";

export default function Home() {
    const searchParams = useSearchParams()
    const [url, set_url] = React.useState("/");
    const [route, set_route] = React.useState(false);

    const router = useRouter();

    React.useEffect(() => {
        const urlParams = new URLSearchParams(searchParams.toString());
        const query_url = urlParams.get('url');

        if (query_url) {
            set_url(query_url);
        }
    }, [searchParams])

    const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
        if (["Space", "Enter", "Escape"].includes(event.code)) {
            // window.location.href = url;
            set_route(true);
        }
    }, []);

    React.useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    if (route) {
        router.push(`/game`);
    }

    return (
        <main className="w-full h-full">
            <div className="absolute flex flex-col gap-4 justify-center items-center w-full h-full z-0">
                <Image src={'/img/TUTORILA.png'} alt={""} fill={true}/>
            </div>
            <div className="absolute top-0 left-0 w-full h-full z-10 bg-transperent z-10">
                <Link href={url} className="absolute top-8 left-8 w-16 h-16 text-3xl">{"<-"}</Link>
                <div className="flex flex-col gap-8 justify-center items-center w-full h-full">
                    <h2 className="font-semibold text-5xl text-amber-500">GAME PAUSED</h2>
                    <h3 className="font-semibold text-lg text-white">Press SPACE to resume</h3>
                </div>
            </div>
        </main>
    )
}
