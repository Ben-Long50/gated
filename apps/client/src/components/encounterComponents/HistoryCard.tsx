import { capitalCase } from 'change-case';
import CharacterPictureRound from '../CharacterPictureRound';
import Die from './Die';

const HistoryCard = ({ history }: { history: any }) => {
  return (
    <div className="flex items-center justify-start gap-4">
      <CharacterPictureRound character={history.characterSnapshot} />
      <div className="flex flex-col items-start gap-2 overflow-hidden">
        <div className="flex w-full items-center gap-4">
          {history.itemSnapshot && (
            <CharacterPictureRound
              character={history.itemSnapshot}
              style={{ height: 32, width: 32 }}
            />
          )}
          <p className="text-tertiary truncate">{`${capitalCase(history.actionSnapshot.actionType)} - ${history.actionSnapshot.name}`}</p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
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
        </div>
      </div>
      {history.targetSnapshot && (
        <CharacterPictureRound
          className="ml-auto"
          character={history.targetSnapshot}
        />
      )}
    </div>
  );
};

export default HistoryCard;
