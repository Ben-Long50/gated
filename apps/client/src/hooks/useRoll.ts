import { useRef, useState } from 'react';

const useRoll = () => {
  const [rolls, setRolls] = useState(new Map());
  const [rolling, setRolling] = useState(false);
  const [rollCounter, setRollCounter] = useState(0);
  const [rollComplete, setRollComplete] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const animateRoll = (rollMap): Promise<number> => {
    setRollComplete(false);
    setRolling(true);

    return new Promise((resolve) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      let count = 1;
      const maxRolls = 18;

      const rollOnce = () => {
        const fakeRollMap = new Map();
        for (const [key, value] of rollMap) {
          const fakeDiceArray = Array.from(
            { length: value.diceArray.length },
            () => Math.floor(Math.random() * 6) + 1,
          );

          fakeRollMap.set(key, { ...value, diceArray: fakeDiceArray });
        }

        if (count < maxRolls) {
          setRolls(fakeRollMap);
          count++;
        }

        if (count >= maxRolls) {
          const sortedRollMap = new Map(
            [...rollMap.entries()].sort(
              (a, b) => b[1].successes - a[1].successes,
            ),
          );

          setRolls(sortedRollMap);
          setRollComplete(true);
          setRolling(false);
          setRollCounter((prev) => prev + 1);
          resolve(rollMap);

          return;
        }

        const delay = count * 15;
        timeoutRef.current = setTimeout(rollOnce, delay);
      };

      rollOnce();
    });
  };

  return {
    rolls,
    rolling,
    animateRoll,
    rollComplete,
    rollCounter,
  };
};

export default useRoll;
