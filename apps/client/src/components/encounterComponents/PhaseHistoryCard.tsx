import { PhaseHistory } from 'src/types/encounter';
import ArrowHeader3 from '../ArrowHeader3';
import PhaseActionCard from './PhaseActionCard';
import Divider from '../Divider';
import ItemCardSmall from '../ItemCardSmall';
import Icon from '@mdi/react';
import { mdiTriangleDown } from '@mdi/js';
import ActionIcon from '../icons/ActionIcon';
import CharacterPictureRound from '../characterComponents/CharacterPictureRound';
import ReactionIcon from '../icons/ReactionIcon';
import parsePhaseAction from 'src/utils/parsePhaseAction';
import { Fragment } from 'react/jsx-runtime';

const PhaseHistoryCard = ({ phaseHistory }: { phaseHistory: PhaseHistory }) => {
  const phaseAction = phaseHistory.action || null;
  const phaseReactions = phaseHistory.reactions || null;

  const { actionResults, reactionResults } = phaseAction
    ? parsePhaseAction(phaseHistory)
    : { actionResults: null, reactionResults: null };

  const reducedSuccesses = reactionResults
    ? reactionResults.reduce(
        (sum, reaction) => sum + reaction.reducedSuccesses,
        0,
      )
    : 0;

  return (
    <div className="flex w-full items-center gap-4">
      <ItemCardSmall
        heading={
          <div className="flex items-center gap-8">
            <h2>{phaseHistory.turn}</h2>
            <Icon
              className="text-primary"
              path={mdiTriangleDown}
              rotate={-90}
              size={0.5}
            />
            <div className="flex items-center gap-4">
              <ActionIcon className="size-8" />
              <CharacterPictureRound
                className="size-9"
                character={phaseAction.characterSnapshot}
              />
              <p>{phaseAction.actionSnapshot.name}</p>
            </div>
            {phaseReactions.length > 0 && (
              <div className="flex items-center gap-4">
                <ReactionIcon className="size-8" />
                {phaseReactions.map((reaction) => {
                  return (
                    <Fragment key={reaction.id}>
                      <CharacterPictureRound
                        className="size-9"
                        character={reaction.characterSnapshot}
                      />
                      <p>{reaction.actionSnapshot.name}</p>
                    </Fragment>
                  );
                })}
              </div>
            )}
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <ArrowHeader3 title="Action" className="self-start" />
          <PhaseActionCard
            phaseAction={phaseAction}
            results={{ ...actionResults, reducedSuccesses }}
            showBlockField={false}
          />

          {phaseReactions.length > 0 && (
            <>
              <Divider />
              <ArrowHeader3 title="Reactions" className="self-start" />
              {phaseReactions.map((phaseReaction, index) => {
                return (
                  <PhaseActionCard
                    key={phaseReaction.id}
                    phaseAction={phaseReaction}
                    results={reactionResults[index]}
                    showBlockField={false}
                  />
                );
              })}
            </>
          )}
        </div>
      </ItemCardSmall>
    </div>
  );
};

export default PhaseHistoryCard;
