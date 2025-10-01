import { capitalCase } from 'change-case';
import {
  Fragment,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import Loading from '../Loading';
import ItemCardSmall from '../ItemCardSmall';
import Icon from '@mdi/react';
import { mdiEye, mdiTagEdit, mdiTrashCanOutline } from '@mdi/js';
import useMaps from 'src/hooks/useMaps';
import BtnRect from '../buttons/BtnRect';
import Divider from '../Divider';
import CloudinaryImage from '../CloudinaryImage';
import useCombatQueries from 'src/hooks/combat hooks/useCombatQueries/useCombatQueries';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import CharacterCardSmall from '../CharacterCardSmall';
import ArrowHeader3 from '../ArrowHeader3';
import ArrowHeader4 from '../ArrowHeader4';
import { socket } from 'src/socket';
import { CampaignContext } from 'src/contexts/CampaignContext';

const EncounterList = () => {
  const { mapId, campaignId } = useParams();
  const { gameMaster } = useContext(CampaignContext);
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');
  const [widthModifier, setWidthModifier] = useState(500);

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

  useEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setWidthModifier(width);
    }
  }, [containerRef.current, pendingEncounters, completedEncounters]);

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
                      <div className="flex items-center gap-4">
                        <button
                          className="bg-tertiary group rounded p-1.5 shadow-md shadow-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`../${encounter.id}`);
                          }}
                        >
                          <Icon
                            className="text-secondary group-hover:text-accent timing size-6"
                            path={mdiEye}
                          />
                        </button>
                        <button
                          className="bg-tertiary group rounded p-1.5 shadow-md shadow-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`../${encounter.id}/update`);
                          }}
                        >
                          <Icon
                            className="text-secondary group-hover:text-accent timing size-6"
                            path={mdiTagEdit}
                          />
                        </button>
                        <button
                          className="bg-tertiary group rounded p-1.5 shadow-md shadow-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`${encounter.id}/delete`);
                          }}
                        >
                          <Icon
                            className="text-secondary group-hover:text-accent timing size-6"
                            path={mdiTrashCanOutline}
                          />
                        </button>
                      </div>
                    </div>
                  }
                >
                  <Divider />
                  <div className="grid grid-cols-2 gap-8">
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
                      <Divider />
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
                    <div className="flex w-full flex-col items-start gap-4">
                      <ArrowHeader3 title={encounter.map.name} />
                      <CloudinaryImage
                        className="border-accent overflow-hidden rounded border"
                        publicId={encounter.map.picture.publicId}
                      />
                    </div>
                  </div>
                  {gameMaster && (
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
                      {encounter.active ? 'End Encounter' : 'Begin Encounter'}
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
