import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import Affiliations from './Affiliations';
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from './Loading';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from 'src/contexts/ThemeContext';
import InputSelectField from './formFields/InputSelectField';
import useAffiliationQueries from 'src/hooks/useAffiliationQueries/useAffiliationQueries';
import Icon from '@mdi/react';
import { mdiSync } from '@mdi/js';
import ArrowHeader3 from './ArrowHeader3';

const CampaignAffiliations = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { campaignId } = useParams();
  const [entity, setEntity] = useState<any>(null);

  const { data: campaign, isLoading: campaignLoading } = useCampaignQuery(
    Number(campaignId),
  );

  const { data: affiliations, isLoading: affiliationsLoading } =
    useAffiliationQueries(
      campaign?.affiliations.map((affiliation) => affiliation.id) || [],
    );

  const filteredAffiliations = entity
    ? affiliations?.filter((affiliation) =>
        [
          ...affiliation?.factions,
          ...affiliation?.gangs,
          ...affiliation?.characters,
        ].some((e: any) => e.name === entity.name),
      )
    : affiliations;

  const isLoading = campaignLoading || affiliationsLoading;

  if (isLoading) return <Loading />;

  return <Affiliations affiliations={filteredAffiliations} entity={entity} />;
};

export default CampaignAffiliations;
