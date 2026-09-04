import MapList from './MapList';
import useCodexMapsQuery from 'src/hooks/useCodexMapsQuery/useCodexMapsQuery';
import Loading from 'src/components/Loading';
import InputField from 'src/components/formFields/InputField';

const CodexMapList = () => {
  const { data: maps, isLoading } = useCodexMapsQuery();

  const mapIds = maps?.map((map) => map.id);

  if (isLoading) {
    return <Loading />;
  }

  if (!mapIds) {
    return <p>No maps found</p>;
  }

  return <MapList mapIds={mapIds} />;
};

export default CodexMapList;
