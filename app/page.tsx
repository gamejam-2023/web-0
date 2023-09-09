'use client'

import React, { ReactHTMLElement } from "react";
import Image from "next/image";
import Projectile from "./shooting";
import {Input} from "../lib/Input.js";


function Player({id}: {id: string}) {
    interface ProjectileData {
        startX: number;
        startY: number;
    }

    const elem = React.useRef<HTMLSpanElement>(null);
    const [x, set_x] = React.useState(0);
    const [y, set_y] = React.useState(0);
    const [projectiles, setProjectiles] = React.useState<ProjectileData[]>([]);  // <-- Explicitly type the state
    const [keysPressed, setKeysPressed] = React.useState({ KeyW: false, KeyS: false, KeyA: false, KeyD: false });
    const [velocity, setVelocity] = React.useState({ x: 0, y: 0 });

    const MOVE_AMOUNT = 2;
    const FRICTION = 0.97;   
    const MaxSpeed = 10;
    const VelocityTreshold = 0.1;
    


    const keyToDirectionMap: Record<string, { x: number, y: number }> = {
        KeyW: { x: 0, y: -MOVE_AMOUNT },
        KeyS: { x: 0, y: MOVE_AMOUNT },
        KeyA: { x: -MOVE_AMOUNT, y: 0 },
        KeyD: { x: MOVE_AMOUNT, y: 0 },
    };

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
            setProjectiles(prev => [...prev, { startX: x+100, startY: y+100 }]);
        }
    }, []);

    React.useEffect(() => {
        let running = true;
        
        const loop = () => {
            // if (!running) return;

            
            // Apply friction
            if (Math.abs(velocity.x) < VelocityTreshold) velocity.x = 0;
            else (velocity.x = velocity.x * FRICTION)
            if (Math.abs(velocity.y) < VelocityTreshold) 
            {velocity.y = 0;}
            else (velocity.y = velocity.y * FRICTION)

            // setVelocity(prev => ({
            //     x: prev.x * FRICTION,
            //     y: prev.y * FRICTION
            // }));

            set_x(prevX => prevX + velocity.x);
            set_y(prevY => prevY + velocity.y);
            
            requestAnimationFrame(loop);
        };
        
        loop();  // Start the loop
        return () => { running = false }; 
    }, [velocity]);

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
            {projectiles?.map((proj, index) => (
                <Projectile key={index} startX={proj.startX} startY={proj.startY} />
            ))}
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
