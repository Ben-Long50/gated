import useActions from 'src/hooks/useActions';
import InputSelectField from '../InputSelectField';
import useCharacter from 'src/hooks/useCharacter';
import CharacterRoll from './CharacterRoll';
import { FormApi } from '@tanstack/react-form';
import BtnRect from '../buttons/BtnRect';
import CharacterPictureRound from '../CharacterPictureRound';
import ActionStatBars from '../ActionStatBars';
import ArrowHeader4 from '../ArrowHeader4';
import RangeIcon from '../icons/RangeIcon';
import WeaponIcon from '../icons/WeaponIcon';
import InputFieldCheckbox from '../InputFieldCheckbox';
import { capitalCase } from 'change-case';
import ArrowHeader3 from '../ArrowHeader3';
import ActionIcon from '../icons/ActionIcon';
import Icon from '@mdi/react';
import { mdiAutorenew } from '@mdi/js';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AttributeName,
  AttributeTree,
  SkillName,
} from 'src/types/attributeTree';
import { Action } from 'src/types/action';
import DieIcon from '../icons/DieIcon';
import { useQueryClient } from '@tanstack/react-query';
import { Item } from 'src/types/item';
import useCombatStore from 'src/stores/combatStore';

const ActionSidebar = ({
  form,
  actionSidebar,
  activeCharacterId,
  calculateDiceCount,
}: {
  form: FormApi;
  actionSidebar: boolean;
  activeCharacterId: number;
  calculateDiceCount: (
    attributes: AttributeTree,
    action: Partial<Action>,
    modifiers: string[],
  ) => {
    diceCount: number;
    roll: { attribute: AttributeName; skill: SkillName };
  };
}) => {
  const { filteredCharacter: character } = useCharacter(activeCharacterId);
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');
  const queryClient = useQueryClient();

  const {
    filteredActions: availableActions,
    filterBySubCategory,
    category,
  } = useActions(character?.actions, 'action');

  const setItem = useCombatStore((state) => state.setItem);

  const handleChosenItem = (action: Action) => {
    if (action.itemLinkId) {
      const items = queryClient
        .getQueriesData({
          queryKey: ['item'],
          exact: false,
        })
        .map((itemInfo) => itemInfo[1]) as Item[];

      const uniqueItem =
        items.find((item) => item.id === action.itemLink?.itemId) || null;

      setItem(uniqueItem);

      form.setFieldValue('item', uniqueItem);
    }
  };

  return (
    <div
      className={`${actionSidebar ? 'visible translate-x-0 opacity-100' : 'invisible translate-x-full opacity-0'} timing z-10 flex flex-col gap-4 p-2`}
    >
      {parts.includes('availableActions') && (
        <Outlet
          context={{
            actions: availableActions,
            category,
            form,
            handleChosenItem,
          }}
        />
      )}

      <div className="flex items-center justify-between gap-2">
        <ArrowHeader3 className="whitespace-nowrap" title="Action Form" />
        <button
          className="bg-tertiary group my-auto ml-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
          aria-label="Open save modal"
          type="button"
          onClick={() => navigate('availableActions')}
        >
          <ActionIcon
            className={`group-hover:text-accent text-tertiary timing size-8`}
          />
        </button>
        <button
          className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
          aria-label="Open save modal"
          type="button"
          onClick={() => {
            form.reset();
            setItem(null);
          }}
        >
          <Icon
            path={mdiAutorenew}
            className={`group-hover:text-accent text-tertiary timing size-8`}
          />
        </button>
      </div>

      <form.Field
        name="actionType"
        listeners={{ onChange: () => form.setFieldValue('action', null) }}
      >
        {(field) => (
          <InputSelectField
            label="Action Category"
            options={['attack', 'movement', 'unique']}
            field={field}
            onChange={(category) => {
              filterBySubCategory(category);
            }}
          />
        )}
      </form.Field>
      <form.Subscribe selector={(state) => state.values.item}>
        {(item) => (
          <form.Field
            name="action"
            listeners={{
              onChange: ({ value }) => {
                handleChosenItem(value);
              },
            }}
          >
            {(field) => {
              const costs = field.state.value
                ? field.state.value.name === 'Salvo Fire'
                  ? {
                      ...field.state.value.costs,
                      currentAmmoCount: item?.stats.salvo,
                    }
                  : field.state.value.costs
                : null;

              return (
                <>
                  <InputSelectField
                    field={field}
                    label="Actions"
                    options={availableActions}
                  />
                  {field.state.value && Object.keys(costs).length > 0 && (
                    <div className="flex w-full flex-col justify-start gap-2">
                      <p className="text-accent text-base tracking-widest">
                        Costs
                      </p>
                      <div
                        className={`grid h-full w-full grow grid-cols-[auto_auto_1fr_auto] place-items-center gap-2 gap-y-2 border-x-2 border-gray-400 border-opacity-50 px-2`}
                      >
                        <ActionStatBars stats={costs} cardWidth={499} />
                      </div>
                    </div>
                  )}
                </>
              );
            }}
          </form.Field>
        )}
      </form.Subscribe>

      <form.Subscribe
        selector={(state) => [
          state.values.action,
          state.values.item,
          state.values.target,
        ]}
      >
        {([action, item, target]) =>
          action?.actionSubtypes?.includes('attack') && (
            <>
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
            </>
          )
        }
      </form.Subscribe>
      <div className="relative flex w-full flex-col gap-2">
        <form.Field name="modifiers">
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
                        form.setFieldValue('modifiers', (prev) =>
                          prev.filter((modifier) => modifier !== value),
                        );
                      } else {
                        form.setFieldValue('modifiers', (prev) => [
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
        </form.Field>
      </div>
      {/* {roll?.diceArray.length > 0 && (
        <CharacterRoll
          form={form}
          characterId={activeCharacterId}
        />
      )} */}
      <form.Subscribe
        selector={(state) => [
          state.values.action,
          state.values.item,
          state.values.target,
          state.values.modifiers,
        ]}
      >
        {([action, item, target, modifiers]) => {
          const diceCount =
            character && action?.roll?.length > 0 && modifiers
              ? calculateDiceCount(character?.attributes, action, modifiers)
                  .diceCount
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
              <form.Subscribe selector={(state) => state.errorMap}>
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
              </form.Subscribe>
              <BtnRect
                className={`${(!action || !item || !target) && 'pointer-events-none opacity-50'} w-full whitespace-nowrap`}
                ariaLabel="Roll action"
                type="button"
                onClick={() => {
                  if (action && target && item) {
                    form.handleSubmit();
                  }
                }}
              >
                Roll Action
              </BtnRect>
            </>
          );
        }}
      </form.Subscribe>
    </div>
  );
};

export default ActionSidebar;
