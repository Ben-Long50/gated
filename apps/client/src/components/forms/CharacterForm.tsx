import { useDebugValue, useMemo } from 'react';
import InputField from '../formFields/InputField';
import { useStore, ValidationError } from '@tanstack/react-form';
import useAttributeTree from '../../hooks/useAttributeTree';
import useCreateCharacterMutation from '../../hooks/useCreateCharacterMutation/useCreateCharacterMutation';
import FormLayout from '../../layouts/FormLayout';
import { SortedInventory } from 'src/types/character';
import useCampaignsQuery from '../../hooks/useCampaignsQuery/useCampaignsQuery';
import ArrowHeader2 from '../ArrowHeader2';
import Divider from '../Divider';
import InputFieldRadio from '../formFields/InputFieldRadio';
import InputSelectField from '../formFields/InputSelectField';
import PerkLinkField from '../formFields/PerkLinkField';
import NpcPreferenceField from '../formFields/NpcPreferenceField';
import PictureField from '../formFields/PictureField';
import AttributeField from '../formFields/AttributeField';
import useCharacterForm from 'src/hooks/form hooks/useCharacterForm';
import calculateStats from 'src/hooks/useStats';
import StatBarContainer from '../StatBarContainer';
import CharacterStatBars from '../characterComponents/CharacterStatBars';
import useCreateCodexCharacterMutation from 'src/hooks/useCreateCodexCharacterMutation/useCreateCodexCharacterMutation';
import { useSearchParams } from 'react-router-dom';
import ActionLinkField from '../formFields/ActionLinkField';
import calculateLevelBonus from 'src/utils/calculateLevelBonus';

