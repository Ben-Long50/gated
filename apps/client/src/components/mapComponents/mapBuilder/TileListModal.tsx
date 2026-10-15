import { useContext, useState } from 'react';
import Modal from '../../modals/Modal';
import { useNavigate } from 'react-router-dom';
import BtnRect from '../../buttons/BtnRect';
import { capitalCase, sentenceCase } from 'change-case';
import Icon from '@mdi/react';
import {
  mdiArrowULeftBottom,
  mdiCancel,
  mdiFolderOutline,
  mdiStar,
  mdiStarOutline,
  mdiViewGridOutline,
} from '@mdi/js';
import Divider from '../../Divider';
import ArrowHeader3 from '../../ArrowHeader3';
import BtnAuth from 'src/components/buttons/BtnAuth';
import useMaps from 'src/hooks/useMaps';
import TilePicker from './TilePicker';
import useMapFavoriteStore from 'src/stores/mapFavoriteStore';
import { AuthContext } from 'src/contexts/AuthContext';
import IconBtnMedium from 'src/components/buttons/IconBtnMedium';
import MapGrid from '../map/MapGrid';
import useMapBuilderStore from 'src/stores/mapBuilderStore';
import { Component } from 'src/types/map';

const TileListModal = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [gridDisplay, setGridDisplay] = useState(true);

  const mapIds = user.maps.map((map) => map.id);
  const { maps: components } = useMaps(mapIds);

  const { favorites, addFavorite, removeFavorite, hasPath } =
    useMapFavoriteStore();

  const tab = useMapBuilderStore((state) => state.tab);
  const manifest = useMapBuilderStore((state) => state.manifest);
  const setTab = useMapBuilderStore((state) => state.setTab);
  const path = useMapBuilderStore((state) => state.path);
  const pushPath = useMapBuilderStore((state) => state.pushPath);
  const popPath = useMapBuilderStore((state) => state.popPath);

  const tempComponent = useMapBuilderStore((state) => state.tempComponent);
  const setTempComponent = useMapBuilderStore(
    (state) => state.setTempComponent,
  );

  const isPng =
    path.length > 0 ? path[path.length - 1].endsWith('.png') : false;
  const pngPath = isPng ? path.join('/') : null;

  const getContents = (manifest: object, path: string[]) => {
    if (path.length === 0) {
      if (typeof manifest === 'object') {
        const folders = Object.fromEntries(
          Object.entries(manifest).filter(([key, _]) => key !== 'files'),
        );
        const files = manifest['files'] ?? [];
        return { folders, files };
      }
      return {};
    }

    const p = path[0];
    const newManifest = manifest[p];

    return getContents(newManifest, path.slice(1));
  };

  const { folders, files } = getContents(manifest, path);

  return (
    <>
      <h1>Tile Explorer</h1>
      <div className="grid w-full grid-cols-3 gap-4">
        <BtnAuth
          active={tab === 'favorites'}
          onClick={() => {
            setTab('favorites');
          }}
        >
          Favorites
        </BtnAuth>
        <BtnAuth
          active={tab === 'tiles'}
          onClick={() => {
            setTab('tiles');
          }}
        >
          Tiles
        </BtnAuth>
        <BtnAuth
          active={tab === 'components'}
          onClick={() => {
            setTab('components');
          }}
        >
          Components
        </BtnAuth>
      </div>
      {tab === 'favorites' && (
        <>
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
            {path.slice(1).map((part: string, index: number) => (
              <ArrowHeader3 key={index} title={capitalCase(part)} />
            ))}
          </div>
          <Divider className="!my-0" />
          <div className="scrollbar-primary flex h-full w-full items-start justify-start">
            {isPng ? (
              <>
                <div className="flex flex-col gap-4">
                  <IconBtnMedium
                    onClick={() => {
                      setTempComponent(null);
                    }}
                    tooltip={gridDisplay ? 'Hide Grid' : 'Show Grid'}
                    active={gridDisplay}
                  >
                    <Icon path={mdiCancel} />
                  </IconBtnMedium>
                  {tempComponent && (
                    <IconBtnMedium
                      onClick={() => {
                        setTempComponent(null);
                      }}
                      tooltip="Deselect Tiles"
                    >
                      <Icon path={mdiCancel} />
                    </IconBtnMedium>
                  )}
                </div>
                <TilePicker pngPath={pngPath} gridDisplay={gridDisplay} />
              </>
            ) : (
              <div className="col-span-2 grid w-full grid-cols-3 gap-4">
                {favorites.map((file: string, index: number) => {
                  const splitFile = file.split('/');

                  return (
                    <div
                      key={index}
                      className="hover:border-accent relative aspect-square size-full rounded border-2 border-gray-500 shadow-md shadow-black"
                      style={{
                        backgroundImage: `url(${file})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        imageRendering: 'pixelated',
                        backgroundRepeat: 'no-repeat',
                      }}
                      onClick={() => pushPath(file)}
                    >
                      <button
                        className="group absolute right-0 top-0 p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(file);
                        }}
                      >
                        <Icon
                          className="timing text-yellow-400"
                          path={mdiStar}
                          size={1.2}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
      {tab === 'tiles' && (
        <>
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
            <IconBtnMedium onClick={() => popPath()} tooltip="Back">
              <Icon path={mdiArrowULeftBottom} />
            </IconBtnMedium>
            <p>All tiles</p>
            {path.map((p) => (
              <>
                <p>-</p>
                <p>{sentenceCase(p)}</p>
              </>
            ))}
            {tempComponent && (
              <IconBtnMedium
                onClick={() => {
                  setTempComponent(null);
                }}
                tooltip="Deselect Tiles"
              >
                <Icon path={mdiCancel} />
              </IconBtnMedium>
            )}
          </div>
          <Divider className="!my-0" />
        </>
      )}
      {tab === 'tiles' && (
        <div className="scrollbar-primary flex h-full w-full items-start justify-start">
          {isPng ? (
            <>
              <div className="flex flex-col gap-4">
                <IconBtnMedium
                  onClick={() => {
                    setGridDisplay((prev) => !prev);
                  }}
                  tooltip={gridDisplay ? 'Hide Grid' : 'Show Grid'}
                  active={gridDisplay}
                >
                  <Icon path={mdiViewGridOutline} />
                </IconBtnMedium>
                {tempComponent && (
                  <IconBtnMedium
                    onClick={() => {
                      setTempComponent(null);
                    }}
                    tooltip="Deselect Tiles"
                  >
                    <Icon path={mdiCancel} />
                  </IconBtnMedium>
                )}
              </div>
              <TilePicker pngPath={pngPath} gridDisplay={gridDisplay} />
            </>
          ) : (
            <div className="scrollbar-primary mb-auto grid w-full grid-cols-1 gap-4 overflow-y-auto rounded pb-2 sm:grid-cols-2">
              {Object.entries(folders).map(([key, value], index) => (
                <button
                  key={index}
                  className="bg-tertiary group flex w-full items-center gap-4 rounded p-2 shadow-md shadow-black"
                  onClick={() => pushPath(key)}
                >
                  <Icon
                    path={mdiFolderOutline}
                    className="text-secondary group-hover:text-accent timing size-8"
                  />
                  <h4 className="group-hover:text-accent timing">
                    {capitalCase(key)}
                  </h4>
                </button>
              ))}
              {files.length > 0 && (
                <div className="col-span-2 grid grid-cols-3 gap-4">
                  {files.map((file: string, index: number) => {
                    const fullPath = path.join('/');

                    const filePath = `/assets/tiles/${fullPath}/${file}`;

                    return (
                      <div
                        key={index}
                        className={`hover:border-accent relative aspect-square size-full rounded border-2 border-gray-500 shadow-md shadow-black`}
                        style={{
                          backgroundImage: `url(${filePath})`,
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                          imageRendering: 'pixelated',
                          backgroundRepeat: 'no-repeat',
                        }}
                        onClick={() => pushPath(file)}
                      >
                        {!hasPath(filePath) ? (
                          <button
                            className="group absolute right-0 top-0 p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              addFavorite(filePath);
                            }}
                          >
                            <Icon
                              className="text-tertiary group-hover:text-primary timing"
                              path={mdiStarOutline}
                              size={1.2}
                            />
                          </button>
                        ) : (
                          <button
                            className="group absolute right-0 top-0 p-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFavorite(filePath);
                            }}
                          >
                            <Icon
                              className="group-hover:text-tertiary timing text-yellow-400"
                              path={mdiStar}
                              size={1.2}
                            />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {tab === 'components' && (
        <>
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
            {path.slice(1).map((part: string, index: number) => (
              <ArrowHeader3 key={index} title={capitalCase(part)} />
            ))}
            {tempComponent && (
              <IconBtnMedium
                onClick={() => {
                  setTempComponent(null);
                }}
                tooltip="Deselect Tiles"
              >
                <Icon path={mdiCancel} />
              </IconBtnMedium>
            )}
          </div>
          <Divider className="!my-0" />
          <div className="scrollbar-primary grid h-full w-full grid-cols-3 gap-4 overflow-y-auto">
            {components?.map((component) => {
              let scale = (464 / (component.width * 48)) * 0.9;
              scale = scale > 1 ? 1 : scale;

              return (
                <button
                  key={component.id}
                  className={`hover:border-accent bg-secondary timing mb-auto flex flex-col gap-4 rounded-md border-2 border-transparent p-4 shadow-md shadow-black`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const componentParts = component.layers.flatMap((layer) =>
                      layer.components.map((component) => component),
                    );

                    setTempComponent({
                      name: component.name,
                      id: 0,
                      mapColStart: 1,
                      mapRowStart: 1,
                      width: component.width,
                      height: component.height,
                      subComponents: componentParts,
                    });
                  }}
                >
                  <div className="flex w-full flex-col items-start gap-2">
                    <div className="flex w-full items-center gap-2">
                      <ArrowHeader3 title={component.name} />
                      {component.draft && (
                        <p className="text-tertiary text-base">
                          (
                          {capitalCase(
                            component.type + (component.draft ? ' draft' : ''),
                          )}
                          )
                        </p>
                      )}
                      <p className="ml-auto whitespace-nowrap">{`${component.width} x ${component.height}`}</p>
                    </div>
                  </div>
                  <MapGrid
                    width={component.width}
                    height={component.height}
                    baseColor={component.baseColor}
                    layers={component.layers}
                    mapScale={scale}
                    locations={[]}
                    gridDisplay={false}
                    className="pointer-events-none mx-auto"
                  />
                </button>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default TileListModal;
