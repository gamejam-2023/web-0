'use client'

import React from "react";
import Image from "next/image";

export default function Projectile({startX, startY, IsLeft}: {startX: number, startY: number, IsLeft: boolean}) {
    const elem = React.useRef(null);
    const [x, set_x] = React.useState(0);
    const [y, set_y] = React.useState(0);
    let speed = 70;
    if (IsLeft === false) {
        speed = -70;
    }

    if (x == 0 && y == 0)
    {
        set_x(startX);
        set_y(startY);
    }
    const client_width = window.innerWidth
    const client_height = window.innerHeight

    React.useEffect(() => {

        if  (x > client_width || x < 0) { 
            //@ts-ignore
            elem.current?.remove();
        }
        if  (y > client_height || y < 0) {
            //@ts-ignore
            elem.current?.remove();
        }


        const interval = setInterval(() => {
            set_x(x + speed);
        }, 70);
        //
        return () => clearInterval(interval);
    }, [x]);

    return ( 


        <div 
        // ref={elem.current}
        ref = {elem}
        className="absolute"
        style={{
            transform: `translate3d(${x}px, ${y}px, 0px)`,
            willChange: `transform`,
            transition: `transform 300ms ease`
        }}>
            <Image src="/img/CannonBall.png" alt={""} width={50} height={50} />
        </div>
    )
  }