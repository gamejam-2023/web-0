import React from "react";
import Image from "next/image";

interface ExplosionProps {
    x: number;
    y: number;
    
}

export default function Explosion(props: ExplosionProps) {
    // set a time of 1 seconds when the when the 1 second is up, remove the explosion

    const elem = React.useRef(null);

    React.useEffect(() => {
        const interval = setInterval(() => {
            clearInterval(interval);
            // elem.current?.remove();
        }, 1000);
    }, []);

    return (
        <div
            ref={elem}
            className="absolute"
            style={{
                left: `${props.x}%`,
                top: `${props.y}%`,
                width: "5%",   // You can adjust the size
                height: "5%",  // You can adjust the size
                zIndex: 10,
            }}
        >
            <Image
                className="absolute w-screen h-screen explosionAnimation"
                src="/img/HitExplosion.png"
                alt="Explosion"
                layout="fill"
            />
        </div>
    );
}