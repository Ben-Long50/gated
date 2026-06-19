import InputField from '../formFields/InputField';
import { useStore } from '@tanstack/react-form';
import { useParams, useSearchParams } from 'react-router-dom';
import useUpdateCharacterMutation from '../../hooks/useCharacterUpdateMutation/useCharacterUpdateMutation';
import useDeleteCharacterMutation from '../../hooks/useDeleteCharacterMutation/useDeleteCharacterMutation';
import Loading from '../Loading';
import FormLayout from '../../layouts/FormLayout';
import ArrowHeader2 from '../ArrowHeader2';
import Divider from '../Divider';
import StatBarContainer from '../StatBarContainer';
import useCampaignsQuery from '../../hooks/useCampaignsQuery/useCampaignsQuery';
import InputSelectField from '../formFields/InputSelectField';
import NpcPreferenceField from '../formFields/NpcPreferenceField';
import PictureField from '../formFields/PictureField';
import useCharacterUpdateForm from 'src/hooks/form hooks/useCharacterUpdateForm';
import constructName from 'src/utils/constructName';
import CharacterStatBars from '../characterComponents/CharacterStatBars';
import calculateStats from 'src/hooks/useStats';
import { SortedInventory } from 'src/types/character';
import useCharacterQuery from 'src/hooks/useCharacterQuery/useCharacterQuery';
import ActionLinkField from '../formFields/ActionLinkField';
import PerkLinkField from '../formFields/PerkLinkField';

const CharacterUpdateForm = () => {
  const { characterId } = useParams();
  const [searchParams] = useSearchParams();

  const formType = searchParams.get('formType');

  const { data: campaigns, isLoading: campaignsLoading } = useCampaignsQuery();

  const { data: character, isLoading: characterLoading } = useCharacterQuery(
    Number(characterId),
  );

  const updateCharacter = useUpdateCharacterMutation(Number(characterId));
  const deleteCharacter = useDeleteCharacterMutation(Number(characterId));

  const characterUpdateForm = useCharacterUpdateForm(
    updateCharacter,
    character,
  );

  const characterStats = useStore(
    characterUpdateForm.store,
    (state) => state.values.stats,
  );

  const stats = calculateStats(
    {
      items: [],
    } as unknown as SortedInventory,
    [],
    character?.attributes,
    character?.perks,
    characterStats,
  );

  const isLoading = characterLoading || campaignsLoading;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FormLayout
      label={character ? constructName(character) : 'Character'}
      form={characterUpdateForm}
      itemId={characterId}
      createMutation={updateCharacter}
      deleteMutation={deleteCharacter}
    >
      <ArrowHeader2 title="General Information" />
      <characterUpdateForm.Field name="campaignId">
        {(field) => (
          <InputSelectField
            label="Campaign"
            options={campaigns || []}
            value={field.state.value}
            onChange={() => field.handleChange(value.id)}
          />
        )}
      </characterUpdateForm.Field>
      <NpcPreferenceField form={characterUpdateForm} />
      <Divider />
      <ArrowHeader2 title="Character Information" />
      <div className="grid w-full grid-cols-2 gap-4">
        <characterUpdateForm.Field name="firstName">
          {(field) => (
            <InputField
              label="First name"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </characterUpdateForm.Field>
        <characterUpdateForm.Field name="lastName">
          {(field) => (
            <InputField
              label="Last name"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </characterUpdateForm.Field>
        <characterUpdateForm.Field name="height">
          {(field) => (
            <InputField
              type="number"
              label="Height (in)"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </characterUpdateForm.Field>
        <characterUpdateForm.Field name="weight">
          {(field) => (
            <InputField
              type="number"
              label="Weight (lbs)"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </characterUpdateForm.Field>
        <characterUpdateForm.Field name="age">
          {(field) => (
            <InputField
              type="number"
              label="Age (yrs)"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </characterUpdateForm.Field>
        <characterUpdateForm.Field name="sex">
          {(field) => (
            <InputSelectField
              label="Sex"
              options={['male', 'female', 'unknown']}
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </characterUpdateForm.Field>
      </div>
      <Divider />
      <ArrowHeader2 title="Character Picture" />
      <PictureField
        form={characterUpdateForm}
        type="character"
        sizeInfo={{ aspectRatio: '1/1', maxHeight: '', minHeight: '' }}
      />
      <Divider />
      <ArrowHeader2 title="Stats" />
      <characterUpdateForm.Field name="stats">
        {(field) => {
          return (
            <StatBarContainer>
              <CharacterStatBars
                stats={stats}
                size="large"
                handleChange={
                  !character?.playerCharacter
                    ? (stat, value) =>
                        characterUpdateForm.setFieldValue('stats', (prev) => ({
                          ...prev,
                          [stat]:
                            prev[stat] != null ? prev[stat] + value : value,
                        }))
                    : undefined
                }
              />
            </StatBarContainer>
          );
        }}
      </characterUpdateForm.Field>
      {formType === 'codex' && (
        <>
          <Divider />
          <PerkLinkField
            form={characterUpdateForm}
            attributeTree={character?.attributes}
            path="perks?formType=codex&mode=form"
          />
          <ActionLinkField
            form={characterUpdateForm}
            path="actions?formType=codex&mode=form"
          />
        </>
      )}
    </FormLayout>
  );
};

export default CharacterUpdateForm;
