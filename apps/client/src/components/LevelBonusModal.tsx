import { useParams, useSearchParams } from 'react-router-dom';
import Modal from './modals/Modal';
import useCharacter from 'src/hooks/useCharacter';
import Loading from './Loading';
import AttributeField from './formFields/AttributeField';
import BtnRect from './buttons/BtnRect';
import Perks from './Perks';
import useSelectLevelUpBonusMutation from 'src/hooks/character hooks/useUpdateCharacterLevelMutation/useSelectLevelUpBonusMutation';
import { useState } from 'react';
import BtnAuth from './buttons/BtnAuth';
import useLevelBonusForm from 'src/hooks/form hooks/useLevelBonusForm';
import calculateLevelBonus from 'src/utils/calculateLevelBonus';
import { getUsedPoints } from 'src/utils/getUsedPoints';
import { combineAttributeTrees } from 'src/utils/combineAttributeTrees';

const LevelBonusModal = () => {
  const { characterId } = useParams();
  const [searchParams] = useSearchParams();

  const level = searchParams.get('level');

  const { filteredCharacter: character, isLoading } = useCharacter(
    Number(characterId),
  );

  const { attributePoints, skillPoints, perkPoints, masterPerkPoints } =
    calculateLevelBonus(Number(level));

  const [tab, setTab] = useState(skillPoints ? 'attributes' : 'perks');

  const selectLevelUpBonus = useSelectLevelUpBonusMutation(Number(characterId));

  const levelBonusForm = useLevelBonusForm(
    selectLevelUpBonus,
    Number(level),
    character,
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Modal
      button={
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
        (skillPoints + attributePoints > 0 ? (
          <levelBonusForm.Subscribe
            selector={(state) => state.values.attributes}
          >
            {(attributes) => {
              const { usedAttributePoints, usedSkillPoints } =
                getUsedPoints(attributes);
              return (
                <>
                  {attributePoints > 0 && (
                    <div className="flex w-full items-center justify-between gap-8">
                      <p>Attribute Points</p>
                      <p>
                        {usedAttributePoints} / {attributePoints}
                      </p>
                    </div>
                  )}
                  {skillPoints > 0 && (
                    <div className="flex w-full items-center justify-between gap-8">
                      <p>Skill Points</p>
                      <p>
                        {usedSkillPoints} / {skillPoints}
                      </p>
                    </div>
                  )}
                  <AttributeField
                    form={levelBonusForm}
                    attributeTree={
                      character?.playerCharacter
                        ? character?.attributes
                        : undefined
                    }
                    attributeIncrease={usedAttributePoints < attributePoints}
                    attributeDecrease={false}
                    skillIncrease={usedSkillPoints < skillPoints}
                    skillDecrease={false}
                  />
                </>
              );
            }}
          </levelBonusForm.Subscribe>
        ) : (
          <p>You may not select an Attribute or Skill bonus for this level</p>
        ))}
      {tab === 'perks' &&
        (perkPoints + masterPerkPoints > 0 ? (
          <>
            <p>{`Select an additional ${perkPoints + masterPerkPoints} Perk(s) and confirm your level up bonus. This action cannot be undone`}</p>
            <levelBonusForm.Subscribe
              selector={(state) => state.values.attributes}
            >
              {(attributes) => (
                <Perks
                  form={levelBonusForm}
                  attributeTree={combineAttributeTrees([
                    attributes,
                    character?.attributes,
                  ])}
                />
              )}
            </levelBonusForm.Subscribe>
          </>
        ) : (
          <p>You may not select a Perk bonus for this level</p>
        ))}
    </Modal>
  );
};

export default LevelBonusModal;
