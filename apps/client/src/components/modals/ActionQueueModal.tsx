import Modal from './Modal';
import Divider from '../Divider';
import BtnRect from '../buttons/BtnRect';
import { useNavigate, useOutletContext } from 'react-router-dom';
import CharacterCardSmall from '../CharacterCardSmall';
import Die from '../maps/Die';
import ArrowHeader3 from '../ArrowHeader3';
import PhaseActionCard from '../maps/PhaseActionCard';

const ActionQueueModal = () => {
  const navigate = useNavigate();

  const { combat } = useOutletContext() || {};

  const phaseAction = combat.phaseActionHistory || null;
  const phaseReactions = combat.phaseReactionHistories || null;

  return (
    <Modal>
      <h1>Action Queue</h1>
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
