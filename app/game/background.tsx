import React from 'react';
import Image from "next/image";

export function Background() {
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

export default Background;