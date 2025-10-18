import CharacterCardSmall from '../CharacterCardSmall';
import Die from './Die';
import ActionCard from '../ActionCard';
import Icon from '@mdi/react';
import { mdiArrowRight } from '@mdi/js';

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
      <div className="col-span-2 grid grid-cols-2 items-start gap-8">
        <ActionCard action={phaseAction.action} />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {phaseAction?.rollResult?.result.map((number: number, index) => (
            <Die
              key={index}
              size={64}
              number={number}
              rolling={phaseAction?.rolling}
              rollComplete={false}
              modifiers={[]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhaseActionCard;
