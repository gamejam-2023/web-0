'use client'

//Nautical Nemeses legit
import React from "react";
import Image from "next/image";
import Projectile from "./shooting";
import { GlobalStateContext } from "../layout";
import { useRouter } from "next/navigation";
import Background from "./background";
import { AudioSystem, IAudio } from '@/lib/AudioSystem';
import Explosion from "./explosion";
import ShootEffect from "./shootEffect";

const audio = new Map<string, IAudio>();

const themeAudio = '/sfx/theme-loop-1.wav';
audio.set(themeAudio, new AudioSystem({ fileName: themeAudio, volume: 0.15 }));
audio.get(themeAudio)?.loop();

const creakAudio = '/sfx/creak-0.wav';
audio.set(creakAudio, new AudioSystem({ fileName: creakAudio, volume: 0.25 }));
audio.get(creakAudio)?.loop();

const shotAudio = '/sfx/shot-1.wav';
audio.set(shotAudio, new AudioSystem({ fileName: shotAudio, volume: 1 }));

// at the top of your original file
import { handleMovement, Movement, Velocity } from './movement';
import RandomObjSpawn from "./RandomOpjSpawn";

interface PlayerProps {
    id: string;
    IsLeft: boolean;
    keypressed: Movement;
    sendMessageDirect?: (message: string) => Promise<void>;
    chatMessagesObj?: Record<string, string>;
    userName?: string;
}

interface ProjectileData {
    startX: number;
    startY: number;
}

interface ExplosionProps {
    x: number;
    y: number;
}

interface ShootEffectProps {
    x: number;
    y: number;
    Isleft: boolean;
}

