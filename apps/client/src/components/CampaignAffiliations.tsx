import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import Affiliations from './Affiliations';
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from './Loading';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from 'src/contexts/ThemeContext';
import InputSelectField from './InputSelectField';
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

  return (
    <div className="flex w-full max-w-7xl flex-col items-center gap-8">
      <h1 className="text-center">Affiliations</h1>
      <ThemeContainer
        className={`ml-auto w-full`}
        chamfer="medium"
        borderColor={accentPrimary}
      >
        <form className="flex w-full flex-col gap-4 p-4">
          <div className="grid w-full items-center gap-4 max-sm:grid-flow-row sm:grid-flow-col sm:gap-8">
            <ArrowHeader3 title="Affiliation Options" />
          </div>

          <div className="flex w-full items-center gap-4">
            <InputSelectField
              label="Select Entity"
              options={[
                ...(campaign?.factions.sort((a, b) =>
                  a.name.localeCompare(b.name),
                ) || []),
                ...(campaign?.characters.sort((a, b) =>
                  a.firstName.localeCompare(b.firstName),
                ) || []),
              ]}
              value={entity}
              onChange={(entity) => setEntity(entity)}
            />
            <button
              className="text-accent bg-tertiary shadow-color group z-10 grid size-12 shrink-0 place-items-center rounded-md p-1.5 shadow-md hover:underline"
              onClick={(e) => {
                e.preventDefault();
                setEntity(null);
              }}
            >
              <Icon
                path={mdiSync}
                className="text-secondary group-hover:text-accent timing"
              />
            </button>
          </div>
        </form>
      </ThemeContainer>
      <Affiliations affiliations={filteredAffiliations} entity={entity} />
    </div>
  );
};

export default CampaignAffiliations;
