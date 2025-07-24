import { capitalCase } from 'change-case';
import CharacterPictureRound from '../CharacterPictureRound';
import Die from './Die';
import DamageIcon from '../icons/DamageIcon';

const HistoryCard = ({ history }: { history: any }) => {
  return (
    <div className="flex items-center justify-start gap-4">
      <CharacterPictureRound character={history.character} />
      <div className="flex flex-col gap-1">
        <p className="text-tertiary whitespace-nowrap">{`${capitalCase(history.action.actionType)} - ${history.action.name}`}</p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1">
            {history.rollResult?.result.map((result, index: number) => (
              <Die
                key={index}
                number={result}
                rolling={false}
                size={24}
                modifiers={history.rollResult.modifiers}
              />
            ))}
          </div>
          {history.rollResult.damage != null && (
            <div className="flex items-center gap-2">
              <DamageIcon className="text-secondary size-6" />
              <p>{history.rollResult.damage}</p>
            </div>
          )}
        </div>
      </div>
      {history.target && (
        <CharacterPictureRound className="ml-auto" character={history.target} />
      )}
    </div>
  );
};

export default HistoryCard;
