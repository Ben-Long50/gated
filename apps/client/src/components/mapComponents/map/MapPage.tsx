import { useState } from 'react';
import useMap from 'src/hooks/useMap';
import Loading from '../../Loading';
import { mdiGrid, mdiSquareEditOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useNavigate, useParams } from 'react-router-dom';
import IconBtnMedium from 'src/components/buttons/IconBtnMedium';
import MapScaler from './MapScaler';
import ArrowHeader3 from 'src/components/ArrowHeader3';
import Page from 'src/components/Page';
import Map from './Map';

const MapPage = () => {
  const { mapId, campaignId } = useParams();

  const [gridDisplay, setGridDisplay] = useState(false);
  const [mapScale, setMapScale] = useState(1);
  const navigate = useNavigate();

  const { map, mapLoading } = useMap(Number(mapId));

  if (mapLoading) return <Loading />;

  if (!map) return <p>No Map Found</p>;

  return (
    <Page container={false}>
      <div className="fixed inset-0 flex h-full w-full flex-col items-center justify-center gap-4 sm:gap-8">
        <Map
          mapId={Number(mapId)}
          sidebar={!!campaignId}
          mapScale={mapScale}
          gridDisplay={gridDisplay}
        />
        <div
          className={`bg-base shadow-color timing absolute bottom-2 z-10 mx-auto flex items-center justify-between gap-8 rounded-md p-4`}
        >
          <ArrowHeader3 title={map.name} />
          <div className={`flex w-full items-center justify-center gap-4`}>
            <IconBtnMedium
              tooltip={gridDisplay ? 'Hide Grid' : 'Show Grid'}
              onClick={() => setGridDisplay((prev) => !prev)}
              active={gridDisplay}
            >
              <Icon path={mdiGrid} />
            </IconBtnMedium>
            <MapScaler mapScale={mapScale} setMapScale={setMapScale} />
            <IconBtnMedium
              onClick={() => {
                navigate(`update`);
              }}
              tooltip="Edit Map"
            >
              <Icon path={mdiSquareEditOutline} />
            </IconBtnMedium>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default MapPage;
