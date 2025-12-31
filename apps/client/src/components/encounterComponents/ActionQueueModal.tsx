import Modal from '../modals/Modal';
import Divider from '../Divider';
import BtnRect from '../buttons/BtnRect';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowHeader3 from '../ArrowHeader3';
import PhaseActionCard from '../encounterComponents/PhaseActionCard';
import DamageIcon from '../icons/DamageIcon';
import ArrowHeader4 from '../ArrowHeader4';
import ItemCardExpanding from '../encounterComponents/ItemCardExpanding';
import useCharacterQuery from 'src/hooks/useCharacterQuery/useCharacterQuery';
import BlockIcon from '../icons/BlockIcon';
import ArmorIcon from '../icons/ArmorIcon';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import { useContext, useState } from 'react';
import ExpandingList from '../ExpandingList';
import { EncounterContext } from 'src/contexts/EncounterContext';
import { Item } from 'src/types/item';
import useConfirmActionQueueMutation from 'src/hooks/encounter hooks/useConfirmActionQueueMutation/useConfirmActionQueueMutation';
import Loading from '../Loading';
import WardIcon from '../icons/WardIcon';
import parsePhaseAction from 'src/utils/parsePhaseAction';
import { useStore } from '@tanstack/react-form';
import ArrowHeader2 from '../ArrowHeader2';
import SanityDamageIcon from '../icons/SanityDamageIcon';

