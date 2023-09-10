import React from 'react';
import Image from 'next/image';
import { GlobalStateContext } from "../layout";

export default function RandomObjSpawn() {
  console.log('RandomObjSpawn');

  const [y1, set_y1] = React.useState(0);
  const [y2, set_y2] = React.useState(0);
  const globalState = React.useContext(GlobalStateContext);

  const [currentObject, setCurrentObject] = React.useState<{ image: string; x: number; y: number } | null>(null);

  if (y1 === 0 && y2 === 0)
    {
        set_y1( 10);

        set_y2(10);
    }

  const spawnableObjects = {
    evilSnake: { image: 'Evil_snake.png', x: 6, y: 24 },
    Log: { image: 'Log.png', x: 20, y: 12 },
    Rock: { image: 'Rock.png', x: 20, y: 12 },
    Rocks: { image: 'Rocks.png', x: 20, y: 12 },
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
        set_y(prevX => {
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
        return () => clearInterval(interval);
    }, 40);

    // This will clear the interval when the component is unmounted
    return () => clearInterval(interval);

}, [x]);

  React.useEffect(() => {
    function spawnRandomObject() {
      const randomIndex = Math.floor(Math.random() * Object.keys(spawnableObjects).length);
      const randomKey = Object.keys(spawnableObjects)[randomIndex];
      setCurrentObject(spawnableObjects.evilSnake);
    }

    

    spawnRandomObject();
    const interval = setInterval(spawnRandomObject, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!currentObject) return null;

  return (
    <div
      className="absolute"
      style={{
        left: `0%`,
        top:  `0%`,
        width: `${currentObject.x}%`,
        height: `${currentObject.y}%`,
      }}
    >
      <Image
        className="absolute w-screen h-screen"
        src={`/img/${currentObject.image}`}
        alt="Spawned Object"
        layout="fill"
      />
    </div>
  );
}
