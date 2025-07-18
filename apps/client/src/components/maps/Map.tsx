import { useContext, useEffect, useState } from 'react';
import ReactGridLayout from 'react-grid-layout';
import useMap from 'src/hooks/useMap';
import Loading from '../Loading';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { mdiGrid } from '@mdi/js';
import Icon from '@mdi/react';
import { AuthContext } from 'src/contexts/AuthContext';
import MapGrid from './MapGrid';
import ItemCard from '../ItemCard';
import CharacterCardSmall from '../CharacterCardSmall';
import CharacterIcon from '../icons/CharacterIcon';
import CharacterOptions from './CharacterOptions';
import useCombat from 'src/hooks/useCombat';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import useCombatStore from 'src/stores/combatStore';
import ActionSidebar from './ActionSidebar';
import { useForm } from '@tanstack/react-form';
import { Action } from 'src/types/action';
import { Item } from 'src/types/item';
import { Character } from 'src/types/character';
import useCharacter from 'src/hooks/useCharacter';
import { LayoutContext } from 'src/contexts/LayoutContext';
import ActionIcon from '../icons/ActionIcon';
import BtnRect from '../buttons/BtnRect';
import ThemeContainer from '../ThemeContainer';
import { CampaignContext } from 'src/contexts/CampaignContext';
import useItemQuery from 'src/hooks/useItemQuery/useItemQuery';
import { socket } from 'src/socket';

