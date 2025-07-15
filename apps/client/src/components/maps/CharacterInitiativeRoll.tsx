import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from '../CharacterPictureRound';
import ArrowHeader3 from '../ArrowHeader3';
import useRoll from 'src/hooks/useRoll';
import useAttributeTree from 'src/hooks/useAttributeTree';
import Die from './Die';
import DieIcon from '../icons/DieIcon';
import { Ref, useContext, useImperativeHandle } from 'react';
import Loading from '../Loading';
import { LayoutContext } from 'src/contexts/LayoutContext';

const CharacterInitiativeRoll = ({
  characterId,
  ref,
}: {
  characterId: number;
  ref: Ref;
}) => {
  const { mobile } = useContext(LayoutContext);
  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

  const { emptyAttributeTree } = useAttributeTree();
  const { diceArray, rolling, calculateSuccesses, successes } = useRoll();

  const violenceRolls = Object.keys(emptyAttributeTree.violence.skills).map(
    (skill) => ({ attribute: 'violence', skill }),
  );

  const roll = async () => {
    const successes = await calculateSuccesses(
      character?.attributes,
      violenceRolls,
      [],
    );
    return {
      characterId,
      name: character?.firstName,
      playerCharacter: character?.playerCharacter,
      successes,
    };
  };

  useImperativeHandle(ref, () => ({
    roll,
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
            {successes != null && (
              <h2 className="flex size-8 items-center justify-center">
                {successes}
              </h2>
            )}
            <button
              className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
              aria-label="Roll selected action"
              type="button"
              onClick={() => {
                roll();
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
        {diceArray?.map((number: number, index) => (
          <Die key={index} size={64} number={number} rolling={rolling} />
        ))}
      </div>
      {!mobile && (
        <div className="flex items-center gap-4 justify-self-end">
          {successes != null && (
            <h1 className="flex size-8 items-center justify-center">
              {successes}
            </h1>
          )}
          <button
            className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
            aria-label="Roll selected action"
            type="button"
            onClick={() => {
              roll();
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
