import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from '../characterComponents/CharacterPictureRound';
import ArrowHeader3 from '../ArrowHeader3';
import Die from './Die';
import { useContext, useEffect } from 'react';
import { LayoutContext } from 'src/contexts/LayoutContext';
import { EncounterContext } from 'src/contexts/EncounterContext';
import {
  calculateDiceCount,
  makeRandomDiceArray,
  violenceRolls,
} from '@gated/shared';
import IconBtnSmall from '../buttons/IconBtnSmall';
import Icon from '@mdi/react';
import {
  mdiArrowDownBoldHexagonOutline,
  mdiArrowUpBoldHexagonOutline,
  mdiDiceMultiple,
  mdiMinus,
  mdiPlus,
  mdiThumbDownOutline,
  mdiThumbUpOutline,
} from '@mdi/js';
import { capitalCase } from 'change-case';
import Loading from '../Loading';

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
  const { rolls, rolling, setRoll, rollComplete } =
    useContext(EncounterContext);

  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

  const characterRollData = rollData.get(characterId);

  const diceCount = character
    ? calculateDiceCount(
        character.attributes,
        'Initiative',
        violenceRolls,
        characterRollData?.modifiers ?? [],
        characterRollData?.extraDice ?? 0,
      )
    : { roll: { attribute: '', skill: '' }, diceCount: 0, extraDiceCount: 0 };

  const totalDiceCount = diceCount.diceCount + diceCount.extraDiceCount;

  const roll = rolls.get(characterId) ?? { diceArray: [] };

  useEffect(() => {
    const diceArray = roll
      ? roll.diceArray.length < totalDiceCount
        ? [
            ...roll.diceArray,
            ...makeRandomDiceArray(totalDiceCount - roll.diceArray.length),
          ]
        : roll.diceArray.slice(0, totalDiceCount)
      : makeRandomDiceArray(totalDiceCount);

    setRoll(characterId, {
      diceArray,
      successes: roll?.successes ?? 0,
    });
  }, [totalDiceCount, characterId]);

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
        <div className="flex items-center gap-4">
          <p>
            {capitalCase(diceCount.roll.attribute)}:{' '}
            {capitalCase(diceCount.roll.skill)}
          </p>
          {characterRollData?.modifiers &&
            characterRollData?.modifiers.length > 0 && (
              <p className="text-tertiary text-base">
                (
                {characterRollData?.modifiers
                  .map((m) => capitalCase(m))
                  .join(', ')}
                )
              </p>
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
              modifiers={characterRollData?.modifiers}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-5 items-center gap-2">
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
        <div className="col-span-3 flex w-full items-center justify-center gap-2">
          <h2 className="text-center">{totalDiceCount}</h2>
          <p className="text-tertiary whitespace-nowrap text-center text-base">
            ( {diceCount.extraDiceCount} )
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
        <IconBtnSmall
          tooltip="Push"
          onClick={() => {
            if (totalDiceCount < 20) {
              setRollData((prev) => {
                const data = prev.get(characterId);
                if (!data) return prev;

                const next = new Map(prev);
                next.set(characterId, {
                  ...data,
                  modifiers: data.modifiers.includes('push')
                    ? data.modifiers.filter((m) => m !== 'push')
                    : [...data.modifiers, 'push'],
                });

                return next;
              });
            }
          }}
        >
          <Icon path={mdiDiceMultiple} />
        </IconBtnSmall>
        <IconBtnSmall
          tooltip="Lucky"
          onClick={() => {
            if (totalDiceCount < 20) {
              setRollData((prev) => {
                const data = prev.get(characterId);
                if (!data) return prev;

                const next = new Map(prev);
                next.set(characterId, {
                  ...data,
                  modifiers: data.modifiers.includes('lucky')
                    ? data.modifiers.filter((m) => m !== 'lucky')
                    : [...data.modifiers, 'lucky'],
                });

                return next;
              });
            }
          }}
        >
          <Icon path={mdiThumbUpOutline} />
        </IconBtnSmall>
        <IconBtnSmall
          tooltip="Unlucky"
          onClick={() => {
            if (totalDiceCount < 20) {
              setRollData((prev) => {
                const data = prev.get(characterId);
                if (!data) return prev;

                const next = new Map(prev);
                next.set(characterId, {
                  ...data,
                  modifiers: data.modifiers.includes('unlucky')
                    ? data.modifiers.filter((m) => m !== 'unlucky')
                    : [...data.modifiers, 'unlucky'],
                });

                return next;
              });
            }
          }}
        >
          <Icon path={mdiThumbDownOutline} />
        </IconBtnSmall>
        <IconBtnSmall
          tooltip="Booming"
          onClick={() => {
            if (totalDiceCount < 20) {
              setRollData((prev) => {
                const data = prev.get(characterId);
                if (!data) return prev;

                const next = new Map(prev);
                next.set(characterId, {
                  ...data,
                  modifiers: data.modifiers.includes('booming')
                    ? data.modifiers.filter((m) => m !== 'booming')
                    : [...data.modifiers, 'booming'],
                });

                return next;
              });
            }
          }}
        >
          <Icon path={mdiArrowUpBoldHexagonOutline} />
        </IconBtnSmall>
        <IconBtnSmall
          tooltip="Dooming"
          onClick={() => {
            if (totalDiceCount < 20) {
              setRollData((prev) => {
                const data = prev.get(characterId);
                if (!data) return prev;

                const next = new Map(prev);
                next.set(characterId, {
                  ...data,
                  modifiers: data.modifiers.includes('dooming')
                    ? data.modifiers.filter((m) => m !== 'dooming')
                    : [...data.modifiers, 'dooming'],
                });

                return next;
              });
            }
          }}
        >
          <Icon path={mdiArrowDownBoldHexagonOutline} />
        </IconBtnSmall>
        <div className="text-tertiary col-span-5 flex items-center justify-between px-4 text-center">
          {rolling ? (
            <>
              <p className="!text-inherit">Successes</p>
              <Loading size={1} />
            </>
          ) : (
            <>
              <p className="!text-inherit">Successes</p>
              <p className="!text-inherit">{roll.successes}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterInitiativeRoll;
