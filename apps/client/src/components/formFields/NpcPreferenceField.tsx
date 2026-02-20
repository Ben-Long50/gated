import { FormApi } from '@tanstack/react-form';
import BtnRect from '../buttons/BtnRect';
import InputSelectField from '../InputSelectField';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';

const NpcPreferenceField = ({ form }: { form: FormApi }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const setBackgroundPath = useModalStore((state) => state.setBackgroundPath);

  const openNpcPreferenceModal = () => {
    setBackgroundPath(location.pathname);
    navigate('npcPreferences');
  };

  const npcTypes = ['shop', 'template', 'goon'];

  return (
    <form.Subscribe selector={(state) => state.values.playerCharacter}>
      {(playerCharacter) =>
        playerCharacter === false && (
          <>
            {parts[parts.length - 1] === 'npcPreferences' && (
              <Outlet context={{ form }} />
            )}
            <form.Field name="npcTypes" mode="array">
              {(field) =>
                field.state.value &&
                field.state.value.map((_, i) => (
                  <form.Field
                    key={i}
                    name={`npcTypes[${i}]`}
                    listeners={{
                      onChange: ({ value }) => {
                        const npcTypesField = field.state.value.filter(
                          (type: string | null) => type,
                        );

                        const lastValue =
                          npcTypesField[npcTypesField.length - 1];

                        if (
                          value &&
                          lastValue &&
                          npcTypesField.length < npcTypes.length
                        ) {
                          field.handleChange([...npcTypesField, '']);
                        } else if (npcTypesField.length === 0) {
                          field.handleChange(['']);
                        } else {
                          field.handleChange([...npcTypesField]);
                        }
                      },
                    }}
                  >
                    {(subField) => (
                      <InputSelectField
                        field={subField}
                        label="Npc Type"
                        options={npcTypes.filter(
                          (type) => !field.state.value.includes(type),
                        )}
                      />
                    )}
                  </form.Field>
                ))
              }
            </form.Field>
            <BtnRect
              type="button"
              ariaLabel="NPC preferences"
              onClick={(e) => {
                e.preventDefault();
                openNpcPreferenceModal();
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
