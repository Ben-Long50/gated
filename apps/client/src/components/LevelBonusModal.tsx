import { useParams, useSearchParams } from 'react-router-dom';
import Modal from './modals/Modal';
import getLevelBonusData from 'src/utils/getLevelBonusData';
import useCharacter from 'src/hooks/useCharacter';
import Loading from './Loading';
import AttributeField from './formFields/AttributeField';
import { useStore } from '@tanstack/react-form';
import BtnRect from './buttons/BtnRect';
import Perks from './Perks';
import getUsedPoints, { subtractAttributeTrees } from 'src/utils/getUsedPoints';
import AttributeList from './AttributeList';
import useSelectLevelUpBonusMutation from 'src/hooks/character hooks/useUpdateCharacterLevelMutation/useSelectLevelUpBonusMutation';
import { useState } from 'react';
import BtnAuth from './buttons/BtnAuth';
import useLevelBonusForm from 'src/hooks/form hooks/useLevelBonusForm';
import PerkCard from './PerkCard';
import ArrowHeader4 from './ArrowHeader4';

const LevelBonusModal = () => {
  const { characterId } = useParams();
  const [searchParams] = useSearchParams();

  const level = searchParams.get('level');

  const { filteredCharacter: character, isLoading } = useCharacter(
    Number(characterId),
  );

  const {
    levelUpAttributePoints,
    levelUpSkillPoints,
    levelUpPerkPoints,
    levelUpMasterPerkPoints,
  } = getLevelBonusData(character, Number(level));

  const [tab, setTab] = useState(levelUpSkillPoints ? 'attributes' : 'perks');

  const selectLevelUpBonus = useSelectLevelUpBonusMutation(Number(characterId));

  const levelBonusForm = useLevelBonusForm(
    selectLevelUpBonus,
    Number(level),
    character,
  );

  const formAttributeTree = useStore(
    levelBonusForm.store,
    (state) => state.values.attributes,
  );

  const subtractedTree = subtractAttributeTrees(
    formAttributeTree,
    character?.attributes,
  );

  const { usedAttributePoints, usedSkillPoints } =
    getUsedPoints(subtractedTree);

  const totalPoints = usedAttributePoints + usedSkillPoints;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Modal
      button={
        <div className="flex w-full flex-col gap-8">
          {totalPoints > 0 && (
            <div className="flex w-full flex-col items-start gap-4">
              <ArrowHeader4
                className="text-primary"
                title="Selected Attribute and Skill Bonuses"
              />
              <AttributeList
                className="mr-auto"
                attributeTree={subtractedTree}
              />
            </div>
          )}
          <levelBonusForm.Subscribe selector={(state) => state.values.perkIds}>
            {(perkIds) => {
              const selectedPerkIds = perkIds.filter(
                (id) => !character?.perks?.some((perk) => perk.id === id),
              );

              return (
                selectedPerkIds.length > 0 && (
                  <div className="flex w-full flex-col items-start gap-4">
                    <ArrowHeader4
                      className="text-primary"
                      title="Selected Perk Bonuses"
                    />
                    <div className="grid w-full grid-cols-2 gap-4">
                      {selectedPerkIds.map((perkId) => (
                        <PerkCard perkId={perkId} form={levelBonusForm} />
                      ))}
                    </div>
                  </div>
                )
              );
            }}
          </levelBonusForm.Subscribe>
          <BtnRect
            className="group w-full"
            ariaLabel="Confirm level bonus"
            onClick={() => {
              if (!selectLevelUpBonus.isPending) {
                levelBonusForm.handleSubmit();
              }
            }}
          >
            {selectLevelUpBonus.isPending ? (
              <Loading className="group-hover:text-accent" size={1.15} />
            ) : (
              'Confirm Bonus'
            )}
          </BtnRect>
        </div>
      }
      errors={
        <levelBonusForm.Subscribe selector={(state) => state.errorMap}>
          {(errorMap) =>
            errorMap.onSubmit ? (
              <em className="text-error text-lg">{errorMap.onSubmit}</em>
            ) : null
          }
        </levelBonusForm.Subscribe>
      }
    >
      <h1>{`Select Level ${level} Bonus`}</h1>
      <div className="flex w-full items-center gap-8">
        <BtnAuth
          className="w-full"
          active={tab === 'attributes'}
          onClick={() => setTab('attributes')}
        >
          Attributes
        </BtnAuth>
        <BtnAuth
          className="w-full"
          active={tab === 'perks'}
          onClick={() => setTab('perks')}
        >
          Perks
        </BtnAuth>
      </div>
      {tab === 'attributes' &&
        (levelUpSkillPoints + levelUpAttributePoints > 0 ? (
          <>
            <p>{`Distribute ${levelUpSkillPoints} Skill Point(s) and confirm your level up bonus. This action cannot be undone`}</p>
            <AttributeField
              form={levelBonusForm}
              attributeTree={character?.attributes}
              attributeIncrease={levelUpAttributePoints > 0}
              attributeDecrease={false}
              skillIncrease={levelUpSkillPoints > 0}
              skillDecrease={false}
            />
          </>
        ) : (
          <p>You may not select an Attribute or Skill bonus for this level</p>
        ))}
      {tab === 'perks' &&
        (levelUpPerkPoints + levelUpMasterPerkPoints > 0 ? (
          <>
            <p>{`Select an additional ${levelUpPerkPoints + levelUpMasterPerkPoints} Perk(s) and confirm your level up bonus. This action cannot be undone`}</p>
            <Perks
              form={levelBonusForm}
              attributeTree={character?.attributes}
            />
          </>
        ) : (
          <p>You may not select a Perk bonus for this level</p>
        ))}
    </Modal>
  );
};

export default LevelBonusModal;
