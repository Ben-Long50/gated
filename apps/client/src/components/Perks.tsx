import PerkList from './PerkList';
import usePerks from '../hooks/usePerks';
import { FormApi } from '@tanstack/react-form';
import InputField from './formFields/InputField';
import Loading from './Loading';
import { AttributeTree } from 'src/types/attributeTree';
import Icon from '@mdi/react';
import { mdiSync } from '@mdi/js';
import NavTabs from './NavTabs';
import BtnAuth from './buttons/BtnAuth';
import { capitalCase } from 'change-case';
import InputFieldRadio from './formFields/InputFieldRadio';
import Divider from './Divider';
import IconBtnMedium from './buttons/IconBtnMedium';
import ArrowHeader3 from './ArrowHeader3';
import { useContext } from 'react';
import { LayoutContext } from 'src/contexts/LayoutContext';

const Perks = ({
  form,
  level,
  attributeTree,
}: {
  form?: FormApi;
  level?: number;
  attributeTree?: AttributeTree;
}) => {
  const { mobile } = useContext(LayoutContext);
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

  const attributes = Object.keys(emptyTree);

  const skills = attributeQuery ? Object.keys(emptyTree[attributeQuery]) : [];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex w-full flex-col gap-8">
        <div
          className={`${mobile ? 'grid-flow-row' : 'grid-flow-col'} grid w-full gap-8`}
        >
          <div className="flex w-full flex-col items-start justify-start gap-2">
            <ArrowHeader3 title="Attribute" />
            {attributes.map((attribute) => (
              <InputFieldRadio
                label={capitalCase(attribute)}
                checked={attributeQuery === attribute}
                value={attribute}
                onChange={(value) => {
                  setAttributeQuery(value);
                  setSkillQuery('');
                }}
              />
            ))}
          </div>
          {skills.length > 0 && (
            <div className="flex w-full flex-col items-start justify-start gap-2">
              <ArrowHeader3 title="Skill" />
              {skills.map((skill) => (
                <InputFieldRadio
                  label={capitalCase(skill)}
                  checked={skillQuery === skill}
                  value={skill}
                  onChange={() => setSkillQuery(skill)}
                />
              ))}
            </div>
          )}
        </div>
        <Divider />
        <div className="flex items-end gap-4">
          <InputField
            label="Search Perks"
            value={query}
            onChange={(value) => {
              setQuery(value);
            }}
          />
          <IconBtnMedium
            onClick={() => {
              setQuery('');
              setAttributeQuery('');
              setSkillQuery('');
            }}
            tooltip="Reset Search"
          >
            <Icon path={mdiSync} />
          </IconBtnMedium>
        </div>
      </div>
      <PerkList
        perkTree={filteredPerkTree}
        level={level}
        attributes={attributeTree}
        form={form}
      />
    </>
  );
};

export default Perks;
