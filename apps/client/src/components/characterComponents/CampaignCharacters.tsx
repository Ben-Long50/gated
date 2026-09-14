import CharacterList from './CharacterList';
import useCharacters from 'src/hooks/useCharacters';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import { useParams } from 'react-router-dom';

const CampaignCharacters = () => {
  const { campaignId } = useParams();
  const { data: campaign } = useCampaignQuery(Number(campaignId));

  const { characters, filters, setFilters, isLoading } = useCharacters(
    campaign?.characters.map((character) => character.id) ?? [],
  );

  return (
    <CharacterList
      characters={characters}
      filters={filters}
      setFilters={setFilters}
      isLoading={isLoading}
    />
  );
};

export default CampaignCharacters;
