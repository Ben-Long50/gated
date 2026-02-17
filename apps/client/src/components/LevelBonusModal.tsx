import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import Modal from './modals/Modal';
import getLevelBonusData from 'src/utils/getLevelBonusData';
import useCharacter from 'src/hooks/useCharacter';
import Loading from './Loading';
import AttributeField from './formFields/AttributeField';
import { useForm, useStore } from '@tanstack/react-form';
import BtnRect from './buttons/BtnRect';
import Perks from './Perks';
import getUsedPoints, { subtractAttributeTrees } from 'src/utils/getUsedPoints';
import AttributeList from './AttributeList';
import Divider from './Divider';
import useSelectLevelUpBonusMutation from 'src/hooks/character hooks/useUpdateCharacterLevelMutation/useSelectLevelUpBonusMutation';
import validateLevelUpBonus from 'src/utils/validateLevelUpBonus';

const LevelBonusModal = () => {
  const { characterId } = useParams();
  const [searchParams] = useSearchParams();

  const location = useLocation();
  const level = searchParams.get('level');

  const {
    filteredCharacter: character,
    isLoading,
    isPending,
  } = useCharacter(Number(characterId));

  const {
    levelUpAttributePoints,
    levelUpSkillPoints,
    levelUpPerkPoints,
    levelUpMasterPerkPoints,
  } = getLevelBonusData(character, Number(level));

  const selectLevelUpBonus = useSelectLevelUpBonusMutation(Number(characterId));

  const levelBonusForm = useForm({
    defaultValues: {
      level: Number(level),
      attributes: character?.attributes,
      perks: character?.perks,
    },
    onSubmit: ({ value }) => {
      const data = { level: value.level };

      if (levelUpAttributePoints || levelUpSkillPoints) {
        data.attributes = value.attributes;
      }

      if (levelUpPerkPoints || levelUpMasterPerkPoints) {
        data.perks = value.perks;
      }

      selectLevelUpBonus.mutate(data);
    },
    validators: {
      onSubmit: ({ value }) => {
        const validationData = validateLevelUpBonus({
          level: value.level,
          attributes: value.attributes,
          perks: value.perks,
        });

        if (!validationData.validated) {
          return `Adjust your bonus selection by the following values: ${validationData.errors.join(', ')}`;
        }
      },
    },
  });

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

  if (isLoading || isPending) {
    return <Loading />;
  }

  return (
    <Modal
      path={location.pathname}
      button={
        <BtnRect
          className="group w-full"
          ariaLabel="Confirm level bonus"
          onClick={(e) => {
            e.preventDefault();
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
      {levelUpSkillPoints > 0 && (
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
          {totalPoints > 0 && <Divider className="opacity-50" />}
          {totalPoints > 0 && (
            <div className="flex w-full flex-col items-start gap-4">
              <p className="mr-auto">Selected Bonuses</p>
              <AttributeList
                className="mr-auto"
                attributeTree={subtractedTree}
              />
            </div>
          )}
        </>
      )}
      {levelUpPerkPoints + levelUpMasterPerkPoints > 0 && (
        <>
          <p>{`Select an additional ${levelUpPerkPoints + levelUpMasterPerkPoints} Perk(s) and confirm your level up bonus. This action cannot be undone`}</p>
          <levelBonusForm.Field name="perks">
            {(field) => (
              <Perks
                title="Link Perks"
                forcedMode="form"
                field={field}
                attributeTree={character?.attributes}
              />
            )}
          </levelBonusForm.Field>
        </>
      )}
    </Modal>
  );
};

export default LevelBonusModal;
