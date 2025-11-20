import {
  Fragment,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import ReactGridLayout from 'react-grid-layout';
import useMap from 'src/hooks/useMap';
import Loading from '../Loading';
import { ThemeContext } from 'src/contexts/ThemeContext';
import {
  mdiChevronDown,
  mdiCrown,
  mdiGrid,
  mdiQueueFirstInLastOut,
} from '@mdi/js';
import Icon from '@mdi/react';
import EncounterGrid from './EncounterGrid';
import ItemCard from '../ItemCard';
import CharacterCardSmall from '../CharacterCardSmall';
import CharacterOptions from './CharacterOptions';
import useCombat from 'src/hooks/useCombat';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import useCombatStore from 'src/stores/combatStore';
import ActionSidebar from './ActionSidebar';
import { LayoutContext } from 'src/contexts/LayoutContext';
import ActionIcon from '../icons/ActionIcon';
import { CampaignContext } from 'src/contexts/CampaignContext';
import Divider from '../Divider';
import ReactionIcon from '../icons/ReactionIcon';
import ReactionSidebar from './ReactionSidebar';
import useEncounterHistoryQuery from 'src/hooks/combat hooks/useEncounterHistoryQuery/useEncounterHistoryQuery';
import ArrowHeader3 from '../ArrowHeader3';
import HistoryCard from './HistoryCard';
import HistoryIcon from '../icons/HistoryIcon';
import ArrowHeader4 from '../ArrowHeader4';
import CharacterName from './CharacterName';
import PassTurnIcon from '../icons/PassTurnIcon';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import useItemQuery from 'src/hooks/useItemQuery/useItemQuery';
import ItemCardBorderless from '../ItemCardBorderless';
import { EncounterContext } from 'src/contexts/EncounterContext';
import { User } from 'src/types/user';

const Encounter = () => {
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);
  const {
    combat,
    joinedPlayers,
    encounterPermissions,
    activeCharacter,
    controlledCharacterId,
  } = useContext(EncounterContext);
  const navigate = useNavigate();
  const location = useLocation();

  const { campaignId, encounterId, mapId } = useParams();
  const parts = location.pathname.split('/');
  const [gridDisplay, setGridDisplay] = useState(false);
  const [characterList, setCharacterList] = useState(false);
  const [actionSidebar, setActionSidebar] = useState(false);
  const [characterOptions, setCharacterOptions] = useState(true);
  const [historyList, setHistoryList] = useState(false);
  const [itemId, setItemId] = useState<number | null>(null);

  const { map, locations, isLoading: mapLoading } = useMap(Number(mapId));

  const { data: campaign } = useCampaignQuery(Number(campaignId));

  const { data: item } = useItemQuery(itemId);

  const {
    data: history,
    isLoading: historyLoading,
    isPending: historyPending,
  } = useEncounterHistoryQuery(Number(encounterId));

  const mapLayout = map?.layout.map((item) => ({
    ...item,
    isDraggable: false,
    isResizable: false,
    resizeHandles: [],
  }));

  const phaseActionCount =
    combat?.phaseHistory.length > 0
      ? [
          combat.phaseHistory[0].action,
          ...combat.phaseHistory[0].reactions,
        ].filter((action) => action).length
      : 0;

  useEffect(() => {
    if (combat && combat.combatPhase === 'initiative') {
      navigate('initiative');
    }

    if (combat && combat.passes.length === combat.characters.length - 1) {
      navigate('actionQueue');
    }
  }, [combat]);

  if (mapLoading || historyLoading) return <Loading />;

  if (!map) return <h1>No Map Found</h1>;

  return (
    <>
      <div
        className={`${characterOptions ? 'gap-4' : 'gap-0'} timing grid h-full w-full max-w-8xl grid-rows-[1fr_auto] justify-center`}
      >
        <div className="bg-primary shadow-primary absolute left-1.5 top-1.5 z-10 ml-[72px] mr-auto flex flex-col items-start justify-start rounded p-1.5">
          {joinedPlayers?.map((player: any) => (
            <div className="flex items-center gap-2" key={player.username}>
              <p className="text-base">{player.username}</p>
              {campaign?.ownerId === player.playerId && (
                <Icon path={mdiCrown} color="gold" size={0.8} />
              )}
            </div>
          ))}
        </div>
        <div
          className={`scrollbar-primary timing pointer-events-auto relative mb-auto max-h-full max-w-full overflow-y-auto rounded border-2`}
          style={{ borderColor: accentPrimary }}
        >
          {!mobile && (
            <div className="absolute left-1 top-1 z-10 flex w-full items-center gap-4">
              <button
                className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow shadow-black"
                aria-label="Open save modal"
                type="button"
                onClick={() => setGridDisplay((prev) => !prev)}
              >
                <Icon
                  path={mdiGrid}
                  className={`${gridDisplay ? 'text-accent' : 'text-tertiary'} group-hover:text-accent timing size-6`}
                />
              </button>
              <h3 className="text-shadow text-center text-shadow-black">
                {map.name}
              </h3>
            </div>
          )}
          <ReactGridLayout
            useCSSTransforms={false}
            className="layout overflow-hidden rounded"
            style={{ width: map.width * 48, height: map.height * 48 }}
            layout={mapLayout}
            cols={map.width}
            rowHeight={48}
            width={map.width * 48}
            margin={[0, 0]}
            allowOverlap={true}
          >
            {mapLayout?.map((item) =>
              item.i === 'base' ? (
                <div
                  key={item.i}
                  className="-z-10"
                  style={{ backgroundColor: map.baseColor }}
                />
              ) : (
                <div
                  key={item.i}
                  style={{
                    backgroundPosition: '0 0',
                    imageRendering: 'pixelated',
                    backgroundSize: `${48 * item.tileWidth}px ${48 * item.tileHeight}px`,
                    backgroundImage: `url(${item.tileUrl})`,
                  }}
                />
              ),
            )}
          </ReactGridLayout>
          <EncounterGrid
            map={map}
            locations={locations}
            gridDisplay={gridDisplay}
            setActionSidebar={setActionSidebar}
          />
        </div>
        <div
          className={`${characterList ? 'w-96' : 'w-[72px]'} scrollbar-secondary-2 bg-primary timing absolute left-0 top-0 z-10 flex h-full flex-col justify-start gap-3 overflow-y-auto p-3 shadow-md shadow-black`}
          onMouseEnter={() => {
            setCharacterList(true);
            setHistoryList(true);
          }}
          onMouseLeave={() => {
            setCharacterList(false);
            setHistoryList(false);
          }}
        >
          {combat.turnOrder?.map((characterId: number, index: number) => (
            <Fragment key={characterId}>
              <CharacterCardSmall
                characterList={characterList}
                characterId={characterId}
                active={
                  combat.turnOrder.findIndex((id) => id === characterId) ===
                  combat.turnPosition
                }
              />
              {index < combat.turnOrder.length - 1 && (
                <Divider className="!my-0 opacity-50" />
              )}
            </Fragment>
          ))}
          <div className="mt-auto">
            <div
              className={`${!historyList ? 'max-h-12' : 'max-h-0'} timing h-full w-12 p-2`}
            >
              {historyPending ? (
                <Loading className="text-accent" size={2} />
              ) : (
                <HistoryIcon className={`text-secondary h-full shrink-0`} />
              )}
            </div>
            <div
              className={`${historyList ? 'max-h-48 border-t-2 pt-4' : 'max-h-0'} timing border-accent scrollbar-secondary-2 flex h-full w-full flex-col overflow-y-auto overflow-x-hidden`}
            >
              {history.length > 0 && (
                <button
                  className="timing hover:bg-tertiary w-full rounded p-2 hover:shadow hover:shadow-black"
                  onClick={() => navigate('history')}
                >
                  <ArrowHeader4
                    className="mb-2 whitespace-nowrap"
                    title="
                  Last Action"
                  />

                  <HistoryCard history={history[0]} />
                </button>
              )}
            </div>
          </div>
          <button
            className="bg-tertiary group relative flex items-center justify-center rounded p-1.5 shadow shadow-black"
            onClick={() => navigate('actionQueue')}
          >
            <Icon
              path={mdiQueueFirstInLastOut}
              className={`timing text-tertiary group-hover:text-accent size-8`}
            />
            {phaseActionCount > 0 && (
              <div className="text-primary absolute -right-1 -top-1 size-6 rounded-full bg-red-600 font-semibold">
                {phaseActionCount}
              </div>
            )}
          </button>
          <button
            className="bg-tertiary group flex items-center justify-center rounded p-1.5 shadow shadow-black"
            onClick={() => setCharacterOptions((prev) => !prev)}
          >
            <Icon
              path={mdiChevronDown}
              className={`${characterOptions ? 'rotate-0' : 'rotate-180'} timing text-tertiary group-hover:text-accent size-8`}
            />
          </button>
        </div>
        <div
          className={`${actionSidebar ? 'w-96' : 'w-[72px]'} bg-primary scrollbar-primary-2 timing absolute right-0 top-0 z-10 flex h-full flex-col gap-2 overflow-x-hidden p-3 shadow-md shadow-black`}
          onMouseEnter={() => setActionSidebar(true)}
          onMouseLeave={() => {
            setActionSidebar(false);
          }}
        >
          {encounterPermissions &&
          controlledCharacterId === activeCharacter?.id ? (
            <>
              {combat?.combatPhase === 'action' ? (
                <ActionIcon className="text-primary ml-1 size-10 shrink-0" />
              ) : (
                <div className="flex items-center gap-4">
                  <Loading size={2} className="text-accent mb-auto size-full" />
                  <ArrowHeader4
                    className="w-full"
                    title="Waiting for Reactions"
                  />
                </div>
              )}
              {combat?.combatPhase === 'reaction' && (
                <>
                  <Divider />
                  <div className="flex flex-col gap-4">
                    {combat?.reactions.length > 0 && (
                      <div className="flex flex-col items-start gap-4">
                        <div className="flex items-center gap-4">
                          <ReactionIcon className="text-secondary ml-1 size-10" />
                          <ArrowHeader3 title="Reactions" />
                        </div>

                        {combat?.reactions.map((characterId: number) => (
                          <CharacterName characterId={characterId} />
                        ))}
                      </div>
                    )}
                    {combat?.passes.length > 0 && (
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-4">
                          <PassTurnIcon className="text-secondary ml-1 size-10" />
                          <ArrowHeader3 title="Passes" />
                        </div>
                        {combat?.passes.map((characterId: number) => (
                          <CharacterName characterId={characterId} />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
              {combat?.combatPhase === 'action' && (
                <ActionSidebar actionSidebar={actionSidebar} />
              )}
            </>
          ) : (
            <>
              {combat?.combatPhase === 'reaction' ? (
                <ReactionIcon className="text-primary ml-1 size-10 shrink-0" />
              ) : (
                <div className="flex items-center gap-4">
                  <Loading size={2} className="text-accent mb-auto" />
                  <ArrowHeader4 title="Waiting for Action" />
                </div>
              )}
              {combat?.combatPhase === 'reaction' &&
                !combat?.reactions.includes(controlledCharacterId) && (
                  <>
                    <Divider />
                    <div className="flex flex-col gap-4">
                      {combat?.reactions.length > 0 && (
                        <div className="flex flex-col items-start gap-4">
                          <div className="flex items-center gap-4">
                            <ReactionIcon className="text-secondary ml-1 size-10" />
                            <ArrowHeader3 title="Reactions" />
                          </div>

                          {combat?.reactions.map((characterId: number) => (
                            <CharacterName characterId={characterId} />
                          ))}
                        </div>
                      )}
                      {combat?.passes.length > 0 && (
                        <div className="flex flex-col items-start gap-2">
                          <div className="flex items-center gap-4">
                            <PassTurnIcon className="text-secondary ml-1 size-10" />
                            <ArrowHeader3 title="Passes" />
                          </div>
                          {combat?.passes.map((characterId: number) => (
                            <CharacterName characterId={characterId} />
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              {combat?.combatPhase === 'reaction' && (
                <ReactionSidebar actionSidebar={actionSidebar} />
              )}
            </>
          )}
          {item && (
            <ItemCardBorderless
              className={`${actionSidebar ? 'visible translate-x-0 opacity-100' : 'invisible translate-x-full opacity-0'} timing w-full`}
              cardType="small"
              item={item}
            />
          )}
        </div>
        <div
          className={`${!characterOptions && 'overflow-hidden'} timing relative mx-auto mt-auto w-full max-w-5xl p-0.5`}
          style={{
            maxHeight: characterOptions ? '500px' : '0px',
          }}
        >
          <CharacterOptions
            setActionSidebar={setActionSidebar}
            characterOptions={characterOptions}
            setItemId={setItemId}
          />
        </div>
      </div>
      {(parts.includes('characters') ||
        parts.includes('initiative') ||
        parts.includes('actionQueue') ||
        parts.includes('history')) && (
        <Outlet
          context={{
            campaign,
          }}
        />
      )}
    </>
  );
};

export default Encounter;
