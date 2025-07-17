import useActions from 'src/hooks/useActions';
import InputSelectField from '../InputSelectField';
import useCombatStore from 'src/stores/combatStore';
import useCharacter from 'src/hooks/useCharacter';
import CharacterRoll from './CharacterRoll';
import ThemeContainer from '../ThemeContainer';
import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { FormApi } from '@tanstack/react-form';
import BtnRect from '../buttons/BtnRect';
import CharacterPictureRound from '../CharacterPictureRound';
import ActionStatBars from '../ActionStatBars';
import ArrowHeader4 from '../ArrowHeader4';
import RangeIcon from '../icons/RangeIcon';
import WeaponIcon from '../icons/WeaponIcon';
import InputFieldCheckbox from '../InputFieldCheckbox';
import { capitalCase } from 'change-case';

const ActionSidebar = ({
  form,
  diceArray,
  rolling,
  calculateSuccesses,
  successes,
}: {
  form: FormApi;
  diceArray: number[];
  rolling: boolean;
  calculateSuccesses: (
    attributes: AttributeTree,
    rolls: { attribute: string; skill: string }[],
    modifiers: string[],
  ) => number;
  successes: number;
}) => {
  const { accentPrimary } = useContext(ThemeContext);
  const activeCharacter = useCombatStore((state) => state.activeCharacter);

  const { filteredCharacter: character } = useCharacter(activeCharacter);

  const { generalActions, filterBySubCategory } = useActions(
    character?.actions,
  );

  const availableActions =
    generalActions && character?.actions
      ? [...character.actions, ...generalActions]
      : [];

  return (
    <ThemeContainer chamfer="medium" borderColor={accentPrimary}>
      <div className="flex flex-col gap-4 p-4">
        <InputSelectField
          label="Action Category"
          options={['attack', 'movement', 'unique']}
          onChange={(category) => {
            filterBySubCategory(category);
            form.setFieldValue('action', null);
          }}
        />
        <form.Field
          name="action"
          listeners={{ onChange: () => form.setFieldValue('item', null) }}
        >
          {(field) => (
            <>
              <InputSelectField
                field={field}
                label="Actions"
                options={availableActions}
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
        </form.Field>
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
        {diceArray.length > 0 && (
          <CharacterRoll
            form={form}
            characterId={activeCharacter}
            diceArray={diceArray}
            rolling={rolling}
            calculateSuccesses={calculateSuccesses}
            successes={successes}
          />
        )}
        <form.Subscribe
          selector={(state) => [
            state.values.action,
            state.values.item,
            state.values.target,
          ]}
        >
          {([action, item, target]) => (
            <BtnRect
              className={`${(!action || !item || !target) && 'pointer-events-none opacity-50'} w-full`}
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
          )}
        </form.Subscribe>
      </div>
    </ThemeContainer>
  );
};

export default ActionSidebar;
