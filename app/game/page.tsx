'use client'

import React from "react";
import Image from "next/image";
import Projectile from "./shooting";
import { GlobalStateContext } from "../layout";
import { useRouter } from "next/navigation";

interface PlayerProps {
    id: string;
    IsLeft: boolean;
    keypressed: any;
}

function Player(props: PlayerProps) {
    interface ProjectileData {
        startX: number;
        startY: number;
    }
    const elem = React.useRef<HTMLSpanElement>(null);
    const [x, set_x] = React.useState(0);
    const [y, set_y] = React.useState(0);
    const [projectiles, setProjectiles] = React.useState<ProjectileData[]>([]);  // <-- Explicitly type the state
    const [velocity, setVelocity] = React.useState({ x: 0, y: 0 });
    let [lock , setLock] = React.useState(false);

    const boat_current = props.IsLeft === true ? "/img/BoatBlue.png" : "/img/BoatRed.png";
    const [CannonBallAmo, setCannonBallAmo] = React.useState(5);
    const MAX_CANNONBALL_AMO = 5;

    
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
    
    const health = props.IsLeft === true ? globalState[4] : globalState[5];
    
    const healthBarStyle = {
        height: '100%',
        width: `${health[0]}%`, // this will automatically set the width to be proportional to the health
        backgroundColor: getHealthColor(health[0]),
        transition: 'width 0.3s ease' // optional, for smooth transition
    };

    const MOVE_AMOUNT = 0.1;
    const PullForce = 0.005;

    if (x === 0 && y === 0)
    {
        if (props.IsLeft === true) {
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
    
    // console.log(props.keypressed);
    React.useEffect(() => {
        if (props.keypressed.ArrowDown && props.IsLeft === false) {
            setVelocity(prev => ({
                x: prev.x,
                y: prev.y + MOVE_AMOUNT
            }));
        }
        if (props.keypressed.ArrowUp && props.IsLeft === false) {
            setVelocity(prev => ({
                x: prev.x,
                y: prev.y - MOVE_AMOUNT
            }));
        }
        if (props.keypressed.ArrowLeft && props.IsLeft === false) {
            setVelocity(prev => ({
                x: prev.x - MOVE_AMOUNT,
                y: prev.y
            }));
        }
        if (props.keypressed.ArrowRight && props.IsLeft === false) {
            setVelocity(prev => ({
                x: prev.x + MOVE_AMOUNT,
                y: prev.y
            }));
        }
        if (props.keypressed.KeyS && props.IsLeft === true) {
            setVelocity(prev => ({
                x: prev.x,
                y: prev.y + MOVE_AMOUNT
            }));
        }
        if (props.keypressed.KeyW && props.IsLeft === true) {
            setVelocity(prev => ({
                x: prev.x,
                y: prev.y - MOVE_AMOUNT
            }));
        }
        if (props.keypressed.KeyA && props.IsLeft === true) {
            setVelocity(prev => ({
                x: prev.x - MOVE_AMOUNT,
                y: prev.y
            }));
        }
        if (props.keypressed.KeyD && props.IsLeft === true) {
            setVelocity(prev => ({
                x: prev.x + MOVE_AMOUNT,
                y: prev.y
            }));
        }

        if (props.keypressed.Space && props.IsLeft === true) {
            if (CannonBallAmo <= 0) {
                return;
            }
            setProjectiles(prev => [...prev, { startX: x, startY: y }]);
            setCannonBallAmo(CannonBallAmo - 1);
  
            ReloadConnonBalls();

        }
        if (props.keypressed.Enter && props.IsLeft === false) {
            if (CannonBallAmo <= 0) {
                return;
            }
            setProjectiles(prev => [...prev, { startX: x, startY: y }]);
            setCannonBallAmo(CannonBallAmo - 1);

            ReloadConnonBalls();
        }
            
    }, [props.keypressed]);

    
    function ReloadConnonBalls() {
        if (lock) {
            return;
        }
        lock = true;
        setLock(true);
        new Promise(resolve => setTimeout(resolve, 3000)).then(() => {
            setCannonBallAmo(MAX_CANNONBALL_AMO);
            setLock(false);
        });
    }

    function UpdateX(prevX: number): number {
        if (prevX < -3 || prevX > 94)
        {
            health[1](health[0] - 5);
            // console.log(globalState[4][0]);
            velocity.x = velocity.x * -1;
        }
        if (prevX > 40 && props.IsLeft === true)
        {
            health[1](health[0] - 5);
            velocity.x = velocity.x * -1;
        }
        if (prevX < 52 && props.IsLeft === false)
        {
            health[1](health[0] - 5);
            velocity.x = velocity.x * -1;
        }

        // console.log(prevX);
        if (props.IsLeft === true) {
            globalState[0][1](prevX + velocity.x)
        }
        else {
            globalState[2][1](prevX + velocity.x)
        }

        return prevX + velocity.x;
    }

    function UpdateY(prevY: number): number {
        if (prevY < -1)
        {
            health[1](health[0] - 5);
            velocity.y = velocity.y * -1;
        }
        if (prevY > 75)
        {
            useRouter().push(`/game/over?url=/?refresh=true&loser=${props.id}`);
        }

        // if (props.IsLeft === true) {
        //     player_0.y = prevY;
        // }
        // else {
        //     player_1.y = prevY;
        // }
        velocity.y = velocity.y + PullForce;

        if (props.IsLeft === true) {
            globalState[1][1](prevY + velocity.x)
        }
        else {
            globalState[3][1](prevY + velocity.x)
        }

        return prevY + velocity.y;
    }

    function getHealthColor(health: number): string {
        if (health <= 0) {
            useRouter().push(`/game/over?url=/?refresh=true&loser=${props.id}`);
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
            
            // clearInterval(interval);
            // //@ts-ignore
            // elem.current?.remove();
            // return false
            
        }, 30);

        
        return () => clearInterval(interval);
    }, [velocity]);

    return (
        <>
            <span className="absolute" style={{
                // right: '50',
                left: `${x}%`,
                top: `${y}%`,
                 color: 'white'
                 }}>{CannonBallAmo}</span>
            
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
                <Projectile key={index} startX={proj.startX} startY={proj.startY} IsLeft={props.IsLeft} />
            ))}
        </>
    );


}

