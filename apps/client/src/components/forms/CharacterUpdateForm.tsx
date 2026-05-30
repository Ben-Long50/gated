import InputField from '../formFields/InputField';
import { ValidationError } from '@tanstack/react-form';
import { useParams } from 'react-router-dom';
import useUpdateCharacterMutation from '../../hooks/useCharacterUpdateMutation/useCharacterUpdateMutation';
import useDeleteCharacterMutation from '../../hooks/useDeleteCharacterMutation/useDeleteCharacterMutation';
import Loading from '../Loading';
import FormLayout from '../../layouts/FormLayout';
import InputFieldRadio from '../formFields/InputFieldRadio';
import ArrowHeader2 from '../ArrowHeader2';
import Divider from '../Divider';
import StatBarContainer from '../StatBarContainer';
import useCampaignsQuery from '../../hooks/useCampaignsQuery/useCampaignsQuery';
import InputSelectField from '../formFields/InputSelectField';
import NpcPreferenceField from '../formFields/NpcPreferenceField';
import PictureField from '../formFields/PictureField';
import useCharacterUpdateForm from 'src/hooks/form hooks/useCharacterUpdateForm';
import constructName from 'src/utils/constructName';
import useCharacter from 'src/hooks/useCharacter';
import CharacterStatBars from '../characterComponents/CharacterStatBars';

const CharacterUpdateForm = () => {
  const { characterId } = useParams();

  const { data: campaigns, isLoading: campaignsLoading } = useCampaignsQuery();

  const { filteredCharacter: character, isLoading: characterLoading } =
    useCharacter(Number(characterId));

  const updateCharacter = useUpdateCharacterMutation(Number(characterId));
  const deleteCharacter = useDeleteCharacterMutation(Number(characterId));

  const characterUpdateForm = useCharacterUpdateForm(
    updateCharacter,
    character,
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
      <characterUpdateForm.Field
        name="playerCharacter"
        validators={{
          onSubmit: ({ value }) =>
            typeof value !== 'boolean'
              ? 'You must choose whether this character is a playable character'
              : undefined,
        }}
        listeners={{
          onChange: ({ value }) => {
            if (value) {
              characterUpdateForm.setFieldValue('npcTypes', null);
            } else if (!value) {
              characterUpdateForm.setFieldValue('npcTypes', ['']);
            }
          },
        }}
      >
        {(field) => (
          <>
            <InputFieldRadio
              label="Player Character"
              value={true}
              checked={field.state.value === true}
              onChange={() => field.handleChange(true)}
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
          </>
        )}
      </characterUpdateForm.Field>
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
      <div className="flex w-full flex-col gap-8">
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
                options={['male', 'female']}
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </characterUpdateForm.Field>
        </div>
        <PictureField
          form={characterUpdateForm}
          sizeInfo={{ aspectRatio: '1/1', maxHeight: '', minHeight: '' }}
        />
      </div>
      <Divider />
      <ArrowHeader2 title="Stats" />
      <StatBarContainer>
        <CharacterStatBars stats={character?.stats} size="large" />
      </StatBarContainer>
      <div className="col-span-4 flex w-full items-center gap-8">
        <characterUpdateForm.Field
          name="stats.permanentInjuries"
          validators={{
            onChange: ({ value }) => {
              if (value < 0) {
                return 'Injuries cannot be lower than 0';
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <InputField
              type="number"
              label="Max Injuries"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </characterUpdateForm.Field>
        <characterUpdateForm.Field
          name="stats.permanentInsanities"
          validators={{
            onChange: ({ value }) => {
              if (value < 0) {
                return 'Insanities cannot be lower than 0';
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <InputField
              type="number"
              label="Max Insanities"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </characterUpdateForm.Field>
      </div>
    </FormLayout>
  );
};

export default CharacterUpdateForm;
