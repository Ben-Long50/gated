import { Outlet, useNavigate, useParams } from 'react-router-dom';
import CoverPicture from './CoverPicture';
import { capitalCase } from 'change-case';
import Loading from './Loading';
import ArrowHeader3 from './ArrowHeader3';
import Divider from './Divider';
import ThemeContainer from './ThemeContainer';
import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import CharacterListSmall from './CharacterListSmall';
import { Map } from 'src/types/map';
import ReputationBar from './ReputationBar';
import useUpdateReputationMutation from 'src/hooks/gang hooks/useUpdateReputationMutation/useUpdateReputationMutation';
import useGang from 'src/hooks/useGang';
import BtnAuth from './buttons/BtnAuth';
import StatBarContainer from './StatBarContainer';
import StatBar from './StatBar';

const GangPage = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { campaignId, gangId } = useParams();
  const navigate = useNavigate();

  const {
    gang,
    gangPoints,
    usedGangPoints,
    reputationData,
    requiredNodes,
    leaderCount,
    memberCount,
    goonCount,
    gangLoading,
  } = useGang(Number(gangId));

  const updateReputation = useUpdateReputationMutation(
    Number(campaignId),
    Number(gangId),
  );

  if (gangLoading) {
    return <Loading />;
  }

  return (
    <>
      {gang?.picture?.imageUrl && <CoverPicture picture={gang?.picture} />}
      <div className="flex w-full max-w-7xl flex-col items-center gap-8">
        <h1 className="w-full text-center font-zen text-4xl sm:text-5xl">
          {capitalCase(gang?.name)}
        </h1>
        <ThemeContainer
          className="w-full"
          chamfer="medium"
          borderColor={accentPrimary}
        >
          <div className="flex w-full flex-col gap-4 p-6">
            <div className="flex flex-col items-center gap-2 px-4">
              <h3>{`Reputation - ${reputationData.description}`}</h3>
              <ReputationBar
                value={reputationData.reputation}
                onClick={(value) => updateReputation.mutate(value)}
              />
            </div>
            <Divider />
            <div className="flex items-center justify-between">
              <ArrowHeader3 title="Gang Stats" />
              <h2 className="!text-accent">
                <span className="text-xl">Gang Level - </span>
                {gang?.level}
              </h2>
            </div>
            <StatBarContainer className="my-4" icon={false} size="small">
              {reputationData.requiredPoints && (
                <StatBar
                  title="Reputation Points"
                  total={reputationData.requiredPoints}
                  current={reputationData.reputationPoints}
                  color="gold"
                  size="large"
                  widthCap={false}
                />
              )}
              <StatBar
                title="Level Nodes"
                total={requiredNodes}
                current={gang?.levelNodes}
                color="gold"
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
                <p className="justify-self-end">{gang?.profits}</p>
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
            </div>
          </div>
        </ThemeContainer>
        <div className="grid w-full grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <CharacterListSmall title="Leaders" characters={gang?.leaders} />
            <CharacterListSmall title="Members" characters={gang?.characters} />
          </div>
          <div className="flex flex-col gap-8">
            <ThemeContainer chamfer="medium" borderColor={accentPrimary}>
              <div className="flex flex-col gap-4 p-6">
                <ArrowHeader3 title="Turf" />
                {gang?.turf.length === 0 ? (
                  <h3>N/A</h3>
                ) : (
                  gang?.turf.map((map: Map) => (
                    <ArrowHeader3 title={map.name} />
                  ))
                )}
                <Divider />
                <ArrowHeader3 title="Properties" />
                {gang?.properties.length === 0 ? (
                  <h3>N/A</h3>
                ) : (
                  gang?.properties.map((property) => (
                    <ArrowHeader3 title={property.name} />
                  ))
                )}
              </div>
            </ThemeContainer>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default GangPage;
