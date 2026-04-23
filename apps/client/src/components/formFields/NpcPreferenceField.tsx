import { FormApi } from '@tanstack/react-form';
import BtnRect from '../buttons/BtnRect';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { capitalCase } from 'change-case';
import ArrowHeader3 from '../ArrowHeader3';

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
                      <p>{capitalCase(type)}</p>
                      <input
                        type="checkbox"
                        className="size-7"
                        checked={field.state.value.includes(type)}
                        onChange={() => {
                          if (field.state.value.includes(type)) {
                            field.handleChange(
                              field.state.value.filter(
                                (t: string) => t !== type,
                              ),
                            );
                          } else {
                            field.handleChange([...field.state.value, type]);
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
