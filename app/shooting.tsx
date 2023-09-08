import React from "react";

export default function Projectile() {
    const [x, set_x] = React.useState(0);
    const [y, set_y] = React.useState(0);

    // setInterval(() => {
    //     set_x(x + 5);
    // }, 100);

    // alternatic
    React.useEffect(() => {
        const interval = setInterval(() => {
            set_x(x + 5);
        }, 10);
        return () => clearInterval(interval);
    }, [x]);


    return (


        <div 
        className="absolute"
        style={{
            transform: `translate3d(${x}px, ${y}px, 0px)`,
            willChange: `transform`,
            // transition: `transform 100ms ease`
        }}>
            x
        </div>
    )
  }