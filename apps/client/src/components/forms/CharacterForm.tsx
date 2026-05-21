import { useContext, useRef } from 'react';
import InputField from '../InputField';
import { useStore, ValidationError } from '@tanstack/react-form';
import useAttributeTree from '../../hooks/useAttributeTree';
import StatBar from '../StatBar';
import useCreateCharacterMutation from '../../hooks/useCreateCharacterMutation/useCreateCharacterMutation';
import WardIcon from '../icons/WardIcon';
import SpeedIcon from '../icons/SpeedIcon';
import ArmorIcon from '../icons/ArmorIcon';
import EvasionIcon from '../icons/EvasionIcon';
import HealthIcon from '../icons/HealthIcon';
import { LayoutContext } from '../../contexts/LayoutContext';
import SanityIcon from '../icons/SanityIcon';
import CyberIcon from '../icons/CyberIcon';
import EquipIcon from '../icons/EquipIcon';
import FormLayout from '../../layouts/FormLayout';
import useStats from '../../hooks/useStats';
import { SortedInventory } from 'src/types/character';
import useCampaignsQuery from '../../hooks/useCampaignsQuery/useCampaignsQuery';
import ArrowHeader2 from '../ArrowHeader2';
import Divider from '../Divider';
import InputFieldRadio from '../InputFieldRadio';
import InputSelectField from '../InputSelectField';
import PerkLinkField from '../formFields/PerkLinkField';
import NpcPreferenceField from '../formFields/NpcPreferenceField';
import PictureField from '../formFields/PictureField';
import AttributeField from '../formFields/AttributeField';
import useCharacterForm from 'src/hooks/form hooks/useCharacterForm';

