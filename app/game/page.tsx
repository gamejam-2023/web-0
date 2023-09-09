'use client'

import React, { ReactHTMLElement } from "react";
import Image from "next/image";
import Projectile from "./shooting";
import { GlobalStateContext } from "../layout";
// import {Input} from "../lib/Input.js";

//keep track of players position
const player_0 = {
    x: 0,
    y: 0,
}
const player_1 = {
    x: 0,
    y: 0,
}

function Player({id, IsLeft}: {id: string, IsLeft: boolean}) {
    interface ProjectileData {
        startX: number;
        startY: number;
    }
    

    const elem = React.useRef<HTMLSpanElement>(null);
    const [x, set_x] = React.useState(0);
    const [y, set_y] = React.useState(0);
    const [projectiles, setProjectiles] = React.useState<ProjectileData[]>([]);  // <-- Explicitly type the state
    const [velocity, setVelocity] = React.useState({ x: 0, y: 0 });

    const globalState = React.useContext(GlobalStateContext);
    console.log(id, globalState);
    globalState[0][1](1);// set player0X to 1
    // globalState[1][1](2);// set player0Y to 2
    // globalState[2][1](3);// set player1X to 3
    // globalState[3][1](4);// set player1Y to 4
    // console.log(globalState[3][0]);// get player1Y

    const MOVE_AMOUNT = 0.1;
    // const FRICTION = 0.97;   
    const MaxSpeed = 10;
    // const VelocityTreshold = 0.1;
    const PullForce = 0.005;

    let keyToDirectionMap: Record<string, { x: number, y: number }>
    

    if (x === 0 && y === 0)
    {
        if (IsLeft === true) {
            set_x(20);
            set_y(20);
            keyToDirectionMap = {
                KeyW: { x: 0, y: -MOVE_AMOUNT },
                KeyS: { x: 0, y: MOVE_AMOUNT },
                KeyA: { x: -MOVE_AMOUNT, y: 0 },
                KeyD: { x: MOVE_AMOUNT, y: 0 },
            };
        }
        else {
            set_x(80);
            set_y(20);
            keyToDirectionMap = {
                ArrowUp: { x: 0, y: -MOVE_AMOUNT },
                ArrowDown: { x: 0, y: MOVE_AMOUNT },
                ArrowLeft: { x: -MOVE_AMOUNT, y: 0 },
                ArrowRight: { x: MOVE_AMOUNT, y: 0 },
            };
        }
    }

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
        if (prevX < -3 || prevX > 94)
        {
            velocity.x = velocity.x * -1;
        }
        if (prevX > 45 && IsLeft === true)
        {
            velocity.x = velocity.x * -1;
        }
        if (prevX < 55 && IsLeft === false)
        {
            velocity.x = velocity.x * -1;
        }

        // console.log(prevX);
        if (IsLeft === true) {
            player_0.x = prevX;
        }
        else {
            player_1.x = prevX;
        }

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

        if (IsLeft === true) {
            player_0.y = prevY;
        }
        else {
            player_1.y = prevY;
        }
        velocity.y = velocity.y + PullForce;

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
                <Projectile key={index} startX={proj.startX} startY={proj.startY} IsLeft={IsLeft} />
            ))}dd
        </>
    );


}

function Background() {
    return (
        <>
            <Image className="absolute w-screen h-screen" src={"/img/BgCore2.png"} alt={""} layout='fill'/>
        </>
    );
}

export default function Home() {
    return (
        <main>
            <Background />

            <Player
                id={"player-0"}
                IsLeft={true}
            />
            
            <Player
                id={"player-1"}
                IsLeft={false}
            />
            
        </main>
    )
}