const CharacterForm = () => {
  const { data: campaigns } = useCampaignsQuery();

  const [searchParams] = useSearchParams();
  const formType = searchParams.get('formType');

  const createCharacter = useCreateCharacterMutation();
  const createCodexCharacter = useCreateCodexCharacterMutation();

  const createMutation =
    formType === 'codex' ? createCodexCharacter : createCharacter;

  const characterForm = useCharacterForm(createMutation);

  const perks = useStore(characterForm.store, (state) => state.values.perkIds);

  const characterStats = useStore(
    characterForm.store,
    (state) => state.values.stats,
  );

  const attributesJson = useStore(characterForm.store, (state) =>
    JSON.stringify(state.values.attributes),
  );
  const attributes = useMemo(
    () => JSON.parse(attributesJson),
    [attributesJson],
  );

  // const { usedAttributePoints, usedSkillPoints } = useAttributeTree(attributes);

  const stats = calculateStats(
    {
      items: [],
    } as unknown as SortedInventory,
    [],
    attributes,
    perks,
    characterStats,
  );

  return (
    <FormLayout
      label="Character"
      form={characterForm}
      createMutation={createMutation}
    >
      <ArrowHeader2 title="General Information" />
      {formType !== 'codex' && (
        <characterForm.Field name="campaignId">
          {(field) => (
            <InputSelectField
              label="Campaign"
              options={campaigns || []}
              value={field.state.value}
              onChange={(value) => field.handleChange(value.id)}
            />
          )}
        </characterForm.Field>
      )}
      <characterForm.Field
        name="playerCharacter"
        listeners={{
          onChange: ({ value }) => {
            if (value) {
              characterForm.setFieldValue('npcTypes', null);
              characterForm.setFieldValue('profits', null);
              characterForm.setFieldValue('level', 1);
              characterForm.setFieldValue('description', null);
              characterForm.setFieldValue('stats', {
                permanentInjuries: 5,
                permanentInsanities: 5,
              });
            } else if (!value) {
              characterForm.setFieldValue('npcTypes', []);
              characterForm.setFieldValue('profits', 10);
              characterForm.setFieldValue('level', 1);
              characterForm.setFieldValue('description', '');
              characterForm.setFieldValue('stats', (prev) => ({
                ...prev,
                maxHealth: 0,
                maxSanity: 0,
                maxCyber: 0,
                maxEquip: 0,
                speed: 0,
                evasion: 0,
              }));
            }
          },
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-4">
            <InputFieldRadio
              label="Player Character"
              value={true}
              checked={field.state.value === true}
              onChange={() => {
                field.handleChange(true);
              }}
            />
            <InputFieldRadio
              label="Non-player Character"
              value={false}
              checked={field.state.value === false}
              onChange={() => field.handleChange(false)}
            />
            {field.state.meta.errors &&
              field.state.meta.errors.map((error: ValidationError) => (
                <p
                  key={error?.toString()}
                  className="timing text-error col-span-2 mt-1 text-base italic leading-5"
                  role="alert"
                >
                  {error}
                </p>
              ))}
          </div>
        )}
      </characterForm.Field>
      <NpcPreferenceField form={characterForm} />
      <Divider />
      <ArrowHeader2 title="Character Information" />
      <div className="grid w-full grid-cols-2 gap-4">
        <characterForm.Field name="firstName">
          {(field) => (
            <InputField
              label="First name"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </characterForm.Field>
        <characterForm.Field name="lastName">
          {(field) => (
            <InputField
              label="Last name"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </characterForm.Field>
        <characterForm.Field name="height">
          {(field) => (
            <InputField
              type="number"
              label="Height (in)"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </characterForm.Field>
        <characterForm.Field name="weight">
          {(field) => (
            <InputField
              type="number"
              label="Weight (lbs)"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </characterForm.Field>
        <characterForm.Field name="age">
          {(field) => (
            <InputField
              type="number"
              label="Age (yrs)"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </characterForm.Field>
        <characterForm.Field name="sex">
          {(field) => (
            <InputSelectField
              label="Sex"
              options={['male', 'female', 'unknown']}
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </characterForm.Field>
      </div>
      <Divider />
      <ArrowHeader2 title="Character Picture" />
      <PictureField
        form={characterForm}
        type="character"
        sizeInfo={{ aspectRatio: '1/1', maxHeight: '', minHeight: '' }}
      />
      <Divider />
      <ArrowHeader2 title="Stats" />
      <characterForm.Subscribe
        selector={(state) => state.values.playerCharacter}
      >
        {(playerCharacter) => (
          <characterForm.Field name="stats">
            {() => (
              <StatBarContainer>
                <CharacterStatBars
                  stats={stats}
                  size="large"
                  handleChange={
                    !playerCharacter
                      ? (stat, value) =>
                          characterForm.setFieldValue(
                            `stats.${stat}`,
                            (prev) => prev + value,
                          )
                      : undefined
                  }
                />
              </StatBarContainer>
            )}
          </characterForm.Field>
        )}
      </characterForm.Subscribe>
      <Divider />
      <ArrowHeader2 title="Attributes and skills" />
      <characterForm.Subscribe
        selector={(state) => [state.values.level, state.values.attributes]}
      >
        {([level, attributes]) => {
          const {
            attributePoints,
            skillPoints,
            perkPoints,
            masterPerkPoints,
            usedAttributePoints,
            usedSkillPoints,
            usedPerkPoints,
            usedMasterPerkPoints,
          } = calculateLevelBonus(level, attributes);

          return (
            <>
              <div className="flex w-full flex-col gap-4">
                <div className="flex justify-between">
                  <p>Attribute Points</p>
                  <div className="flex items-center gap-2">
                    <p className="grid size-6 place-content-center">
                      {usedAttributePoints}
                    </p>
                    <p> / </p>
                    <p className="grid size-6 place-content-center">
                      {attributePoints}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <p>Skill Points</p>
                  <div className="flex items-center gap-2">
                    <p className="grid size-6 place-content-center">
                      {usedSkillPoints}
                    </p>
                    <p> / </p>
                    <p className="grid size-6 place-content-center">
                      {skillPoints}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <p>Perks</p>
                  <div className="flex items-center gap-2">
                    <p className="grid size-6 place-content-center">
                      {usedPerkPoints}
                    </p>
                    <p> / </p>
                    <p className="grid size-6 place-content-center">
                      {perkPoints}
                    </p>
                  </div>
                </div>
                {masterPerkPoints > 0 && (
                  <div className="flex justify-between">
                    <p>Master Perks</p>
                    <div className="flex items-center gap-2">
                      <p className="grid size-6 place-content-center">
                        {usedMasterPerkPoints}
                      </p>
                      <p> / </p>
                      <p className="grid size-6 place-content-center">
                        {masterPerkPoints}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <AttributeField
                form={characterForm}
                attributeTree={attributes}
                attributeIncrease={usedAttributePoints < attributePoints}
                skillIncrease={usedSkillPoints < skillPoints}
              />
            </>
          );
        }}
      </characterForm.Subscribe>
      <Divider />
      <characterForm.Subscribe
        selector={(state) => [state.values.level, state.values.attributes]}
      >
        {([level, attributes]) => (
          <PerkLinkField
            form={characterForm}
            level={level}
            attributeTree={attributes}
            path="perks?formType=codex&mode=form"
          />
        )}
      </characterForm.Subscribe>
      <ActionLinkField
        form={characterForm}
        path="actions?formType=codex&mode=form"
      />
    </FormLayout>
  );
};

export default CharacterForm;
