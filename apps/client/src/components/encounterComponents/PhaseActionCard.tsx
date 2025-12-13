import CharacterCardSmall from '../CharacterCardSmall';
import Die from './Die';
import ActionCard from '../ActionCard';
import Icon from '@mdi/react';
import { mdiArrowRight } from '@mdi/js';
import CharacterPictureRound from '../CharacterPictureRound';
import ArrowHeader3 from '../ArrowHeader3';
import ItemCardSmall from '../ItemCardSmall';
import StatBars from '../StatBars';

const PhaseActionCard = ({ phaseAction }: { phaseAction: History }) => {
  return (
    <div className="bg-primary flex w-full flex-col gap-6 rounded-md p-4 shadow-md shadow-black">
      <div className="flex w-full items-center gap-8">
        <CharacterCardSmall
          className="flex-1"
          characterId={phaseAction.characterId}
          characterList={true}
        />

        {phaseAction.targetId && (
          <>
            <Icon path={mdiArrowRight} size={1.5} className="text-tertiary" />
            <CharacterCardSmall
              className="flex-1"
              characterId={phaseAction.targetId}
              characterList={true}
            />
          </>
        )}
      </div>
      {phaseAction.item && (
        <ItemCardSmall
          className="col-span-2"
          heading={
            <div className="flex items-center gap-4">
              <CharacterPictureRound
                className="-my-2 size-10"
                character={phaseAction.item}
              />
              <ArrowHeader3 title={phaseAction.item.name} />
            </div>
          }
        >
          <div
            className={`scrollbar-primary-2 grid w-full grid-cols-[auto_auto_1fr_auto] place-items-center gap-2 gap-y-2 overflow-y-auto border-x-2 border-gray-400 border-opacity-50 px-4`}
          >
            <StatBars stats={phaseAction.item.stats} cardWidth={501} />
          </div>
        </ItemCardSmall>
      )}
      <ActionCard className="col-span-2" action={phaseAction.action} />
      {phaseAction.rollResult && (
        <div className="col-span-2 flex w-full flex-wrap items-center justify-center gap-2">
          {phaseAction?.rollResult?.result.map((number: number, index) => (
            <Die
              key={index}
              size={64}
              number={number}
              rolling={phaseAction?.rolling}
              rollComplete={false}
              modifiers={phaseAction.rollResult.modifiers}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhaseActionCard;