function Background() {
    return ( 
        <>
            <div className="relative w-screen h-screen overflow-hidden"> {/* Container for the waves */}
                <Image className="absolute w-screen h-screen" src={"/img/BgOnlt.png"} alt={""} layout='fill'/>
                <Image className="absolute w-screen h-screen wavesAnimation" src={"/img/waves2.png"} alt={"Waves"} layout='fill'/>
                <Image className="absolute w-screen h-screen wavesAnimation" style={{top: '-100%'}} src={"/img/waves2.png"} alt={"Waves"} layout='fill'/>
                <Image className="absolute w-screen h-screen" src={"/img/WaterMovingMiddle1.png"} alt={""} layout='fill'/>
                <Image className="absolute w-screen h-screen WaterMovingMiddle" src={"/img/WaterMovingMiddle2.png"} alt={""} layout='fill'/>
            </div>
        </>
    );
}

export function PlayerController() {
    const [keysPressed, setKeysPressed] = React.useState({});

    const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
        setKeysPressed(prev => ({ ...prev, [event.code]: true }));
    }, []);

    const handleKeyUp = React.useCallback((event: KeyboardEvent) => {
        setKeysPressed(prev => ({ ...prev, [event.code]: false }));
    }, []);

    React.useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    return (
        <>
            <Player
                id={"player-0"}
                IsLeft={true}
                keypressed={(keysPressed)}
            />
            <Player
                id={"player-1"}
                IsLeft={false}
                keypressed={(keysPressed)}
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