export function Player(props: PlayerProps) {
    const MAX_CANNONBALL_AMO = 5;
    const PullForce = 0.005;
    const RECOIL_FORCE = 0.05;

    // const { IsLeft, keypressed, id } = props;

    const elem = React.useRef<HTMLSpanElement>(null);
    const [projectiles, setProjectiles] = React.useState<ProjectileData[]>([]);
    const [velocity, setVelocity] = React.useState({ x: 0, y: 0 });
    const [isLocked, setLock] = React.useState(false);
    const [CannonBallAmo, setCannonBallAmo] = React.useState(MAX_CANNONBALL_AMO);
    const [randomObj, setRandomObj] = React.useState(null);
    const router = useRouter();

    const [boatSrc, setboatSrc] = React.useState(props.IsLeft ? "/img/BoatBlue.png" : "/img/BoatRed.png");

    const globalState = React.useContext(GlobalStateContext);

    const health = props.IsLeft ? globalState.player0Health : globalState.player1Health;
    const set_health = props.IsLeft ? globalState.setPlayer0Health : globalState.setPlayer1Health;

    const PlayerX = props.IsLeft ? globalState.player0X : globalState.player1X;
    const PlayerY = props.IsLeft ? globalState.player0Y : globalState.player1Y;

    const setX = props.IsLeft ? globalState.setPlayer0X : globalState.setPlayer1X;
    const setY = props.IsLeft ? globalState.setPlayer0Y : globalState.setPlayer1Y;

    const [explosion, setExplosion] = React.useState<ExplosionProps[]>([]);
    const [shootEffect, setShootEffect] = React.useState<ShootEffectProps[]>([]);

    const healthBarStyle = {
        height: '100%',
        width: `${health}%`,
        backgroundColor: getHealthColor(health),
        transition: 'width 0.3s ease'
    };

    const fire = () => {
        if (CannonBallAmo > 0) {
            audio.get(shotAudio)?.play();

            setShootEffect(prev => [...prev, { x: PlayerX, y: PlayerY }])
            setProjectiles(prev => [...prev, { startX: PlayerX, startY: PlayerY }]);
            setCannonBallAmo(prev => prev - 1);

            if (props.IsLeft) {
                setX(prev => prev - 0.2);
                setVelocity(prev => ({
                    x: prev.x - RECOIL_FORCE,  // Push the player to the left when they are on the left side
                    y: prev.y
                }));
            } else {
                setX(prev => prev + 0.2);
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
        handleMovement(props.keypressed, props.IsLeft, velocity, setVelocity);
        if (props.keypressed.Space && props.IsLeft) fire();
        if (props.keypressed.Enter && !props.IsLeft) fire();

        if (props.keypressed.Escape) {
            router.push(`/game/pause`);
        }
        props.sendMessageDirect?.(JSON.stringify(props.keypressed));
    }, [props.keypressed]);

    function reloadConnonBalls() {
        setLock(true);
        setTimeout(() => {
            setCannonBallAmo(MAX_CANNONBALL_AMO);
            setLock(false);
        }, 3000);
    }

    if (PlayerX === 0 && PlayerY === 0) {
        if (props.IsLeft === true) {
            setX(20);
            setY(20);
        }
        else {
            setX(80);
            setY(20);
        }
    }

    function UpdateX(prevX: number) {
        if (prevX < -3 && props.IsLeft === true) {
            set_health(health - 9);
            velocity.x = velocity.x * -1;
            prevX = -3;
        }
        if (prevX > 94 && props.IsLeft === false) {
            set_health(health - 9);
            velocity.x = velocity.x * -1;
            prevX = 94;
        }
        if (prevX > 40 && props.IsLeft === true) {
            set_health(health - 9);
            velocity.x = velocity.x * -1;
            prevX = 40;
        }
        if (prevX < 52 && props.IsLeft === false) {
            set_health(health - 9);
            velocity.x = velocity.x * -1;
            prevX = 52;
        }

        return prevX + velocity.x;
    }

    function UpdateY(prevY: number): number {
        if (prevY < -1) {
            set_health(health - 9);
            velocity.y = velocity.y * -1;
        }
        if (prevY > 83) {
            router.push(`/game/over?loser=${props.id}`);
        }

        velocity.y = velocity.y + PullForce;

        return prevY + velocity.y;
    }

    function getHealthColor(health: number): string {
        if (health <= 0) {
            router.push(`/game/over?loser=${props.id}`);
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

    if (health > 60) {

    }
    else if (health > 25) {
        if (boatSrc !== "/img/BoatBlueDamaged.png" || boatSrc !== "/img/BoatRedDamaged.png" )
        {
            setboatSrc(props.IsLeft ? "/img/BoatBlueDamaged.png" : "/img/BoatRedDamaged.png");
        }
    } else {
        if (boatSrc !== "/img/BoatBlueVeryDamaged.png" || boatSrc !== "/img/BoatRedVeryDamaged.png" )
        {
            setboatSrc(props.IsLeft ? "/img/BoatBlueVeryDamaged.png" : "/img/BoatRedVeryDamaged.png");
        }
    }
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
                id={"player"}
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
                    src={"/img/BoarWaterMove2.png"}
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
                <Projectile key={index} startX={proj.startX} startY={proj.startY} IsLeft={props.IsLeft} setExplosion={setExplosion} />
            ))}

            {explosion?.map((ex, index) => (
                <Explosion key={index} x={ex.x} y={ex.y} />
            ))}

            {shootEffect?.map((ex, index) => (
                <ShootEffect key={index} x={ex.x} y={ex.y} Isleft={props.IsLeft} />
            ))}

            {/* {projectiles?.map((_, index) => (
                <RandomObjSpawn key={index}/>
            ))} */}

        </>
    );
}

interface PlayerControllerProps {
    sendMessageDirect?: (message: string) => Promise<void>;
    chatMessagesObj?: Record<string, string>;
    userName?: string;
}

export function PlayerController(props: PlayerControllerProps) {
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
                sendMessageDirect={props.sendMessageDirect}
                chatMessagesObj={props.chatMessagesObj}
                userName={props.userName}
            />
            <Player
                id={"player-1"}
                IsLeft={false}
                keypressed={keysPressed}
                sendMessageDirect={props.sendMessageDirect}
                chatMessagesObj={props.chatMessagesObj}
                userName={props.userName}
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
