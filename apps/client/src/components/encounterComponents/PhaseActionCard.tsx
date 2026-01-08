import Die from './Die';
import ActionCard from '../ActionCard';
import Icon from '@mdi/react';
import { mdiArrowRight } from '@mdi/js';
import CharacterPictureRound from '../CharacterPictureRound';
import ArrowHeader3 from '../ArrowHeader3';
import ItemCardSmall from '../ItemCardSmall';
import StatBars from '../StatBars';
import BlockIcon from '../icons/BlockIcon';
import { History } from 'src/types/encounter';
import ArrowHeader4 from '../ArrowHeader4';
import CharacterStatBars from '../CharacterStatBars';
import { ActionData } from 'src/types/actionData';
import BlockField from './BlockField';
import Divider from '../Divider';

const PhaseActionCard = ({
  phaseAction,
  results,
}: {
  phaseAction: History;
  results: ActionData;
}) => {
  const character = phaseAction.characterSnapshot;
  const target = phaseAction.targetSnapshot;
  const item = phaseAction.itemSnapshot;
  const action = phaseAction.actionSnapshot;

  const characterName = character?.lastName
    ? character?.firstName + ' ' + character?.lastName
    : character?.firstName;

  const targetName = target?.lastName
    ? target?.firstName + ' ' + target?.lastName
    : target?.firstName;

  const damage = [
    results.damage * results.instances,
    results.sanityDamage * results.instances,
  ]
    .filter((damage) => damage && damage > 0)
    .reduce((sum, damage) => sum + damage, 0);

  return (
    <div className="bg-primary flex w-full flex-col gap-8 rounded-md p-4 shadow-md shadow-black">
      <div className="flex w-full items-center gap-8">
        <div className="flex w-full flex-col items-start gap-4">
          <ArrowHeader4 className="text-primary" title={characterName} />
          <div className={`relative flex w-full items-center`}>
            <CharacterPictureRound character={character} />
            {character?.conditions && character?.conditions.length > 0 && (
              <div className="absolute left-0 top-0 z-10 size-3 rounded-full bg-red-600 shadow-md shadow-black"></div>
            )}
            <div
              className={`timing visible ml-4 grid max-h-20 w-full translate-x-0 grid-cols-[auto_auto_1fr_auto] place-items-center gap-2 gap-y-0 opacity-100`}
            >
              <CharacterStatBars
                characterId={character?.id}
                size="small"
                stats={{
                  currentHealth: character?.stats.currentHealth,
                  maxHealth: character?.stats.maxHealth,
                  currentSanity: character?.stats.currentSanity,
                  maxSanity: character?.stats.maxSanity,
                }}
                cardWidth={300}
              />
            </div>
          </div>
        </div>

        {phaseAction.targetId && (
          <>
            <Icon
              path={mdiArrowRight}
              size={1.5}
              className="text-tertiary shrink-0"
            />
            <div className="flex w-full flex-col items-start gap-4">
              <ArrowHeader4 className="text-primary" title={targetName} />
              <div className={`relative flex w-full items-center`}>
                <CharacterPictureRound character={target} />
                {target?.conditions && target?.conditions.length > 0 && (
                  <div className="absolute left-0 top-0 z-10 size-3 rounded-full bg-red-600 shadow-md shadow-black"></div>
                )}
                <div
                  className={`timing visible ml-4 grid max-h-20 w-full translate-x-0 grid-cols-[auto_auto_1fr_auto] place-items-center gap-2 gap-y-0 opacity-100`}
                >
                  <CharacterStatBars
                    characterId={target?.id}
                    size="small"
                    stats={{
                      currentHealth: target?.stats.currentHealth,
                      maxHealth: target?.stats.maxHealth,
                      currentSanity: target?.stats.currentSanity,
                      maxSanity: target?.stats.maxSanity,
                    }}
                    cardWidth={300}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {item && (
          <ItemCardSmall
            className="col-span-2"
            heading={
              <div className="flex items-center gap-4">
                <CharacterPictureRound
                  className="-my-2 size-10"
                  character={item}
                />
                <ArrowHeader3 title={item.name} />
              </div>
            }
          >
            <div
              className={`scrollbar-primary-2 grid w-full grid-cols-[auto_auto_1fr_auto] place-items-center gap-2 gap-y-2 overflow-y-auto border-x-2 border-gray-400 border-opacity-50 px-4`}
            >
              <StatBars stats={item.stats} cardWidth={501} />
            </div>
          </ItemCardSmall>
        )}
        <ActionCard className="col-span-2" action={action} />
        {phaseAction.armorSnapshots &&
          phaseAction.armorSnapshots.map((armor) => (
            <ItemCardSmall
              className="col-span-2"
              heading={
                <div className="mr-4 flex w-full items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <CharacterPictureRound
                      className="-my-2 size-10"
                      character={armor}
                    />
                    <ArrowHeader3 title={armor.name} />
                  </div>
                  <div className="flex items-center gap-4">
                    <BlockIcon className="text-primary size-9" />
                    <h2>{armor.blocks}</h2>
                  </div>
                </div>
              }
            >
              <div
                className={`scrollbar-primary-2 grid w-full grid-cols-[auto_auto_1fr_auto] place-items-center gap-2 gap-y-2 overflow-y-auto border-x-2 border-gray-400 border-opacity-50 px-4`}
              >
                <StatBars stats={armor.stats} cardWidth={501} />
              </div>
            </ItemCardSmall>
          ))}
      </div>
      {phaseAction.rollResult && (
        <div className="flex w-full items-center justify-between gap-4">
          <ArrowHeader3 title="Roll" />
          <h4 className="text-tertiary mr-auto">{`(${phaseAction.rollResult.successes} successes)`}</h4>
          <div className="col-span-2 flex flex-wrap items-center justify-center gap-2">
            {phaseAction?.rollResult?.result.map((number: number, index) => (
              <Die
                key={index}
                size={36}
                number={number}
                rolling={phaseAction?.rolling}
                rollComplete={false}
                modifiers={phaseAction.rollResult.modifiers}
              />
            ))}
          </div>
        </div>
      )}
      {results.damage && results.instances != null && (
        <div className="flex flex-col gap-2 border-x-2 border-gray-400/50 px-2">
          <div className="flex w-full items-center justify-between px-2">
            <ArrowHeader4
              className="text-secondary"
              title="Damage (Instances)"
            />
            <h3 className="min-size-6 flex items-center justify-center">
              {`${results.damage}`}
              <span className="text-tertiary ml-2 text-lg">{`(${results.instances})`}</span>
            </h3>
          </div>
          <div className="flex w-full items-center justify-between px-2">
            <ArrowHeader4 className="text-secondary" title="Total Damage" />
            <h3 className="flex size-6 items-center justify-center">
              {results.instances * results.damage}
            </h3>
          </div>
        </div>
      )}
      {damage > 0 && (
        <>
          <Divider className="opacity-50" />
          <BlockField phaseAction={phaseAction} results={results} />
        </>
      )}
    </div>
  );
};

export default PhaseActionCard;
