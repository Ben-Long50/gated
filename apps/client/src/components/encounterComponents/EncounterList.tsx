import { capitalCase } from 'change-case';
import { Fragment, useContext, useRef } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import Loading from '../Loading';
import ItemCardSmall from '../ItemCardSmall';
import BtnRect from '../buttons/BtnRect';
import Divider from '../Divider';
import CloudinaryImage from '../CloudinaryImage';
import useCombatQueries from 'src/hooks/combat hooks/useCombatQueries/useCombatQueries';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import CharacterCardSmall from '../CharacterCardSmall';
import ArrowHeader3 from '../ArrowHeader3';
import { socket } from 'src/socket';
import { CampaignContext } from 'src/contexts/CampaignContext';

const EncounterList = () => {
  const { mapId, campaignId } = useParams();
  const { gameMaster } = useContext(CampaignContext);
  const location = useLocation();
  const parts = location.pathname.split('/');

  const containerRef = useRef(null);

  const mode = (() => {
    if (parts.includes('pending')) {
      return 'pending';
    } else if (parts.includes('completed')) {
      return 'completed';
    }
    return 'all';
  })();

  const { data: campaign, isLoading: campaignLoading } = useCampaignQuery(
    Number(campaignId),
  );

  const { pendingEncounters, completedEncounters, isLoading } =
    useCombatQueries(campaign?.encounters.map((encounter) => encounter.id));

  let encounters = [] as any[];

  switch (mode) {
    case 'pending':
      encounters = pendingEncounters;
      break;
    case 'completed':
      encounters = completedEncounters;
      break;
    default:
      encounters = [];
      break;
  }

  if (campaignLoading || isLoading) return <Loading />;

  return (
    <div
      ref={containerRef}
      className="flex w-full max-w-5xl flex-col items-center gap-8"
    >
      <h1>{capitalCase(mode)} Encounters</h1>
      {encounters.length === 0 ? (
        <>
          <h3 className="text-center">
            Your campaign has no {mode} encounters
          </h3>
        </>
      ) : (
        <div className="flex w-full flex-col gap-4">
          {encounters.map((encounter) => {
            return (
              <Fragment key={encounter.id}>
                <ItemCardSmall
                  heading={
                    <div className="mr-4 flex w-full items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h2>{encounter.name}</h2>
                      </div>
                      <div className="flex items-center gap-4"></div>
                    </div>
                  }
                >
                  <Divider />
                  <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2 flex w-full flex-col items-start gap-4">
                      <ArrowHeader3 title={encounter.map.name} />
                      <CloudinaryImage
                        className="border-accent overflow-hidden rounded border"
                        publicId={encounter.map.picture.publicId}
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <ArrowHeader3 title="Player Characters" />
                      {encounter.characters
                        .filter((character) => character.playerCharacter)
                        .map((character) => (
                          <CharacterCardSmall
                            characterList={true}
                            characterId={character.id}
                            active={false}
                          />
                        ))}
                    </div>
                    <div className="flex flex-col gap-4">
                      <ArrowHeader3 title="Non-Player Characters" />
                      {encounter.characters
                        .filter((character) => !character.playerCharacter)
                        .map((character) => (
                          <CharacterCardSmall
                            characterList={true}
                            characterId={character.id}
                            active={false}
                          />
                        ))}
                    </div>
                  </div>
                  <Divider />
                  {gameMaster && !encounter.active && (
                    <BtnRect
                      type="button"
                      ariaLabel="Begin encounter"
                      onClick={(e) => {
                        e.stopPropagation();
                        socket.emit('activateEncounter', {
                          campaignId: Number(campaignId),
                          encounterId: encounter.id,
                        });
                      }}
                    >
                      Begin Encounter
                    </BtnRect>
                  )}
                </ItemCardSmall>
                {encounter.map.id === Number(mapId) && (
                  <Outlet context={{ name: encounter.map.name }} />
                )}
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EncounterList;
