import InputField from '../formFields/InputField';
import { useParams } from 'react-router-dom';
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
import CharacterStatBars from '../characterComponents/CharacterStatBars';
import useCharacterQuery from 'src/hooks/useCharacterQuery/useCharacterQuery';
import { useContext } from 'react';
import { LayoutContext } from 'src/contexts/LayoutContext';
import useCharacter from 'src/hooks/useCharacter';
import combineObjects from 'src/utils/combineObjects';

const CharacterUpdateForm = () => {
  const { characterId } = useParams();
  const { mobile } = useContext(LayoutContext);

  const size = mobile ? 'small' : 'large';

  const { data: campaigns, isLoading: campaignsLoading } = useCampaignsQuery();

  const { data: character, isLoading: characterLoading } = useCharacterQuery(
    Number(characterId),
  );

  const { filteredCharacter } = useCharacter(Number(characterId));

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
      label={character ? character?.name : 'Character'}
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
            onChange={(value) => field.handleChange(value.id)}
          />
        )}
      </characterUpdateForm.Field>
      <NpcPreferenceField form={characterUpdateForm} />
      <Divider />
      <ArrowHeader2 title="Character Information" />
      <div className="grid w-full grid-cols-2 gap-4">
        <characterUpdateForm.Field name="name">
          {(field) => (
            <InputField
              label="Name"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </characterUpdateForm.Field>
        <characterUpdateForm.Field name="title">
          {(field) => (
            <InputField
              label="Title"
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
      <PictureField form={characterUpdateForm} type="character" />
      <Divider />
      <ArrowHeader2 title="Stats" />
      <characterUpdateForm.Field name="stats">
        {(field) => {
          const { permanentInjuries, permanentInsanities, ...stats } =
            filteredCharacter?.stats;

          return (
            <StatBarContainer size={size}>
              <CharacterStatBars
                stats={combineObjects(field.state.value, stats)}
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
    </FormLayout>
  );
};

export default CharacterUpdateForm;
