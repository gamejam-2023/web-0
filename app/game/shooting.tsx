'use client'

import React from "react";
import Image from "next/image";
import { GlobalStateContext } from "../layout";



export default function Projectile({startX, startY, IsLeft, setExplosion
}: {startX: number, startY: number, IsLeft: boolean, setExplosion: any}) {
    const elem = React.useRef(null);
    const [x, set_x] = React.useState(0);
    const [y, set_y] = React.useState(0);
    const globalState = React.useContext(GlobalStateContext);
    const speed = IsLeft === true ? 1 : -1;

    if (x === 0 && y === 0)
    {
        if (IsLeft === true) {
            set_x(startX + 5);
            set_y(startY + 10);

        }
        else {
            set_x(startX);
            set_y(startY + 10);
        }
    }

    const Health_other = IsLeft === true ? globalState[5] : globalState[4];


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
        }, 40);
    
        // This will clear the interval when the component is unmounted
        return () => clearInterval(interval);
    
    }, [x]);  
    
    function UpdateX(prevX: number): number {
        // console.log("prevX: " + prevX);
        const Player_other_x = IsLeft === true ? globalState[2] : globalState[0];
        const Player_other_y = IsLeft === true ? globalState[3] : globalState[1];
        // console.log("Player_other_y: " + Player_other_y[0]);
        if (prevX > Player_other_x[0] && prevX < Player_other_x[0] + 6 && y > Player_other_y[0] && y < Player_other_y[0] + 20) {
            // console.log("hit");
            Health_other[1](Health_other[0] - 10)
            setExplosion(prev => [...prev, { x: prevX, y: y }]);
            // return -100;
        }
        // console.log(elem.current?.parentNode);
        //how to set an object inside the parent div
        return prevX + speed;
    }

    return ( 

        <div 
            ref = {elem}

            className="absolute"
            
            style={{
                width: "2%",
                height: "3%",
                left: `${x}%`,
                top: `${y}%`,
                willChange: `left, right`
            }}>
                <Image src="/img/CannonBall.png" alt={""} fill={true} />
                
        </div>
        
    )
  } 