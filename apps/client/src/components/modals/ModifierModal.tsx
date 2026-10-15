import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import BtnAuth from '../buttons/BtnAuth';
import { capitalCase } from 'change-case';
import InputField from '../formFields/InputField';
import { mdiSync } from '@mdi/js';
import InputSelectField from '../formFields/InputSelectField';
import InputFieldCheckbox from '../formFields/InputFieldCheckbox';
import NavTabs from '../NavTabs';
import IconBtnSmall from '../buttons/IconBtnSmall';
import Icon from '@mdi/react';

const ModifierModal = () => {
  const [tab, setTab] = useState<'character' | 'item'>('character');
  const [inputType, setInputType] = useState<'number' | 'skill'>('number');

  const { form } = useOutletContext() || {};

  const characterStats = [
    'maxHealth',
    'currentHealth',
    'maxSanity',
    'currentSanity',
    'maxCyber',
    'maxEquip',
    'maxHull',
    'speed',
    'evasion',
    'armor',
    'ward',
    'permanentInjuries',
    'permanentInsanities',
    'uploadRange',
    'mindExpansionRange',
    'jumpBracket',
    'actions',
    'reactions',
    'chomebitsTn',
    'hardwiredTn',
    'motorizedTn',
    'networkedTn',
    'gestaltTn',
    'godheadTn',
    'mysticismTn',
    'outerworldTn',
    'barterTn',
    'rhetoricTn',
    'eruditionTn',
    'treatmentTn',
    'assaultTn',
    'shootingTn',
    'subterfugeTn',
    'thresholdTn',
  ];

  const itemStats = [
    'damage',
    'salvo',
    'flurry',
    'range',
    'magCapacity',
    'magCount',
    'armor',
    'ward',
    'block',
    'cyber',
    'power',
    'weight',
    'size',
    'speed',
    'agility',
    'hull',
    'cargo',
    'pass',
    'turret',
    'weapon',
    'wyrmMoldSlots',
    'wyrmMoldPoints',
    'esotericCharges',
  ];

  const stats = tab === 'character' ? characterStats : itemStats;

  return (
    <>
      <h1>Stat Modifiers</h1>
      <NavTabs className="grid-cols-2">
        <BtnAuth
          onClick={() => {
            setTab('character');
          }}
          active={tab === 'character'}
        >
          Character Stats
        </BtnAuth>
        <BtnAuth
          onClick={() => {
            setTab('item');
          }}
          active={tab === 'item'}
        >
          Item Stats
        </BtnAuth>
      </NavTabs>
      <div className="flex w-full flex-col gap-4">
        <form.Field name="modifiers">
          {(field) => (
            <div className="flex flex-col gap-6">
              {stats.map((stat) => {
                const checked = field.state.value[stat] !== undefined;

                return (
                  <>
                    <div key={stat} className="flex w-full flex-col gap-4">
                      <InputFieldCheckbox
                        label={capitalCase(stat)}
                        value={stat}
                        checked={checked}
                        onChange={(value) => {
                          if (checked) {
                            const { [value]: _, ...rest } = field.state.value;
                            field.handleChange(rest);
                          } else {
                            field.handleChange((prev) => ({
                              ...prev,
                              [value]: 1,
                            }));
                          }
                        }}
                      />
                      {checked && (
                        <form.Field key={stat} name={`modifiers[${stat}]`}>
                          {(subfield) =>
                            inputType === 'number' ? (
                              <div className="flex w-full items-center gap-4">
                                <IconBtnSmall
                                  active={true}
                                  onClick={() => {
                                    setInputType('skill');
                                    subfield.handleChange('chromebits');
                                  }}
                                  tooltip="Toggle Value Type"
                                >
                                  <Icon path={mdiSync} />
                                </IconBtnSmall>
                                <InputField
                                  type="number"
                                  label={`${capitalCase(stat)} Value`}
                                  value={subfield.state.value}
                                  onChange={(value) =>
                                    subfield.handleChange(value)
                                  }
                                />
                              </div>
                            ) : (
                              <div className="flex w-full items-center gap-4">
                                <IconBtnSmall
                                  active={true}
                                  onClick={() => {
                                    setInputType('number');
                                    subfield.handleChange(1);
                                  }}
                                  tooltip="Toggle Value Type"
                                >
                                  <Icon path={mdiSync} />
                                </IconBtnSmall>
                                <InputSelectField
                                  label={`${capitalCase(stat)} Value`}
                                  options={[
                                    'chromebits',
                                    'hardwired',
                                    'motorized',
                                    'networked',
                                    'gestalt',
                                    'outerworld',
                                    'mysticism',
                                    'godhead',
                                    'barter',
                                    'rhetoric',
                                    'erudition',
                                    'treatment',
                                    'assault',
                                    'shooting',
                                    'subterfuge',
                                    'threshold',
                                  ]}
                                  value={subfield.state.value}
                                  onChange={(value) =>
                                    subfield.handleChange(value)
                                  }
                                />
                              </div>
                            )
                          }
                        </form.Field>
                      )}
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </form.Field>
      </div>
    </>
  );
};

export default ModifierModal;
