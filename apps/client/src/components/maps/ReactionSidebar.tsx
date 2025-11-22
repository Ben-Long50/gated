import useActions from 'src/hooks/useActions';
import InputSelectField from '../InputSelectField';
import useCharacter from 'src/hooks/useCharacter';
import CharacterRoll from './CharacterRoll';
import { FormApi } from '@tanstack/react-reactionForm';
import BtnRect from '../buttons/BtnRect';
import CharacterPictureRound from '../CharacterPictureRound';
import ActionStatBars from '../ActionStatBars';
import ArrowHeader4 from '../ArrowHeader4';
import RangeIcon from '../icons/RangeIcon';
import WeaponIcon from '../icons/WeaponIcon';
import InputFieldCheckbox from '../InputFieldCheckbox';
import { capitalCase } from 'change-case';
import ArrowHeader3 from '../ArrowHeader3';
import Icon from '@mdi/react';
import { mdiAutorenew } from '@mdi/js';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ReactionIcon from '../icons/ReactionIcon';
import DieIcon from '../icons/DieIcon';
import calculateDiceCount from 'src/utils/calculateDiceCount';
import { useContext } from 'react';
import { EncounterContext } from 'src/contexts/EncounterContext';

const ReactionSidebar = ({ actionSidebar }: { actionSidebar: boolean }) => {
  const { combat, controlledCharacterId, reactionForm } =
    useContext(EncounterContext);

  const { filteredCharacter: character } = useCharacter(controlledCharacterId);
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const {
    filteredActions: availableReactions,
    filterBySubCategory,
    category,
  } = useActions(character?.actions, 'reaction');

  return (
    <div
      className={`${actionSidebar ? 'visible translate-x-0 opacity-100' : 'invisible translate-x-full opacity-0'} timing z-10 flex flex-col gap-4 p-2`}
    >
      {parts.includes('availableReactions') && (
        <Outlet
          context={{
            actions: availableReactions,
            category,
            form: reactionForm,
          }}
        />
      )}
      <>
        {combat.reactions.includes(controlledCharacterId) && (
          <>
            <div className="flex items-center justify-between gap-2">
              <ArrowHeader3
                className="whitespace-nowrap"
                title="Reaction Form"
              />
              <button
                className="bg-tertiary group my-auto ml-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
                aria-label="Open save modal"
                type="button"
                onClick={() => navigate('availableReactions')}
              >
                <ReactionIcon
                  className={`group-hover:text-accent text-tertiary timing size-8`}
                />
              </button>
              <button
                className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
                aria-label="Open save modal"
                type="button"
                onClick={() => reactionForm.reset()}
              >
                <Icon
                  path={mdiAutorenew}
                  className={`group-hover:text-accent text-tertiary timing size-8`}
                />
              </button>
            </div>
            <reactionForm.Field
              name="reaction"
              listeners={{
                onChange: () => reactionForm.setFieldValue('item', null),
              }}
            >
              {(field) => (
                <>
                  <InputSelectField
                    field={field}
                    label="Reactions"
                    options={availableReactions}
                  />
                  {field.state.value &&
                    Object.keys(field.state.value.costs).length > 0 && (
                      <div className="flex w-full flex-col justify-start gap-2">
                        <p className="text-accent text-base tracking-widest">
                          Costs
                        </p>
                        <div
                          className={`grid h-full w-full grow grid-cols-[auto_auto_1fr_auto] place-items-center gap-2 gap-y-2 border-x-2 border-gray-400 border-opacity-50 px-2`}
                        >
                          <ActionStatBars
                            stats={field.state.value.costs}
                            cardWidth={499}
                          />
                        </div>
                      </div>
                    )}
                </>
              )}
            </reactionForm.Field>
            <reactionForm.Subscribe
              selector={(state) => [
                state.values.reaction,
                state.values.item,
                state.values.target,
              ]}
            >
              {([reaction, item, target]) =>
                reaction?.actionSubtypes?.includes('attack') && (
                  <>
                    {target ? (
                      <div className="flex flex-col items-start gap-4">
                        <div className="flex w-full items-center gap-4">
                          <CharacterPictureRound character={target} />
                          <ArrowHeader4
                            className="w-[80%]"
                            title={`${target.firstName} ${target.lastName}`}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <RangeIcon className="text-primary size-10" />
                        <h4>Select Target on Map</h4>
                      </div>
                    )}
                    {item ? (
                      <div className="flex flex-col items-start gap-4">
                        <div className="flex w-full items-center gap-4">
                          <CharacterPictureRound character={item} />
                          <ArrowHeader4 className="w-[80%]" title={item.name} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <WeaponIcon className="text-primary size-10" />
                        <h4>Select Weapon from Equipment</h4>
                      </div>
                    )}
                  </>
                )
              }
            </reactionForm.Subscribe>
            <div className="relative flex w-full flex-col gap-2">
              <reactionForm.Field name="modifiers">
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
                              reactionForm.setFieldValue('modifiers', (prev) =>
                                prev.filter((modifier) => modifier !== value),
                              );
                            } else {
                              reactionForm.setFieldValue(
                                'modifiers',
                                (prev) => [...prev, value],
                              );
                            }
                          }}
                        />
                      ))}
                    </>
                  );
                }}
              </reactionForm.Field>
            </div>
            <reactionForm.Subscribe
              selector={(state) => [
                state.values.reaction,
                state.values.modifiers,
              ]}
            >
              {([reaction, modifiers]) => {
                console.log(reaction);

                const diceCount =
                  character && reaction && modifiers
                    ? calculateDiceCount(
                        character?.attributes,
                        reaction,
                        modifiers,
                      ).diceCount
                    : 'N/A';

                return (
                  <>
                    <div className="flex items-center justify-between">
                      <DieIcon className="text-secondary size-8" />
                      {typeof diceCount === 'number' ? (
                        <h2 className="!text-accent">{diceCount}</h2>
                      ) : (
                        <h3>{diceCount}</h3>
                      )}
                    </div>
                    <reactionForm.Subscribe
                      selector={(state) => state.errorMap}
                    >
                      {(errorMap) => {
                        const errors = errorMap.onSubmit?.split(', ') || [];

                        return (
                          errors.length > 0 && (
                            <ul className="flex list-disc flex-col gap-2">
                              {errors.map((error) => (
                                <li className="text-error w-full text-base">
                                  {error}
                                </li>
                              ))}
                            </ul>
                          )
                        );
                      }}
                    </reactionForm.Subscribe>
                    <BtnRect
                      className={`${!reaction && 'pointer-events-none opacity-50'} w-full whitespace-nowrap`}
                      ariaLabel="Roll action"
                      type="button"
                      onClick={() => {
                        if (reaction) {
                          reactionForm.handleSubmit();
                        }
                      }}
                    >
                      Roll Reaction
                    </BtnRect>
                  </>
                );
              }}
            </reactionForm.Subscribe>
          </>
        )}
      </>
    </div>
  );
};

export default ReactionSidebar;
