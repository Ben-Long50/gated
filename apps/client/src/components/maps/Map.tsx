import { useContext, useEffect, useMemo, useState } from 'react';
import ReactGridLayout from 'react-grid-layout';
import useMap from 'src/hooks/useMap';
import Loading from '../Loading';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { mdiGrid } from '@mdi/js';
import Icon from '@mdi/react';
import { AuthContext } from 'src/contexts/AuthContext';
import { Character } from 'src/types/character';
import MapGrid from './MapGrid';
import useMapStore from 'src/stores/mapStore';
import ItemCard from '../ItemCard';
import CharacterCardSmall from '../CharacterCardSmall';
import LinkedActionCard from '../LinkedActionCard';
import CharacterIcon from '../icons/CharacterIcon';
import { CampaignContext } from 'src/contexts/CampaignContext';
import CharacterOptions from './CharacterOptions';
import useRoll from 'src/hooks/useRoll';
import useCombat from 'src/hooks/useCombat';
import { Outlet } from 'react-router-dom';

const Map = () => {
  const { user } = useContext(AuthContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { gameMaster } = useContext(CampaignContext);
  const [gridDisplay, setGridDisplay] = useState(false);
  const [character, setCharacter] = useState<Partial<Character> | null>(null);
  const [characterList, setCharacterList] = useState(true);

  const { map, locations, isLoading } = useMap();

  const characterIds = useMemo(() => {
    return locations
      ?.map((location) => location?.characterId)
      .filter((characterId) => characterId != null);
  }, [locations]);

  const { turnOrder, setTurnOrder } = useCombat(characterIds);

  const { diceArray, rolling, calculateSuccesses } = useRoll();

  useEffect(() => {
    if (!gameMaster) {
      const characters = locations?.map((location) => location?.character);
      setCharacter(
        characters?.find((character) => character?.userId === user?.id),
      );
    } else {
      setCharacter(null);
    }
  }, [map, gameMaster]);

  const mapLayout = map?.layout.map((item) => ({
    ...item,
    isDraggable: false,
    isResizable: false,
    resizeHandles: [],
  }));

  const action = useMapStore((state) => state.action);

  const item = useMapStore((state) => state.item);

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
          <h1>{map.name}</h1>
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
            map={map}
            locations={locations}
            activeCharacter={character}
            gridDisplay={gridDisplay}
            diceArray={diceArray}
            rolling={rolling}
          />
        </div>
        <div className={`fixed left-24 top-[90px] flex items-start gap-2`}>
          <div
            className={`${characterList ? 'visible w-full opacity-100' : 'invisible w-0 opacity-0'} timing flex flex-col gap-2`}
          >
            {turnOrder?.map((characterId) => (
              <CharacterCardSmall
                key={characterId}
                characterId={characterId}
                active={character?.id === characterId}
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
          className={`${item ? 'visible translate-x-0 px-4 opacity-100' : 'invisible translate-x-full opacity-0'} timing fixed right-8 top-[90px] w-96`}
        >
          {item && <ItemCard className="w-full" cardType="small" item={item} />}
        </div>
        {action && (
          <LinkedActionCard
            cardWidth={501}
            className="w-full max-w-5xl"
            action={action}
          />
        )}
        <CharacterOptions
          locations={locations}
          characterId={character?.id}
          setCharacter={setCharacter}
          calculateSuccesses={calculateSuccesses}
        />
      </div>
      <Outlet
        context={{
          turnOrder,
          setTurnOrder,
        }}
      />
    </>
  );
};

export default Map;
