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

const CharacterInitiativeRoll = ({ characterId }: { characterId: number }) => {
  const { mobile } = useContext(LayoutContext);
  const { rolls, rollOptions, rolling, setRoll, setOption, rollComplete } =
    useContext(EncounterContext);

  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

  const roll = rolls.get(characterId) ?? { diceArray: [] };
  const rollData = rollOptions.get(characterId) ?? {
    modifiers: [],
    extraDice: 0,
  };

  const diceCount = character
    ? calculateDiceCount(
        character.attributes,
        'Initiative',
        violenceRolls,
        rollData?.modifiers ?? [],
        rollData?.extraDice ?? 0,
      )
    : { roll: { attribute: '', skill: '' }, diceCount: 0, extraDiceCount: 0 };

  const totalDiceCount = diceCount.diceCount + diceCount.extraDiceCount;

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
          {rollData?.modifiers && rollData?.modifiers.length > 0 && (
            <p className="text-tertiary text-base">
              ({rollData?.modifiers.map((m) => capitalCase(m)).join(', ')})
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
              modifiers={rollData?.modifiers}
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
              setOption(characterId, {
                ...rollData,
                extraDice: rollData.extraDice - 1,
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
              setOption(characterId, {
                ...rollData,
                extraDice: rollData.extraDice + 1,
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
              setOption(characterId, {
                ...rollData,
                modifiers: rollData.modifiers.includes('push')
                  ? rollData.modifiers.filter((m: string) => m !== 'push')
                  : [...rollData.modifiers, 'push'],
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
              setOption(characterId, {
                ...rollData,
                modifiers: rollData.modifiers.includes('lucky')
                  ? rollData.modifiers.filter((m: string) => m !== 'lucky')
                  : [...rollData.modifiers, 'lucky'],
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
              setOption(characterId, {
                ...rollData,
                modifiers: rollData.modifiers.includes('unlucky')
                  ? rollData.modifiers.filter((m: string) => m !== 'unlucky')
                  : [...rollData.modifiers, 'unlucky'],
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
              setOption(characterId, {
                ...rollData,
                modifiers: rollData.modifiers.includes('booming')
                  ? rollData.modifiers.filter((m: string) => m !== 'booming')
                  : [...rollData.modifiers, 'booming'],
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
              setOption(characterId, {
                ...rollData,
                modifiers: rollData.modifiers.includes('dooming')
                  ? rollData.modifiers.filter((m: string) => m !== 'dooming')
                  : [...rollData.modifiers, 'dooming'],
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
