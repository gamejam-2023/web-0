import React from 'react';
import Image from 'next/image';

interface RandomObjSpawnProps {
  IsLeft: boolean;
}

export default function RandomObjSpawn({ IsLeft }: RandomObjSpawnProps) {
  console.log('RandomObjSpawn');
  const [currentObject, setCurrentObject] = React.useState<string>('');

  const spawnableObjects = ['Evil_snake.png', 'Log.png', 'Rock.png', 'Rocks.png'];

  React.useEffect(() => {
    function spawnRandomObject() {
      const randomIndex = Math.floor(Math.random() * spawnableObjects.length);
      setCurrentObject(spawnableObjects[randomIndex]);
    }

    spawnRandomObject();

    const interval = setInterval(spawnRandomObject, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute"
      style={{
        left: `${IsLeft ? 0 : 50}%`,
        top: `${0}%`,
        width: '20%',
        height: '20%',
      }}
    >
      <Image
        className="absolute w-screen h-screen wavesAnimation"
        src={`/img/${currentObject}`}
        alt="Spawned Object"
        layout="fill"
      />
    </div>
  );
}
