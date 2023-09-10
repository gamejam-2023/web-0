import React from 'react';

interface Movement {
    ArrowDown: boolean;
    ArrowUp: boolean;
    ArrowLeft: boolean;
    ArrowRight: boolean;
    KeyS: boolean;
    KeyW: boolean;
    KeyA: boolean;
    KeyD: boolean;
    Space: boolean;
    Enter: boolean;
}

interface Velocity {
    x: number;
    y: number;
}

export const handleMovement = (
    keys: Movement,
    isLeft: boolean,
    velocity: Velocity,
    setVelocity: React.Dispatch<React.SetStateAction<Velocity>>
) => {
    const MOVE_AMOUNT = 0.1;
    const directions: { [key: string]: { x: number; y: number } } = {
        ArrowDown: { x: 0, y: MOVE_AMOUNT },
        ArrowUp: { x: 0, y: -MOVE_AMOUNT },
        ArrowLeft: { x: -MOVE_AMOUNT, y: 0 },
        ArrowRight: { x: MOVE_AMOUNT, y: 0 },
        KeyS: { x: 0, y: MOVE_AMOUNT },
        KeyW: { x: 0, y: -MOVE_AMOUNT },
        KeyA: { x: -MOVE_AMOUNT, y: 0 },
        KeyD: { x: MOVE_AMOUNT, y: 0 },
    };

    const updateDir = isLeft
        ? ["KeyS", "KeyW", "KeyA", "KeyD"]
        : ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];

    updateDir.forEach((dir) => {
        if (keys[dir as keyof Movement]) {
            setVelocity((prev) => ({
                x: prev.x + directions[dir].x,
                y: prev.y + directions[dir].y,
            }));
        }
    });
};

export type{ Movement, Velocity }; // Export the interfaces for use in the main file.