import Modal from './Modal';
import Divider from '../Divider';
import BtnRect from '../buttons/BtnRect';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import ArrowHeader3 from '../ArrowHeader3';
import PhaseActionCard from '../maps/PhaseActionCard';
import { calculateDamage } from 'src/utils/calculateDamage';
import DamageIcon from '../icons/DamageIcon';
import ArrowHeader4 from '../ArrowHeader4';
import { socket } from 'src/socket';
import { calculateArmorDamage } from 'src/utils/calculateArmorDamage';
import ItemCardExpanding from '../maps/ItemCardExpanding';
import useCharacterQuery from 'src/hooks/useCharacterQuery/useCharacterQuery';
import BlockIcon from '../icons/BlockIcon';
import ArmorIcon from '../icons/ArmorIcon';
import Icon from '@mdi/react';
import { mdiMinus, mdiPlus } from '@mdi/js';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import ExpandingList from '../ExpandingList';

const ActionQueueModal = () => {
  const navigate = useNavigate();
  const { campaignId, encounterId } = useParams();
  const [listExpanded, setListExpanded] = useState(false);

  const { combat, encounterPermissions } = useOutletContext() || {};

  const phaseAction = combat.phaseHistory[0].action || null;
  const phaseReactions = combat.phaseHistory[0].reactions || null;

  const reducedSuccesses = phaseReactions.reduce((sum: number, reaction) => {
    if (reaction.name === 'Parry') {
      return sum + reaction.rollResult.successes;
    } else {
      return sum;
    }
  }, 0);

  const { data: target } = useCharacterQuery(phaseAction.targetId);

  const armor = target?.equipment.armors
    .filter((armor) => armor.stats.armor && armor.stats.currentBlock > 0)
    .sort((a, b) => b.stats.armor - a.stats.armor);

  const wardArmor = target?.equipment.armors
    .filter((armor) => armor.stats.ward && armor.stats.currentBlock > 0)
    .sort((a, b) => b.stats.ward - a.stats.ward);

  const { damage, instances } = calculateDamage(
    phaseAction.item,
    phaseAction.action,
    phaseAction.rollResult.successes - reducedSuccesses,
  );

  const blockForm = useForm({
    defaultValues: {
      armorData: armor.map((armor) => ({ armor, blocks: 0 })),
    },
    onSubmit: ({ value }) => {
      console.log(value);
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
        {phaseAction && (
          <div className="flex w-full items-center justify-between">
            <ArrowHeader3 title="Action Successes" />
            <h2 className="flex size-6 items-center justify-center">
              {phaseAction.rollResult.successes}
            </h2>
          </div>
        )}
        {instances && (
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
        {phaseReactions.length > 0 && (
          <div className="flex w-full items-center justify-between">
            <ArrowHeader3 title="Reaction Success Reductions" />
            <h2 className="flex size-6 items-center justify-center">
              {reducedSuccesses}
            </h2>
          </div>
        )}
        <Divider className="opacity-50" />
        {armor.length > 0 && (
          <ExpandingList
            title="Assign Blocks"
            className="flex flex-col items-center gap-4"
            onClick={() => setListExpanded((prev) => !prev)}
          >
            {
              <blockForm.Field name="armorData">
                {(field) =>
                  field.state.value.map((_, i) => (
                    <blockForm.Field key={i} name={`armorData[${i}]`}>
                      {(subField) => (
                        <div className="flex w-full items-center gap-8">
                          <ItemCardExpanding
                            expanded={listExpanded}
                            itemId={subField.state.value.armor.id}
                          />
                          <div className="flex items-center gap-4">
                            <button
                              className="bg-tertiary group rounded p-1 shadow-md shadow-black"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (subField.state.value.blocks > 0) {
                                  subField.handleChange({
                                    ...subField.state.value,
                                    blocks: subField.state.value.blocks - 1,
                                  });
                                }
                              }}
                            >
                              <Icon
                                className="text-primary group-hover:text-accent timing"
                                path={mdiMinus}
                                size={1}
                              />
                            </button>
                            <button
                              className="bg-tertiary group rounded p-1 shadow-md shadow-black"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (instances > subField.state.value.blocks) {
                                  subField.handleChange({
                                    ...subField.state.value,
                                    blocks: subField.state.value.blocks + 1,
                                  });
                                }
                              }}
                            >
                              <Icon
                                className="text-primary group-hover:text-accent timing"
                                path={mdiPlus}
                                size={1}
                              />
                            </button>
                            <BlockIcon className="text-primary size-8" />
                            <h2 className="flex size-6 items-center justify-center">
                              {subField.state.value.blocks}
                            </h2>
                          </div>
                        </div>
                      )}
                    </blockForm.Field>
                  ))
                }
              </blockForm.Field>
            }
          </ExpandingList>
        )}
        {phaseAction && phaseAction.item && (
          <blockForm.Subscribe selector={(state) => state.values.armorData}>
            {(armorData) => {
              const blockedDamage = armorData.reduce((sum, data) => {
                const damagePerBlock =
                  data.armor.stats.armor > phaseAction.item.stats.damage
                    ? phaseAction.item.stats.damage
                    : data.armor.stats.armor;
                return sum + damagePerBlock * data.blocks;
              }, 0);

              return (
                <>
                  <div className="mt-2 flex w-full items-center justify-between">
                    <ArrowHeader3 title="Blocked Damage" />
                    <div className="flex items-center gap-4">
                      <ArmorIcon className="text-primary size-8" />
                      <h2 className="flex size-6 items-center justify-center">
                        {blockedDamage}
                      </h2>
                      {blockedDamage > damage && (
                        <h3 className="text-base !text-red-600">
                          ({blockedDamage - damage})
                        </h3>
                      )}
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <ArrowHeader3 title="Total Damage" />
                    <div className="flex items-center gap-4">
                      <DamageIcon className="text-primary size-8" />
                      <h2 className="flex size-6 items-center justify-center">
                        {damage - blockedDamage > 0
                          ? damage - blockedDamage
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
      {combat.passes.length >= combat.turnOrder.length - 1 &&
      encounterPermissions ? (
        <BtnRect
          className="w-full"
          ariaLabel="Close"
          type="button"
          onClick={() => {
            socket.emit('confirmActionQueueResults', {
              campaignId: Number(campaignId),
              encounterId: Number(encounterId),
            });

            socket.emit('advanceTurn', {
              campaignId: Number(campaignId),
              encounterId: Number(encounterId),
            });

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