const Map = () => {
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { campaignId } = useParams();
  const {
    gameMaster,
    diceArray,
    rolling,
    calculateRoll,
    calculateSuccesses,
    successes,
  } = useContext(CampaignContext);
  const navigate = useNavigate();
  const [gridDisplay, setGridDisplay] = useState(false);
  const [characterList, setCharacterList] = useState(mobile ? false : true);
  const [actionSidebar, setActionSidebar] = useState(mobile ? false : true);

  const { map, locations, isLoading } = useMap();

  const userCharacter = useCombatStore((state) => state.userCharacter);
  const activeCharacter = useCombatStore((state) => state.activeCharacter);
  const setUserCharacter = useCombatStore((state) => state.setUserCharacter);
  const turnOrder =
    useCombatStore((state) => state.turnOrder) ||
    locations?.map((location) => location?.characterId);

  const { advanceTurn, calculateDamage } = useCombat();

  const { filteredCharacter: character } = useCharacter(activeCharacter);

  useEffect(() => {
    if (!gameMaster) {
      const character = locations
        ?.map((location) => location?.character)
        .find((character) => character?.userId === user?.id);

      setUserCharacter(character?.id);
    }
  }, [locations, gameMaster]);

  const mapLayout = map?.layout.map((item) => ({
    ...item,
    isDraggable: false,
    isResizable: false,
    resizeHandles: [],
  }));

  const item = useCombatStore((state) => state.item);

  const { data: currentItem } = useItemQuery(item.item?.id);

  const actionForm = useForm({
    defaultValues: {
      activeCharacter: character || null,
      action: null as Action | null,
      item: null as Item | null,
      target: null as Character | null,
      modifiers: [] as string[],
    },

    onSubmit: async ({ value }) => {
      value.activeCharacter = character;

      const rollResult = calculateRoll(
        value.activeCharacter?.attributes,
        value.action?.roll,
        value.modifiers,
      );

      const damage = calculateDamage(
        value.item,
        value.action,
        rollResult.successes,
      );

      socket.emit('combatRoll', {
        campaignId: Number(campaignId),
        characterId: activeCharacter,
        targetId: value.target?.id,
        damage,
        rollResult,
      });
    },
  });

  if (isLoading) return <Loading />;

  if (!map) return <h1>No Map Found</h1>;

  return (
    <>
      <div className="flex h-dvh w-full max-w-8xl flex-col items-center gap-4 sm:gap-8">
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
        <div
          className="scrollbar-primary pointer-events-auto relative max-h-full max-w-full overflow-x-auto overflow-y-auto rounded border-2"
          style={{
            borderColor: accentPrimary,
          }}
        >
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
                  style={{
                    backgroundColor: map.baseColor,
                  }}
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
          <MapGrid
            form={actionForm}
            map={map}
            locations={locations}
            gridDisplay={gridDisplay}
            diceArray={diceArray}
            rolling={rolling}
          />
        </div>
        <div
          className={
            mobile
              ? `${!characterList && 'pointer-events-none'} fixed left-3 right-3 top-[68px] flex flex-col items-start justify-start gap-2`
              : `${!characterList && 'pointer-events-none'} fixed left-24 top-[90px] flex flex-col items-start justify-start gap-4`
          }
        >
          <button
            className={`timing bg-tertiary group pointer-events-auto flex rounded p-1.5 shadow-md shadow-black`}
            aria-label="Open character list"
            type="button"
            onClick={() => setCharacterList((prev) => !prev)}
          >
            <CharacterIcon className="text-tertiary group-hover:text-accent timing size-8" />
          </button>
          <div
            className={`${characterList ? 'visible translate-x-0 opacity-100' : 'invisible -translate-x-full opacity-0'} timing flex w-full flex-col gap-2`}
          >
            {turnOrder?.map((characterId) => (
              <CharacterCardSmall
                className={mobile ? 'max-w-full' : 'max-w-96'}
                key={characterId}
                characterId={characterId}
                active={userCharacter === characterId}
              />
            ))}
          </div>
        </div>
        <div
          className={
            mobile
              ? `${!actionSidebar && 'pointer-events-none'} fixed bottom-3 left-3 right-3 top-[68px] flex flex-col items-end justify-start gap-2`
              : `${!actionSidebar && 'pointer-events-none'} fixed bottom-8 right-8 top-[90px] flex flex-col items-end justify-start gap-4`
          }
        >
          <button
            className={`timing bg-tertiary group pointer-events-auto ml-auto flex rounded p-1.5 shadow-md shadow-black`}
            aria-label="Open character list"
            type="button"
            onClick={() => {
              if (activeCharacter === userCharacter)
                setActionSidebar((prev) => !prev);
            }}
          >
            <ActionIcon className="text-tertiary group-hover:text-accent timing size-8" />
          </button>
          <div
            className={`${actionSidebar ? `visible translate-x-0 overflow-y-auto px-0.5 opacity-100` : 'invisible translate-x-full opacity-0'} ${mobile ? 'w-full' : 'w-[400px]'} scrollbar-primary-2 timing flex h-full flex-col gap-2 overflow-x-hidden sm:gap-8`}
          >
            {activeCharacter === userCharacter && (
              <ActionSidebar
                form={actionForm}
                diceArray={diceArray}
                rolling={rolling}
                calculateSuccesses={calculateSuccesses}
                successes={successes}
              />
            )}
            {item?.item && (
              <ItemCard
                className="w-full"
                cardType="small"
                item={currentItem}
              />
            )}
          </div>
        </div>
        <ThemeContainer
          className={`${!mobile && '!sticky bottom-2 mt-auto'} w-full max-w-5xl sm:bottom-[33px]`}
          borderColor={accentPrimary}
          chamfer="small"
        >
          <div className="flex w-full flex-col gap-4 p-4">
            {userCharacter && (
              <CharacterOptions form={actionForm} advanceTurn={advanceTurn} />
            )}
            {gameMaster && !activeCharacter && (
              <BtnRect
                ariaLabel="Open initiative modal"
                type="button"
                onClick={() => navigate('initiative')}
              >
                Start Combat
              </BtnRect>
            )}
          </div>
        </ThemeContainer>
      </div>
      <Outlet
        context={{
          advanceTurn,
          characterIds: locations?.map((location) => location.characterId),
        }}
      />
    </>
  );
};

export default Map;
