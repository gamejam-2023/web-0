import React from "react";
import Image from "next/image";

interface ShootEffectProps {
    x: number;
    y: number;
    Isleft: boolean;
}

export default function ShootEffect(props: ShootEffectProps) {
    // set a time of 1 seconds when the when the 1 second is up, remove the explosion

    const elem = React.useRef(null);
    const x = props.Isleft === true ? props.x + 5 : props.x;
    const y = props.Isleft === true ? props.y + 10 : props.y + 10;
    const rotation = props.Isleft === true ? "90deg" : "-90deg";

    return (
        <div
            ref={elem}
            className="absolute"
            style={{
                left: `${x}%`,
                top: `${y}%`,
                width: "5%",   // You can adjust the size
                height: "5%",  // You can adjust the size
                zIndex: 10,
                rotate: `${rotation}`,
            }}
        >
            <Image
                className="absolute w-screen h-screen explosionAnimation"
                src="/img/ShootEffect.png"
                alt="Explosion"
                layout="fill"
            />
        </div>
    );
}