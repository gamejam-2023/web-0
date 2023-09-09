'use client'

import React, { ReactHTMLElement } from "react";
import Image from "next/image";
import Projectile from "./shooting";
import { GlobalStateContext } from "../layout";
import { cwd } from "process";
// import {Input} from "../lib/Input.js";

function Player({id, IsLeft, key_code}: {id: string, IsLeft: boolean, key_code: string}) {
    interface ProjectileData {
        startX: number;
        startY: number;
    }
    const elem = React.useRef<HTMLSpanElement>(null);
    const [x, set_x] = React.useState(0);
    const [y, set_y] = React.useState(0);
    const [projectiles, setProjectiles] = React.useState<ProjectileData[]>([]);  // <-- Explicitly type the state
    const [velocity, setVelocity] = React.useState({ x: 0, y: 0 });

    const boat_current = IsLeft === true ? "/img/BoatBlue.png" : "/img/BoatRed.png";

    
    const globalState = React.useContext(GlobalStateContext);
    // console.log(id, globalState);
    // globalState[0][1](1);// set player0X to 1
    // globalState[1][1](2);// set player0Y to 2
    // globalState[2][1](3);// set player1X to 3
    // globalState[3][1](4);// set player1Y to 4
    // console.log(globalState[3][0]);// get player1Y
    // set player0Health to 100

    const healthBarContainerStyle = {
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '10px',
        backgroundColor: 'rgba(255,255,255,0.3)', // semi-transparent white for the background
        borderRadius: '5px',
        overflow: 'hidden'
    };
    
    const health = IsLeft === true ? globalState[4] : globalState[5];
    const health_other = IsLeft === true ? globalState[5] : globalState[4];
    
    const healthBarStyle = {
        height: '100%',
        width: `${health[0]}%`, // this will automatically set the width to be proportional to the health
        backgroundColor: getHealthColor(health[0]),
        transition: 'width 0.3s ease' // optional, for smooth transition
    };

    const MOVE_AMOUNT = 0.1;
    // const FRICTION = 0.97;   
    const MaxSpeed = 10;
    // const VelocityTreshold = 0.1;
    const PullForce = 0.005;

    const keyToDirectionMap: Record<string, { x: number, y: number }> = IsLeft === true ? 
        {
            KeyW: { x: 0, y: -MOVE_AMOUNT },
            KeyS: { x: 0, y: MOVE_AMOUNT },
            KeyA: { x: -MOVE_AMOUNT, y: 0 },
            KeyD: { x: MOVE_AMOUNT, y: 0 },
        }
        : 
        {
            ArrowUp: { x: 0, y: -MOVE_AMOUNT },
            ArrowDown: { x: 0, y: MOVE_AMOUNT },

            ArrowLeft: { x: -MOVE_AMOUNT, y: 0 },
            ArrowRight: { x: MOVE_AMOUNT, y: 0 },
        };

    

    if (x === 0 && y === 0)
    {
        if (IsLeft === true) {
            set_x(20);
            set_y(20);

        }
        else {
            set_x(80);
            set_y(20);
        }
    }

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
    

    React.useEffect(() => {
        const direction = keyToDirectionMap[key_code];
        if (direction) {
            setVelocity(prev => ({
                x: Math.min(MaxSpeed, Math.max(-MaxSpeed, prev.x + direction.x)),
                y: Math.min(MaxSpeed, Math.max(-MaxSpeed, prev.y + direction.y))
            }));
        }
        if (key_code === "Space") {
            setProjectiles(prev => [...prev, { startX: x, startY: y }]);
        }
    }, [key_code]);

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
        // if (event.code === "KeyH") {
        //     // globalState[4][1]();
        //     console.log(globalState[4][0])// set player0Health to 100
        //     // setHealth(health => health - 5);
        // }
    }, []);

    function UpdateX(prevX: number): number {
        if (prevX < -3 || prevX > 94)
        {
            health[1](health[0] - 5);
            // console.log(globalState[4][0]);
            velocity.x = velocity.x * -1;
        }
        if (prevX > 40 && IsLeft === true)
        {
            health[1](health[0] - 5);
            velocity.x = velocity.x * -1;
        }
        if (prevX < 52 && IsLeft === false)
        {
            health[1](health[0] - 5);
            velocity.x = velocity.x * -1;
        }

        // console.log(prevX);
        if (IsLeft === true) {
            globalState[0][1](prevX + velocity.x)
        }
        else {
            globalState[2][1](prevX + velocity.x)
        }

        return prevX + velocity.x;
    }
    // console.log(globalState[4][0]);


    function UpdateY(prevY: number): number {
        if (prevY < -1)
        {
            health[1](health[0] - 5);
            velocity.y = velocity.y * -1;
        }
        if (prevY > 75)
        {
            //lose gamea
            velocity.y = velocity.y * -1;
        }

        // if (IsLeft === true) {
        //     player_0.y = prevY;
        // }
        // else {
        //     player_1.y = prevY;
        // }
        velocity.y = velocity.y + PullForce;

        if (IsLeft === true) {
            globalState[1][1](prevY + velocity.x)
        }
        else {
            globalState[3][1](prevY + velocity.x)
        }

        return prevY + velocity.y;
    }

    function getHealthColor(health: number): string {
        if (health <= 0) {
            console.log("Game Over");
        }

        if (health > 60) {
          return "green";
        } else if (health > 25) {
          return "yellow";
        } else {
          return "red";
        }
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
                // onKeyDown={(event) => {handleKeydown(event, x, y)}}
                tabIndex={0}
            >
                
                <Image
                    className="absolute"
                    src={"/img/BoatWaterMove3.png"}
                    alt={""}
                    layout="fill"
                />
                
                 <Image
                    className="absolute"
                    src={boat_current}
                    alt={""}
                    layout="fill"
                />
                {/* <Image
                    className="absolute"
                    src={"/img/Boat_vertical_test.png"}
                    alt={""}
                    layout="fill"
                /> */}
                <div style={healthBarContainerStyle}>
                    <div style={healthBarStyle}></div>
                </div>
                {/* <div style={{ position: 'absolute', bottom: '0', left: '0', backgroundColor: 'white', color: getHealthColor(health), padding: '5px', borderRadius: '5px' }}>
                Health: {health} */}
            {/* </div> */}
            </span>
            {projectiles?.map((proj, index) => (
                <Projectile key={index} startX={proj.startX} startY={proj.startY} IsLeft={IsLeft} />
            ))}
        </>
    );


}

