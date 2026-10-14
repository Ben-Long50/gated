import { useForm } from '@tanstack/react-form';
import useActions from '../hooks/useActions';
import ArrowHeader3 from './ArrowHeader3';
import { useContext } from 'react';
import Loading from './Loading';
import BtnRect from './buttons/BtnRect';
import DieIcon from './icons/DieIcon';
import InputFieldCheckbox from './formFields/InputFieldCheckbox';
import InputField from './formFields/InputField';
import InputSelectField from './formFields/InputSelectField';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useCampaignQuery from '../hooks/useCampaignQuery/useCampaignQuery';
import useCampaignRollMutation from '../hooks/campaign hooks/useCampaignRollMutation/useCampaignRollMutation';
import { LayoutContext } from '../contexts/LayoutContext';
import { capitalCase } from 'change-case';
import { CampaignContext } from 'src/contexts/CampaignContext';
import calculateDiceCount from 'src/utils/calculateDiceCount';
import useCharacterQueries from 'src/hooks/character hooks/useUpdateCharacterLevelMutation/useCharactersQuery/useCharacterQueries';
import Page from './Page';

const RollSimulator = () => {
  const { mobile } = useContext(LayoutContext);
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

  const { actions, isLoading } = useActions();

  const rollForm = useForm({
    defaultValues: {
      characterId: null as number | null,
      actionId: null as number | null,
      modifiers: [] as string[],
      extraDice: null as number | null,
    },
    onSubmit: ({ value }) => {
      campaignRoll.mutate(value);
      navigate('modal/rollResults');
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

  if (campaignLoading || isLoading) return <Loading />;

  return (
    <Page title="Roll Simulator" context={{ rolls, rolling, rollForm, parts }}>
      <rollForm.Field name="characterId">
        {(field) => (
          <div className="flex w-full flex-col gap-8">
            <InputSelectField
              options={characters || []}
              label="Character"
              value={field.state.value}
              onChange={(value) => field.handleChange(value.id)}
            />
          </div>
        )}
      </rollForm.Field>
      <div
        className={`${mobile ? 'row-span-1' : 'col-start-2 row-start-1 row-end-3'} mb-auto flex flex-col items-start justify-start gap-8`}
      >
        <rollForm.Field name="actionId">
          {(field) => (
            <InputSelectField
              options={actions || []}
              label="Action"
              value={field.state.value}
              onChange={(value) => field.handleChange(value.id)}
            />
          )}
        </rollForm.Field>
        <ArrowHeader3 title="Roll Modifiers" />
        <div className="relative flex w-full flex-col gap-4">
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
                      label={capitalCase(modifier)}
                      value={modifier}
                      checked={field.state.value.includes(modifier)}
                      onChange={(value) => {
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
        <rollForm.Field name="extraDice">
          {(field) => (
            <InputField
              field={field}
              type="number"
              label="Extra Dice"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
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
    </Page>
  );
};

export default RollSimulator;
