import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from '../CharacterPictureRound';
import ArrowHeader3 from '../ArrowHeader3';
import useAttributeTree from 'src/hooks/useAttributeTree';
import Die from './Die';
import DieIcon from '../icons/DieIcon';
import {
  Ref,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import Loading from '../Loading';
import { LayoutContext } from 'src/contexts/LayoutContext';
import { Action } from 'src/types/action';
import { CampaignContext } from 'src/contexts/CampaignContext';

const CharacterInitiativeRoll = ({
  characterId,
  ref,
  calculateRoll,
  animateRoll,
  rollData,
}: {
  characterId: number;
  ref: Ref;
  calculateRoll: (
    attributes: AttributeTree,
    action: Partial<Action>,
    modifiers: string[],
  ) => { result: number[]; successes: number };
  animateRoll: (
    characterId: number,
    roll: {
      result: number[];
      successes: number;
    },
  ) => Promise<number>;
  rollData: Map<
    number,
    { diceArray: number[]; rolling: boolean; successes: number }
  >;
}) => {
  const { mobile } = useContext(LayoutContext);
  const { rollComplete } = useContext(CampaignContext);
  const { filteredCharacter: character, isLoading } = useCharacter(characterId);
  const [roll, setRoll] = useState<any>(null);

  const { emptyAttributeTree } = useAttributeTree();

  const violenceRolls = Object.keys(emptyAttributeTree.violence.skills).map(
    (skill) => ({ attribute: 'violence', skill }),
  );

  const rollInitiative = async () => {
    const rollResults = calculateRoll(
      character?.attributes,
      { roll: violenceRolls },
      [],
    ) || { result: [], successes: 0 };

    const successes = await animateRoll(characterId, rollResults);

    return {
      characterId,
      name: character?.firstName,
      playerCharacter: character?.playerCharacter,
      successes,
    };
  };

  useEffect(() => {
    if (rollData) {
      setRoll(rollData.get(characterId));
    }
  }, [rollData]);

  useImperativeHandle(ref, () => ({
    rollInitiative,
    characterId,
  }));

  if (isLoading) return <Loading size={2} />;

  return (
    <div className="flex flex-col justify-between gap-4 sm:grid sm:grid-cols-[1fr_2fr_auto]">
      <div className="flex w-full items-center gap-4">
        <CharacterPictureRound character={character} />
        <ArrowHeader3
          title={`${character?.firstName} ${character?.lastName}`}
        />
        {mobile && (
          <div className="ml-auto flex items-center gap-2 self-end justify-self-end">
            {roll?.successes != null && rollComplete && (
              <h2 className="rollComplete flex size-8 items-center justify-center">
                {roll?.successes}
              </h2>
            )}
            <button
              className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
              aria-label="Roll selected action"
              type="button"
              onClick={() => {
                rollInitiative();
              }}
            >
              <DieIcon
                className={`text-tertiary group-hover:text-accent timing size-8`}
              />
            </button>
          </div>
        )}
      </div>

      <div className="flex w-full flex-wrap items-center justify-start gap-2">
        {roll?.diceArray.map((number: number, index) => (
          <Die
            key={index}
            size={64}
            number={number}
            rolling={roll?.rolling}
            rollComplete={rollComplete}
            modifiers={[]}
          />
        ))}
      </div>
      {!mobile && (
        <div className="flex items-center gap-4 justify-self-end">
          {roll?.successes != null && rollComplete && (
            <h1
              className={`rollComplete flex size-8 items-center justify-center`}
            >
              {roll?.successes}
            </h1>
          )}
          <button
            className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
            aria-label="Roll selected action"
            type="button"
            onClick={() => {
              rollInitiative();
            }}
          >
            <DieIcon
              className={`text-tertiary group-hover:text-accent timing size-8`}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default CharacterInitiativeRoll;