const CharacterForm = () => {
  const { layoutSize } = useContext(LayoutContext);

  const cardRef = useRef(null);

  const { data: campaigns } = useCampaignsQuery();

  const { emptyAttributeTree } = useAttributeTree();

  const createCharacter = useCreateCharacterMutation();

  const characterForm = useCharacterForm(createCharacter);

  const perks = useStore(characterForm.store, (state) => state.values.perks);

  const formStats = useStore(
    characterForm.store,
    (state) => state.values.stats,
  );

  const { stats } = useStats(
    {
      items: [],
    } as unknown as SortedInventory,
    [],
    emptyAttributeTree,
    perks,
    formStats,
  );

  return (
    <FormLayout
      label="Character"
      form={characterForm}
      createMutation={createCharacter}
    >
      <ArrowHeader2 title="Character Information" />
      <characterForm.Field
        name="playerCharacter"
        listeners={{
          onChange: ({ value }) => {
            if (value) {
              characterForm.setFieldValue('npcTypes', null);
            } else if (!value) {
              characterForm.setFieldValue('npcTypes', []);
            }
          },
        }}
      >
        {(field) => (
          <>
            <InputFieldRadio
              label="Player Character"
              field={field}
              checked={field.state.value === true}
              onChange={() => {
                field.handleChange(true);
              }}
            />
            <InputFieldRadio
              label="Non-player Character"
              field={field}
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
          </>
        )}
      </characterForm.Field>
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
      <NpcPreferenceField form={characterForm} />
      <Divider />
      <ArrowHeader2 title="Character Information" />
      <div className="flex w-full flex-col gap-8">
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
                options={['male', 'female']}
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </characterForm.Field>
        </div>
        <PictureField
          form={characterForm}
          sizeInfo={{ aspectRatio: '1/1', maxHeight: '', minHeight: '' }}
        />
      </div>
      <characterForm.Subscribe selector={(state) => state.values.attributes}>
        {(attributes) => (
          <>
            <div className={`grid w-full grid-cols-[auto_auto_1fr_auto] gap-4`}>
              <StatBar
                title="Health"
                current={
                  stats.maxHealth +
                    attributes.violence.skills.threshold.points * 2 || 0
                }
                total={
                  stats.maxHealth +
                  attributes.violence.skills.threshold.points * 2
                }
                color="rgb(248 113 113)"
                cardWidth={cardRef.current?.offsetWidth}
              >
                <HealthIcon className="text-secondary size-8" />
              </StatBar>
              <StatBar
                title="Sanity"
                current={
                  stats.maxSanity +
                    attributes.esoterica.skills.mysticism.points * 2 || 0
                }
                total={
                  stats.maxSanity +
                  attributes.esoterica.skills.mysticism.points * 2
                }
                color="rgb(96 165 250)"
                cardWidth={cardRef.current?.offsetWidth}
              >
                <SanityIcon className="text-secondary size-8" />
              </StatBar>
              <StatBar
                title="Cyber"
                current={
                  stats.maxCyber +
                    attributes.cybernetica.skills.chromebits.points * 2 || 0
                }
                total={
                  stats.maxCyber +
                  attributes.cybernetica.skills.chromebits.points * 2
                }
                color="rgb(52 211 153)"
                cardWidth={cardRef.current?.offsetWidth}
              >
                <CyberIcon className="text-secondary size-8" />
              </StatBar>
              <StatBar
                title="Equip"
                current={
                  stats.maxEquip +
                    attributes.violence.skills.threshold.points * 2 || 0
                }
                total={
                  stats.maxEquip +
                  attributes.violence.skills.threshold.points * 2
                }
                color="rgb(251 191 36)"
                cardWidth={cardRef.current?.offsetWidth}
              >
                <EquipIcon className="text-secondary size-8" />
              </StatBar>
            </div>
            <div className="col-span-4 flex w-full items-center gap-8">
              <characterForm.Field name="stats.permanentInjuries">
                {(field) => (
                  <InputField
                    type="number"
                    label="Max Injuries"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </characterForm.Field>
              <characterForm.Field name="stats.permanentInsanities">
                {(field) => (
                  <InputField
                    type="number"
                    label="Max Insanities"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </characterForm.Field>
            </div>
            <div className="flex flex-wrap justify-around gap-6">
              <div className="flex flex-col items-center gap-2" key={'speed'}>
                {layoutSize !== 'xsmall' && <p>Speed</p>}
                <div className="flex items-center justify-center gap-2">
                  <SpeedIcon className="text-secondary size-8" />
                  <p className="text-secondary text-xl sm:pt-1 sm:text-2xl">
                    {stats.speed + attributes.violence.skills.assault.points}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2" key={'evasion'}>
                {layoutSize !== 'xsmall' && <p>Evasion</p>}
                <div className="flex items-center justify-center gap-2">
                  <EvasionIcon className="text-secondary size-8" />
                  <p className="text-secondary text-xl sm:pt-1 sm:text-2xl">
                    {stats.evasion}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2" key={'armor'}>
                {layoutSize !== 'xsmall' && <p>Armor</p>}
                <div className="flex items-center justify-center gap-2">
                  <ArmorIcon className="text-secondary size-8" />
                  <p className="text-secondary text-xl sm:pt-1 sm:text-2xl">
                    {stats.armor}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2" key={'ward'}>
                {layoutSize !== 'xsmall' && <p>Ward</p>}
                <div className="flex items-center justify-center gap-2">
                  <WardIcon className="text-secondary size-8" />
                  <p className="text-secondary text-xl sm:pt-1 sm:text-2xl">
                    {stats.ward}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </characterForm.Subscribe>
      <Divider />
      <ArrowHeader2 title="Attributes and skills" />
      <div className="flex w-full flex-col gap-4 border-l-2 border-gray-400 border-opacity-50 pl-4">
        <characterForm.Subscribe
          selector={(state) => [
            state.values.attributes,
            state.values.attributes.cybernetica.skills,
            state.values.attributes.esoterica.skills,
            state.values.attributes.peace.skills,
            state.values.attributes.violence.skills,
          ]}
        >
          {([attributes, cybernetica, esoterica, peace, violence]) => {
            const attributePoints = Object.values(attributes).reduce(
              (sum, attribute) => sum + attribute.points,
              0,
            );

            const skillPoints = Object.values({
              ...cybernetica,
              ...esoterica,
              ...peace,
              ...violence,
            }).reduce((sum, skill) => sum + skill.points, 0);

            return (
              <>
                <p className="flex justify-between">
                  <span className="text-tertiary">
                    Starting Attribute Points
                  </span>
                  <span className="text-xl">{attributePoints} / 6</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-tertiary">Starting Skill Points</span>
                  <span className="text-xl">{skillPoints} / 12</span>
                </p>
              </>
            );
          }}
        </characterForm.Subscribe>
      </div>
      <AttributeField form={characterForm} />
      <Divider />
      <ArrowHeader2 title="Starting Perk" />
      <p className="text-tertiary border-l-2 border-gray-400 border-opacity-50 pl-4">
        Select a starting perk for your character. Available perks are only
        shown if you meet the attribute and skill point requirements
      </p>
      <characterForm.Subscribe selector={(state) => state.values.attributes}>
        {(attributes) => (
          <div className="flex flex-col gap-4">
            <PerkLinkField form={characterForm} attributeTree={attributes} />
          </div>
        )}
      </characterForm.Subscribe>
    </FormLayout>
  );
};

export default CharacterForm;
