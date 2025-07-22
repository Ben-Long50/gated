import { Fragment, useContext, useEffect, useState } from 'react';
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
import { LayoutContext } from 'src/contexts/LayoutContext';
import ActionIcon from '../icons/ActionIcon';
import BtnRect from '../buttons/BtnRect';
import ThemeContainer from '../ThemeContainer';
import { CampaignContext } from 'src/contexts/CampaignContext';
import useItemQuery from 'src/hooks/useItemQuery/useItemQuery';
import { socket } from 'src/socket';
import useCharacterQuery from 'src/hooks/useCharacterQuery/useCharacterQuery';
import useCharacterStatHandlers from 'src/hooks/character stat hooks/useCharacterStatMutation/useCharacterStatHandlers';
import useUpdateCharacterLocationMutation from 'src/hooks/useUpdateCharacterLocationMutation/useUpdateCharacterLocationMutation';
import Divider from '../Divider';
import ReactionIcon from '../icons/ReactionIcon';
import ReactionSidebar from './ReactionSidebar';

const Encounter = () => {
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { campaignId, mapId } = useParams();
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
  const [characterList, setCharacterList] = useState(false);
  const [actionSidebar, setActionSidebar] = useState(false);

  const { map, locations, isLoading: mapLoading } = useMap();

  const setUserCharacter = useCombatStore((state) => state.setUserCharacter);

  const {
    combat,
    encounterPermissions,
    ownedCharacter,
    activeCharacter,
    handleAdvanceTurn,
    calculateDamage,
    combatForm,
    isLoading: combatLoading,
  } = useCombat();

  const characterStatHandlers = useCharacterStatHandlers(
    gameMaster ? activeCharacter.id : ownedCharacter.id,
  );

  const updateCharacterLocation = useUpdateCharacterLocationMutation(
    Number(mapId),
  );

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
      actionType: null as string | null,
      action: null as Action | null,
      locationId: null as number | null,
      index: null as number | null,
      item: null as Item | null,
      target: null as Character | null,
      modifiers: [] as string[],
    },

    onSubmit: async ({ value }) => {
      if (activeCharacter?.stats.currentActions === 0) {
        alert('You do not have any more actions this turn');
        return;
      }

      if (value.actionType === 'movement' && value.locationId) {
        updateCharacterLocation.mutate({
          characterId: activeCharacter?.id,
          locationId: Number(value.locationId),
          index: value.index,
        });

        characterStatHandlers.handleCurrentActions(-1);
      } else {
        const rollResult = calculateRoll(
          activeCharacter?.attributes,
          value.action?.roll,
          value.modifiers,
        );

        const damage = calculateDamage(
          value.item,
          value.action,
          rollResult.successes,
        );

        characterStatHandlers.handleCurrentActions(-1);

        socket.emit('combatRoll', {
          campaignId: Number(campaignId),
          characterId: activeCharacter?.id,
          targetInfo: { id: value.target?.id, stats: value.target?.stats },
          damage,
          rollResult,
        });
      }
    },
  });

  if (mapLoading || combatLoading) return <Loading />;

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
            setCharacterList={setCharacterList}
            encounterPermissions={encounterPermissions}
            map={map}
            locations={locations}
            activeCharacterId={activeCharacter?.id}
            gridDisplay={gridDisplay}
            diceArray={diceArray}
            rolling={rolling}
          />
        </div>
        <div
          className={`${characterList ? 'w-96' : 'w-[72px]'} bg-primary timing absolute left-0 top-0 z-10 flex h-full flex-col justify-start gap-3 p-3 shadow-md shadow-black`}
          onMouseEnter={() => setCharacterList(true)}
          onMouseLeave={() => setCharacterList(false)}
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
        </div>
        <actionForm.Subscribe
          selector={(state) => [state.values.actionType, state.values.action]}
        >
          {([actionType, action]) => (
            <div
              className={`${actionSidebar ? 'w-96' : 'w-[72px]'} bg-primary scrollbar-primary-2 timing absolute right-0 top-0 z-10 mr-4 flex h-full flex-col gap-2 overflow-x-hidden p-2 shadow-md shadow-black sm:p-4`}
              onMouseEnter={() => setActionSidebar(true)}
              onMouseLeave={() => {
                if (!actionType && !action && !currentItem) {
                  setActionSidebar(false);
                }
              }}
            >
              {encounterPermissions ? (
                <ActionIcon className="text-primary size-10" />
              ) : (
                <ReactionIcon className="text-primary size-10" />
              )}
              {encounterPermissions ? (
                <ActionSidebar
                  form={actionForm}
                  actionSidebar={actionSidebar}
                  activeCharacterId={activeCharacter?.id}
                  diceArray={diceArray}
                  rolling={rolling}
                  calculateSuccesses={calculateSuccesses}
                  successes={successes}
                />
              ) : (
                <ReactionSidebar
                  form={actionForm}
                  actionSidebar={actionSidebar}
                  activeCharacterId={ownedCharacter?.id}
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
          )}
        </actionForm.Subscribe>
        <ThemeContainer
          className={`${!mobile && '!sticky bottom-2 mt-auto'} w-full max-w-5xl sm:bottom-[33px]`}
          borderColor={accentPrimary}
          chamfer="medium"
        >
          <div className="relative flex w-full flex-col gap-2 p-4">
            <CharacterOptions
              form={actionForm}
              setActionSidebar={setActionSidebar}
              encounterPermissions={encounterPermissions}
              handleAdvanceTurn={handleAdvanceTurn}
              characterId={
                gameMaster ? activeCharacter?.id : ownedCharacter?.id
              }
            />
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
          handleAdvanceTurn,
          characterIds: locations?.map((location) => location.characterId),
          combatForm,
        }}
      />
    </>
  );
};

export default Encounter;
