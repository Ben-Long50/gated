import { useContext, useState } from 'react';
import Modal from '../../modals/Modal';
import { useNavigate, useOutletContext } from 'react-router-dom';
import BtnRect from '../../buttons/BtnRect';
import { capitalCase } from 'change-case';
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
import CloudinaryPicture from 'src/components/CloudinaryPicture';
import TilePicker from './TilePicker';
import useMapFavoriteStore from 'src/stores/mapFavoriteStore';
import { AuthContext } from 'src/contexts/AuthContext';
import IconBtnMedium from 'src/components/buttons/IconBtnMedium';

const TileListModal = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [gridDisplay, setGridDisplay] = useState(true);

  const mapIds = user.maps.map((map) => map.id);
  const { maps: components } = useMaps(mapIds);

  const { favorites, addFavorite, removeFavorite, hasPath, tab, setTab } =
    useMapFavoriteStore();

  const {
    currentFolder,
    path,
    setPath,
    isPng,
    pngPath,
    handleTileSelect,
    tempComponent,
    setTempComponent,
  } = useOutletContext() || {};

  return (
    <Modal className="relative h-full">
      <h1>Tile Explorer</h1>
      <div className="grid w-full grid-cols-3 gap-4">
        <BtnAuth
          active={tab === 'favorites'}
          onClick={() => {
            setTab('favorites');
            setPath(['/assets', 'favorites']);
          }}
        >
          Favorites
        </BtnAuth>
        <BtnAuth
          active={tab === 'tiles'}
          onClick={() => {
            setTab('tiles');
            setPath(['/assets', 'tiles']);
          }}
        >
          Tiles
        </BtnAuth>
        <BtnAuth
          active={tab === 'components'}
          onClick={() => {
            setTab('components');
            setPath(['/assets', 'components']);
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
                <TilePicker
                  pngPath={pngPath}
                  tempComponent={tempComponent}
                  handleTileSelect={handleTileSelect}
                  gridDisplay={gridDisplay}
                />
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
                      onClick={() => setPath([...splitFile])}
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
            <IconBtnMedium
              onClick={() => {
                if (path.length === 2) {
                  return;
                }

                setPath((prev) => prev.slice(0, -1));
              }}
              tooltip="Back"
            >
              <Icon path={mdiArrowULeftBottom} />
            </IconBtnMedium>
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
              <TilePicker
                pngPath={pngPath}
                tempComponent={tempComponent}
                handleTileSelect={handleTileSelect}
                gridDisplay={gridDisplay}
              />
            </>
          ) : (
            <div className="scrollbar-primary mb-auto grid w-full grid-cols-1 gap-4 overflow-y-auto rounded pb-2 sm:grid-cols-2">
              {Object.entries(currentFolder).map(([key, value], index) =>
                key !== 'files' ? (
                  <button
                    key={index}
                    className="bg-tertiary group flex w-full items-center gap-4 rounded p-2 shadow-md shadow-black"
                    onClick={() => {
                      setPath((prev) => [...prev, key]);
                    }}
                  >
                    <Icon
                      path={mdiFolderOutline}
                      className="text-secondary group-hover:text-accent timing size-8"
                    />
                    <h4 className="group-hover:text-accent timing">
                      {capitalCase(key)}
                    </h4>
                  </button>
                ) : (
                  value.length > 0 && (
                    <div className="col-span-2 grid grid-cols-3 gap-4">
                      {value.map((file: string, index: number) => {
                        const fullPath = path.join('/');

                        const filePath = `${fullPath}/${file}`;
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
                            onClick={() =>
                              setPath((prev) => [...prev, `${file}`])
                            }
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
                  )
                ),
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
            {components?.map((component) => (
              <button
                key={component.id}
                className={`hover:border-accent bg-secondary timing mb-auto flex flex-col gap-4 rounded-md border-2 border-transparent p-4 shadow-md shadow-black`}
                onClick={() => {
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
                <div className="flex w-full items-center justify-between">
                  <ArrowHeader3 title={component.name} />
                  <p>{`${component.width} x ${component.height}`}</p>
                </div>
                <div className="flex w-full items-center justify-center">
                  <CloudinaryPicture
                    className="border-accent aspect-square overflow-hidden rounded border"
                    publicId={component.picture.publicId}
                  />
                </div>
              </button>
            ))}
          </div>
        </>
      )}
      <BtnRect
        className="sticky bottom-0 w-full"
        type="button"
        ariaLabel="Select category"
        onClick={() => navigate(-1)}
      >
        Select
      </BtnRect>
    </Modal>
  );
};

export default TileListModal;
