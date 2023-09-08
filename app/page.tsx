'use client'

import React, { ReactHTMLElement } from "react";
import Image from "next/image";
import Projectile from "./shooting";
import {Input} from "../lib/Input.js";

function Player({id}: {id: string}) {
    const elem = React.useRef<HTMLElement>(null);
    const [x, set_x] = React.useState(0);
    const [y, set_y] = React.useState(0);

    // React.useEffect(() => {
    //     var elem_input = Input(elem);

    //     elem_input.watch("print_5", function() {
    //         console.log(1);
    //     }, "Control", "5");
    // }, []);

    // React.useEffect(() => {
    //     document.addEventListener('keydown', (event) => {
    //         if (id === "player-0") {
    //             if (event.code === "KeyS") {
    //                 set_y(y + 1);
    //             }
    //         }

    //         if (id === "player-1") {
    //             if (event.code === "ArrowDown") {
    //                 set_y(y + 1);
    //             }
    //         }
    //     });
    // }, [y]);

    const handleKeydown = React.useCallback((event: React.KeyboardEvent<HTMLSpanElement>, x: number, y: number) => {
        if (event.code === "KeyS") {
            set_y(y + 5);
        }
        if (event.code === "KeyW") {
            set_y(y - 5);
        }
        if (event.code === "KeyD") {
            set_x(x + 5);
        }
        if (event.code === "KeyA") {
            set_x(x - 5);
        }
    }, []);

    return (
        <>
            <span
                ref={elem}
                className="absolute outline-none"
                style={{
                    transform: `translate3d(${x}px, ${y}px, 0px)`,
                    willChange: `transform`,
                    transition: `transform 100ms ease`,
                }}
                onKeyDown={(event) => {handleKeydown(event, x, y)}}
                tabIndex={0}
            >
                <Image src={"/img/Boat_vertical_test.png"} alt={""} width={160} height={160}/>
            </span>
        </>
    );
}

function Background() {
    return (
        <>
            <Image className="absolute w-screen h-screen" src={"/img/BgCore.png"} alt={""} layout='fill'/>
        </>
    );
}

export default function Home() {
  return (
    <main>
        <Background />

        <Player
            id={"player-0"}
        />
        
        {/* <Player
            id={"player-1"}
        /> */}
        <Projectile startX={150} startY={150} />
    </main>
  )
}
