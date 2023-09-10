'use client'

import React, { ReactHTMLElement } from "react";
import Image from "next/image";
import { useSearchParams } from 'next/navigation'
import Link from 'next/link';

interface MenuItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    url?: string;
    text: string;
}

function MenuItem(props: MenuItemProps) {
    return (
        <Link
            {...props}
            href={props.url ?? ''}
            className={`flex justify-center text-white font-bold w-48 py-4 px-8 rounded-full outline-none ${props.className}`}
        >
            {props.text}
        </Link>
    );
}

function Menu() {
    return (
        <>
            <div className="absolute flex flex-col gap-4 justify-center items-center w-full h-full z-10">
                <MenuItem url={"/game/pause"} text={"Play"} className={"bg-neutral-700 hover:bg-emerald-500"} />
                {/* <MenuItem url={"/game-online"} text={"Play Online"} className={"bg-neutral-700 hover:bg-emerald-500"} /> */}
                {/* <MenuItem url={"/leaderboard"} text={"Leaderborad"} className={"bg-neutral-700 hover:bg-emerald-500"} /> */}
                <MenuItem url={"/credits"} text={"Credits"} className={"bg-neutral-700 hover:bg-emerald-500"} />
            </div>
        </>
    );
}

export default function Home() {
    const searchParams = useSearchParams()

    React.useEffect(() => {
        const urlParams = new URLSearchParams(searchParams.toString());
        const refresh = Boolean(urlParams.get('refresh'));

        if (refresh) {
            window.location.href = '/';
        }
    }, [searchParams])

    const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
        if (["Space", "Enter", "Escape"].includes(event.code)) {
            window.location.href = '/game/pause';
        }
    }, []);

    React.useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <main className="w-full h-full">
            <Menu />
        </main>
    )
}
