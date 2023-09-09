'use client'

import React, { ReactHTMLElement } from "react";
import Image from "next/image";
import Projectile from "./shooting";
// import {Input} from "../lib/Input.js";

function Player({id}: {id: string}) {
    interface ProjectileData {
        startX: number;
        startY: number;
    }

    const elem = React.useRef<HTMLSpanElement>(null);
    const [x, set_x] = React.useState(0);
    const [y, set_y] = React.useState(0);
    const [projectiles, setProjectiles] = React.useState<ProjectileData[]>([]);  // <-- Explicitly type the state
    const [velocity, setVelocity] = React.useState({ x: 0, y: 0 });

    const MOVE_AMOUNT = 0.1;
    // const FRICTION = 0.97;   
    const MaxSpeed = 10;
    // const VelocityTreshold = 0.1;
    const PullForce = 0.05;

    const keyToDirectionMap: Record<string, { x: number, y: number }> = {
        KeyW: { x: 0, y: -MOVE_AMOUNT },
        KeyS: { x: 0, y: MOVE_AMOUNT },
        KeyA: { x: -MOVE_AMOUNT, y: 0 },
        KeyD: { x: MOVE_AMOUNT, y: 0 },
    };

    let client_width = window.innerWidth
    let client_height = window.innerHeight
    let client_width_half = client_width / 2

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
        const direction = keyToDirectionMap[event.code];
        if (direction) {
            setVelocity(prev => ({
                x: Math.min(MaxSpeed, Math.max(-MaxSpeed, prev.x + direction.x)),
                y: Math.min(MaxSpeed, Math.max(-MaxSpeed, prev.y + direction.y))
            }));
        }
        if (event.code === "Space") {
            setProjectiles(prev => [...prev, { startX: x, startY: y }]);
        }
    }, []);

    function UpdateX(prevX: number): number {
        client_width = window.innerWidth;
        client_height = window.innerHeight;
        client_width_half = client_width / 2;
        if (prevX < -1)
        {
            velocity.x = velocity.x * -1;
        }
        if (prevX > 40)
        {
            velocity.x = velocity.x * -1;
        }
        console.log(prevX);
        return prevX + velocity.x;
    }

    function UpdateY(prevY: number): number {
        if (prevY < -1)
        {
            velocity.y = velocity.y * -1;
        }
        if (prevY > 75)
        {
            //lose game
            velocity.y = velocity.y * -1;
        }
        return prevY + velocity.y;
    }

    React.useEffect(() => {

        const interval = setInterval(() => {
            set_x(prevX => UpdateX(prevX));
            set_y(prevY => UpdateY(prevY));
        }, 30);

        
        return () => clearInterval(interval);
    }, [velocity]);

    return (
        <>
            <span
                id = {"player"}
                ref={elem}
                className="absolute outline-none"
                style={{
                    width: "8%",
                    height: "25%",
                    left: `${x}%`,
                    top: `${y}%`,
                    willChange: `transform, top, left`,
                }}
                onKeyDown={(event) => {handleKeydown(event, x, y)}}
                tabIndex={0}
            >
                <Image
                    className="absolute"
                    src={"/img/Boat_vertical_test.png"}
                    alt={""}
                    layout="fill"
                />
            </span>
            {projectiles?.map((proj, index) => (
                <Projectile key={index} startX={proj.startX} startY={proj.startY} IsLeft={true} />
            ))}dd
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
            
        </main>
    )
}
