'use client'

import React from "react";
import Image from "next/image";
import { GlobalStateContext } from "../layout";

export default function RandomObj() {
    const elem = React.useRef(null);
    const [x0, set_x0] = React.useState(20);
    const [y0, set_y0] = React.useState(0);
    const [x1, set_x1] = React.useState(80);
    const [y1, set_y1] = React.useState(0);

    // const globalState = React.useContext(GlobalStateContext);
    const SPEED = 1;


    React.useEffect(() => {
        const interval = setInterval(() => {
            set_x(prevX => {
                const newX = UpdateX(prevX);
                
                // Check condition here, and clear interval if condition is met
                if (newX >= 100 || newX <= 1) {
                    clearInterval(interval);
                    //@ts-ignore
                    elem.current?.remove();
                    return false
                }
    
                return newX;
            });
        }, 30);
    
        // This will clear the interval when the component is unmounted
        return () => clearInterval(interval);
    
    }, [x]);  
    
    function UpdateX(prevX: number): number {
        // console.log("prevX: " + prevX);
        const Player_other_x = IsLeft === true ? globalState[2] : globalState[0];
        const Player_other_y = IsLeft === true ? globalState[3] : globalState[1];
        console.log("Player_other_y: " + Player_other_y[0]);
        if (prevX > Player_other_x[0] && prevX < Player_other_x[0] + 6 && y > Player_other_y[0] && y < Player_other_y[0] + 20) {
            console.log("hit");
            Health_other[1](Health_other[0] - 10)
            return -100;
        }

        return prevX + speed;
    }

    return ( 


        <div 
        ref = {elem}
        className="absolute"
        style={{
            width: "8%",
            height: "25%",
            left: `${x1}%`,
            top: `${y1}%`,
            // transform: `translate3d(${x}px, ${y}px, 0px)`,
            willChange: `left, top`,
            // transition: `transform 300ms ease`
        }}>
            <Image src="/img/Evil_Snake.png" alt={""} />
        </div>
        
    )
  }