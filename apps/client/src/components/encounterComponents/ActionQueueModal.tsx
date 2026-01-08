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
    blockForm,
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
      {/* {phaseAction && (
            <div className="flex w-full flex-col gap-4">
              {phaseAction.rollResult && (
                <div className="flex w-full items-center justify-between px-2">
                  <ArrowHeader4
                    className="text-secondary"
                    title="Action Successes"
                  />
                  <h3 className="flex size-6 items-center justify-center">
                    {phaseAction.rollResult.successes}
                  </h3>
                </div>
              )} */}

      {/* {!!actionQueueResults.instances && (
                <>
                  {actionQueueResults.reducedSuccesses > 0 && (
                    <div className="flex w-full items-center justify-between px-2">
                      <ArrowHeader4
                        className="text-secondary"
                        title="Reaction Success Reductions"
                      />
                      <h3 className="flex size-6 items-center justify-center">
                        {actionQueueResults.reducedSuccesses}
                      </h3>
                    </div>
                  )}
                  <div className="flex w-full items-center justify-between px-2">
                    <ArrowHeader4
                      className="text-secondary"
                      title="Damage Instances"
                    />
                    <h3 className="flex size-6 items-center justify-center">
                      {actionQueueResults.resultingInstances}
                    </h3>
                  </div>
                  {actionQueueResults.damage > 0 && (
                    <div className="flex w-full items-center justify-between px-2">
                      <ArrowHeader4
                        className="text-secondary"
                        title="Damage per Instance"
                      />
                      <h3 className="flex size-6 items-center justify-center">
                        {actionQueueResults.damage}
                      </h3>
                    </div>
                  )}
                  {actionQueueResults.sanityDamage > 0 && (
                    <div className="flex w-full items-center justify-between px-2">
                      <ArrowHeader4
                        className="text-secondary"
                        title="Sanity Damage per Instance"
                      />
                      <h3 className="flex size-6 items-center justify-center">
                        {actionQueueResults.sanityDamage}
                      </h3>
                    </div>
                  )}
                  {actionQueueResults.damage > 0 && (
                    <div className="flex w-full items-center justify-between">
                      <ArrowHeader3 title="Total Damage" />
                      <h2 className="flex size-6 items-center justify-center">
                        {actionQueueResults.damage *
                          actionQueueResults.resultingInstances}
                      </h2>
                    </div>
                  )}
                  {actionQueueResults.sanityDamage > 0 && (
                    <div className="flex w-full items-center justify-between">
                      <ArrowHeader3 title="Total Sanity Damage" />
                      <h2 className="flex size-6 items-center justify-center">
                        {actionQueueResults.sanityDamage *
                          actionQueueResults.resultingInstances}
                      </h2>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <Divider className="opacity-50" />
         

          {actionQueueResults.damage + actionQueueResults.sanityDamage > 0 && (
            <div className="flex w-full flex-col gap-4">
              {actionQueueResults.blockedDamage > 0 && (
                <div className="mt-2 flex w-full items-center justify-between px-2">
                  <ArrowHeader4results.successes
                    className="text-secondary"
                    title="Blocked Damage"
                  />
                  <div className="flex items-center gap-2">
                    <ArmorIcon className="text-primary size-6" />
                    <h3 className="flex size-6 items-center justify-center">
                      {actionQueueResults.blockedDamage}
                    </h3>
                    {actionQueueResults.armorPoints >
                      actionQueueResults.blockedDamage && (
                      <h3 className="text-tertiary text-base">
                        (
                        {actionQueueResults.armorPoints -
                          actionQueueResults.blockedDamage}
                        )
                      </h3>
                    )}
                  </div>
                </div>
              )}
              {actionQueueResults.blockedSanityDamage > 0 && (
                <div className="mt-2 flex w-full items-center justify-between px-2">
                  <ArrowHeader4
                    className="text-secondary"
                    title="Blocked Sanity Damage"
                  />
                  <div className="flex items-center gap-2">
                    <WardIcon className="text-primary size-6" />
                    <h3 className="flex size-6 items-center justify-center">
                      {actionQueueResults.blockedSanityDamage}
                    </h3>
                    {actionQueueResults.wardPoints >
                      actionQueueResults.blockedSanityDamage && (
                      <h3 className="text-tertiary text-base">
                        (
                        {actionQueueResults.wardPoints -
                          actionQueueResults.blockedSanityDamage}
                        )
                      </h3>
                    )}
                  </div>
                </div>
              )}
              {actionQueueResults.damage > 0 && (
                <div className="flex w-full items-center justify-between">
                  <ArrowHeader3 title="Final Damage" />
                  <div className="flex items-center gap-4">
                    <DamageIcon className="text-primary size-8" />
                    <h2 className="flex size-6 items-center justify-center">
                      {actionQueueResults.damage *
                        actionQueueResults.resultingInstances -
                        actionQueueResults.blockedDamage >
                      0
                        ? actionQueueResults.damage *
                            actionQueueResults.resultingInstances -
                          actionQueueResults.blockedDamage
                        : 0}
                    </h2>
                  </div>
                </div>
              )}
              {actionQueueResults.sanityDamage > 0 && (
                <div className="flex w-full items-center justify-between">
                  <ArrowHeader3 title="Final Sanity Damage" />
                  <div className="flex items-center gap-4">
                    <SanityDamageIcon className="text-primary size-8" />
                    <h2 className="flex size-6 items-center justify-center">
                      {actionQueueResults.sanityDamage *
                        actionQueueResults.resultingInstances -
                        actionQueueResults.blockedSanityDamage >
                      0
                        ? actionQueueResults.sanityDamage *
                            actionQueueResults.resultingInstances -
                          actionQueueResults.blockedSanityDamage
                        : 0}
                    </h2>
                  </div>
                </div>
              )}
            </div>
          )}
          
        </> */}

      {combat.passes.length >= combat.turnOrder.length - 1 &&
      encounterPermissions ? (
        <BtnRect
          className="w-full"
          ariaLabel="Confirm action queue results"
          type="button"
          active={!isFetching}
          onClick={() => {
            setIsFetching(true);
            const blockData = blockForm.getFieldValue('blockData');
            confirmActionQueue.mutate(blockData);
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
