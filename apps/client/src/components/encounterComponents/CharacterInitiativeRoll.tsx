import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from '../characterComponents/CharacterPictureRound';
import ArrowHeader3 from '../ArrowHeader3';
import Die from './Die';
import { useContext, useEffect, useState } from 'react';
import Loading from '../Loading';
import { LayoutContext } from 'src/contexts/LayoutContext';
import { EncounterContext } from 'src/contexts/EncounterContext';

const CharacterInitiativeRoll = ({ characterId }: { characterId: number }) => {
  const { mobile } = useContext(LayoutContext);
  const { rolls, rolling, rollComplete } = useContext(EncounterContext);

  const { filteredCharacter: character, isLoading } = useCharacter(characterId);
  const [roll, setRoll] = useState<any>(null);

  const characterName = character?.lastName
    ? character?.firstName + ' ' + character?.lastName
    : character?.firstName;

  useEffect(() => {
    if (rolls) {
      setRoll(rolls.get(characterId));
    }
  }, [rolls]);

  if (isLoading) return <Loading size={2} />;

  return (
    <div className="flex flex-col justify-between gap-4 sm:grid sm:grid-cols-[1fr_2fr_auto]">
      <div className="flex w-full items-center gap-4">
        <CharacterPictureRound character={character} />
        <ArrowHeader3 title={characterName} />
        {mobile && (
          <div className="ml-auto flex items-center gap-2 self-end justify-self-end">
            {roll?.successes != null && !rolling && (
              <h2 className="rollComplete flex size-8 items-center justify-center">
                {roll?.successes}
              </h2>
            )}
          </div>
        )}
      </div>

      <div className="flex w-full flex-wrap items-center justify-start gap-2">
        {roll?.diceArray.map((number: number, index: number) => (
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
          {roll?.successes != null && !rolling && (
            <h1
              className={`rollComplete flex size-8 items-center justify-center`}
            >
              {roll?.successes}
            </h1>
          )}
        </div>
      )}
    </div>
  );
};

export default CharacterInitiativeRoll;
