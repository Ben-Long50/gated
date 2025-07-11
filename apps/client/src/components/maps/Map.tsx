import {
  useContext,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import ReactGridLayout from 'react-grid-layout';
import useMap from 'src/hooks/useMap';
import Loading from '../Loading';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { mdiGrid } from '@mdi/js';
import Icon from '@mdi/react';
import RangeIcon from '../icons/RangeIcon';
import InputFieldBasic from '../InputFieldBasic';
import ThemeContainer from '../ThemeContainer';
import { AuthContext } from 'src/contexts/AuthContext';
import { useParams } from 'react-router-dom';
import useUpdateCharacterLocationMutation from 'src/hooks/useUpdateCharacterLocationMutation/useUpdateCharacterLocationMutation';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import useCharacterQueries from 'src/hooks/useCharactersQuery/useCharacterQueries';
import InputSelectField from '../InputSelectField';
import { useForm } from '@tanstack/react-form';
import { Character } from 'src/types/character';
import BtnRect from '../buttons/BtnRect';
import MapGrid from './MapGrid';
import useMapStore from 'src/stores/mapStore';
import ItemCard from '../ItemCard';
import CharacterPictureRound from '../CharacterPictureRound';
import StatBars from '../StatBars';
import CharacterStatBars from '../CharacterStatBars';
import useCampaignCharacters from 'src/hooks/useCampaignCharacters';
import CharacterCardSmall from '../CharacterCardSmall';
import useActions from 'src/hooks/useActions';
import LinkedActionCard from '../LinkedActionCard';

const Map = () => {
  const { apiUrl } = useContext(AuthContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { campaignId, mapId } = useParams();
  const [gridDisplay, setGridDisplay] = useState(false);

  const { map, isLoading } = useMap();

  const { filteredActions: actions } = useActions();

  const updateCharacterLocation = useUpdateCharacterLocationMutation(
    apiUrl,
    Number(mapId),
  );

  const { data: campaign, isLoading: campaignLoading } = useCampaignQuery(
    apiUrl,
    Number(campaignId),
  );

  const mapLayout = map?.layout.map((item) => ({
    ...item,
    isDraggable: false,
    isResizable: false,
    resizeHandles: [],
  }));

  const action = useMapStore((state) => state.action);
  const setAction = useMapStore((state) => state.setAction);
  const range = useMapStore((state) => state.range);
  const item = useMapStore((state) => state.item);

  const locationForm = useForm({
    defaultValues: {
      character: null as null | Character,
      index: null as null | number,
    },
    onSubmit: ({ value }) => {
      if (value.character && value.index) {
        updateCharacterLocation.mutate({
          characterId: value.character.id,
          index: value.index,
        });
        locationForm.reset();
      }
    },
  });

  if (isLoading || campaignLoading) return <Loading />;

  if (!map) return <h1>No Map Found</h1>;

  return (
    <div className="flex h-full w-full max-w-8xl flex-col items-center gap-4 sm:gap-8">
      <h1>{map.name}</h1>
      <div
        className="scrollbar-primary relative max-w-full overflow-x-auto overflow-y-auto rounded border-2"
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

        <MapGrid map={map} form={locationForm} gridDisplay={gridDisplay} />
      </div>
      <div className={`timing fixed left-24 top-[90px] flex flex-col gap-2`}>
        {map?.locations.map((location) => (
          <CharacterCardSmall characterId={location.characterId} />
        ))}
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
      <ThemeContainer
        className="!sticky bottom-[33px] mt-auto"
        borderColor={accentPrimary}
        chamfer="small"
      >
        <div className="flex min-w-[500px] items-center justify-start gap-4 p-4">
          <locationForm.Subscribe
            selector={(state) => [state.values.character, state.values.index]}
          >
            {([character, index]) =>
              character !== null &&
              index !== null && (
                <BtnRect
                  type="button"
                  ariaLabel="Move character"
                  onClick={() => locationForm.handleSubmit()}
                >
                  Move Character
                </BtnRect>
              )
            }
          </locationForm.Subscribe>
          <button
            className="bg-tertiary group my-auto flex rounded p-1.5 shadow-md shadow-black"
            aria-label="Open save modal"
            type="button"
            onClick={() => setGridDisplay((prev) => !prev)}
          >
            <Icon
              path={mdiGrid}
              className="text-tertiary group-hover:text-accent timing size-8"
            />
          </button>
          {/* <locationForm.Field name="character">
            {(field) => (
              <InputSelectField
                label="Character Select"
                field={field}
                options={[...playerCharacters, ...nonPlayerCharacters]}
                reverse={true}
              />
            )}
          </locationForm.Field> */}
          <InputSelectField
            label="Action"
            options={actions}
            onChange={(action) => {
              setAction(action);
            }}
            reverse={true}
          />
        </div>
      </ThemeContainer>
    </div>
  );
};

export default Map;
