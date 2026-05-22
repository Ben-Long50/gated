import { FormApi } from '@tanstack/react-form';
import BtnRect from '../buttons/BtnRect';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { capitalCase } from 'change-case';
import ArrowHeader3 from '../ArrowHeader3';
import InputFieldCheckbox from './InputFieldCheckbox';

const NpcPreferenceField = ({ form }: { form: FormApi }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const npcTypes = ['shop', 'template', 'goon'];

  return (
    <form.Subscribe selector={(state) => state.values.playerCharacter}>
      {(playerCharacter: boolean) =>
        playerCharacter === false && (
          <>
            {parts[parts.length - 1] === 'npcPreferences' && (
              <Outlet context={{ form, parts }} />
            )}
            <form.Field name="npcTypes" mode="array">
              {(field) => (
                <div className="flex w-full flex-col gap-4">
                  <ArrowHeader3 title="Npc Types" />
                  {npcTypes.map((type) => (
                    <div className="flex items-center justify-between">
                      <InputFieldCheckbox
                        label={capitalCase(type)}
                        value={type}
                        checked={field.state.value.includes(type)}
                        onChange={(value) => {
                          if (field.state.value.includes(value)) {
                            field.handleChange(
                              field.state.value.filter(
                                (t: string) => t !== value,
                              ),
                            );
                          } else {
                            field.handleChange([...field.state.value, value]);
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </form.Field>
            <BtnRect
              type="button"
              ariaLabel="NPC preferences"
              onClick={() => {
                navigate('npcPreferences');
              }}
            >
              NPC Preferences
            </BtnRect>
          </>
        )
      }
    </form.Subscribe>
  );
};

export default NpcPreferenceField;
