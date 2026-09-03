import { Affiliation } from 'src/types/faction';
import AffiliationCard from './AffiliationCard';
import Divider from './Divider';
import { useState } from 'react';
import NavTabs from './NavTabs';
import BtnAuth from './buttons/BtnAuth';
import InputSelectField from './formFields/InputSelectField';
import Icon from '@mdi/react';
import IconBtnMedium from './buttons/IconBtnMedium';
import { mdiSync } from '@mdi/js';

const Affiliations = ({ affiliations }: { affiliations: Affiliation[] }) => {
  const [tab, setTab] = useState('all');
  const [entity, setEntity] = useState(null);

  const entities = affiliations.flatMap((affiliation) => [
    ...affiliation.factions,
    ...affiliation.gangs,
    ...affiliation.characters,
  ]);

  const sortedAffiliations = {
    factionAffiliations:
      affiliations?.filter((affiliation: Affiliation) =>
        entity
          ? affiliation?.factions.length > 0 &&
            [
              ...affiliation.factions,
              ...affiliation.gangs,
              ...affiliation.characters,
            ].some((e) => e.id === entity.id)
          : affiliation?.factions.length > 0,
      ) || [],
    gangAffiliations:
      affiliations?.filter((affiliation: Affiliation) =>
        entity
          ? affiliation?.gangs.length > 0 &&
            [
              ...affiliation.factions,
              ...affiliation.gangs,
              ...affiliation.characters,
            ].some((e) => e.id === entity.id)
          : affiliation?.gangs.length > 0,
      ) || [],
    characterAffiliations:
      affiliations?.filter((affiliation: Affiliation) =>
        entity
          ? affiliation?.characters.length > 1 &&
            [
              ...affiliation.factions,
              ...affiliation.gangs,
              ...affiliation.characters,
            ].some((e) => e.id === entity.id)
          : affiliation?.characters.length > 1,
      ) || [],
  };

  const allAffiliations = [
    ...sortedAffiliations?.factionAffiliations,
    ...sortedAffiliations?.gangAffiliations,
    ...sortedAffiliations?.characterAffiliations,
  ];

  const factionAffiliations = sortedAffiliations?.factionAffiliations;

  const gangAffiliations = sortedAffiliations?.gangAffiliations;

  const characterAffiliations = sortedAffiliations?.characterAffiliations;

  return (
    <div className="flex w-full flex-col items-start gap-8">
      <div className="flex w-full items-center gap-4">
        <InputSelectField
          label="Entity"
          options={entities}
          value={entity?.id}
          onChange={(entity) => setEntity(entity)}
        />
        <IconBtnMedium
          onClick={() => {
            setEntity(null);
          }}
          tooltip="Reset Search"
        >
          <Icon path={mdiSync} />
        </IconBtnMedium>
      </div>
      <NavTabs className="grid-cols-4">
        <BtnAuth active={tab === 'all'} onClick={() => setTab('all')}>
          All
        </BtnAuth>
        <BtnAuth active={tab === 'faction'} onClick={() => setTab('faction')}>
          Faction
        </BtnAuth>
        <BtnAuth active={tab === 'gang'} onClick={() => setTab('gang')}>
          Gang
        </BtnAuth>
        <BtnAuth
          active={tab === 'character'}
          onClick={() => setTab('character')}
        >
          Character
        </BtnAuth>
      </NavTabs>
      {tab === 'all' &&
        (allAffiliations.length > 0 ? (
          allAffiliations.map((affiliation: Affiliation, index) => (
            <>
              <AffiliationCard key={affiliation.id} affiliation={affiliation} />
              {index + 1 < allAffiliations.length && <Divider />}
            </>
          ))
        ) : (
          <p className="w-full text-center">No affiliations found</p>
        ))}
      {tab === 'faction' &&
        (factionAffiliations.length > 0 ? (
          factionAffiliations.map((affiliation: Affiliation, index) => (
            <>
              <AffiliationCard key={affiliation.id} affiliation={affiliation} />
              {index + 1 < factionAffiliations.length && <Divider />}
            </>
          ))
        ) : (
          <p className="w-full text-center">No Faction affiliations found</p>
        ))}
      {tab === 'gang' &&
        (gangAffiliations.length > 0 ? (
          gangAffiliations.map((affiliation: Affiliation, index) => (
            <>
              <AffiliationCard key={affiliation.id} affiliation={affiliation} />
              {index + 1 < gangAffiliations.length && <Divider />}
            </>
          ))
        ) : (
          <p className="w-full text-center">No Gang affiliations found</p>
        ))}
      {tab === 'character' &&
        (characterAffiliations.length > 0 ? (
          characterAffiliations.map((affiliation: Affiliation, index) => (
            <>
              <AffiliationCard key={affiliation.id} affiliation={affiliation} />
              {index + 1 < characterAffiliations.length && <Divider />}
            </>
          ))
        ) : (
          <p className="w-full text-center">No Character affiliations found</p>
        ))}
    </div>
  );
};

export default Affiliations;
