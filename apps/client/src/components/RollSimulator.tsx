import { useForm } from '@tanstack/react-form';
import useActions from '../hooks/useActions';
import ArrowHeader3 from './ArrowHeader3';
import ThemeContainer from './ThemeContainer';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import Loading from './Loading';
import BtnRect from './buttons/BtnRect';
import DieIcon from './icons/DieIcon';
import InputFieldCheckbox from './InputFieldCheckbox';
import InputField from './InputField';
import InputSelectField from './InputSelectField';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import useCampaignQuery from '../hooks/useCampaignQuery/useCampaignQuery';
import useCampaignRollMutation from '../hooks/campaign hooks/useCampaignRollMutation/useCampaignRollMutation';
import { LayoutContext } from '../contexts/LayoutContext';
import { capitalCase } from 'change-case';
import { CampaignContext } from 'src/contexts/CampaignContext';
import calculateDiceCount from 'src/utils/calculateDiceCount';
import useCharacterQueries from 'src/hooks/useCharactersQuery/useCharacterQueries';

const RollSimulator = () => {
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { rolls, rolling } = useContext(CampaignContext);
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');
  const { campaignId } = useParams();

  const { data: campaign, isLoading: campaignLoading } = useCampaignQuery(
    Number(campaignId),
  );

  const campaignRoll = useCampaignRollMutation(Number(campaignId));

  const { characters } = useCharacterQueries(
    campaign?.characters.map((character) => character.id) || [],
  );

  const { filteredActions: actions } = useActions();

  const rollForm = useForm({
    defaultValues: {
      characterId: null as number | null,
      actionId: null as number | null,
      modifiers: [] as string[],
      extraDice: null as number | null,
    },
    onSubmit: ({ value }) => {
      campaignRoll.mutate(value);
      navigate('rollResults');
    },
    validators: {
      onSubmit: ({ value }) => {
        const errors = [];
        if (!value.characterId) {
          errors.push('Select a character');
        }
        if (!value.actionId) {
          errors.push('Select an action');
        }
        return errors.length > 0 ? errors.join(',') : undefined;
      },
    },
  });

  if (campaignLoading) return <Loading />;

  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-8">
      <h1 className="text-center">Roll Simulator</h1>

      <ThemeContainer
        className="w-full max-w-4xl"
        borderColor={accentPrimary}
        chamfer="medium"
      >
        <div className={`flex w-full flex-col gap-8 p-4`}>
          <rollForm.Field name="characterId">
            {(field) => (
              <div className="flex w-full flex-col gap-8">
                <InputSelectField
                  field={field}
                  options={characters || []}
                  label="Character"
                  onChange={(e) => field.handleChange(e.target.value.id)}
                />
              </div>
            )}
          </rollForm.Field>
          <div
            className={`${mobile ? 'row-span-1' : 'col-start-2 row-start-1 row-end-3'} mb-auto flex flex-col items-start justify-start gap-8`}
          >
            <ArrowHeader3 title="Roll Options" />
            <rollForm.Field name="actionId">
              {(field) => (
                <InputSelectField
                  options={actions || []}
                  label="Action"
                  field={field}
                  onChange={(e) => field.handleChange(e.target.value.id)}
                />
              )}
            </rollForm.Field>
            <ThemeContainer
              className="w-full"
              borderColor={accentPrimary}
              chamfer="small"
            >
              <p className="!text-accent bg-primary absolute -top-2 left-3.5 px-1.5 text-base">
                Modifiers
              </p>
              <div className="relative flex w-full flex-col gap-4 p-4 pt-6">
                <rollForm.Field name="modifiers">
                  {(field) => {
                    const modifiers = [
                      'push',
                      'booming',
                      'dooming',
                      'lucky',
                      'unlucky',
                    ];
                    return (
                      <>
                        {modifiers.map((modifier) => (
                          <InputFieldCheckbox
                            key={modifier}
                            field={field}
                            label={capitalCase(modifier)}
                            value={modifier}
                            checked={field.state.value.includes(modifier)}
                            onChange={(value: string) => {
                              if (field.state.value.includes(value)) {
                                rollForm.setFieldValue('modifiers', (prev) =>
                                  prev.filter((modifier) => modifier !== value),
                                );
                              } else {
                                rollForm.setFieldValue('modifiers', (prev) => [
                                  ...prev,
                                  value,
                                ]);
                              }
                            }}
                          />
                        ))}
                      </>
                    );
                  }}
                </rollForm.Field>
              </div>
            </ThemeContainer>
            <rollForm.Field name="extraDice">
              {(field) => (
                <InputField
                  className="w-full"
                  field={field}
                  type="number"
                  label="Extra Dice"
                />
              )}
            </rollForm.Field>
            <div className="flex w-full items-center justify-between gap-4">
              <rollForm.Subscribe
                selector={(state) => [
                  state.values.character,
                  state.values.action,
                  state.values.modifiers,
                  state.values.extraDice,
                ]}
              >
                {([character, action, modifiers, extraDice]) => {
                  const { diceCount, roll } =
                    character && action
                      ? calculateDiceCount(
                          character.attributes,
                          action,
                          modifiers,
                          extraDice,
                        )
                      : { diceCount: null, roll: null };
                  return (
                    <>
                      {roll && (
                        <div className="flex items-center gap-4">
                          <h3>{capitalCase(roll.attribute)}</h3>
                          <ArrowHeader3 title={capitalCase(roll.skill)} />
                        </div>
                      )}
                      <div className="ml-auto flex items-center gap-4">
                        <DieIcon className="text-secondary size-10" />
                        <h2>{diceCount}</h2>
                      </div>
                    </>
                  );
                }}
              </rollForm.Subscribe>
            </div>
            <rollForm.Subscribe selector={(state) => state.errorMap}>
              {(errorMap) => {
                const errors = errorMap.onSubmit?.split(', ') || [];

                return (
                  errors.length > 0 && (
                    <ul className="flex list-disc flex-col gap-2">
                      {errors.map((error) => (
                        <li className="text-error w-full text-base">{error}</li>
                      ))}
                    </ul>
                  )
                );
              }}
            </rollForm.Subscribe>
            <BtnRect
              ariaLabel="Roll dice"
              type="submit"
              className="w-full min-w-28 self-end"
              onClick={() => {
                rollForm.handleSubmit();
              }}
            >
              Roll
            </BtnRect>
          </div>
        </div>
      </ThemeContainer>
      {parts.includes('rollSimulator') && (
        <Outlet context={{ rolls, rolling, rollForm, parts }} />
      )}
    </div>
  );
};

export default RollSimulator;
