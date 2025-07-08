import { capitalCase } from 'change-case';
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import Loading from '../Loading';
import ReactGridLayout from 'react-grid-layout';
import ItemCardSmall from '../ItemCardSmall';
import Icon from '@mdi/react';
import { mdiTagEdit, mdiTrashCanOutline } from '@mdi/js';
import useMaps from 'src/hooks/useMaps';
import BtnRect from '../buttons/BtnRect';
import Divider from '../Divider';

const MapList = () => {
  const { mapId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');
  const [widthModifier, setWidthModifier] = useState(500);

  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setWidthModifier(width);
    }
  }, [containerRef.current]);

  const mode = (() => {
    if (parts.includes('drafts')) {
      return 'drafts';
    } else if (parts.includes('locations')) {
      return 'locations';
    } else if (parts.includes('components')) {
      return 'components';
    }
    throw new Error('Incorrent map type provided');
  })();

  const maps = useMaps();

  if (maps.isLoading) return <Loading />;

  return (
    <div
      ref={containerRef}
      className="flex w-full max-w-5xl flex-col items-center gap-8"
    >
      <h1>Map {capitalCase(mode)}</h1>
      {maps[mode].length === 0 ? (
        <>
          <h3 className="text-center">
            Your campaign has no map {mode}. Head to the Map Builder to create
            new campaign maps
          </h3>
          <BtnRect
            className="min-w-80"
            type="button"
            ariaLabel="Navigate to map builder"
            onClick={() => navigate('../create')}
          >
            Map Builder
          </BtnRect>
        </>
      ) : (
        <div className="flex w-full flex-col gap-4">
          {maps[mode]?.map((map) => {
            const mapLayout = map.layout.map((item) => ({
              ...item,
              isDraggable: false,
              isResizable: false,
              resizeHandles: [],
            }));

            return (
              <Fragment key={map.id}>
                <ItemCardSmall
                  heading={
                    <div className="mr-4 flex w-full items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h3>{map.name}</h3>
                        {map.draft && <p className="text-tertiary">(draft)</p>}
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          className="bg-tertiary group rounded p-1.5 shadow-md shadow-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`../${map.id}/update`);
                          }}
                        >
                          <Icon
                            className="text-secondary group-hover:text-accent timing size-6"
                            path={mdiTagEdit}
                          />
                        </button>
                        <button
                          className="bg-tertiary group rounded p-1.5 shadow-md shadow-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`${map.id}/delete`);
                          }}
                        >
                          <Icon
                            className="text-secondary group-hover:text-accent timing size-6"
                            path={mdiTrashCanOutline}
                          />
                        </button>
                      </div>
                    </div>
                  }
                >
                  <Divider />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-4">
                      <div className="bg-tertiary flex items-center justify-between gap-4 rounded p-3 shadow-md shadow-black">
                        <h4>Map Author</h4>
                        <p>{map.user.username}</p>
                      </div>
                      <div className="bg-tertiary flex items-center justify-between gap-4 rounded p-3 shadow-md shadow-black">
                        <h4>Size</h4>
                        <p>
                          {map.height} (height) x {map.width} (width)
                        </p>
                      </div>
                      <p className="border-x-2 border-gray-400 border-opacity-50 px-4">
                        {map.description}
                      </p>
                    </div>
                    <ReactGridLayout
                      className="layout overflow-hidden rounded"
                      style={{
                        width: widthModifier * 0.5 - 24,
                      }}
                      layout={mapLayout}
                      cols={map.width}
                      rowHeight={(widthModifier * 0.5 - 24) / map.width}
                      width={widthModifier * 0.5 - 24}
                      margin={[0, 0]}
                      allowOverlap={true}
                    >
                      {mapLayout.map((item, index: number) => (
                        <div
                          className={`${item.classNames}`}
                          style={
                            index === 0
                              ? { backgroundColor: map.baseColor }
                              : undefined
                          }
                          key={item.i}
                        />
                      ))}
                    </ReactGridLayout>
                  </div>
                </ItemCardSmall>
                {map.id === Number(mapId) && (
                  <Outlet context={{ name: map.name }} />
                )}
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MapList;
