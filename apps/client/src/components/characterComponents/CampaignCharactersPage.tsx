import CharacterList from './CharacterList';
import useCharacters from 'src/hooks/useCharacters';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import { useParams } from 'react-router-dom';
import Page from '../Page';

const CampaignCharactersPage = () => {
  const { campaignId } = useParams();
  const { data: campaign } = useCampaignQuery(Number(campaignId));

  const { characters, filters, setFilters, isLoading } = useCharacters(
    campaign?.characters.map((character) => character.id) ?? [],
  );

  return (
    <Page title="Campaign Characters">
      <CharacterList
        characters={characters}
        filters={filters}
        setFilters={setFilters}
        isLoading={isLoading}
      />
    </Page>
  );
};

export default CampaignCharactersPage;
