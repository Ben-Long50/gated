import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import CoverPicture from './CoverPicture';
import { capitalCase } from 'change-case';
import Loading from './Loading';
import ArrowHeader3 from './ArrowHeader3';
import Divider from './Divider';
import { useState } from 'react';
import { Map } from 'src/types/map';
import ReputationBar from './ReputationBar';
import useGang from 'src/hooks/useGang';
import BtnAuth from './buttons/BtnAuth';
import StatBarContainer from './StatBarContainer';
import StatBar from './StatBar';
import BtnRect from './buttons/BtnRect';
import { useForm } from '@tanstack/react-form';
import useUpdateGangCharactersMutation from 'src/hooks/gang hooks/updateGangCharactersMutation/useUpdateGangCharactersMutation';
import NavTabs from './NavTabs';
import CharacterList from './characterComponents/CharacterList';
import Affiliations from './Affiliations';

const GangPage = () => {
  const { campaignId, gangId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');
  const [tab, setTab] = useState('information');
  const [subTab, setSubTab] = useState('characters');

  const {
    gang,
    characters,
    gangPoints,
    usedGangPoints,
    reputationData,
    levelData,
    leaderCount,
    memberCount,
    goonCount,
    affiliations,
    gangLoading,
  } = useGang(Number(gangId));

  const levelUpAvailable = characters.some(
    (character) => character.level < levelData.level,
  );

  const createGang = useUpdateGangCharactersMutation(
    Number(campaignId),
    Number(gangId),
  );

  const gangCharactersForm = useForm({
    defaultValues: {
      leaderIds:
        gang?.leaders.map((character) => character.id) || ([] as number[]),
      characterIds:
        gang?.characters.map((character) => character.id) || ([] as number[]),
    },

    onSubmit: async ({ value }) => {
      await createGang.mutate(value);
    },
  });

  if (gangLoading) {
    return <Loading />;
  }

  return (
    <>
      <CoverPicture picture={gang?.picture} />
      <div className="absolute left-8 right-8 top-8 flex items-start justify-between gap-8">
        <h2 className="w-full font-zen text-4xl">{capitalCase(gang?.name)}</h2>
        <p className="!text-accent whitespace-nowrap font-zen text-4xl">
          Level {levelData.level}
        </p>
      </div>
      <NavTabs className="grid-cols-3">
        <BtnAuth
          active={tab === 'information'}
          onClick={() => setTab('information')}
        >
          Information
        </BtnAuth>
        <BtnAuth
          active={tab === 'background'}
          onClick={() => setTab('background')}
        >
          Background
        </BtnAuth>
        <BtnAuth
          active={tab === 'affiliations'}
          onClick={() => setTab('affiliations')}
        >
          Affiliations
        </BtnAuth>
      </NavTabs>
      {tab === 'information' && (
        <>
          {' '}
          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col items-center gap-2 px-4">
              <h3>{`Reputation - ${reputationData.description}`}</h3>
              <ReputationBar value={reputationData.reputation} />
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <ArrowHeader3 title="Gang Stats" />
            </div>
            <StatBarContainer className="my-4" icon={false} size="small">
              {reputationData.requiredPoints && (
                <StatBar
                  title="Reputation Points"
                  total={reputationData.requiredPoints}
                  current={reputationData.reputationPoints}
                  color="rgb(59 130 246)"
                  size="large"
                  widthCap={false}
                />
              )}
              <StatBar
                title="Level Nodes"
                total={levelData.requiredNodes}
                current={levelData.levelNodes}
                color="rgb(250 204 21)"
                size="large"
                widthCap={false}
              />
            </StatBarContainer>
            <div className="flex w-full items-start justify-between gap-8">
              <div className="grid grid-cols-[auto_auto] gap-x-8 gap-y-1">
                <p>Leaders</p>
                <p className="justify-self-end">{leaderCount}</p>
                <p>Members</p>
                <p className="justify-self-end">{memberCount}</p>
                <p>Goons</p>
                <p className="justify-self-end whitespace-nowrap text-center">
                  {goonCount} / {gangPoints}
                </p>
              </div>
              <div className="grid grid-cols-[auto_auto] gap-x-8 gap-y-1">
                <p>Gang Points</p>
                <p className="justify-self-end">
                  {usedGangPoints} / {gangPoints}
                </p>
                <p>Profits</p>
                <p className="justify-self-end">
                  {gang?.profits.toLocaleString()} p
                </p>
                <p>Properties</p>
                <p className="justify-self-end whitespace-nowrap text-center">
                  {gang?.properties.length}
                </p>
              </div>
            </div>
            <Divider />
            <div className="grid grid-cols-2 gap-4">
              <BtnAuth onClick={() => navigate('allocateReputation')}>
                Allocate Reputation
              </BtnAuth>
              <BtnAuth onClick={() => navigate('allocateNodes')}>
                Allocate Level Nodes
              </BtnAuth>
              <BtnAuth onClick={() => navigate('distributeProfits')}>
                Distribute Profits
              </BtnAuth>
              {levelUpAvailable ? (
                <BtnRect
                  ariaLabel="Manage levels"
                  onClick={() => navigate('manageLevels')}
                >
                  Manage Character Levels
                </BtnRect>
              ) : (
                <BtnAuth onClick={() => navigate('manageLevels')}>
                  Manage Character Levels
                </BtnAuth>
              )}
              <BtnAuth onClick={() => navigate('manageGangCharacters')}>
                Manage Gang Characters
              </BtnAuth>
              <BtnAuth onClick={() => navigate('')}>
                Purchase Properties
              </BtnAuth>
            </div>
          </div>
          <Divider />
          <NavTabs className="grid-cols-3">
            <BtnAuth
              active={subTab === 'characters'}
              onClick={() => setTab('characters')}
            >
              Characters
            </BtnAuth>
            <BtnAuth
              active={subTab === 'properties'}
              onClick={() => setTab('properties')}
            >
              Properties
            </BtnAuth>
            <BtnAuth active={subTab === 'turf'} onClick={() => setTab('turf')}>
              Turf
            </BtnAuth>
          </NavTabs>
          {subTab === 'characters' && (
            <CharacterList
              characterIds={[...gang?.leaders, ...gang?.characters].map(
                (character) => character.id,
              )}
            />
          )}
          {subTab === 'properties' && (
            <div className="flex flex-col gap-4 p-6">
              <ArrowHeader3 title="Properties" />
              {gang?.properties.length === 0 ? (
                <p>No Properties</p>
              ) : (
                gang?.properties.map((property) => (
                  <ArrowHeader3 title={property.name} />
                ))
              )}
            </div>
          )}
          {subTab === 'turf' && (
            <div className="flex flex-col gap-4 p-6">
              <ArrowHeader3 title="Turf" />
              {gang?.turf.length === 0 ? (
                <p>No Turf</p>
              ) : (
                gang?.turf.map((map: Map) => <ArrowHeader3 title={map.name} />)
              )}
            </div>
          )}
        </>
      )}
      {tab === 'background' &&
        (gang?.background ? (
          <div
            id="quill-display"
            className="ql-editor whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: gang?.background.html }}
          />
        ) : (
          <p className="text-center">No background</p>
        ))}
      {tab === 'affiliations' && <Affiliations affiliations={affiliations} />}
      <BtnRect ariaLabel="Update gang" onClick={() => navigate('update')}>
        Update Gang
      </BtnRect>
      <Outlet context={{ gang, form: gangCharactersForm, parts }} />
    </>
  );
};

export default GangPage;
