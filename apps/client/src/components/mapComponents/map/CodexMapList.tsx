import MapList from './MapList';
import useCodexMapsQuery from 'src/hooks/useCodexMapsQuery/useCodexMapsQuery';
import Loading from 'src/components/Loading';
import Page from 'src/components/Page';

const CodexMapList = () => {
  const { data: maps, isLoading } = useCodexMapsQuery();

  const mapIds = maps?.map((map) => map.id);

  if (isLoading) {
    return <Loading />;
  }

  if (!mapIds) {
    return <p>No maps found</p>;
  }

  return (
    <Page title="Maps">
      <MapList mapIds={mapIds} />
    </Page>
  );
};

export default CodexMapList;
