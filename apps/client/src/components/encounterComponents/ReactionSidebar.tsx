import useActions from 'src/hooks/useActions';
import InputSelectField from '../InputSelectField';
import useCharacter from 'src/hooks/useCharacter';
import BtnRect from '../buttons/BtnRect';
import CharacterPictureRound from '../CharacterPictureRound';
import ActionStatBars from '../ActionStatBars';
import ArrowHeader4 from '../ArrowHeader4';
import InputFieldCheckbox from '../InputFieldCheckbox';
import { camelCase, capitalCase } from 'change-case';
import ArrowHeader3 from '../ArrowHeader3';
import Icon from '@mdi/react';
import { mdiAutorenew } from '@mdi/js';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ReactionIcon from '../icons/ReactionIcon';
import DieIcon from '../icons/DieIcon';
import calculateDiceCount from 'src/utils/calculateDiceCount';
import { useContext } from 'react';
import { EncounterContext } from 'src/contexts/EncounterContext';
import { useStore } from '@tanstack/react-form';
import { Item } from 'src/types/item';
import useCombatStore from 'src/stores/combatStore';
import reactionFuncs from 'src/utils/reactionFuncs';
import isInRange from './encounterUtils/isInRange';
import calculateCosts from 'src/utils/calculateCosts';
import Divider from '../Divider';
import InputField from '../InputField';
import { useQueryClient } from '@tanstack/react-query';
import { Action } from 'src/types/action';

