import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from '../characterComponents/CharacterPictureRound';
import ArrowHeader3 from '../ArrowHeader3';
import Die from './Die';
import { useContext, useEffect, useState } from 'react';
import Loading from '../Loading';
import { LayoutContext } from 'src/contexts/LayoutContext';
import { EncounterContext } from 'src/contexts/EncounterContext';
import { calculateBestRoll, violenceRolls } from '@gated/shared';
import IconBtnSmall from '../buttons/IconBtnSmall';
import Icon from '@mdi/react';
import { mdiMinus, mdiPlus } from '@mdi/js';
import { capitalCase } from 'change-case';

const CharacterInitiativeRoll = ({
  characterId,
  rollData,
  setRollData,
}: {
  characterId: number;
  rollData: Map<number, { modifiers: string[]; extraDice: number }>;
  setRollData: React.Dispatch<
    React.SetStateAction<
      Map<number, { modifiers: string[]; extraDice: number }>
    >
  >;
}) => {
  const { mobile } = useContext(LayoutContext);
  const { rolls, rolling, rollComplete } = useContext(EncounterContext);

  const { filteredCharacter: character, isLoading } = useCharacter(characterId);
  const [roll, setRoll] = useState<any>(null);

  const diceCount = character
    ? calculateBestRoll(character.attributes, violenceRolls, [])
    : { roll: { attribute: '', skill: '' }, diceCount: 0 };

  const characterRollData = rollData.get(characterId);
  const totalDiceCount = diceCount.diceCount + characterRollData?.extraDice;

  useEffect(() => {
    if (rolls) {
      setRoll(rolls.get(characterId));
    }
  }, [rolls]);

  if (isLoading) return <Loading size={2} />;

  return (
    <div className="bg-primary shadow-color flex h-full w-full flex-col items-center justify-between gap-4 rounded-md p-4 sm:grid sm:grid-cols-[1fr_2fr_auto]">
      <div className="flex w-full items-center gap-4">
        <CharacterPictureRound character={character} />
        <ArrowHeader3 title={character?.name} />
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
      <div className="flex h-full w-full flex-col items-start gap-4">
        <p>
          {capitalCase(diceCount.roll.attribute)}:{' '}
          {capitalCase(diceCount.roll.skill)}
        </p>
        {roll ? (
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
        ) : (
          <div className="flex w-full flex-wrap items-center justify-start gap-2">
            {Array.from({
              length: totalDiceCount,
            }).map((_, index: number) => (
              <Die
                key={index}
                size={64}
                number={1}
                rolling={roll?.rolling}
                rollComplete={rollComplete}
                modifiers={[]}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <IconBtnSmall
          tooltip="Decrease Dice"
          active={totalDiceCount > 0}
          onClick={() => {
            if (totalDiceCount > 0) {
              setRollData((prev) => {
                const data = prev.get(characterId);
                if (!data) return prev;

                const next = new Map(prev);
                next.set(characterId, {
                  ...data,
                  extraDice: data.extraDice - 1,
                });

                return next;
              });
            }
          }}
        >
          <Icon path={mdiMinus} />
        </IconBtnSmall>
        <div className="flex items-center gap-2">
          <h2 className="w-8 text-center">{totalDiceCount}</h2>
          <p className="text-tertiary w-8 whitespace-nowrap text-center text-base">
            ( {characterRollData.extraDice} )
          </p>
        </div>
        <IconBtnSmall
          tooltip="Increase Dice"
          active={totalDiceCount < 20}
          onClick={() => {
            if (totalDiceCount < 20) {
              setRollData((prev) => {
                const data = prev.get(characterId);
                if (!data) return prev;

                const next = new Map(prev);
                next.set(characterId, {
                  ...data,
                  extraDice: data.extraDice + 1,
                });

                return next;
              });
            }
          }}
        >
          <Icon path={mdiPlus} />
        </IconBtnSmall>
      </div>
    </div>
  );
};

export default CharacterInitiativeRoll;
