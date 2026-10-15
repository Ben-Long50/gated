import Modal from '../modals/Modal';
import Divider from '../Divider';
import BtnRect from '../buttons/BtnRect';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowHeader3 from '../ArrowHeader3';
import PhaseActionCard from '../encounterComponents/PhaseActionCard';
import ArrowHeader4 from '../ArrowHeader4';
import { useContext, useState } from 'react';
import { EncounterContext } from 'src/contexts/EncounterContext';
import useConfirmActionQueueMutation from 'src/hooks/encounter hooks/useConfirmActionQueueMutation/useConfirmActionQueueMutation';
import Loading from '../Loading';
import parsePhaseAction from 'src/utils/parsePhaseAction';
import { History } from 'src/types/encounter';
import BtnAuth from '../buttons/BtnAuth';

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

  const [tab, setTab] = useState('action');

  const confirmActionQueue = useConfirmActionQueueMutation(
    Number(campaignId),
    Number(encounterId),
  );

  const phaseAction = combat.phaseHistory[0].action || null;
  const phaseReactions = combat.phaseHistory[0].reactions || null;

  const { actionResults, reactionResults } = phaseAction
    ? parsePhaseAction(combat.phaseHistory[0])
    : { actionResults: null, reactionResults: null };

  const reducedSuccesses = reactionResults
    ? reactionResults.reduce(
        (sum, reaction) => sum + reaction.reducedSuccesses,
        0,
      )
    : 0;

  return (
    <Modal>
      <h1>Action Queue</h1>
      <div className="absolute left-4 top-4 flex flex-col">
        <p className="text-base">{`Round ${combat.phaseHistory[0].round}`}</p>
        <p className="text-base">{`Turn ${combat.phaseHistory[0].turn}`}</p>
      </div>
      <Divider />
      <div className="grid w-full grid-cols-2 gap-8">
        <BtnAuth active={tab === 'action'} onClick={() => setTab('action')}>
          Action
        </BtnAuth>
        <BtnAuth
          active={tab === 'reactions'}
          onClick={() => setTab('reactions')}
        >
          {phaseReactions && phaseReactions.length > 0
            ? `Reactions ( ${phaseReactions.length} )`
            : 'Reactions'}
        </BtnAuth>
      </div>
      {isFetching ? (
        <Loading />
      ) : tab === 'action' ? (
        phaseAction ? (
          <PhaseActionCard
            phaseAction={phaseAction}
            results={{ ...actionResults, reducedSuccesses }}
          />
        ) : (
          <h2>No Action Currently in Queue</h2>
        )
      ) : phaseReactions && phaseReactions.length > 0 ? (
        <>
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
      ) : (
        <h2>No Reactions Currently in Queue</h2>
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
