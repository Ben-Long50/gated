import useActions from 'src/hooks/useActions';
import InputSelectField from '../formFields/InputSelectField';
import useCharacter from 'src/hooks/useCharacter';
import { useStore } from '@tanstack/react-form';
import BtnRect from '../buttons/BtnRect';
import CharacterPictureRound from '../characterComponents/CharacterPictureRound';
import ActionStatBars from '../ActionStatBars';
import ArrowHeader4 from '../ArrowHeader4';
import InputFieldCheckbox from '../formFields/InputFieldCheckbox';
import { camelCase, capitalCase } from 'change-case';
import ArrowHeader3 from '../ArrowHeader3';
import ActionIcon from '../icons/ActionIcon';
import Icon from '@mdi/react';
import { mdiAutorenew, mdiSync } from '@mdi/js';
import { useLocation, useNavigate } from 'react-router-dom';
import DieIcon from '../icons/DieIcon';
import { useQueryClient } from '@tanstack/react-query';
import useCombatStore from 'src/stores/combatStore';
import InputField from '../formFields/InputField';
import { useContext } from 'react';
import { EncounterContext } from 'src/contexts/EncounterContext';
import actionFuncs from 'src/utils/actionFuncs';
import Divider from '../Divider';
import isInRange from './encounterUtils/isInRange';
import { calculateCosts, calculateDiceCount, Item } from '@gated/shared';
import { Action } from '@cloudinary/url-gen/internal/Action';
import Sidebar from '../sidebars/Sidebar';
import IconBtnMedium from '../buttons/IconBtnMedium';
import StatBarContainer from '../StatBarContainer';

const ActionSidebar = () => {
  const { activeCharacter, actionForm, removeTarget, getTarget } =
    useContext(EncounterContext);

  const { filteredCharacter: character } = useCharacter(activeCharacter?.id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const characterActions = character?.characterInventory?.actions;

  const subtypes = useStore(
    actionForm.store,
    (state) => state.values.actionType,
  );

  const item = useStore(actionForm.store, (state) => state.values.item) as Item;

  const action = useStore(
    actionForm.store,
    (state) => state.values.action,
  ) as Action;

  const { actions } = useActions(characterActions);

  const filterActions = (item: Item) => {
    const rangedActions = ['Single Shot', 'Salvo', 'Reload'];
    const meleeActions = ['Strike', 'Flurry', 'Haymaker', 'Charge', 'Throw'];

    const itemActions = item.linkedActions || [];

    if (item.keywords.some((data) => data.keyword.name === 'Ranged')) {
      return [
        ...actions.filter((action) => rangedActions.includes(action.name)),
        ...itemActions,
      ].sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      );
    } else if (item.keywords.some((data) => data.keyword.name === 'Melee')) {
      return [
        ...actions.filter((action) => meleeActions.includes(action.name)),
        ...itemActions,
      ].sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      );
    } else {
      return [...itemActions].sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      );
    }
  };

  const actionList = item ? filterActions(item) : actions;

  const setItem = useCombatStore((state) => state.setItem);

  const handleChosenItem = (action: Action) => {
    if (action && action.parentItemId) {
      const item = queryClient.getQueryData([
        'item',
        action.parentItemId,
      ]) as Item;

      setItem(item);

      actionForm.setFieldValue('item', item);
    }
  };

  let actionInfo = null;

  if (action) {
    if (actionFuncs[`${camelCase(action.name)}`]) {
      actionInfo = actionFuncs[`${camelCase(action.name)}`](
        action.costs,
        character,
        item,
      );
    } else {
      actionInfo = {
        message: `Programmed support for ${action.name} is currently not supported. Handle this action manually.`,
      };
    }
  }

  const { errors } =
    actionInfo && actionInfo.costs
      ? calculateCosts(actionInfo.costs, character, item)
      : { errors: [] as string[] };

  if (actionInfo) {
    const targetData = getTarget(`character ${activeCharacter?.id}`);
    if (targetData) {
      const inRange = isInRange(
        { row: targetData.start.row, col: targetData.start.col },
        { row: targetData.end.row, col: targetData.end.col },
        actionInfo.range,
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
    <Sidebar position="right">
      <div className="flex items-center justify-between gap-2">
        <ArrowHeader3 className="whitespace-nowrap" title="Action" />
        <IconBtnMedium
          tooltip="Actions"
          onClick={() => navigate('modal/actions')}
        >
          <ActionIcon />
        </IconBtnMedium>
        <IconBtnMedium
          tooltip="Reset Action"
          onClick={() => {
            actionForm.reset();
            setItem(null);
            removeTarget(`character ${activeCharacter?.id}`);
          }}
        >
          <Icon path={mdiSync} />
        </IconBtnMedium>
      </div>
      <actionForm.Field
        name="actionType"
        listeners={{
          onChange: () => {
            actionForm.setFieldValue('action', null);
          },
        }}
      >
        {(field) => (
          <InputSelectField
            label="Action Type"
            options={['attack', 'movement', 'unique']}
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </actionForm.Field>
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
            label="Actions"
            options={actionList}
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </actionForm.Field>
      <Divider />
      {actionInfo &&
        (actionInfo.message ? (
          <>
            <p>{actionInfo.message}</p>
            <Divider />
          </>
        ) : (
          <>
            {actionInfo &&
              actionInfo.costs &&
              Object.keys(actionInfo.costs).length > 0 && (
                <div className="flex w-full flex-col justify-start gap-2">
                  <ArrowHeader4 className="text-primary" title="Action Costs" />
                  <StatBarContainer size="small">
                    <ActionStatBars size="small" stats={actionInfo.costs} />
                  </StatBarContainer>
                </div>
              )}
            {actionInfo && actionInfo.requirements.includes('item') && (
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
            {actionInfo && actionInfo.requirements.includes('target') && (
              <actionForm.Subscribe selector={(state) => state.values.target}>
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
            <Divider />
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
          {([action, item, target, modifiers, extraDice]) => {
            const diceCount =
              character && action?.roll?.length > 0 && modifiers
                ? calculateDiceCount(
                    character?.attributes,
                    action,
                    modifiers,
                    extraDice,
                  ).diceCount
                : 'N/A';

            return (
              <>
                {action?.roll && action?.roll.length > 0 ? (
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
                                    if (field.state.value?.includes(value)) {
                                      actionForm.setFieldValue(
                                        'modifiers',
                                        (prev) =>
                                          prev.filter(
                                            (modifier) => modifier !== value,
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
                            label="Extra Dice"
                            type="number"
                            value={field.state.value}
                            onChange={(value) => field.handleChange(value)}
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
                      ariaLabel="Roll action"
                      type="button"
                      onClick={() => {
                        if (action && target && item) {
                          actionForm.handleSubmit();
                        }
                      }}
                    >
                      Roll Action
                    </BtnRect>
                  </>
                ) : (
                  <BtnRect
                    type="button"
                    ariaLabel="Confirm action"
                    onClick={() => {
                      actionForm.handleSubmit();
                    }}
                  >
                    Confirm Action
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
      <Divider />
    </Sidebar>
  );
};

export default ActionSidebar;
