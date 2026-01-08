import { useContext, useState } from 'react';
import { EncounterContext } from 'src/contexts/EncounterContext';
import WardIcon from '../icons/WardIcon';
import ItemCardExpanding from './ItemCardExpanding';
import ExpandingList from '../ExpandingList';
import ArrowHeader3 from '../ArrowHeader3';
import { History } from 'src/types/encounter';
import { Item } from 'src/types/item';
import { ActionData } from 'src/types/actionData';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';
import BlockIcon from '../icons/BlockIcon';
import { socket } from 'src/socket';
import { useParams } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import useCharacter from 'src/hooks/useCharacter';

const BlockField = ({
  phaseAction,
  results,
}: {
  phaseAction: History;
  results: ActionData;
}) => {
  const { gameMaster, controlledCharacter } = useContext(EncounterContext);
  const { encounterId } = useParams();

  const [listExpanded, setListExpanded] = useState(false);
  const [blockDataIndex, setBlockDataIndex] = useState(0);

  const { filteredCharacter: target } = useCharacter(phaseAction.targetId);

  const blockPermissions = gameMaster || controlledCharacter.id === target?.id;

  const armor = target
    ? target?.equipment?.armors
        .filter(
          (armor: Item) =>
            armor.stats.armor &&
            armor.stats.currentBlock &&
            armor.stats.currentBlock > 0,
        )
        .sort((a: Item, b: Item) => b.stats.armor - a.stats.armor)
    : [];

  const wardArmor = target
    ? target?.equipment?.armors
        .filter(
          (armor: Item) =>
            armor.stats.ward &&
            armor.stats.currentBlock &&
            armor.stats.currentBlock > 0,
        )
        .sort((a: Item, b: Item) => b.stats.ward - a.stats.ward)
    : [];

  const blockForm = useForm({
    defaultValues: {
      blockData:
        results && (results.damage || results.sanityDamage) && results.instances
          ? Array.from({ length: results.instances }, () => ({
              blockedDamage: 0,
              blockedSanityDamage: 0,
              armorIds: [] as number[],
            }))
          : [],
    },
    onSubmit: ({ value }) => {
      socket.emit('blockData', {
        encounterId: Number(encounterId),
        blockData: value.blockData,
      });
    },
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <ArrowHeader3 className="w-full" title="Assign Blocks" />
      {results.damage > 0 && (
        <blockForm.Field name="blockData">
          {(field) => (
            <>
              <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-8">
                {field.state.value.map((_, i) => (
                  <blockForm.Field key={i} name={`blockData[${i}]`}>
                    {(subField) => {
                      const blocked =
                        subField.state.value.blockedDamage >= results.damage;

                      return (
                        <div className="flex flex-col items-center justify-end gap-2">
                          {blockDataIndex === i && blockPermissions && (
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
                            {results.damage}
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
                                              ...subField.state.value.armorIds,
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
      {results.sanityDamage > 0 && (
        <blockForm.Field name="blockData">
          {(field) => (
            <>
              <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-8">
                {field.state.value.map((_, i) => (
                  <blockForm.Field key={i} name={`blockData[${i}]`}>
                    {(subField) => {
                      const blocked =
                        subField.state.value.blockedSanityDamage >=
                        results.sanityDamage;

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
                            {subField.state.value.blockedSanityDamage} /{' '}
                            {results.sanityDamage}
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
                                              ...subField.state.value.armorIds,
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
  );
};

export default BlockField;
