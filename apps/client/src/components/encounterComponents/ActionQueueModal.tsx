import Modal from '../modals/Modal';
import Divider from '../Divider';
import BtnRect from '../buttons/BtnRect';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowHeader3 from '../ArrowHeader3';
import PhaseActionCard from '../encounterComponents/PhaseActionCard';
import ArrowHeader4 from '../ArrowHeader4';
import { useContext } from 'react';
import { EncounterContext } from 'src/contexts/EncounterContext';
import useConfirmActionQueueMutation from 'src/hooks/encounter hooks/useConfirmActionQueueMutation/useConfirmActionQueueMutation';
import Loading from '../Loading';
import parsePhaseAction from 'src/utils/parsePhaseAction';
import { History } from 'src/types/encounter';

const ActionQueueModal = () => {
  const {
    combat,
    isFetching,
    setIsFetching,
    encounterPermissions,
    resetRolls,
    blockDataMap,
  } = useContext(EncounterContext);

  const navigate = useNavigate();
  const { campaignId, encounterId } = useParams();

  const confirmActionQueue = useConfirmActionQueueMutation(
    Number(campaignId),
    Number(encounterId),
  );

  const phaseAction = combat.phaseHistory[0].action || null;
  const phaseReactions = combat.phaseHistory[0].reactions || null;

  const { actionResults, reactionResults } = parsePhaseAction(
    combat.phaseHistory[0],
  );

  return (
    <Modal>
      <h1>Action Queue</h1>
      <div className="absolute left-4 top-4 flex flex-col">
        <ArrowHeader4
          className="text-primary"
          title={`Round ${combat.phaseHistory[0].round}`}
        />
        <ArrowHeader4
          className="text-primary"
          title={`Turn ${combat.phaseHistory[0].turn}`}
        />
      </div>
      <Divider className="opacity-50" />
      {isFetching ? (
        <Loading />
      ) : phaseAction ? (
        <>
          <ArrowHeader3 title="Pending Action" className="self-start" />
          <PhaseActionCard phaseAction={phaseAction} results={actionResults} />
          {phaseReactions.length > 0 && !isFetching && (
            <>
              <Divider className="!my-0 opacity-50" />
              <ArrowHeader3 title="Pending Reactions" className="self-start" />
              {phaseReactions.map((phaseReaction: History, index: number) => {
                return (
                  <PhaseActionCard
                    key={phaseReaction.id}
                    phaseAction={phaseReaction}
                    results={reactionResults[index]}
                  />
                );
              })}
              <Divider className="!my-0 opacity-50" />
            </>
          )}
        </>
      ) : (
        <h2>No Actions Currently in Queue</h2>
      )}
      {combat.passes.length >= combat.turnOrder.length - 1 &&
      encounterPermissions ? (
        <BtnRect
          className="w-full"
          ariaLabel="Confirm action queue results"
          type="button"
          active={!isFetching}
          onClick={() => {
            setIsFetching(true);
            confirmActionQueue.mutate(Array.from(blockDataMap.entries()));
            resetRolls();
          }}
        >
          Confirm Action Queue
        </BtnRect>
      ) : (
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
      )}
    </Modal>
  );
};

export default ActionQueueModal;
