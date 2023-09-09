'use client'

import React, { ReactHTMLElement } from "react";
import Image from "next/image";
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
        <div className="flex flex-col gap-4 justify-center items-center w-full h-full">
            <MenuItem url={"/game"} text={"Play"} className={"bg-neutral-700 hover:bg-emerald-500"} />
            <MenuItem url={"/game-online"} text={"Play Online"} className={"bg-neutral-700 hover:bg-emerald-500"} />
            <MenuItem url={"/leaderboard"} text={"Leaderborad"} className={"bg-neutral-700 hover:bg-emerald-500"} />
            <MenuItem url={"/credits"} text={"Credits"} className={"bg-neutral-700 hover:bg-emerald-500"} />
        </div>
    );
}

export default function Home() {
    return (
        <main className="w-full h-full">
            <Menu />
        </main>
    )
}
