import { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import useMap from 'src/hooks/useMap';
import Loading from '../Loading';
import {
  mdiChevronDown,
  mdiCrown,
  mdiGrid,
  mdiQueueFirstInLastOut,
} from '@mdi/js';
import Icon from '@mdi/react';
import EncounterGrid from './EncounterGrid';
import CharacterCardSmall from '../CharacterCardSmall';
import CharacterOptions from './CharacterOptions';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import ActionSidebar from './ActionSidebar';
import { LayoutContext } from 'src/contexts/LayoutContext';
import ActionIcon from '../icons/ActionIcon';
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

const Encounter = () => {
  const { mobile } = useContext(LayoutContext);
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

  const { map, locations, mapLoading } = useMap(Number(mapId));

  const { data: campaign } = useCampaignQuery(Number(campaignId));

  const { data: item } = useItemQuery(itemId);

  const {
    data: history,
    isLoading: historyLoading,
    isPending: historyPending,
  } = useEncounterHistoryQuery(Number(encounterId));

  const phaseActionCount = useMemo(
    () =>
      combat?.phaseHistory.length > 0
        ? [
            combat.phaseHistory[0].action,
            ...combat.phaseHistory[0].reactions,
          ].filter((action) => action).length
        : 0,
    [combat?.phaseHistory],
  );

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
        className={`flex h-full w-full max-w-85dvw flex-col items-center gap-4 sm:gap-8`}
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
        {!mobile && (
          <div className="flex w-full max-w-4xl items-center justify-center gap-8">
            <button
              className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
              aria-label="Open save modal"
              type="button"
              onClick={() => setGridDisplay((prev) => !prev)}
            >
              <Icon
                path={mdiGrid}
                className={`${gridDisplay ? 'text-accent' : 'text-tertiary'} group-hover:text-accent timing size-8`}
              />
            </button>
            <h1 className="text-center">{map.name}</h1>
          </div>
        )}
        <EncounterGrid
          width={map.width}
          height={map.height}
          baseColor={map.baseColor}
          layers={map.layers}
          locations={locations}
          gridDisplay={gridDisplay}
          setActionSidebar={setActionSidebar}
        />
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
                expanding={true}
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
                    className="text-primary mb-2 whitespace-nowrap"
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
                    className="text-primary w-full"
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
                          <CharacterName
                            key={characterId}
                            characterId={characterId}
                          />
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
                          <CharacterName
                            key={characterId}
                            characterId={characterId}
                          />
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
                  <ArrowHeader4
                    className="text-primary w-full"
                    title="Waiting for Action"
                  />
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
                            <CharacterName
                              key={characterId}
                              characterId={characterId}
                            />
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
                            <CharacterName
                              key={characterId}
                              characterId={characterId}
                            />
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
          className={`${!characterOptions && 'overflow-hidden'} timing absolute bottom-4 mt-auto w-full p-0.5`}
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
