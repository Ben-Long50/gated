import { Fragment } from 'react/jsx-runtime';
import CharacterRoll from '../maps/CharacterRoll';
import Modal from './Modal';
import Divider from '../Divider';
import BtnRect from '../buttons/BtnRect';
import { useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

const InitiativeModal = () => {
  const rollRefs = useRef([]);

  const { turnOrder, setTurnOrder } = useOutletContext() || {};

  const initiativeRoll = async () => {
    const rollAll = async (characterIds?: []) => {
      const rolls = rollRefs.current
        .map((ref) => {
          if (ref?.roll && !characterIds) {
            return ref.roll();
          } else if (characterIds?.includes(ref.characterId)) {
            return ref.roll();
          }
        })
        .filter((roll) => roll != null);

      const results = (await Promise.all(rolls)) as {
        characterId: number;
        playerCharacter: boolean;
        successes: number;
      }[];

      const sortedResults = results.sort((a, b) => b.successes - a.successes);

      const ties = new Map();

      sortedResults.map((result) => {
        if (!ties.get(result.successes)) {
          ties.set(result.successes, [result]);
        } else {
          const old = ties.get(result.successes);
          ties.set(result.successes, [...old, result]);
        }
      });

      let newResults = [] as {
        characterId: number;
        name: string;
        playerCharacter: boolean;
        successes: number;
      }[];

      for (const tie of ties.values()) {
        if (tie.length > 1) {
          const result = await rollAll(tie.map((result) => result.characterId));
          newResults = [...newResults, ...result];
        } else {
          newResults = [...newResults, tie[0]];
        }
      }

      return newResults;
    };

    const results = await rollAll();

    let resultsOrder = results.splice(0, 1);

    const remainingPcs =
      results.filter((result) => result.playerCharacter) || [];
    const remainingNpcs =
      results.filter((result) => !result.playerCharacter) || [];

    for (let i = 0; i < results.length; i++) {
      let previous = resultsOrder[i].playerCharacter;

      if (previous && remainingNpcs.length > 0) {
        resultsOrder = [...resultsOrder, ...remainingNpcs.splice(0, 1)];
      } else if (!previous && remainingPcs.length > 0) {
        resultsOrder = [...resultsOrder, ...remainingPcs.splice(0, 1)];
      } else if (remainingNpcs.length > 0 && remainingPcs.length === 0) {
        resultsOrder = [...resultsOrder, ...remainingNpcs.splice(0, 1)];
      } else if (remainingNpcs.length === 0 && remainingPcs.length > 0) {
        resultsOrder = [...resultsOrder, ...remainingNpcs.splice(0, 1)];
      }
    }

    setTurnOrder(resultsOrder.map((result) => result.characterId));
  };

  return (
    <Modal>
      <h1>Initiative Rolls</h1>
      <div className="flex w-full flex-col gap-2">
        {turnOrder?.map((characterId, index) => (
          <Fragment key={characterId}>
            <CharacterRoll
              ref={(ref) => {
                rollRefs.current[index] = ref;
              }}
              characterId={characterId}
            />
            {index < turnOrder.length - 1 && <Divider />}
          </Fragment>
        ))}
      </div>
      <BtnRect
        className="w-full"
        ariaLabel="Roll initiative"
        type="button"
        onClick={() => {
          initiativeRoll();
        }}
      >
        Roll Initiative
      </BtnRect>
    </Modal>
  );
};

export default InitiativeModal;
