'use client'

//Nautical Nemeses legit
//Buccaneer's Bounty

import React from "react";
import Image from "next/image";
import Projectile from "./shooting";
import { GlobalStateContext } from "../layout";
import { useRouter } from "next/navigation";

interface Movement {
    ArrowDown: boolean;
    ArrowUp: boolean;
    ArrowLeft: boolean;
    ArrowRight: boolean;
    KeyS: boolean;
    KeyW: boolean;
    KeyA: boolean;
    KeyD: boolean;
    Space: boolean;
    Enter: boolean;
  }
  
  interface PlayerProps {
    id: string;
    IsLeft: boolean;
    keypressed: Movement;
  }
  
  interface Velocity {
    x: number;
    y: number;
  }
  
  interface GameState {
    x: number;
    y: number;
    velocity: Velocity;
    health: number;
    cannonBallAmmo: number;
  }

  const handleMovement = (
    keys: Movement,
    isLeft: boolean,
    velocity: Velocity,
    setVelocity: React.Dispatch<React.SetStateAction<Velocity>>
  ) => {
    const MOVE_AMOUNT = 0.1;
    const directions: { [key: string]: { x: number; y: number } } = {
      ArrowDown: { x: 0, y: MOVE_AMOUNT },
      ArrowUp: { x: 0, y: -MOVE_AMOUNT },
      ArrowLeft: { x: -MOVE_AMOUNT, y: 0 },
      ArrowRight: { x: MOVE_AMOUNT, y: 0 },
      KeyS: { x: 0, y: MOVE_AMOUNT },
      KeyW: { x: 0, y: -MOVE_AMOUNT },
      KeyA: { x: -MOVE_AMOUNT, y: 0 },
      KeyD: { x: MOVE_AMOUNT, y: 0 },
    };


  const updateDir = isLeft
  ? ["KeyS", "KeyW", "KeyA", "KeyD"]
  : ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];

updateDir.forEach((dir) => {
  if (keys[dir as keyof Movement]) {
    setVelocity((prev) => ({
      x: prev.x + directions[dir].x,
      y: prev.y + directions[dir].y,
    }));
  }
});
};

function Player(props: PlayerProps) {
    interface ProjectileData {
        startX: number;
        startY: number;
    }
    
    const INITIAL_POSITION = React.useMemo(() => (
        props.IsLeft ? { x: 20, y: 20 } : { x: 80, y: 20 }
    ), [props.IsLeft]);

    const MAX_CANNONBALL_AMO = 5;
    const PullForce = 0.005;
    const RECOIL_FORCE = 0.2; 

    const { IsLeft, keypressed, id } = props;

    const elem = React.useRef<HTMLSpanElement>(null);
    const [PlayerX, setX] = React.useState(INITIAL_POSITION.x);
    const [PlayerY, setY] = React.useState(INITIAL_POSITION.y);
    const [projectiles, setProjectiles] = React.useState<ProjectileData[]>([]);
    const [velocity, setVelocity] = React.useState({ x: 0, y: 0 });
    const [isLocked, setLock] = React.useState(false);
    const [CannonBallAmo, setCannonBallAmo] = React.useState(MAX_CANNONBALL_AMO);

    const boatSrc = IsLeft ? "/img/BoatBlue.png" : "/img/BoatRed.png";
    const globalState = React.useContext(GlobalStateContext);
    const health = IsLeft ? globalState[4] : globalState[5];


    const healthBarStyle = {
        height: '100%',
        width: `${health[0]}%`,
        backgroundColor: getHealthColor(health[0]),
        transition: 'width 0.3s ease'
    };


    const fire = () => {
        if (CannonBallAmo > 0){
            setProjectiles(prev => [...prev, { startX: PlayerX, startY: PlayerY }]);
            setCannonBallAmo(prev => prev - 1);
            
            if (IsLeft) {
                setVelocity(prev => ({
                    x: prev.x - RECOIL_FORCE,  // Push the player to the left when they are on the left side
                    y: prev.y
                }));
            } else {
                setVelocity(prev => ({
                    x: prev.x + RECOIL_FORCE,  // Push the player to the right when they are on the right side
                    y: prev.y
                }));
            }

            if (!isLocked) {
                reloadConnonBalls();
            }
        }
    };

    React.useEffect(() => {
        handleMovement(keypressed, IsLeft, velocity, setVelocity);
        if (keypressed.Space && IsLeft) fire();
        if (keypressed.Enter && !IsLeft) fire();
    }, [keypressed]);

    function reloadConnonBalls() {
        setLock(true);
        setTimeout(() => {
            setCannonBallAmo(MAX_CANNONBALL_AMO);
            setLock(false);
        }, 3000);
    }

    if (PlayerX === 0 && PlayerY === 0)
    {
        if (props.IsLeft === true) {
            setX(20);
            setY(20);
        }
        else {
            setX(80);
            setY(20);
        }
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
        if (prevY > 83)
        {
        useRouter().push(`/game/over?loser=${props.id}`);
    }

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
            useRouter().push(`/game/over?loser=${props.id}`);
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
            setX(prevX => UpdateX(prevX));
            setY(prevY => UpdateY(prevY));
        }, 30);
        return () => clearInterval(interval);
    }, [velocity]);

    return (
        <>
            <span className="absolute" style={{
                // right: '50',
                left: `${PlayerX}%`,
                top: `${PlayerY}%`,
                 color: 'white'
                 }}>{CannonBallAmo}</span>
            
            <span
                id = {"player"}
                ref={elem}
                className="absolute outline-none"
                style={{
                    width: "8%",
                    height: "25%",
                    left: `${PlayerX}%`,
                    top: `${PlayerY}%`,
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
                    src={boatSrc}
                    alt={""}
                    layout="fill"
                />

                <div className="health-bar-container">
                    <div style={healthBarStyle}></div>
                </div>
                
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
                keypressed={keysPressed}
            />
            <Player
                id={"player-1"}
                IsLeft={false}
                keypressed={keysPressed}
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