function Background() {
    return ( 
        <>
            <div className="relative w-screen h-screen overflow-hidden"> {/* Container for the waves */}
                <Image className="absolute w-screen h-screen" src={"/img/BgOnlt.png"} alt={""} layout='fill'/>
                <Image className="absolute w-screen h-screen" src={"/img/WaterMovingMiddle1.png"} alt={""} layout='fill'/>
                <Image className="absolute w-screen h-screen WaterMovingMiddle" src={"/img/WaterMovingMiddle2.png"} alt={""} layout='fill'/>


                <Image className="absolute w-screen h-screen wavesAnimation" src={"/img/waves2.png"} alt={"Waves"} layout='fill'/>
                <Image className="absolute w-screen h-screen wavesAnimation" style={{top: '-100%'}} src={"/img/waves2.png"} alt={"Waves"} layout='fill'/>
            </div>
        </>
    );
}

export function PlayerController() {
    const [key_code, set_key_code] = React.useState("");

    const handleUserKeyPress = React.useCallback(event => {
        set_key_code(event.code);
    }, []);

    React.useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    }, [handleUserKeyPress]);

    return (
        <>
            <Player
                id={"player-0"}
                IsLeft={true}
                key_code={key_code}
            />
            <Player
                id={"player-1"}
                IsLeft={false}
                key_code={key_code}
            />
        </>
    );
}

export default function Home() {
    return (
        <main className="w-full h-full">
            <Background />
            <PlayerController /> 
        </main>
    )
}
