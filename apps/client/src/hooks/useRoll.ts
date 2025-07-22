import { useRef, useState } from 'react';
import useCombatStore from 'src/stores/combatStore';
import {
  AttributeName,
  AttributeTree,
  SkillName,
} from 'src/types/attributeTree';

const useRoll = () => {
  const [diceArray, setDiceArray] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);
  const [successes, setSuccesses] = useState(<number | null>null);

  const timeoutRef = useRef<number | null>(null);
  const setDamage = useCombatStore((state) => state.setDamage);

  const rollResult = (diceCount: number) => {
    return Array.from(
      { length: diceCount },
      () => Math.floor(Math.random() * 6) + 1,
    );
  };

  const animateRoll = (result: number[]): Promise<number[]> => {
    return new Promise((resolve) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      let count = 1;
      const maxRolls = 18;

      setRolling(true);

      const rollOnce = () => {
        const dieArray = Array.from(
          { length: result.length },
          () => Math.floor(Math.random() * 6) + 1,
        );

        if (count < maxRolls) {
          setDiceArray(dieArray);
          count++;
        }

        if (count >= maxRolls) {
          setRolling(false);
          setDiceArray(result);
          resolve(result);
          return;
        }

        const delay = count * 10;
        timeoutRef.current = setTimeout(rollOnce, delay);
      };

      rollOnce();
    });
  };

  const calculateRoll = (
    attributes: AttributeTree,
    rolls: { attribute: string; skill: string }[],
    modifiers: string[],
  ) => {
    if (!rolls) {
      setSuccesses(0);
      return;
    }

    const calculatedRolls = rolls.map((roll) => {
      const attributePoints =
        attributes[roll.attribute as AttributeName].points;
      const skillPoints =
        attributes[roll.attribute as AttributeName].skills[
          roll.skill as SkillName
        ].points;
      return {
        diceCount: attributePoints + skillPoints,
        roll,
      };
    });

    const bestRoll = calculatedRolls.sort(
      (a, b) => b.diceCount - a.diceCount,
    )[0];

    if (modifiers.includes('push')) {
      bestRoll.diceCount += 2;
    }

    const result = rollResult(bestRoll.diceCount);

    let successes = 0;
    successes += result.filter((number) => number >= 5).length;
    if (modifiers.includes('booming')) {
      successes += result.filter((number) => number === 6).length;
    }
    if (modifiers.includes('dooming')) {
      successes -= result.filter((number) => number === 1).length;
    }
    if (modifiers.includes('lucky') && !modifiers.includes('unlucky')) {
      successes += result.filter((number) => number === 4).length;
    }
    if (modifiers.includes('unlucky') && !modifiers.includes('lucky')) {
      successes -= result.filter((number) => number === 5).length;
    }

    return { result, successes };
  };

  const calculateSuccesses = async (
    roll: {
      result: number[];
      successes: number;
    },
    damage: number,
  ) => {
    console.log(roll, damage);

    await animateRoll(roll.result);

    setDamage(damage);
    setSuccesses(roll.successes);
    return roll.successes;
  };

  return {
    diceArray,
    setDiceArray,
    rolling,
    calculateRoll,
    calculateSuccesses,
    successes,
  };
};

export default useRoll;
