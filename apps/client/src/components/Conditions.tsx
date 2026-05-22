import InputField from './formFields/InputField';
import { FormApi } from '@tanstack/react-form';
import Loading from './Loading';
import useConditions from '../hooks/useConditions';
import ConditionCard from './ConditionCard';
import ArrowHeader2 from './ArrowHeader2';
import InputSelectField from './formFields/InputSelectField';
import Icon from '@mdi/react';
import { mdiSync } from '@mdi/js';
import { Condition } from 'src/types/condition';
import Divider from './Divider';

const Conditions = ({
  form,
  conditionList,
}: {
  form?: FormApi;
  conditionList?: Condition[];
}) => {
  const {
    filteredConditions: conditions,
    query,
    category,
    setQuery,
    setCategory,
    isLoading,
  } = useConditions(conditionList);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <div className="grid w-full grid-cols-2 gap-4 sm:gap-8">
          <ArrowHeader2 title="Filter Options" />
          <InputSelectField
            label="Condition Type"
            options={['character', 'item']}
            value={category}
            onChange={(value) => {
              setCategory(value);
            }}
          />
        </div>
        <div className="flex items-end gap-4">
          <InputField
            label="Search Conditions"
            value={query}
            onChange={(value) => {
              setQuery(value);
            }}
          />
          <button
            className="text-accent bg-tertiary shadow-color group grid size-12 shrink-0 place-items-center rounded-md p-1.5 shadow-md hover:underline"
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
      <Divider />
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            {conditions?.map((condition) => (
              <ConditionCard
                key={condition.id}
                form={form}
                condition={condition}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Conditions;
