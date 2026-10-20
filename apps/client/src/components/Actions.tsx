import InputField from './formFields/InputField';
import { FormApi } from '@tanstack/react-form';
import useActions from '../hooks/useActions';
import ActionCard from './ActionCard';
import Loading from './Loading';
import ArrowHeader2 from './ArrowHeader2';
import InputSelectField from './formFields/InputSelectField';
import Icon from '@mdi/react';
import { mdiSync } from '@mdi/js';
import { capitalCase } from 'change-case';
import InputFieldCheckbox from './formFields/InputFieldCheckbox';
import IconBtnMedium from './buttons/IconBtnMedium';
import { useContext } from 'react';
import { LayoutContext } from 'src/contexts/LayoutContext';

const Actions = ({ form }: { form?: FormApi }) => {
  const { mobile } = useContext(LayoutContext);

  const {
    actions,
    query,
    types,
    setTypes,
    setQuery,
    subTypes,
    setSubtypes,
    isLoading,
  } = useActions();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <div className="grid w-full grid-cols-2 items-center justify-between gap-4">
          <InputSelectField
            label="Action Type"
            options={['action', 'extendedAction', 'reaction', 'passive']}
            value={types[0]}
            onChange={(value) => {
              setTypes([value]);
            }}
          />
          <InputSelectField
            label="Action Subtype"
            options={['attack', 'movement', 'upkeep', 'unique']}
            value={subTypes[0]}
            onChange={(value) => {
              setSubtypes([value]);
            }}
          />
        </div>
        <div className="flex items-end gap-4">
          <InputField
            label="Search actions"
            value={query}
            onChange={(value) => {
              setQuery(value);
            }}
          />

          <IconBtnMedium
            onClick={() => {
              setQuery('');
              setTypes([]);
              setSubtypes([]);
            }}
            tooltip="Reset Search"
          >
            <Icon path={mdiSync} />
          </IconBtnMedium>
        </div>
      </div>
      <div className="flex w-full flex-col gap-8">
        <ArrowHeader2
          title={types[0] ? capitalCase(types[0]) : 'All Actions'}
        />
        {form ? (
          <form.Field name="actionIds">
            {(field) => (
              <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                {actions?.map((action) => (
                  <InputFieldCheckbox
                    label={
                      <ActionCard
                        size={mobile ? 'small' : 'large'}
                        actionId={action.id}
                      />
                    }
                    value={action.id}
                    checked={field.state.value.some(
                      (id: number) => action.id === id,
                    )}
                    onChange={(value) => {
                      if (!field.state.value.includes(Number(value))) {
                        field.handleChange([
                          ...field.state.value,
                          Number(value),
                        ]);
                      } else {
                        field.handleChange(
                          field.state.value.filter(
                            (id: number) => id !== Number(value),
                          ),
                        );
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </form.Field>
        ) : (
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            {actions?.map((action) => (
              <ActionCard
                size={mobile ? 'small' : 'large'}
                actionId={action.id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Actions;
