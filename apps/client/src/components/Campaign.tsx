import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Loading from './Loading';
import useCampaignQuery from '../hooks/useCampaignQuery/useCampaignQuery';
import { ThemeContext } from '../contexts/ThemeContext';
import Icon from '@mdi/react';
import { mdiCrown } from '@mdi/js';
import { format } from 'date-fns';
import LocationIcon from './icons/LocationIcon';
import { Session } from 'src/types/campaign';
import { User } from 'src/types/user';
import Divider from './Divider';
import BtnAuth from './buttons/BtnAuth';
import AccountPicture from './AccountPicture';
import ThemeContainer from './ThemeContainer';
import { Faction } from 'src/types/faction';
import BtnRect from './buttons/BtnRect';
import useJoinCampaignMutation from '../hooks/useJoinCampaignMutation/useJoinCampaignMutation';
import ArrowHeader3 from './ArrowHeader3';
import CoverPicture from './CoverPicture';
import { capitalCase } from 'change-case';
import Calendar from './Calendar';
import CharacterList from './characterComponents/CharacterList';
import useRejectCampaignMutation from 'src/hooks/useRejectCampaignMutation/useRejectCampaignMutation';
import EntityAvater from './EntityAvatar';

const Campaign = () => {
  const { user } = useContext(AuthContext);
  const { campaignId } = useParams();
  const { accentPrimary } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('sessions');
  const [coverHeight, setCoverHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const { data: campaign, isLoading } = useCampaignQuery(Number(campaignId));

  const coverRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const accentCampaignInvitation = useJoinCampaignMutation(Number(campaignId));
  const rejectCampaignInvitation = useRejectCampaignMutation(
    Number(campaignId),
  );

  const playerIds = campaign?.players.map((player: User) => player.id) || [];
  const pendingIds =
    campaign?.pendingPlayers.map((player: User) => player.id) || [];

  useEffect(() => {
    if (coverRef.current) {
      setCoverHeight(coverRef.current.offsetHeight);
    }
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [coverRef, headerRef]);

  if (isLoading) return <Loading />;

  return (
    <>
      {campaign?.picture?.imageUrl && (
        <CoverPicture ref={coverRef} picture={campaign?.picture} />
      )}
      <div className="flex w-full max-w-8xl flex-col items-center gap-8">
        <div
          ref={headerRef}
          className="flex w-full items-start justify-between gap-8"
        >
          <h2 className="w-full font-zen text-4xl">
            {capitalCase(campaign?.name)}
          </h2>
          <div className="flex items-center justify-end gap-4">
            <LocationIcon className="text-accent size-10" />
            <h2 className="!text-accent text-right">{campaign?.location}</h2>
          </div>
        </div>
        <div
          className={`flex w-full flex-col gap-8`}
          style={{ marginTop: coverHeight - headerHeight - 32 }}
        >
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
                  <div
                    key={player.id}
                    className="group flex items-center gap-4"
                  >
                    <AccountPicture user={player} />
                    <p className="timing max-w-0 overflow-hidden whitespace-nowrap font-semibold group-hover:max-w-40 group-hover:pr-4">
                      {player.username}
                    </p>
                  </div>
                ))}
                {campaign?.pendingPlayers.map((player: User) => (
                  <div
                    key={player.id}
                    className="group flex items-center gap-4"
                  >
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
          </div>
          <Divider className="col-span-2" />
          <div className="grid grid-cols-2 gap-4">
            <BtnAuth
              active={tab === 'sessions'}
              onClick={() => setTab('sessions')}
            >
              Sessions
            </BtnAuth>
            <BtnAuth
              active={tab === 'factions'}
              onClick={() => setTab('factions')}
            >
              Factions
            </BtnAuth>
          </div>
          <ArrowHeader3 title={capitalCase(tab)} />
          <div className="scrollbar-primary-2 flex max-h-80 w-full flex-col gap-4 overflow-y-auto px-0.5 py-2">
            {tab === 'sessions' && (
              <>
                {campaign?.sessions.map((session: Session) => (
                  <BtnAuth
                    key={session.id}
                    className="timing flex w-full items-center justify-between gap-4"
                    onClick={() => navigate(`sessions/${session.id}`)}
                  >
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="flex items-center justify-start gap-4">
                        <EntityAvater entity={session} />
                        <p className="font-semibold">{session.name}</p>
                      </div>
                      <p className="text-right">
                        {format(session.createdAt, 'PP')}
                      </p>
                    </div>
                  </BtnAuth>
                ))}
              </>
            )}
            {tab === 'factions' && (
              <>
                {campaign?.factions.map((faction: Faction) => (
                  <BtnAuth
                    key={faction.id}
                    className="timing flex w-full items-center justify-between"
                    onClick={() => navigate(`factions/${faction.id}`)}
                  >
                    <div className="flex w-full items-center gap-4">
                      <EntityAvater entity={faction} />
                      <p className="font-semibold !text-inherit">
                        {faction.name}
                      </p>
                    </div>
                  </BtnAuth>
                ))}
              </>
            )}
          </div>
          <Divider className="col-span-2" />
          <CharacterList
            characterIds={campaign?.characters.map((character) => character.id)}
          />
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
        </div>
      </div>
    </>
  );
};

export default Campaign;
