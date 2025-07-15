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
import { CampaignContext } from 'src/contexts/CampaignContext';
import CharacterOptions from './CharacterOptions';
import useRoll from 'src/hooks/useRoll';
import useCombat from 'src/hooks/useCombat';
import { Outlet } from 'react-router-dom';
import useCombatStore from 'src/stores/combatStore';
import ActionSidebar from './ActionSidebar';
import { useForm } from '@tanstack/react-form';
import { Action } from 'src/types/action';
import { Item } from 'src/types/item';
import { Character } from 'src/types/character';
import useCharacter from 'src/hooks/useCharacter';
import { LayoutContext } from 'src/contexts/LayoutContext';
import ActionIcon from '../icons/ActionIcon';

const Map = () => {
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { gameMaster } = useContext(CampaignContext);
  const [gridDisplay, setGridDisplay] = useState(false);
  const [characterList, setCharacterList] = useState(true);
  const [actionSidebar, setActionSidebar] = useState(true);

  const { map, locations, isLoading } = useMap();

  const userCharacter = useCombatStore((state) => state.userCharacter);
  const activeCharacter = useCombatStore((state) => state.activeCharacter);
  const setUserCharacter = useCombatStore((state) => state.setUserCharacter);
  const turnOrder = useCombatStore((state) => state.turnOrder);

  const { diceArray, setDiceArray, rolling, calculateSuccesses, successes } =
    useRoll();

  const { advanceTurn } = useCombat();

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

  //   const roll = async (rolls: { attribute: string; skill: string }[]) => {
  //   await calculateSuccesses(character?.attributes, rolls, []);
  // };

  const actionForm = useForm({
    defaultValues: {
      activeCharacter: character || null,
      action: null as Action | null,
      item: null as Item | null,
      target: null as Character | null,
    },
    onSubmit: async ({ value }) => {
      // roll(value.action?.roll);
      value.activeCharacter = character;
      console.log(value);

      await calculateSuccesses(
        value.activeCharacter?.attributes,
        value.action.roll,
        [],
      );

      setTimeout(() => {
        setDiceArray([]);
      }, 10000);

      actionForm.reset();
    },
  });

  if (isLoading) return <Loading />;

  if (!map) return <h1>No Map Found</h1>;

  return (
    <>
      <div className="flex h-full w-full max-w-8xl flex-col items-center gap-4 sm:gap-8">
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
        <div
          className="scrollbar-primary relative max-w-full overflow-x-auto overflow-y-hidden rounded border-2"
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
          className={`${mobile ? `${characterList ? 'left-2 right-2 gap-0' : 'left-0 gap-2'} top-[72px]` : 'left-24 top-[90px] gap-4'} fixed flex items-start`}
        >
          <div
            className={`${characterList ? 'visible w-full opacity-100' : 'invisible w-0 opacity-0'} timing flex flex-col gap-2`}
          >
            {turnOrder?.map((characterId) => (
              <CharacterCardSmall
                key={characterId}
                characterId={characterId}
                active={userCharacter === characterId}
              />
            ))}
          </div>
          <button
            className={`timing bg-tertiary group flex rounded p-1.5 shadow-md shadow-black`}
            aria-label="Open character list"
            type="button"
            onClick={() => setCharacterList((prev) => !prev)}
          >
            <CharacterIcon className="text-tertiary group-hover:text-accent timing size-8" />
          </button>
        </div>
        <div
          className={`${actionSidebar ? 'overflow-y-auto' : 'overflow-y-hidden'} ${mobile ? `${actionSidebar ? 'left-2 right-2 gap-0' : 'right-2 gap-4'} bottom-4 top-[72px]` : 'bottom-8 right-8 top-[90px] gap-4'} scrollbar-primary-2 fixed flex justify-end`}
        >
          <button
            className={`timing bg-tertiary group mb-auto flex rounded p-1.5 shadow-md shadow-black`}
            aria-label="Open character list"
            type="button"
            onClick={() => setActionSidebar((prev) => !prev)}
          >
            <ActionIcon className="text-tertiary group-hover:text-accent timing size-8" />
          </button>
          <div
            className={`${actionSidebar ? `${mobile ? 'w-full' : 'w-[425px]'} visible px-0.5 opacity-100` : 'invisible w-0 opacity-0'} timing flex flex-col gap-4 sm:gap-8`}
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
              <ItemCard className="w-full" cardType="small" item={item?.item} />
            )}
          </div>
        </div>
        <CharacterOptions form={actionForm} advanceTurn={advanceTurn} />
      </div>
      <Outlet
        context={{
          advanceTurn,
        }}
      />
    </>
  );
};

export default Map;
