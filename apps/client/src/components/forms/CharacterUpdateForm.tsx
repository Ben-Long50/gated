import { useContext, useRef } from 'react';
import InputField from '../InputField';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ValidationError } from '@tanstack/react-form';
import StatBar from '../StatBar';
import Icon from '@mdi/react';
import { mdiCircleOutline } from '@mdi/js';
import HealthIcon from '../icons/HealthIcon';
import { LayoutContext } from '../../contexts/LayoutContext';
import SanityIcon from '../icons/SanityIcon';
import { useParams } from 'react-router-dom';
import useUpdateCharacterMutation from '../../hooks/useCharacterUpdateMutation/useCharacterUpdateMutation';
import useDeleteCharacterMutation from '../../hooks/useDeleteCharacterMutation/useDeleteCharacterMutation';
import Loading from '../Loading';
import FormLayout from '../../layouts/FormLayout';
import InputFieldRadio from '../InputFieldRadio';
import ArrowHeader2 from '../ArrowHeader2';
import Divider from '../Divider';
import StatBarContainer from '../StatBarContainer';
import useCampaignsQuery from '../../hooks/useCampaignsQuery/useCampaignsQuery';
import InputSelectField from '../InputSelectField';
import InjuryIcon from '../icons/InjuryIcon';
import InsanityIcon from '../icons/InsanityIcon';
import NpcPreferenceField from '../formFields/NpcPreferenceField';
import PictureField from '../formFields/PictureField';
import CyberIcon from '../icons/CyberIcon';
import EquipIcon from '../icons/EquipIcon';
import useCharacterUpdateForm from 'src/hooks/form hooks/useCharacterUpdateForm';
import constructName from 'src/utils/constructName';
import useCharacter from 'src/hooks/useCharacter';