const ReactionSidebar = ({ actionSidebar }: { actionSidebar: boolean }) => {
  const {
    reactionPermissions,
    controlledCharacterId,
    actionForm,
    removeTarget,
    getTarget,
  } = useContext(EncounterContext);

  const { filteredCharacter: character } = useCharacter(controlledCharacterId);
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');
  const queryClient = useQueryClient();

  const characterActions = character?.characterInventory?.actions;

  const item = useStore(actionForm.store, (state) => state.values.item) as Item;

  const reaction = useStore(
    actionForm.store,
    (state) => state.values.action,
  ) as Action;

  const { filteredActions: availableReactions, category } = useActions(
    characterActions,
    'reaction',
  );

  const setItem = useCombatStore((state) => state.setItem);

  const handleChosenItem = (reaction: Action) => {
    if (reaction && reaction.itemLink) {
      const item = queryClient.getQueryData([
        'item',
        reaction.itemLink.itemId,
      ]) as Item;

      setItem(item);

      actionForm.setFieldValue('item', item);
    }
  };

  let reactionInfo = null;

  if (reaction) {
    if (reactionFuncs[`${camelCase(reaction.name)}`]) {
      reactionInfo = reactionFuncs[`${camelCase(reaction.name)}`](
        reaction.costs,
        character,
        item,
      );
    } else {
      reactionInfo = {
        message: `Programmed support for ${reaction.name} is currently not supported. Handle this reaction manually.`,
      };
    }
  }

  const { errors } =
    reactionInfo && reactionInfo.costs
      ? calculateCosts(reactionInfo.costs, character, item)
      : { errors: [] as string[] };

  if (reactionInfo) {
    const targetData = getTarget(`character ${controlledCharacterId}`);
    if (targetData) {
      const inRange = isInRange(
        { row: targetData.start.row, col: targetData.start.col },
        { row: targetData.end.row, col: targetData.end.col },
        reactionInfo.range,
      );

      if (!inRange) {
        errors.push('Not in Range');
      }
      if (targetData.occupied) {
        errors.push('Tile is Occupied');
      }
    }
  }

  return (
    <div
      className={`${actionSidebar ? 'visible translate-x-0 opacity-100' : 'invisible translate-x-full opacity-0'} timing z-10 flex flex-col gap-4 p-2`}
    >
      {parts.includes('availableReactions') && (
        <Outlet
          context={{
            actions: availableReactions,
            category,
            form: actionForm,
          }}
        />
      )}
      {reactionPermissions && (
        <>
          <div className="flex items-center justify-between gap-2">
            <ArrowHeader3 className="whitespace-nowrap" title="Reaction" />
            <button
              className="bg-tertiary group my-auto ml-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
              aria-label="Open available reactions"
              type="button"
              onClick={() => navigate('availableReactions')}
            >
              <ReactionIcon
                className={`group-hover:text-accent text-tertiary timing size-8`}
              />
            </button>
            <button
              className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
              aria-label="Reset"
              type="button"
              onClick={() => {
                actionForm.reset();
                setItem(null);
                removeTarget(`character ${controlledCharacterId}`);
              }}
            >
              <Icon
                path={mdiAutorenew}
                className={`group-hover:text-accent text-tertiary timing size-8`}
              />
            </button>
          </div>
          <actionForm.Field
            name="action"
            listeners={{
              onChange: ({ value }) => {
                handleChosenItem(value);
              },
            }}
          >
            {(field) => (
              <InputSelectField
                field={field}
                label="Reactions"
                options={availableReactions}
              />
            )}
          </actionForm.Field>
          <Divider className="opacity-50" />
          {reactionInfo &&
            (reactionInfo.message ? (
              <>
                <p>{reactionInfo.message}</p>
                <Divider className="opacity-50" />
              </>
            ) : (
              <>
                {reactionInfo &&
                  reactionInfo.costs &&
                  Object.keys(reactionInfo.costs).length > 0 && (
                    <div className="flex w-full flex-col justify-start gap-2">
                      <ArrowHeader4
                        className="text-primary"
                        title="Reaction Costs"
                      />
                      <div
                        className={`grid h-full w-full grow grid-cols-[auto_auto_1fr_auto] place-items-center gap-2 gap-y-2 border-x-2 border-gray-400 border-opacity-50 px-2`}
                      >
                        <ActionStatBars
                          stats={reactionInfo.costs}
                          cardWidth={499}
                        />
                      </div>
                    </div>
                  )}
                {reactionInfo && reactionInfo.requirements.includes('item') && (
                  <actionForm.Subscribe selector={(state) => state.values.item}>
                    {(item) => (
                      <>
                        <p>
                          {item
                            ? 'Selected Weapon'
                            : 'Select a Weapon from Equipment'}
                        </p>
                        {item && (
                          <div className="flex flex-col items-start gap-4">
                            <div className="flex w-full items-center gap-4">
                              <CharacterPictureRound character={item} />
                              <ArrowHeader4
                                className="text-primary w-[80%]"
                                title={item.name}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </actionForm.Subscribe>
                )}
                {reactionInfo &&
                  reactionInfo.requirements.includes('target') && (
                    <actionForm.Subscribe
                      selector={(state) => state.values.target}
                    >
                      {(target) => (
                        <>
                          <p>
                            {target
                              ? 'Selected Target'
                              : 'Select a Target on the Map'}
                          </p>
                          {target && (
                            <div className="flex flex-col items-start gap-4">
                              <div className="flex w-full items-center gap-4">
                                <CharacterPictureRound character={target} />
                                <ArrowHeader4
                                  className="text-primary w-[80%]"
                                  title={target.firstName}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </actionForm.Subscribe>
                  )}
                <Divider className="opacity-50" />
              </>
            ))}
          {errors.length > 0 ? (
            <ul className="flex flex-col items-start">
              {errors.map((error: string) => (
                <li className="text-error">{error}</li>
              ))}
            </ul>
          ) : (
            <actionForm.Subscribe
              selector={(state) => [
                state.values.action,
                state.values.item,
                state.values.target,
                state.values.modifiers,
                state.values.extraDice,
              ]}
            >
              {([reaction, item, target, modifiers, extraDice]) => {
                const diceCount =
                  character && reaction?.roll?.length > 0 && modifiers
                    ? calculateDiceCount(
                        character?.attributes,
                        reaction,
                        modifiers,
                        extraDice,
                      ).diceCount
                    : 'N/A';

                return (
                  <>
                    {reaction?.roll && reaction?.roll.length > 0 ? (
                      <>
                        <div className="relative flex w-full flex-col gap-2">
                          <actionForm.Field name="modifiers">
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
                                      checked={field.state.value?.includes(
                                        modifier,
                                      )}
                                      onChange={(value: string) => {
                                        if (
                                          field.state.value?.includes(value)
                                        ) {
                                          actionForm.setFieldValue(
                                            'modifiers',
                                            (prev) =>
                                              prev.filter(
                                                (modifier) =>
                                                  modifier !== value,
                                              ),
                                          );
                                        } else {
                                          actionForm.setFieldValue(
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
                          </actionForm.Field>
                          <actionForm.Field name="extraDice">
                            {(field) => (
                              <InputField
                                field={field}
                                label="Extra Dice"
                                type="number"
                              />
                            )}
                          </actionForm.Field>
                        </div>
                        <div className="flex items-center justify-between">
                          <DieIcon className="text-secondary size-8" />
                          {typeof diceCount === 'number' ? (
                            <h2 className="!text-accent">{diceCount}</h2>
                          ) : (
                            <h3>{diceCount}</h3>
                          )}
                        </div>
                        <BtnRect
                          className={`w-full whitespace-nowrap`}
                          ariaLabel="Roll reaction"
                          type="button"
                          onClick={() => {
                            actionForm.handleSubmit();
                          }}
                        >
                          Roll Reaction
                        </BtnRect>
                      </>
                    ) : (
                      <BtnRect
                        type="button"
                        ariaLabel="Confirm reaction"
                        onClick={() => {
                          actionForm.handleSubmit();
                        }}
                      >
                        Confirm Reaction
                      </BtnRect>
                    )}
                    <actionForm.Subscribe selector={(state) => state.errorMap}>
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
                    </actionForm.Subscribe>
                  </>
                );
              }}
            </actionForm.Subscribe>
          )}
          <Divider className="opacity-50" />
        </>
      )}
    </div>
  );
};

export default ReactionSidebar;
