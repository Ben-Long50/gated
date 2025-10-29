import Modal from './Modal';
import Divider from '../Divider';
import BtnRect from '../buttons/BtnRect';
import { useNavigate, useOutletContext } from 'react-router-dom';
import CharacterCardSmall from '../CharacterCardSmall';
import Die from '../maps/Die';
import ArrowHeader3 from '../ArrowHeader3';
import PhaseActionCard from '../maps/PhaseActionCard';
import { calculateDamage } from 'src/utils/calculateDamage';
import DamageIcon from '../icons/DamageIcon';

const ActionQueueModal = () => {
  const navigate = useNavigate();

  const { combat } = useOutletContext() || {};

  const phaseAction = combat.phaseActionHistory || null;
  const phaseReactions = combat.phaseReactionHistories || null;

  const reducedSuccesses = phaseReactions.reduce((sum: number, reaction) => {
    if (reaction.name === 'Parry') {
      return sum + reaction.rollResult.successes;
    } else {
      return sum;
    }
  }, 0);

  return (
    <Modal>
      <h1>Action Queue</h1>
      <p className="text-tertiary w-full border-x-2 border-x-gray-400 border-opacity-50 px-4">
        The Action Queue is a history of actions and reactions that have been
        rolled for on this specific turn. The successes from the current pending
        action and success reductions from pending reactions such as "Parry" are
        totalled and shown. After all character reactions have been either
        rolled or passed, the calculated damage will be applied to the target
        character. The Action Queue resets for each gameplay action taken.
      </p>
      <ArrowHeader3 title="Pending Action" className="self-start" />
      {phaseAction ? (
        <PhaseActionCard phaseAction={phaseAction} />
      ) : (
        <h2>No Actions currently in Queue</h2>
      )}
      <Divider className="!my-0 opacity-50" />
      {phaseReactions.length > 0 && (
        <>
          <ArrowHeader3 title="Pending Reactions" className="self-start" />
          {phaseReactions.map((phaseReaction) => {
            return (
              <PhaseActionCard
                key={phaseReaction.id}
                phaseAction={phaseReaction}
              />
            );
          })}
          <Divider className="!my-0 opacity-50" />
        </>
      )}
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <ArrowHeader3 title="Action Successes" />
          <h2 className="flex size-6 items-center justify-center">
            {phaseAction.rollResult.successes}
          </h2>
        </div>
        {phaseReactions.length > 0 && (
          <div className="flex w-full items-center justify-between">
            <ArrowHeader3 title="Reaction Success Reductions" />
            <h2 className="flex size-6 items-center justify-center">
              {reducedSuccesses}
            </h2>
          </div>
        )}
        {phaseAction.item && (
          <div className="flex w-full items-center justify-between">
            <ArrowHeader3 title="Total Damage" />
            <div className="flex items-center gap-2">
              <DamageIcon className="text-primary size-8" />
              <h2 className="flex size-6 items-center justify-center">
                {calculateDamage(
                  phaseAction.item,
                  phaseAction.action,
                  phaseAction.rollResult.successes - reducedSuccesses,
                )}
              </h2>
            </div>
          </div>
        )}
      </div>
      <BtnRect
        className="w-full"
        ariaLabel="Close"
        type="button"
        onClick={() => {
          navigate('..');
        }}
      >
        Close
      </BtnRect>
    </Modal>
  );
};

export default ActionQueueModal;
