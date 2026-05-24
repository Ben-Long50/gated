import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Loading from './Loading';
import useCampaignQuery from '../hooks/useCampaignQuery/useCampaignQuery';
import Icon from '@mdi/react';
import { mdiCrown } from '@mdi/js';
import { format } from 'date-fns';
import LocationIcon from './icons/LocationIcon';
import { Session } from 'src/types/campaign';
import { User } from 'src/types/user';
import Divider from './Divider';
import BtnAuth from './buttons/BtnAuth';
import AccountPicture from './AccountPicture';
import BtnRect from './buttons/BtnRect';
import useJoinCampaignMutation from '../hooks/useJoinCampaignMutation/useJoinCampaignMutation';
import ArrowHeader3 from './ArrowHeader3';
import CoverPicture from './CoverPicture';
import { capitalCase } from 'change-case';
import Calendar from './Calendar';
import CharacterList from './characterComponents/CharacterList';
import useRejectCampaignMutation from 'src/hooks/useRejectCampaignMutation/useRejectCampaignMutation';
import EntityAvater from './EntityAvatar';
import NavTabs from './NavTabs';
import GangCard from './GangCard';
import FactionCard from './FactionCard';

const Campaign = () => {
  const { user } = useContext(AuthContext);
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('characters');

  const { data: campaign, isLoading } = useCampaignQuery(Number(campaignId));

  const accentCampaignInvitation = useJoinCampaignMutation(Number(campaignId));
  const rejectCampaignInvitation = useRejectCampaignMutation(
    Number(campaignId),
  );

  const playerIds = campaign?.players.map((player: User) => player.id) || [];
  const pendingIds =
    campaign?.pendingPlayers.map((player: User) => player.id) || [];

  if (isLoading) return <Loading />;

  return (
    <>
      <CoverPicture picture={campaign?.picture} />
      <div className="absolute left-8 right-8 top-8 flex items-start justify-between gap-8">
        <h2 className="w-full font-zen text-4xl">
          {capitalCase(campaign?.name)}
        </h2>
        <div className="flex items-center justify-end gap-4">
          <LocationIcon className="text-accent size-10" />
          <h2 className="!text-accent text-right">{campaign?.location}</h2>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <p>
          Joined Players {playerIds?.length} /{' '}
          {playerIds?.length + pendingIds?.length}
        </p>
      </div>
      <div className="grid w-full grid-cols-[2fr_1fr]">
        <div className="flex flex-col items-start gap-4">
          <ArrowHeader3 title="Players" />
          <div className="flex items-center justify-start">
            {campaign?.players.map((player: User) => (
              <div key={player.id} className="group flex items-center gap-4">
                <AccountPicture user={player} />
                <p className="timing max-w-0 overflow-hidden whitespace-nowrap font-semibold group-hover:max-w-40 group-hover:pr-4">
                  {player.username}
                </p>
              </div>
            ))}
            {campaign?.pendingPlayers.map((player: User) => (
              <div key={player.id} className="group flex items-center gap-4">
                <AccountPicture
                  className="opacity-50 grayscale"
                  user={player}
                />
                <p className="timing max-w-0 overflow-hidden whitespace-nowrap font-semibold group-hover:max-w-40 group-hover:pr-4">
                  {player.username}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <ArrowHeader3 reverse={true} title="Game Master" />
          <div className="group relative flex items-center gap-4">
            <AccountPicture user={campaign?.owner} />
            <p className="timing max-w-0 overflow-hidden whitespace-nowrap font-semibold group-hover:max-w-40 group-hover:pr-4">
              {campaign?.owner.username}
            </p>
            <Icon
              path={mdiCrown}
              className="absolute -left-2 -top-2 size-5 text-yellow-400"
            />
          </div>
        </div>
      </div>
      {pendingIds?.includes(user?.id) && (
        <>
          <BtnRect
            type="button"
            className="w-full"
            ariaLabel="Join campaign"
            onClick={() => {
              accentCampaignInvitation.mutate();
            }}
          >
            {accentCampaignInvitation.isPending ? (
              <Loading
                className="group-hover:text-accent text-gray-900"
                size={1.15}
              />
            ) : (
              'Join Campaign'
            )}
          </BtnRect>
          <BtnAuth
            className="w-full"
            onClick={() => {
              rejectCampaignInvitation.mutate();
            }}
          >
            {accentCampaignInvitation.isPending ? (
              <Loading
                className="group-hover:text-accent text-gray-900"
                size={1.15}
              />
            ) : (
              'Reject Invitation'
            )}
          </BtnAuth>
        </>
      )}
      <Divider />
      <div className="grid grid-cols-2 gap-8">
        <Calendar />
        <div className="scrollbar-primary-2 flex max-h-80 w-full flex-col gap-4 overflow-y-auto px-0.5 py-2 pr-2">
          <ArrowHeader3 title="Sessions" />
          {campaign?.sessions.map((session: Session) => (
            <BtnAuth
              key={session.id}
              className="timing flex w-full items-center justify-between gap-4"
              onClick={() => navigate(`sessions/${session.id}`)}
            >
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center justify-start gap-4">
                  <EntityAvater entity={session} />
                  <p className="font-semibold">
                    {session.sessionNumber}. {session.name}
                  </p>
                </div>
                <p className="text-right">{format(session.createdAt, 'PP')}</p>
              </div>
            </BtnAuth>
          ))}
        </div>
      </div>
      <Divider className="col-span-2" />
      <NavTabs className="grid-cols-3">
        <BtnAuth active={tab === 'factions'} onClick={() => setTab('factions')}>
          Factions
        </BtnAuth>
        <BtnAuth active={tab === 'gangs'} onClick={() => setTab('gangs')}>
          Gangs
        </BtnAuth>
        <BtnAuth
          active={tab === 'characters'}
          onClick={() => setTab('characters')}
        >
          Characters
        </BtnAuth>
      </NavTabs>
      {tab === 'factions' &&
        campaign?.factions.map((faction) => (
          <FactionCard key={faction.id} factionId={faction.id} />
        ))}
      {tab === 'gangs' &&
        campaign?.gangs.map((gang) => (
          <GangCard key={gang.id} gangId={gang.id} />
        ))}
      {tab === 'characters' && (
        <CharacterList
          characterIds={campaign?.characters.map((character) => character.id)}
        />
      )}
      {campaign?.ownerId === user?.id && (
        <>
          <Divider />
          <Link className="col-start-2" to={`update`}>
            <BtnRect
              className="w-full"
              type="button"
              ariaLabel="Update campaign"
            >
              Update Campaign
            </BtnRect>
          </Link>
        </>
      )}
    </>
  );
};

export default Campaign;
