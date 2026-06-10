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

const Actions = ({ form }: { form?: FormApi }) => {
  const {
    actions,
    query,
    category,
    subCategory,
    setQuery,
    setCategory,
    setSubCategory,
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
            value={category}
            onChange={(value) => {
              setCategory(value);
            }}
          />
          <InputSelectField
            label="Action Subtype"
            options={['attack', 'movement', 'upkeep', 'unique']}
            value={subCategory}
            onChange={(value) => {
              setSubCategory(value);
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

          <button
            className="text-accent bg-tertiary shadow-color group z-10 grid size-12 shrink-0 place-items-center rounded-md p-1.5 shadow-md hover:underline"
            onClick={(e) => {
              e.preventDefault();
              setQuery('');
              setCategory('');
            }}
          >
            <Icon
              path={mdiSync}
              className="text-secondary group-hover:text-accent timing"
            />
          </button>
        </div>
      </div>
      <div className="flex w-full flex-col gap-8">
        <ArrowHeader2 title={capitalCase(category) || 'All Actions'} />
        {form ? (
          <form.Field name="actionIds">
            {(field) => (
              <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                {actions?.map((action) => (
                  <InputFieldCheckbox
                    label={<ActionCard actionId={action.id} />}
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
              <ActionCard actionId={action.id} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Actions;
