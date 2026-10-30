import { useContext, useState } from 'react';
import useMap from 'src/hooks/useMap';
import Loading from '../Loading';
import { mdiCrown } from '@mdi/js';
import Icon from '@mdi/react';
import EncounterGrid from './EncounterGrid';
import CharacterOptions from './CharacterOptions';
import { useParams } from 'react-router-dom';
import ActionSidebar from './ActionSidebar';
import ReactionSidebar from './ReactionSidebar';
import useEncounterHistoryQuery from 'src/hooks/encounter hooks/useEncounterHistoryQuery/useEncounterHistoryQuery';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import { EncounterContext } from 'src/contexts/EncounterContext';
import MapHeader from '../mapComponents/map/MapHeader';
import MapIcon from '../icons/MapIcon';
import useCombatStore from 'src/stores/combatStore';
import { useStore } from '@tanstack/react-form';
import Page from '../Page';
import EncounterSidebar from './EncounterSidebar';

const Encounter = () => {
  const {
    combat,
    combatLoading,
    joinedPlayers,
    encounterPermissions,
    activeCharacter,
    controlledCharacterId,
    actionForm,
  } = useContext(EncounterContext);

  const { campaignId, encounterId, mapId } = useParams();
  const [gridDisplay, setGridDisplay] = useState(false);
  const [measureMode, setMeasureMode] = useState(false);
  const [actionSidebar, setActionSidebar] = useState(false);
  const [characterOptions, setCharacterOptions] = useState(true);
  const [mapScale, setMapScale] = useState(1);
  const [mapInfo, setMapInfo] = useState(false);

  const { map, locations, mapLoading } = useMap(Number(mapId));

  const { data: campaign } = useCampaignQuery(Number(campaignId));

  const { data: history, isLoading: historyLoading } = useEncounterHistoryQuery(
    Number(encounterId),
  );

  const tempItem = useCombatStore((state) => state.item);
  const actionItem = useStore(actionForm.store, (state) => state.values.item);

  const item = tempItem || actionItem;

  if (mapLoading || combatLoading) return <Loading />;

  if (!map) return <h1>No Map Found</h1>;

  return (
    <Page container={false} context={{ history }}>
      <div
        className={`timing fixed inset-0 flex flex-col items-center justify-center bg-black`}
      >
        {/* <div className="absolute left-1 top-1 z-10 mx-auto ml-[72px] flex flex-col items-start justify-start gap-1">
          <button
            className="bg-secondary group flex w-full items-center gap-2 rounded p-1 shadow shadow-black"
            onClick={() => setMapInfo((prev) => !prev)}
          >
            <MapIcon className="timing text-primary group-hover:text-accent size-5" />
            <p className="group-hover:text-accent timing text-base">
              Toggle Map Tools
            </p>
          </button>
          <div className="bg-primary flex flex-col items-start p-1.5">
            {joinedPlayers?.map((player: any) => (
              <div className="flex items-center gap-2" key={player.username}>
                <p className="text-base">{player.username}</p>
                {campaign?.ownerId === player.playerId && (
                  <Icon path={mdiCrown} color="gold" size={0.8} />
                )}
              </div>
            ))}
          </div>
        </div> */}
        {/* {mapInfo && (
          <MapHeader
            mapName={map.name}
            gridDisplay={gridDisplay}
            setGridDisplay={setGridDisplay}
            measureMode={measureMode}
            setMeasureMode={setMeasureMode}
            mapScale={mapScale}
            setMapScale={setMapScale}
          />
        )} */}
        <div
          className={`${mapInfo && 'pb-[60px]'} flex h-full w-full grow items-center`}
        >
          <EncounterGrid
            width={map.width}
            height={map.height}
            baseColor={map.baseColor}
            layers={map.layers}
            mapScale={mapScale}
            locations={locations}
            gridDisplay={gridDisplay}
            measureMode={measureMode}
            setActionSidebar={setActionSidebar}
          />
        </div>
        <EncounterSidebar
          turnOrder={combat?.turnOrder}
          turnPosition={combat?.turnPosition}
          history={history}
          historyLoading={historyLoading}
        />
        {combat?.combatPhase === 'action' && (
          <ActionSidebar actionSidebar={actionSidebar} />
        )}
        {combat?.combatPhase === 'reaction' && (
          <ReactionSidebar actionSidebar={actionSidebar} />
        )}
        {controlledCharacterId && (
          <div
            className={`${!characterOptions && 'overflow-hidden'} timing absolute bottom-4 mt-auto w-full p-0.5`}
            style={{
              maxHeight: characterOptions ? '500px' : '0px',
            }}
          >
            <CharacterOptions
              setActionSidebar={setActionSidebar}
              characterOptions={characterOptions}
            />
          </div>
        )}
      </div>
    </Page>
  );
};

export default Encounter;
