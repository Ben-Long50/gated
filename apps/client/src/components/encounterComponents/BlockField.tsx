import { useContext, useEffect, useState } from 'react';
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
import useCharacter from 'src/hooks/useCharacter';
import constructName from 'src/utils/constructName';
import { CampaignContext } from 'src/contexts/CampaignContext';
import { socket } from 'src/socket';
import { useParams } from 'react-router-dom';

const BlockField = ({
  phaseAction,
  results,
}: {
  phaseAction: History;
  results: ActionData;
}) => {
  const { gameMaster } = useContext(CampaignContext);
  const { controlledCharacter, getBlockData, setBlockData } =
    useContext(EncounterContext);
  const { encounterId } = useParams();

  const [listExpanded, setListExpanded] = useState(false);
  const [blockDataIndex, setBlockDataIndex] = useState(0);

  const { filteredCharacter: target } = useCharacter(phaseAction.targetId);

  useEffect(() => {
    if (target?.id) {
      const blockData = getBlockData(`character ${target?.id}`);

      if (!blockData) {
        setBlockData(
          `character ${target?.id}`,
          Array.from({ length: results.resultingInstances }).map(() => ({
            blockedDamage: 0,
            blockedSanityDamage: 0,
            armorIds: [],
          })),
        );
      }
    }
  }, [phaseAction, target?.id, results]);

  const blockData = getBlockData(`character ${target?.id}`) || [];

  const blockPermissions = gameMaster || controlledCharacter?.id === target?.id;

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

  const insertNewValue = (
    value: {
      blockedDamage: number;
      blockedSanityDamage: number;
      armorIds: number[];
    },
    index: number,
  ) => {
    const newBlockData = blockData.map((data, i) =>
      index === i ? value : data,
    );

    setBlockData(`character ${target?.id}`, newBlockData);
    socket.emit('blockData', {
      encounterId: Number(encounterId),
      characterId: target?.id,
      blockData: newBlockData,
    });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <ArrowHeader3
        className="w-full"
        title={`Assign Blocks for ${constructName(target)}`}
      />
      {results.damage > 0 && (
        <>
          <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-8">
            {blockData.map((_: any, i: number) => {
              const blocked = blockData[i].blockedDamage >= results.damage;

              return (
                <div
                  key={i}
                  className="flex flex-col items-center justify-end gap-2"
                >
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
                    {blockData[i].blockedDamage} / {results.damage}
                  </p>
                </div>
              );
            })}
          </div>
          <ExpandingList
            title="Armor"
            className="flex flex-col items-center gap-4"
            onClick={() => setListExpanded((prev) => !prev)}
          >
            {armor && armor.length === 0 ? (
              <h3 className="italic">No Available Armor</h3>
            ) : armor ? (
              blockData.map(
                (_: any, i: number) =>
                  blockDataIndex === i &&
                  armor.map((armor: Item) => {
                    const blocking = blockData[i].armorIds.includes(armor.id);

                    const uses = blockData.reduce((sum: number, data) => {
                      if (data.armorIds.includes(armor.id)) {
                        return sum + 1;
                      } else {
                        return sum;
                      }
                    }, 0);

                    const available = armor.stats.currentBlock
                      ? uses < armor.stats.currentBlock
                      : 0;

                    return (
                      <div
                        key={`${i} ${armor.id}`}
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

                              if (blockData[i].armorIds.includes(armor.id)) {
                                const newArmorIds = blockData[
                                  i
                                ].armorIds.filter(
                                  (id: number) => id !== armor.id,
                                );

                                insertNewValue(
                                  {
                                    ...blockData[i],
                                    blockedDamage:
                                      blockData[i].blockedDamage -
                                      armor.stats.armor,
                                    armorIds: newArmorIds,
                                  },
                                  i,
                                );
                              } else {
                                insertNewValue(
                                  {
                                    ...blockData[i],
                                    blockedDamage:
                                      blockData[i].blockedDamage +
                                      armor.stats.armor,
                                    armorIds: [
                                      ...blockData[i].armorIds,
                                      armor.id,
                                    ],
                                  },
                                  i,
                                );
                              }
                            }}
                          >
                            <BlockIcon className="text-primary hover:text-accent size-8" />
                          </button>
                        </div>
                      </div>
                    );
                  }),
              )
            ) : (
              <h3 className="italic">Armor Unknown</h3>
            )}
          </ExpandingList>
        </>
      )}
      {results.sanityDamage > 0 && (
        <>
          <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-8">
            {blockData.map((_: any, i: number) => {
              const blocked =
                blockData[i].blockedSanityDamage >= results.sanityDamage;

              return (
                <div
                  key={i}
                  className="flex flex-col items-center justify-end gap-2"
                >
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
                    {blockData[i].blockedSanityDamage} / {results.sanityDamage}
                  </p>
                </div>
              );
            })}
          </div>
          <ExpandingList
            title="Ward"
            className="flex flex-col items-center gap-4"
            onClick={() => setListExpanded((prev) => !prev)}
          >
            {wardArmor && wardArmor.length === 0 ? (
              <h3 className="italic">No Available Ward</h3>
            ) : wardArmor ? (
              blockData.map(
                (_: any, i: number) =>
                  blockDataIndex === i &&
                  wardArmor.map((armor: Item) => {
                    const blocking = blockData[i].armorIds.includes(armor.id);

                    const uses = blockData.reduce((sum: number, data) => {
                      if (data.armorIds.includes(armor.id)) {
                        return sum + 1;
                      } else {
                        return sum;
                      }
                    }, 0);

                    const available = armor.stats.currentBlock
                      ? uses < armor.stats.currentBlock
                      : 0;

                    return (
                      <div
                        key={`${i} ${armor.id}`}
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

                              if (blockData[i].armorIds.includes(armor.id)) {
                                const newArmorIds = blockData[
                                  i
                                ].armorIds.filter(
                                  (id: number) => id !== armor.id,
                                );

                                insertNewValue(
                                  {
                                    ...blockData[i],
                                    blockedSanityDamage:
                                      blockData[i].blockedSanityDamage -
                                      armor.stats.ward,
                                    armorIds: newArmorIds,
                                  },
                                  i,
                                );
                              } else {
                                insertNewValue(
                                  {
                                    ...blockData[i],
                                    blockedSanityDamage:
                                      blockData[i].blockedSanityDamage +
                                      armor.stats.ward,
                                    armorIds: [
                                      ...blockData[i].armorIds,
                                      armor.id,
                                    ],
                                  },
                                  i,
                                );
                              }
                            }}
                          >
                            <WardIcon className="text-primary hover:text-accent size-8" />
                          </button>
                        </div>
                      </div>
                    );
                  }),
              )
            ) : (
              <h2 className="italic">Ward Unknown</h2>
            )}
          </ExpandingList>
        </>
      )}
    </div>
  );
};

export default BlockField;
