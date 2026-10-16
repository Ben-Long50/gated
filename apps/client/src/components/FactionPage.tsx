import { useContext, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Loading from './Loading';
import BtnRect from './buttons/BtnRect';
import { Affiliation } from '@gated/shared';
import BtnAuth from './buttons/BtnAuth';
import CoverPicture from './CoverPicture';
import useAffiliationQueries from 'src/hooks/useAffiliationQueries/useAffiliationQueries';
import useFactionQuery from 'src/hooks/faction hooks/useFactionQuery';
import { capitalCase } from 'change-case';
import NavTabs from './NavTabs';
import Affiliations from './Affiliations';
import Page from './Page';

const FactionPage = () => {
  const { user } = useContext(AuthContext);
  const { factionId } = useParams();
  const [tab, setTab] = useState('information');

  const {
    data: faction,
    isLoading: factionLoading,
    isPending,
  } = useFactionQuery(Number(factionId));

  const { data: affiliations, isLoading: affiliationsLoading } =
    useAffiliationQueries(
      faction?.affiliations.map((affiliation: Affiliation) => affiliation.id) ||
        [],
    );

  const isLoading = factionLoading || affiliationsLoading;

  if (isLoading || isPending) return <Loading />;

  return (
    <Page title="Faction">
      <CoverPicture publicId={faction?.generatedPicture?.publicId} />
      <div className="timing absolute left-8 right-8 top-8 flex items-center justify-between">
        <h2 className="w-full font-zen text-4xl">{faction?.name}</h2>
        <p className="!text-accent text-right font-semibold">
          {capitalCase(faction?.factionType)}
        </p>
      </div>
      <NavTabs className="grid-cols-3">
        <BtnAuth
          active={tab === 'information'}
          onClick={() => setTab('information')}
        >
          Information
        </BtnAuth>
        <BtnAuth
          active={tab === 'background'}
          onClick={() => setTab('background')}
        >
          Background
        </BtnAuth>
        <BtnAuth
          active={tab === 'affiliations'}
          onClick={() => setTab('affiliations')}
        >
          Affiliations
        </BtnAuth>
      </NavTabs>
      {tab === 'background' &&
        (faction?.background ? (
          <div
            id="quill-display"
            className="ql-editor whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: faction?.background.html }}
          />
        ) : (
          <p className="text-center">No background</p>
        ))}
      {tab === 'affiliations' && <Affiliations affiliations={affiliations} />}
      {user?.id === faction?.campaign.ownerId && (
        <Link className="w-full" to={`update`}>
          <BtnRect
            ariaLabel="Update faction information"
            className="w-full sm:w-1/2 sm:justify-self-end"
            type="button"
          >
            Update faction info
          </BtnRect>
        </Link>
      )}
    </Page>
  );
};

export default FactionPage;
