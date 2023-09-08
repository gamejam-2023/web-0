'use client'

import React from "react";

export default function Projectile({startX, startY}: {startX: number, startY: number}) {
    const elem = React.useRef(null);
    const [x, set_x] = React.useState(0);
    const [y, set_y] = React.useState(0);

    const client_width = window.innerWidth
    const client_height = window.innerHeight

    // set start position
    React.useEffect(() => {
        set_x(startX);
        set_y(startY);
    }, []);

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
            set_x(x + 5);
        }, 10);
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
            // transition: `transform 100ms ease`
        }}>
            x
            {client_width}
            {client_height}
        </div>
    )
  }