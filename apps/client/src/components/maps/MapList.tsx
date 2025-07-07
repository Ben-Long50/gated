import { capitalCase } from 'change-case';
import { useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from 'src/contexts/AuthContext';
import useCampaignMapsQuery from 'src/hooks/useCampaignMapsQuery/useCampaignMapsQuery';
import Loading from '../Loading';
import ReactGridLayout from 'react-grid-layout';
import ItemCardSmall from '../ItemCardSmall';
import Icon from '@mdi/react';
import { mdiTagEdit } from '@mdi/js';

const MapList = () => {
  const { apiUrl } = useContext(AuthContext);
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');
  const mode = parts[parts.length - 1];

  const { data: campaignMaps, isLoading } = useCampaignMapsQuery(
    apiUrl,
    Number(campaignId),
  );

  if (isLoading) return <Loading />;

  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-8">
      <h1>{capitalCase(mode)}</h1>
      <div className="flex w-full flex-col gap-4">
        {campaignMaps?.map((map) => {
          const mapLayout = map.layout.map((item) => ({
            ...item,
            isDraggable: false,
            isResizable: false,
            resizeHandles: [],
          }));

          return (
            <ItemCardSmall
              heading={
                <div className="mr-4 flex w-full items-center justify-between">
                  <h3>{map.name}</h3>
                  <button
                    className="bg-tertiary group rounded p-1.5 shadow-md shadow-black"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`../maps/${map.id}/update`);
                    }}
                  >
                    <Icon
                      className="text-secondary group-hover:text-accent timing size-6"
                      path={mdiTagEdit}
                    />
                  </button>
                </div>
              }
            >
              <ReactGridLayout
                className="layout overflow-hidden rounded"
                style={{ width: map.width * 48 }}
                layout={mapLayout}
                cols={map.width}
                rowHeight={48}
                width={map.width * 48}
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
            </ItemCardSmall>
          );
        })}
      </div>
    </div>
  );
};

export default MapList;
