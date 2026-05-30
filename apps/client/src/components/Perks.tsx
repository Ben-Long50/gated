import PerkList from './PerkList';
import usePerks from '../hooks/usePerks';
import { FormApi } from '@tanstack/react-form';
import InputField from './formFields/InputField';
import Loading from './Loading';
import ArrowHeader2 from './ArrowHeader2';
import InputSelectField from './formFields/InputSelectField';
import { AttributeTree } from 'src/types/attributeTree';
import Icon from '@mdi/react';
import { mdiSync } from '@mdi/js';
import Divider from './Divider';
import NavTabs from './NavTabs';
import BtnAuth from './buttons/BtnAuth';
import { capitalCase } from 'change-case';

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
    skillQuery,
    setAttributeQuery,
    setSkillQuery,
    isLoading,
  } = usePerks(attributeTree);

  const skills = attributeQuery ? Object.keys(emptyTree[attributeQuery]) : [];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col items-center justify-between gap-4">
          <NavTabs className="grid-cols-5">
            <BtnAuth
              active={attributeQuery === 'general'}
              onClick={() => {
                setAttributeQuery('general');
                setSkillQuery('');
              }}
            >
              General
            </BtnAuth>
            <BtnAuth
              active={attributeQuery === 'cybernetica'}
              onClick={() => {
                setAttributeQuery('cybernetica');
                setSkillQuery('');
              }}
            >
              Cybernetica
            </BtnAuth>
            <BtnAuth
              active={attributeQuery === 'esoterica'}
              onClick={() => {
                setAttributeQuery('esoterica');
                setSkillQuery('');
              }}
            >
              Esoterica
            </BtnAuth>
            <BtnAuth
              active={attributeQuery === 'peace'}
              onClick={() => {
                setAttributeQuery('peace');
                setSkillQuery('');
              }}
            >
              Peace
            </BtnAuth>
            <BtnAuth
              active={attributeQuery === 'violence'}
              onClick={() => {
                setAttributeQuery('violence');
                setSkillQuery('');
              }}
            >
              Violence
            </BtnAuth>
          </NavTabs>
          {skills.length > 0 && (
            <NavTabs className="grid-cols-4">
              {skills.map((skill) => (
                <BtnAuth
                  active={skillQuery === skill}
                  onClick={() => setSkillQuery(skill)}
                >
                  {capitalCase(skill)}
                </BtnAuth>
              ))}
            </NavTabs>
          )}
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
      <PerkList perkTree={filteredPerkTree} form={form} />
    </>
  );
};

export default Perks;
