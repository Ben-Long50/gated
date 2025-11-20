import Modal from './Modal';
import Divider from '../Divider';
import BtnRect from '../buttons/BtnRect';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowHeader3 from '../ArrowHeader3';
import PhaseActionCard from '../maps/PhaseActionCard';
import { calculateDamage } from 'src/utils/calculateDamage';
import DamageIcon from '../icons/DamageIcon';
import ArrowHeader4 from '../ArrowHeader4';
import { socket } from 'src/socket';
import ItemCardExpanding from '../maps/ItemCardExpanding';
import useCharacterQuery from 'src/hooks/useCharacterQuery/useCharacterQuery';
import BlockIcon from '../icons/BlockIcon';
import ArmorIcon from '../icons/ArmorIcon';
import Icon from '@mdi/react';
import { mdiChevronDown, mdiMinus, mdiPlus } from '@mdi/js';
import { useForm } from '@tanstack/react-form';
import { useContext, useState } from 'react';
import ExpandingList from '../ExpandingList';
import useEditBlockMutation from 'src/hooks/item stat hooks/useEditBlockMutation/useEditBlockMutation';
import { EncounterContext } from 'src/contexts/EncounterContext';
import useCombatStore from 'src/stores/combatStore';
import { Item } from 'src/types/item';

const ActionQueueModal = () => {
  const { combat, encounterPermissions, resetRolls } =
    useContext(EncounterContext);

  const navigate = useNavigate();
  const { campaignId, encounterId } = useParams();
  const [listExpanded, setListExpanded] = useState(false);
  const [blockDataIndex, setBlockDataIndex] = useState(0);

  const editBlock = useEditBlockMutation();

  const phaseAction = combat.phaseHistory[0].action || null;
  const phaseReactions = combat.phaseHistory[0].reactions || null;

  const reducedSuccesses = phaseReactions.reduce((sum: number, reaction) => {
    if (reaction.name === 'Parry') {
      return sum + reaction.rollResult.successes;
    } else {
      return sum;
    }
  }, 0);

  const setTarget = useCombatStore((state) => state.setTarget);

  const { data: target } = useCharacterQuery(phaseAction?.targetId);

  const armor = phaseAction?.targetId
    ? target.equipment.armors
        .filter((armor) => armor.stats.armor && armor.stats.currentBlock > 0)
        .sort((a, b) => b.stats.armor - a.stats.armor)
    : [];

  const wardArmor = phaseAction?.targetId
    ? target?.equipment.armors
        .filter((armor) => armor.stats.ward && armor.stats.currentBlock > 0)
        .sort((a, b) => b.stats.ward - a.stats.ward)
    : [];

  const { damage, instances } = phaseAction?.rollResult
    ? calculateDamage(
        phaseAction?.item,
        phaseAction?.action,
        phaseAction?.rollResult.successes - reducedSuccesses,
      )
    : { damage: null, instances: null };

  const blockForm = useForm({
    defaultValues: {
      blockData:
        damage && instances
          ? Array.from({ length: instances }, () => ({
              damage: damage / instances,
              blockedDamage: 0,
              armorIds: [] as number[],
            }))
          : [],
    },
    onSubmit: ({ value }) => {
      console.log(value);
      // value.armorData.forEach((data) => {
      //   if (data.blocks > 0) {
      //     editBlock.mutate({ itemId: data.armor.id, value: -1 * data.blocks });
      //   }
      // });
    },
  });

  return (
    <Modal>
      <h1>Action Queue</h1>
      <div className="absolute left-4 top-4 flex flex-col gap-2">
        <ArrowHeader4 title={`Round ${combat.phaseHistory[0].round}`} />
        <ArrowHeader4 title={`Turn ${combat.phaseHistory[0].turn}`} />
      </div>
      <Divider className="opacity-50" />
      <p className="text-tertiary w-full border-x-2 border-x-gray-400 border-opacity-50 px-4">
        The Action Queue is a history of actions and reactions that have been
        rolled for on this specific turn. The successes from the current pending
        action and success reductions from pending reactions such as "Parry" are
        totalled and shown. After all character reactions have been either
        rolled or passed, the calculated damage will be applied to the target
        character. The Action Queue resets for each gameplay action taken.
      </p>

      {phaseAction ? (
        <>
          <ArrowHeader3 title="Pending Action" className="self-start" />
          <PhaseActionCard phaseAction={phaseAction} />
        </>
      ) : (
        <h2>No Actions currently in Queue</h2>
      )}
      {phaseReactions.length > 0 && (
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
            <div className="flex w-full items-center justify-between">
              <ArrowHeader3 title="Action Successes" />
              <h2 className="flex size-6 items-center justify-center">
                {phaseAction.rollResult.successes}
              </h2>
            </div>
          )}
          {!!instances && (
            <>
              <div className="flex w-full items-center justify-between">
                <ArrowHeader3 title="Damage Instances" />
                <h2 className="flex size-6 items-center justify-center">
                  {instances}
                </h2>
              </div>
              <div className="flex w-full items-center justify-between">
                <ArrowHeader3 title="Damage Per Instance" />
                <h2 className="flex size-6 items-center justify-center">
                  {damage / instances}
                </h2>
              </div>
            </>
          )}
          {phaseReactions && phaseReactions.length > 0 && (
            <div className="flex w-full items-center justify-between">
              <ArrowHeader3 title="Reaction Success Reductions" />
              <h2 className="flex size-6 items-center justify-center">
                {reducedSuccesses}
              </h2>
            </div>
          )}
          <Divider className="opacity-50" />
          {armor && armor.length > 0 && (
            <blockForm.Field name="blockData">
              {(field) => (
                <>
                  <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-8">
                    {field.state.value.map((_, i) => (
                      <blockForm.Field key={i} name={`blockData[${i}]`}>
                        {(subField) => {
                          const blocked =
                            subField.state.value.blockedDamage >=
                            subField.state.value.damage;
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
                                onClick={() => setBlockDataIndex(i)}
                                className={`${blocked ? 'border-green-500' : 'border-red-500'} group flex size-12 items-center justify-center rounded-full border-2`}
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
                                {subField.state.value.damage}
                              </p>
                            </div>
                          );
                        }}
                      </blockForm.Field>
                    ))}
                  </div>
                  <ExpandingList
                    title="Assign Blocks"
                    className="flex flex-col items-center gap-4"
                    onClick={() => setListExpanded((prev) => !prev)}
                  >
                    {field.state.value.map(
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
                                    if (data.armorIds.includes(armor.id)) {
                                      return sum + 1;
                                    } else {
                                      return sum;
                                    }
                                  },
                                  0,
                                );

                                const available = armor.stats.currentBlock
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
                                        className={`${blocking && 'ring-2 ring-green-500'} ${!blocking && !available && 'pointer-events-none opacity-50'} bg-tertiary group rounded p-2 shadow-md shadow-black`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log(
                                            subField.state.value.armorIds,
                                            armor.id,
                                          );

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
                    )}
                  </ExpandingList>
                </>
              )}
            </blockForm.Field>
          )}

          {phaseAction && phaseAction.item && (
            <blockForm.Subscribe selector={(state) => state.values.blockData}>
              {(blockData) => {
                const totalBlockedDamage = blockData
                  ? blockData.reduce((sum, data) => {
                      if (data.blockedDamage >= data.damage) {
                        return sum + data.damage;
                      } else {
                        return sum + data.blockedDamage;
                      }
                    }, 0)
                  : 0;

                return (
                  <>
                    <div className="mt-2 flex w-full items-center justify-between">
                      <ArrowHeader3 title="Blocked Damage" />
                      <div className="flex items-center gap-4">
                        <ArmorIcon className="text-primary size-8" />
                        <h2 className="flex size-6 items-center justify-center">
                          {totalBlockedDamage}
                        </h2>
                        {totalBlockedDamage > damage && (
                          <h3 className="text-base !text-red-600">
                            ({totalBlockedDamage - damage})
                          </h3>
                        )}
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <ArrowHeader3 title="Final Damage" />
                      <div className="flex items-center gap-4">
                        <DamageIcon className="text-primary size-8" />
                        <h2 className="flex size-6 items-center justify-center">
                          {damage - totalBlockedDamage > 0
                            ? damage - totalBlockedDamage
                            : 0}
                        </h2>
                      </div>
                    </div>
                  </>
                );
              }}
            </blockForm.Subscribe>
          )}
        </div>
      )}
      {combat.passes.length >= combat.turnOrder.length - 1 &&
      encounterPermissions ? (
        <BtnRect
          className="w-full"
          ariaLabel="Confirm action queue results"
          type="button"
          onClick={() => {
            const blockData = blockForm.getFieldValue('blockData');

            socket.emit('confirmActionQueueResults', {
              campaignId: Number(campaignId),
              encounterId: Number(encounterId),
              blockData,
            });

            socket.emit('advancePhase', {
              campaignId: Number(campaignId),
              encounterId: Number(encounterId),
            });

            socket.emit('resetBoard', {
              encounterId: Number(encounterId),
            });
            resetRolls();
            setTarget(null);

            navigate('..');
          }}
        >
          Confirm Action Queue Results
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
