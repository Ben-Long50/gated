import { useParams } from 'react-router-dom';
import useGangQuery from 'src/hooks/gang hooks/useGangQuery/useGangQuery';
import CoverPicture from './CoverPicture';
import { capitalCase } from 'change-case';
import Loading from './Loading';
import ArrowHeader3 from './ArrowHeader3';
import Divider from './Divider';
import { Character } from 'src/types/character';
import ThemeContainer from './ThemeContainer';
import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import CharacterListSmall from './CharacterListSmall';
import { Map } from 'src/types/map';
import ReputationBar from './ReputationBar';
import useUpdateReputationMutation from 'src/hooks/gang hooks/useUpdateReputationMutation/useUpdateReputationMutation';

const GangPage = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { campaignId, gangId } = useParams();

  const { data: gang, isLoading: gangLoading } = useGangQuery(Number(gangId));

  const updateReputation = useUpdateReputationMutation(
    Number(campaignId),
    Number(gangId),
  );

  const memberCount = gang?.characters.filter(
    (character: Character) =>
      !character.npcTypes || !character.npcTypes.includes('goon'),
  ).length;

  const goonCount = gang?.characters.filter(
    (character: Character) =>
      character.npcTypes && character.npcTypes.includes('goon'),
  ).length;

  let reputation = '';

  switch (gang?.reputation) {
    case 1:
      reputation = 'New Kids on the Block';
      break;
    case 2:
      reputation = 'Up and Comers';
      break;
    case 3:
      reputation = 'Original Gangsters';
      break;
    case 4:
      reputation = 'Made Men';
      break;
    case 5:
      reputation = 'Living Legends';
      break;
    default:
      reputation = 'No Reputation';
      break;
  }

  if (gangLoading) {
    return <Loading />;
  }

  return (
    <>
      {gang.picture?.imageUrl && <CoverPicture picture={gang.picture} />}
      <div className="flex w-full max-w-7xl flex-col items-center gap-8">
        <h1 className="w-full text-center font-zen text-4xl sm:text-5xl">
          {capitalCase(gang.name)}
        </h1>
        <ThemeContainer
          className="w-full"
          chamfer="medium"
          borderColor={accentPrimary}
        >
          <div className="w-full p-6">
            <div className="flex flex-col items-center gap-2 px-4">
              <h3>{`Reputation - ${reputation}`}</h3>
              <ReputationBar
                value={gang.reputation}
                onClick={(value) => updateReputation.mutate(value)}
              />
            </div>
            <Divider />
            <div className="mb-4 flex items-center justify-between">
              <ArrowHeader3 title="Quick Stats" />
              <h2 className="!text-accent">
                <h3 className="!text-accent inline">Gang Level </h3>
                {gang.level}
              </h2>
            </div>
            <div className="flex w-full items-start justify-between gap-8">
              <div className="grid grid-cols-[auto_auto] items-start gap-x-4 gap-y-1">
                <p>Leaders</p>
                <p className="w-6 text-center">{gang.leaders.length}</p>
                <p>Members</p>
                <p className="w-6 text-center">{memberCount}</p>
                <p>Goons</p>
                <p className="w-6 text-center">{goonCount}</p>
              </div>
              <div className="flex w-full flex-col items-end gap-2">
                <p>{`Gang Points ${gang.gangPoints}`}</p>
                <p>{`Profits ${gang.profits}`}</p>
              </div>
            </div>
          </div>
        </ThemeContainer>
        <div className="grid w-full grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <CharacterListSmall title="Leaders" characters={gang.leaders} />
            <CharacterListSmall title="Members" characters={gang.characters} />
          </div>
          <div className="flex flex-col gap-8">
            <ThemeContainer chamfer="medium" borderColor={accentPrimary}>
              <div className="flex flex-col gap-4 p-6">
                <ArrowHeader3 title="Turf" />
                {gang.turf.length === 0 ? (
                  <h3>N/A</h3>
                ) : (
                  gang.turf.map((map: Map) => <ArrowHeader3 title={map.name} />)
                )}
                <Divider />
                <ArrowHeader3 title="Properties" />
                {gang.properties.length === 0 ? (
                  <h3>N/A</h3>
                ) : (
                  gang.properties.map((property) => (
                    <ArrowHeader3 title={property.name} />
                  ))
                )}
              </div>
            </ThemeContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default GangPage;
