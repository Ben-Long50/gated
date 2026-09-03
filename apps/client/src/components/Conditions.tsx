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
import IconBtnMedium from './buttons/IconBtnMedium';

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
        <InputSelectField
          label="Condition Type"
          options={['character', 'item']}
          value={category}
          onChange={(value) => {
            setCategory(value);
          }}
        />
        <div className="flex items-end gap-4">
          <InputField
            label="Search Conditions"
            value={query}
            onChange={(value) => {
              setQuery(value);
            }}
          />
          <IconBtnMedium
            onClick={() => {
              setQuery('');
              setCategory('');
            }}
            tooltip="Reset Search"
          >
            <Icon path={mdiSync} />
          </IconBtnMedium>
        </div>
      </div>
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
