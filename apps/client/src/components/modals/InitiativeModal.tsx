import { Fragment } from 'react/jsx-runtime';
import Modal from './Modal';
import Divider from '../Divider';
import BtnRect from '../buttons/BtnRect';
import { useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Loading from '../Loading';
import useCombatStore from 'src/stores/combatStore';
import CharacterInitiativeRoll from '../maps/CharacterInitiativeRoll';

const InitiativeModal = () => {
  const [rollingInitiative, setRollingInitiative] = useState(false);
  const [rollCounter, setRollCounter] = useState(0);
  const navigate = useNavigate();
  const rollRefs = useRef([]);

  const { advanceTurn, characterIds } = useOutletContext() || {};

  const turnOrder = useCombatStore((state) => state.turnOrder);
  const setTurnOrder = useCombatStore((state) => state.setTurnOrder);

  const rollInitiative = async () => {
    setRollingInitiative(true);
    const rollAll = async (ids?: []) => {
      const rolls = rollRefs.current
        .map((ref) => {
          if (ref?.roll && !ids) {
            return ref.roll();
          } else if (ids?.includes(ref.characterId)) {
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
    setRollingInitiative(false);
    setRollCounter((prev) => prev + 1);
  };

  return (
    <Modal>
      <h1>Initiative Rolls</h1>
      <div className="flex w-full flex-col gap-2">
        {characterIds?.map((characterId, index) => (
          <Fragment key={characterId}>
            <CharacterInitiativeRoll
              ref={(ref) => {
                rollRefs.current[index] = ref;
              }}
              characterId={characterId}
            />
            {index < characterIds.length - 1 && <Divider />}
          </Fragment>
        ))}
      </div>
      <div className="flex w-full items-center gap-8">
        <BtnRect
          className="group w-full"
          ariaLabel="Roll initiative"
          type="button"
          onClick={() => {
            if (!rollingInitiative) {
              rollInitiative();
            }
          }}
        >
          {rollingInitiative ? (
            <Loading
              className="group-hover:text-accent text-zinc-950"
              size={1.15}
            />
          ) : !rollingInitiative && rollCounter > 0 ? (
            'Reroll Initiative'
          ) : (
            'Roll Initiative'
          )}
        </BtnRect>
        {rollCounter > 0 && (
          <BtnRect
            className={`${rollingInitiative && 'pointer-events-none opacity-50'} w-full`}
            ariaLabel="Start combat"
            type="button"
            onClick={() => {
              advanceTurn();
              navigate(-1);
            }}
          >
            Start Combat
          </BtnRect>
        )}
      </div>
    </Modal>
  );
};

export default InitiativeModal;
