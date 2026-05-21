import PerkList from './PerkList';
import usePerks from '../hooks/usePerks';
import { FormApi } from '@tanstack/react-form';
import InputField from './InputField';
import Loading from './Loading';
import ArrowHeader2 from './ArrowHeader2';
import InputSelectField from './InputSelectField';
import { AttributeTree } from 'src/types/attributeTree';
import Icon from '@mdi/react';
import { mdiSync } from '@mdi/js';
import Divider from './Divider';

const Perks = ({
  form,
  attributeTree,
}: {
  form?: FormApi;
  attributeTree?: AttributeTree;
}) => {
  const {
    filteredPerkTree,
    emptyTree,
    query,
    attributeQuery,
    setQuery,
    setAttributeQuery,
    setSkillQuery,
    isLoading,
  } = usePerks(attributeTree);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <div className="grid w-full grid-cols-2 items-center justify-between gap-4 sm:grid-cols-3 sm:gap-8">
          <ArrowHeader2 title="Filter Options" />
          <InputSelectField
            label="Attribute"
            options={[
              '',
              'general',
              'cybernetica',
              'esoterica',
              'peace',
              'violence',
            ]}
            value={attributeQuery}
            onChange={(value) => {
              setAttributeQuery(value);
              setSkillQuery('');
            }}
          />
          <InputSelectField
            label="Skill"
            options={
              attributeQuery ? Object.keys(emptyTree[selectedAttribute]) : []
            }
            onChange={(value) => {
              setSkillQuery(value);
            }}
          />
        </div>
        <div className="flex items-end gap-4">
          <InputField
            label="Search Perks"
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
              setAttributeQuery('');
              setSkillQuery('');
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
      <PerkList perkTree={filteredPerkTree} form={form} />
    </>
  );
};

export default Perks;