const CharacterUpdateForm = () => {
  const { statColorMap } = useContext(ThemeContext);
  const { mobile } = useContext(LayoutContext);
  const { characterId } = useParams();

  const cardRef = useRef(null);

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
      <ArrowHeader2 title="Character Information" />
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
              field={field}
              checked={field.state.value === true}
              onChange={() => field.handleChange(true)}
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
      </characterUpdateForm.Field>
      <characterUpdateForm.Field name="campaignId">
        {(field) => (
          <InputSelectField
            className="w-full"
            field={field}
            label="Campaign"
            options={campaigns}
            onChange={(campaign) => {
              field.handleChange(campaign.id);
            }}
          />
        )}
      </characterUpdateForm.Field>
      <NpcPreferenceField form={characterUpdateForm} />
      <Divider />
      <ArrowHeader2 title="Character Information" />
      <div className="grid w-full gap-8 max-sm:col-span-2 max-sm:grid-flow-row sm:grid-cols-2">
        <PictureField
          form={characterUpdateForm}
          sizeInfo={{
            aspectRatio: '1/1',
            maxHeight: '',
            minHeight: '',
          }}
        />
        <div className="flex w-full flex-col gap-8">
          <characterUpdateForm.Field name="firstName">
            {(field) => (
              <InputField className="w-full" label="First name" field={field} />
            )}
          </characterUpdateForm.Field>
          <characterUpdateForm.Field name="lastName">
            {(field) => (
              <InputField className="w-full" label="Last name" field={field} />
            )}
          </characterUpdateForm.Field>
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            <characterUpdateForm.Field name="height">
              {(field) => (
                <InputField type="number" label="Height (in)" field={field} />
              )}
            </characterUpdateForm.Field>
            <characterUpdateForm.Field name="weight">
              {(field) => (
                <InputField type="number" label="Weight (lbs)" field={field} />
              )}
            </characterUpdateForm.Field>
            <characterUpdateForm.Field name="age">
              {(field) => (
                <InputField type="number" label="Age (yrs)" field={field} />
              )}
            </characterUpdateForm.Field>
            <characterUpdateForm.Field name="sex">
              {(field) => (
                <InputSelectField
                  label="Sex"
                  field={field}
                  options={['male', 'female']}
                />
              )}
            </characterUpdateForm.Field>
          </div>
        </div>
      </div>
      <StatBarContainer>
        {character?.stats.currentHealth !== undefined && (
          <characterUpdateForm.Field name="stats.currentHealth">
            {(field) => (
              <StatBar
                title="Health"
                current={field.state.value}
                total={character?.stats.maxHealth}
                color={statColorMap['Health']}
                cardWidth={cardRef.current?.offsetWidth}
                mutation={(value: number) =>
                  field.handleChange(field.state.value + value)
                }
                mode="adjustable"
              >
                <HealthIcon className="text-secondary size-8" />
              </StatBar>
            )}
          </characterUpdateForm.Field>
        )}
        {character?.stats.currentSanity !== undefined && (
          <characterUpdateForm.Field name="stats.currentSanity">
            {(field) => (
              <StatBar
                title="Sanity"
                current={field.state.value}
                total={character?.stats.maxSanity}
                color={statColorMap['Sanity']}
                cardWidth={cardRef.current?.offsetWidth}
                mutation={(value: number) =>
                  field.handleChange(field.state.value + value)
                }
                mode="adjustable"
              >
                <SanityIcon className="text-secondary size-8" />
              </StatBar>
            )}
          </characterUpdateForm.Field>
        )}
        <StatBar
          title="Cyber"
          current={character?.stats.cyber || 0}
          total={character?.stats.maxCyber}
          color="rgb(52 211 153)"
          cardWidth={cardRef.current?.offsetWidth}
        >
          <CyberIcon className="text-secondary size-8" />
        </StatBar>
        <StatBar
          title="Equip"
          current={character?.stats.weight || 0}
          total={character?.stats.maxEquip}
          color="rgb(251 191 36)"
          cardWidth={cardRef.current?.offsetWidth}
        >
          <EquipIcon className="text-secondary size-8" />
        </StatBar>
        <characterUpdateForm.Subscribe
          selector={(state) => [
            state.values.stats.permanentInjuries,
            state.values.stats.permanentInsanities,
          ]}
        >
          {([permanentInjuries, permanentInsanities]) => (
            <>
              <characterUpdateForm.Field
                name="stats.injuries"
                validators={{
                  onChange: ({ value }) => {
                    if (value > permanentInjuries) {
                      return 'Cannot exceed max injuries';
                    } else if (value < 0) {
                      return 'Injuries cannot be lower than 0';
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <>
                    {!mobile && <h4>Injuries</h4>}
                    <div
                      className={`${mobile ? 'col-span-4 gap-0' : 'col-span-3 gap-2'} flex grow items-center justify-self-end`}
                    >
                      {Array.from({
                        length: permanentInjuries,
                      }).map((_, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            if (field.state.value === 1 && index === 0) {
                              field.handleChange(index);
                            } else {
                              field.handleChange(index + 1);
                            }
                          }}
                        >
                          {index < field.state.value ? (
                            <InjuryIcon
                              key={index}
                              className="text-secondary size-7 shrink-0 sm:size-8"
                            />
                          ) : (
                            <Icon
                              path={mdiCircleOutline}
                              key={index}
                              className="text-tertiary size-7 shrink-0 p-1 sm:size-8"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </characterUpdateForm.Field>
              <characterUpdateForm.Field
                name="stats.insanities"
                validators={{
                  onChange: ({ value }) => {
                    if (value > permanentInsanities) {
                      return 'Cannot exceed max insanities';
                    } else if (value < 0) {
                      return 'Insanities cannot be lower than 0';
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <>
                    {!mobile && <h4>Insanities</h4>}
                    <div
                      className={`${mobile ? 'col-span-4 gap-0' : 'col-span-3 gap-2'} flex grow items-center justify-self-end`}
                    >
                      {Array.from({
                        length: permanentInsanities,
                      }).map((_, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            if (field.state.value === 1 && index === 0) {
                              field.handleChange(index);
                            } else {
                              field.handleChange(index + 1);
                            }
                          }}
                        >
                          {index < field.state.value ? (
                            <InsanityIcon
                              key={index}
                              className="text-secondary size-7 shrink-0 sm:size-8"
                            />
                          ) : (
                            <Icon
                              path={mdiCircleOutline}
                              key={index}
                              className="text-tertiary size-7 shrink-0 p-1 sm:size-8"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </characterUpdateForm.Field>
            </>
          )}
        </characterUpdateForm.Subscribe>
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
              className="w-full"
              type="number"
              label="Max Injuries"
              field={field}
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
              className="w-full"
              type="number"
              label="Max Insanities"
              field={field}
            />
          )}
        </characterUpdateForm.Field>
      </div>
    </FormLayout>
  );
};

export default CharacterUpdateForm;