const ActionQueueModal = () => {
  const {
    combat,
    isFetching,
    setIsFetching,
    encounterPermissions,
    blockPermissions,
    resetRolls,
    blockForm,
  } = useContext(EncounterContext);

  const navigate = useNavigate();
  const { campaignId, encounterId } = useParams();
  const [listExpanded, setListExpanded] = useState(false);
  const [blockDataIndex, setBlockDataIndex] = useState(0);

  const confirmActionQueue = useConfirmActionQueueMutation(
    Number(campaignId),
    Number(encounterId),
  );

  const phaseAction = combat.phaseHistory[0].action || null;
  const phaseReactions = combat.phaseHistory[0].reactions || null;

  const { data: target, isLoading } = useCharacterQuery(phaseAction?.targetId);

  const armor = phaseAction?.targetId
    ? target?.equipment?.armors
        .filter((armor) => armor.stats.armor && armor.stats.currentBlock > 0)
        .sort((a, b) => b.stats.armor - a.stats.armor)
    : [];

  const wardArmor = phaseAction?.targetId
    ? target?.equipment?.armors
        .filter((armor) => armor.stats.ward && armor.stats.currentBlock > 0)
        .sort((a, b) => b.stats.ward - a.stats.ward)
    : [];

  const blockData = useStore(
    blockForm.store,
    (state) => state.values.blockData,
  );

  const actionQueueResults = parsePhaseAction(
    combat.phaseHistory[0],
    blockData,
  );

  return (
    <Modal>
      {isLoading ? (
        <Loading />
      ) : (
        <>
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
              <PhaseActionCard phaseAction={phaseAction} />
            </>
          ) : (
            <h2>No Actions Currently in Queue</h2>
          )}
          {phaseReactions.length > 0 && !isFetching && (
            <>
              <Divider className="!my-0 opacity-50" />
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
          {phaseAction && (
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
              )}

              {!!actionQueueResults.instances && (
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
          {actionQueueResults.damage * actionQueueResults.resultingInstances +
            actionQueueResults.sanityDamage *
              actionQueueResults.resultingInstances >
            0 && (
            <>
              <ArrowHeader3 className="w-full" title="Assign Blocks" />
              <div className="bg-primary w-full rounded-md p-4 shadow-md shadow-black">
                {actionQueueResults.damage > 0 && (
                  <blockForm.Field name="blockData">
                    {(field) => (
                      <>
                        <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-8">
                          {field.state.value.map((_, i) => (
                            <blockForm.Field key={i} name={`blockData[${i}]`}>
                              {(subField) => {
                                const blocked =
                                  subField.state.value.blockedDamage >=
                                  actionQueueResults.damage;

                                return (
                                  <div className="flex flex-col items-center justify-end gap-2">
                                    {blockDataIndex === i &&
                                      blockPermissions && (
                                        <Icon
                                          path={mdiChevronDown}
                                          size={1}
                                          className="text-primary"
                                        />
                                      )}
                                    <button
                                      onClick={() => {
                                        if (!blockPermissions) {
                                          return;
                                        }
                                        setBlockDataIndex(i);
                                      }}
                                      className={`${!blockPermissions && 'pointer-events-none'} ${blocked ? 'border-green-500' : 'border-red-500'} group flex size-12 items-center justify-center rounded-full border-2`}
                                    >
                                      {blocked ? (
                                        <BlockIcon className="text-primary group-hover:text-accent size-8" />
                                      ) : (
                                        <h3 className="group-hover:text-accent timing">
                                          {i + 1}
                                        </h3>
                                      )}
                                    </button>
                                    <p>
                                      {subField.state.value.blockedDamage} /{' '}
                                      {actionQueueResults.damage}
                                    </p>
                                  </div>
                                );
                              }}
                            </blockForm.Field>
                          ))}
                        </div>
                        <ExpandingList
                          title="Armor"
                          className="flex flex-col items-center gap-4"
                          onClick={() => setListExpanded((prev) => !prev)}
                        >
                          {armor && armor.length === 0 ? (
                            <h3 className="italic">No Available Armor</h3>
                          ) : armor ? (
                            field.state.value.map(
                              (_, i) =>
                                blockDataIndex === i && (
                                  <blockForm.Field name={`blockData[${i}]`}>
                                    {(subField) =>
                                      armor.map((armor: Item) => {
                                        const blocking =
                                          subField.state.value.armorIds.includes(
                                            armor.id,
                                          );

                                        const uses = field.state.value.reduce(
                                          (sum, data) => {
                                            if (
                                              data.armorIds.includes(armor.id)
                                            ) {
                                              return sum + 1;
                                            } else {
                                              return sum;
                                            }
                                          },
                                          0,
                                        );

                                        const available = armor.stats
                                          .currentBlock
                                          ? uses < armor.stats.currentBlock
                                          : 0;

                                        return (
                                          <div
                                            className={`${!blocking && !available && 'opacity-50'} flex w-full items-center gap-8`}
                                          >
                                            <ItemCardExpanding
                                              expanded={listExpanded}
                                              itemId={armor.id}
                                            />
                                            <div className="flex items-center gap-4">
                                              <button
                                                className={`${!blockPermissions && 'pointer-events-none'} ${blocking && 'ring-2 ring-green-500'} ${!blocking && !available && 'pointer-events-none opacity-50'} bg-tertiary group rounded p-2 shadow-md shadow-black`}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (!blockPermissions) {
                                                    return;
                                                  }

                                                  if (
                                                    subField.state.value.armorIds.includes(
                                                      armor.id,
                                                    )
                                                  ) {
                                                    const newArmorIds =
                                                      subField.state.value.armorIds.filter(
                                                        (id) => id !== armor.id,
                                                      );

                                                    subField.handleChange({
                                                      ...subField.state.value,
                                                      blockedDamage:
                                                        subField.state.value
                                                          .blockedDamage -
                                                        armor.stats.armor,
                                                      armorIds: newArmorIds,
                                                    });
                                                  } else {
                                                    subField.handleChange({
                                                      ...subField.state.value,
                                                      blockedDamage:
                                                        subField.state.value
                                                          .blockedDamage +
                                                        armor.stats.armor,
                                                      armorIds: [
                                                        ...subField.state.value
                                                          .armorIds,
                                                        armor.id,
                                                      ],
                                                    });
                                                  }
                                                  blockForm.handleSubmit();
                                                }}
                                              >
                                                <BlockIcon className="text-primary hover:text-accent size-8" />
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })
                                    }
                                  </blockForm.Field>
                                ),
                            )
                          ) : (
                            <h3 className="italic">Armor Unknown</h3>
                          )}
                        </ExpandingList>
                      </>
                    )}
                  </blockForm.Field>
                )}
                {actionQueueResults.sanityDamage > 0 && (
                  <blockForm.Field name="blockData">
                    {(field) => (
                      <>
                        <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-8">
                          {field.state.value.map((_, i) => (
                            <blockForm.Field key={i} name={`blockData[${i}]`}>
                              {(subField) => {
                                const blocked =
                                  subField.state.value.blockedSanityDamage >=
                                  actionQueueResults.sanityDamage;

                                return (
                                  <div className="flex flex-col items-center justify-end gap-2">
                                    {blockDataIndex === i && (
                                      <Icon
                                        path={mdiChevronDown}
                                        size={1}
                                        className="text-primary"
                                      />
                                    )}
                                    <button
                                      onClick={() => {
                                        if (!blockPermissions) {
                                          return;
                                        }
                                        setBlockDataIndex(i);
                                      }}
                                      className={`${!blockPermissions && 'pointer-events-none'} ${blocked ? 'border-purple-500' : 'border-red-500'} group flex size-12 items-center justify-center rounded-full border-2`}
                                    >
                                      {blocked ? (
                                        <WardIcon className="text-primary group-hover:text-accent size-8" />
                                      ) : (
                                        <h3 className="group-hover:text-accent timing">
                                          {i + 1}
                                        </h3>
                                      )}
                                    </button>
                                    <p>
                                      {subField.state.value.blockedSanityDamage}{' '}
                                      / {actionQueueResults.sanityDamage}
                                    </p>
                                  </div>
                                );
                              }}
                            </blockForm.Field>
                          ))}
                        </div>
                        <ExpandingList
                          title="Ward"
                          className="flex flex-col items-center gap-4"
                          onClick={() => setListExpanded((prev) => !prev)}
                        >
                          {wardArmor && wardArmor.length === 0 ? (
                            <h3 className="italic">No Available Ward</h3>
                          ) : wardArmor ? (
                            field.state.value.map(
                              (_, i) =>
                                blockDataIndex === i && (
                                  <blockForm.Field name={`blockData[${i}]`}>
                                    {(subField) =>
                                      wardArmor.map((armor: Item) => {
                                        const blocking =
                                          subField.state.value.armorIds.includes(
                                            armor.id,
                                          );

                                        const uses = field.state.value.reduce(
                                          (sum, data) => {
                                            if (
                                              data.armorIds.includes(armor.id)
                                            ) {
                                              return sum + 1;
                                            } else {
                                              return sum;
                                            }
                                          },
                                          0,
                                        );

                                        const available = armor.stats
                                          .currentBlock
                                          ? uses < armor.stats.currentBlock
                                          : 0;

                                        return (
                                          <div
                                            className={`${!blocking && !available && 'opacity-50'} flex w-full items-center gap-8`}
                                          >
                                            <ItemCardExpanding
                                              expanded={listExpanded}
                                              itemId={armor.id}
                                            />
                                            <div className="flex items-center gap-4">
                                              <button
                                                className={`${!blockPermissions && 'pointer-events-none'} ${blocking && 'ring-2 ring-green-500'} ${!blocking && !available && 'pointer-events-none opacity-50'} bg-tertiary group rounded p-2 shadow-md shadow-black`}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (!blockPermissions) {
                                                    return;
                                                  }

                                                  if (
                                                    subField.state.value.armorIds.includes(
                                                      armor.id,
                                                    )
                                                  ) {
                                                    const newArmorIds =
                                                      subField.state.value.armorIds.filter(
                                                        (id) => id !== armor.id,
                                                      );

                                                    subField.handleChange({
                                                      ...subField.state.value,
                                                      blockedSanityDamage:
                                                        subField.state.value
                                                          .blockedSanityDamage -
                                                        armor.stats.ward,
                                                      armorIds: newArmorIds,
                                                    });
                                                  } else {
                                                    subField.handleChange({
                                                      ...subField.state.value,
                                                      blockedSanityDamage:
                                                        subField.state.value
                                                          .blockedSanityDamage +
                                                        armor.stats.ward,
                                                      armorIds: [
                                                        ...subField.state.value
                                                          .armorIds,
                                                        armor.id,
                                                      ],
                                                    });
                                                  }
                                                  blockForm.handleSubmit();
                                                }}
                                              >
                                                <WardIcon className="text-primary hover:text-accent size-8" />
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })
                                    }
                                  </blockForm.Field>
                                ),
                            )
                          ) : (
                            <h2 className="italic">Ward Unknown</h2>
                          )}
                        </ExpandingList>
                      </>
                    )}
                  </blockForm.Field>
                )}
              </div>
            </>
          )}

          {actionQueueResults.damage + actionQueueResults.sanityDamage > 0 && (
            <div className="flex w-full flex-col gap-4">
              {actionQueueResults.blockedDamage > 0 && (
                <div className="mt-2 flex w-full items-center justify-between px-2">
                  <ArrowHeader4
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
        </>
      )}
    </Modal>
  );
};

export default ActionQueueModal;
