import {
  RollData,
  RollResult,
  RollResultData,
  RollResultMap,
} from '@gated/shared';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from 'src/socket';

const useRoll = () => {
  const { encounterId } = useParams();
  const [rolls, setRolls] = useState<RollResultMap>(new Map());
  const [rollOptions, setRollOptions] = useState<Map<number, RollData>>(
    new Map(),
  );
  const [rolling, setRolling] = useState(false);
  const [rollCounter, setRollCounter] = useState(0);
  const [rollComplete, setRollComplete] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const animateRoll = (rollMap: RollResultMap): Promise<number> => {
    setRollComplete(false);
    setRolling(true);

    return new Promise((resolve) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      let count = 1;
      const maxRolls = 30;

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

        const delay = 50;
        timeoutRef.current = setTimeout(rollOnce, delay);
      };

      rollOnce();
    });
  };

  const setRoll = (characterId: number, rollResultData: RollResult) => {
    setRolls((prev) => {
      const newResults = new Map(prev);
      newResults.set(characterId, rollResultData);

      return newResults;
    });
  };

  const setOption = (characterId: number, rollData: RollData) => {
    setRollOptions((prev) => {
      const newOptions = new Map(prev);
      newOptions.set(characterId, rollData);

      socket.emit('updateRollOptions', {
        encounterId,
        rollOptionData: Array.from(newOptions),
      });

      return newOptions;
    });
  };

  const syncRolls = async (rollResultData: RollResultData) => {
    const newRollMap = new Map(rollResultData);
    await animateRoll(newRollMap);
  };

  const resetOptions = () => {
    setRollOptions(new Map());
  };

  const resetRolls = () => {
    setRolls(new Map());
  };

  return {
    rolls,
    rollOptions,
    setRoll,
    setOption,
    syncRolls,
    rolling,
    animateRoll,
    resetRolls,
    resetOptions,
    rollComplete,
    rollCounter,
    setRolls,
    setRollOptions,
  };
};

export default useRoll;
