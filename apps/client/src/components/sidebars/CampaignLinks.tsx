import LinkListSidebar from './LinkListSidebar';
import SubLinkSidebar from './SubLinkSidebar';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import CampaignIcon from '../icons/CampaignIcon';
import LinkSidebar from './LinkSidebar';
import DieIcon from '../icons/DieIcon';
import { useParams } from 'react-router-dom';
import CharacterIcon from '../icons/CharacterIcon';
import useCampaignQuery from '../../hooks/useCampaignQuery/useCampaignQuery';
import { Session } from 'src/types/campaign';
import SessionIcon from '../icons/SessionIcon';
import AffiliationIcon from '../icons/AffiliationIcon';
import NoteIcon from '../icons/NoteIcon';
import useCampaignCharactersQuery from 'src/hooks/useCampaignCharactersQuery/useCampaignCharactersQuery';
import MapIcon from '../icons/MapIcon';
import useNavigationStore from 'src/stores/navbarStore';
import { LayoutContext } from 'src/contexts/LayoutContext';
import useToggleCampaignMutation from 'src/hooks/campaign hooks/useToggleCampaignMutation/useToggleCampaignMutation';
import CrownIcon from '../icons/CrownIcon';
import Loading from '../Loading';
import CombatIcon from '../icons/CombatIcon';
import { CampaignContext } from 'src/contexts/CampaignContext';
import PassIcon from '../icons/PassIcon';
import { Gang } from 'src/types/gang';
import CharacterPictureRound from '../CharacterPictureRound';
import constructName from 'src/utils/constructName';

const CampaignLinks = () => {
  const { user } = useContext(AuthContext);
  const { campaigns } = useContext(CampaignContext);
  const { layoutSize } = useContext(LayoutContext);
  const { gameMaster } = useContext(CampaignContext);
  const { campaignId } = useParams();

  const { data: campaign } = useCampaignQuery(Number(campaignId));
  const toggleCampaign = useToggleCampaignMutation(Number(campaignId));

  const setSidebar = useNavigationStore((state) => state.setSidebar);

  const { playerCharacters } = useCampaignCharactersQuery(
    campaign?.characters.map((character) => character.id) || [],
  );

  return (
    <>
      {!campaignId ? (
        <>
          <LinkSidebar
            icon={
              <CampaignIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
            }
            title="Create Campaign"
            path="campaigns/create"
          ></LinkSidebar>
          {campaigns.map((campaign) => {
            const characterName = constructName(campaign);

            return (
              <LinkSidebar
                title={characterName}
                icon={<CharacterPictureRound character={campaign} />}
                path={`campaigns/${campaign.id}`}
              />
            );
          })}
        </>
      ) : (
        <>
          <LinkListSidebar
            icon={
              <SessionIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
            }
            title="Sessions"
          >
            {campaign?.sessions.map((session: Session) => (
              <SubLinkSidebar
                key={session.id}
                title={`${session.sessionNumber} — ${session.name}`}
                path={`campaigns/${campaignId}/sessions/${session.id}`}
              />
            ))}
            {campaign?.ownerId === user.id && (
              <SubLinkSidebar
                title={`Create a new session`}
                path={`campaigns/${campaignId}/sessions/create`}
              />
            )}
          </LinkListSidebar>
          <LinkListSidebar
            icon={
              <CharacterIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
            }
            title="Characters"
          >
            <SubLinkSidebar
              title="Player Characters"
              path={`campaigns/${campaignId}/characters?list=playerCharacters`}
            />
            <SubLinkSidebar
              title="Non-player Characters"
              path={`campaigns/${campaignId}/characters?list=nonPlayerCharacters`}
            />
          </LinkListSidebar>
          <LinkListSidebar
            icon={
              <PassIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
            }
            title="Gangs"
          >
            {campaign?.gangs.map((gang: Gang) => (
              <SubLinkSidebar
                title={gang.name}
                path={`campaigns/${campaignId}/gangs/${gang.id}`}
              />
            ))}
            <SubLinkSidebar
              title="Create a Gang"
              path={`campaigns/${campaignId}/gangs/create`}
            />
          </LinkListSidebar>
          <LinkListSidebar
            icon={
              <MapIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
            }
            title="Maps"
          >
            <SubLinkSidebar
              title="Maps"
              path={`campaigns/${campaignId}/maps/?mapType=map&draft=false`}
            />
            <SubLinkSidebar
              title="Components"
              path={`campaigns/${campaignId}/maps/?mapType=component&draft=false`}
            />
            <SubLinkSidebar
              title="Your Drafts"
              path={`campaigns/${campaignId}/maps/?draft=true`}
            />
            <SubLinkSidebar
              title="Create a Map"
              path={`campaigns/${campaignId}/maps/create`}
            />
          </LinkListSidebar>
          <LinkListSidebar
            icon={
              <CombatIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
            }
            title="Encounters"
          >
            <SubLinkSidebar
              title={`Completed Encounters`}
              path={`campaigns/${campaignId}/encounters/completed`}
            />
            {gameMaster && (
              <>
                <SubLinkSidebar
                  title={`Pending Encounters`}
                  path={`campaigns/${campaignId}/encounters/pending`}
                />
                <SubLinkSidebar
                  title={`Create an Encounter`}
                  path={`campaigns/${campaignId}/encounters/create`}
                />
              </>
            )}
          </LinkListSidebar>
          <LinkListSidebar
            icon={
              <NoteIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
            }
            title="Notes"
          >
            {playerCharacters.map((character) => (
              <SubLinkSidebar
                key={character?.id}
                title={`${character?.firstName}'s Notes`}
                path={`campaigns/${campaignId}/characters/${character?.id}/notes`}
              />
            ))}
          </LinkListSidebar>
          <LinkListSidebar
            title="Affiliations"
            icon={
              <AffiliationIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
            }
          >
            <SubLinkSidebar
              title="Affiliations"
              path={`campaigns/${campaignId}/affiliations`}
            />
            <SubLinkSidebar
              title="Create an Affiliation"
              path={`campaigns/${campaignId}/affiliations/create`}
            />
          </LinkListSidebar>

          <LinkSidebar
            title="Roll Simulator"
            icon={
              <DieIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
            }
            path={`campaigns/${campaignId}/rollSimulator`}
          />
          {gameMaster && (
            <LinkListSidebar
              icon={
                <CrownIcon className="timing group-hover:text-accent bg-secondary z-10 size-12 shrink-0 p-2 text-inherit" />
              }
              title="GM Options"
            >
              <div className="text-secondary group flex gap-4">
                <button
                  className="w-full pl-4 text-left text-inherit"
                  onClick={() => {
                    toggleCampaign.mutate();
                    if (layoutSize !== 'large' && layoutSize !== 'xlarge') {
                      setSidebar(false);
                    }
                  }}
                >
                  {toggleCampaign.isPending ? (
                    <Loading size={1.25} className="mr-auto" />
                  ) : (
                    <div className="timing group-hover:text-accent whitespace-nowrap text-xl tracking-wide text-inherit">
                      {campaign?.active
                        ? 'Deactivate Campaign'
                        : 'Activate Campaign'}
                    </div>
                  )}
                </button>
              </div>
            </LinkListSidebar>
          )}
        </>
      )}
    </>
  );
};

export default CampaignLinks;
