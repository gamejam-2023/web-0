'use client'

import React from "react";
import Image from "next/image";
import { request } from "http";

export default function Projectile({startX, startY, IsLeft}: {startX: number, startY: number, IsLeft: boolean}) {
    const elem = React.useRef(null);
    const [x, set_x] = React.useState(0);
    const [y, set_y] = React.useState(0);
    let speed = 20;
    if (IsLeft === false) {
        speed = -20;
    }

    if (x == 0 && y == 0)
    {
        if (IsLeft === true) {
            set_x(startX + 100);
        }
        else {
            set_x(startX - 100);
        }
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
        }, 30);

        return () => clearInterval(interval);
    }, [x]);

    return ( 


        <div 
        // ref={elem.current}
        ref = {elem}
        // className="absolute outline-none"
        //         style={{
        //             width: "8%",
        //             height: "25%",
        //             left: `${x / 20}%`,
        //             top: `${y / 20}%`,
        //             willChange: `transform, top, left`,
        //         }}
        className="absolute"
        style={{
            width: "8%",
            height: "25%",
            left: `${x / 20}%`,
            top: `${y / 20}%`,
            // transform: `translate3d(${x}px, ${y}px, 0px)`,
            willChange: `left, top`,
            // transition: `transform 300ms ease`
        }}>
            <Image src="/img/CannonBall.png" alt={""} width={50} height={50} />
        </div>
    )
  }