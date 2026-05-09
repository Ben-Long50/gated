import { useContext, useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Loading from './Loading';
import useCampaignQuery from '../hooks/useCampaignQuery/useCampaignQuery';
import { ThemeContext } from '../contexts/ThemeContext';
import Icon from '@mdi/react';
import { mdiCircle, mdiCrown } from '@mdi/js';
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
import { LayoutContext } from 'src/contexts/LayoutContext';
import Calendar from './Calendar';
import CharacterList from './CharacterList';
import useRejectCampaignMutation from 'src/hooks/useRejectCampaignMutation/useRejectCampaignMutation';

const Campaign = () => {
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);
  const { campaignId } = useParams();
  const { accentPrimary } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('sessions');

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
      {campaign?.picture?.imageUrl && (
        <CoverPicture picture={campaign?.picture} />
      )}
      <div className="flex w-full max-w-7xl flex-col items-center gap-8">
        <h1 className="w-full text-center font-zen text-4xl sm:text-5xl">
          {capitalCase(campaign?.name)}
        </h1>
        <ThemeContainer
          className="w-full"
          borderColor={accentPrimary}
          chamfer="medium"
        >
          <div className="flex w-full flex-col items-start gap-8 p-8">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center justify-start gap-4">
                <LocationIcon className="text-accent size-8" />
                <h2 className="!text-accent text-left">{campaign?.location}</h2>
              </div>
              <p>
                Joined Players {playerIds?.length} /{' '}
                {playerIds?.length + pendingIds?.length}
              </p>
            </div>
            <div className="grid w-full grid-cols-[2fr_1fr]">
              <div className="grid grid-cols-3 gap-4">
                <ArrowHeader3 className="col-span-3" title="Players" />
                {campaign?.players.map((player: User) => (
                  <div key={player.id} className="flex items-center gap-4">
                    <AccountPicture user={player} />
                    <p className="font-semibold">{player.username}</p>
                  </div>
                ))}
                {campaign?.pendingPlayers.map((player: User) => (
                  <div key={player.id} className="flex items-center gap-4">
                    <AccountPicture
                      className="opacity-50 grayscale"
                      user={player}
                    />
                    <p className="font-semibold opacity-50">
                      {player.username}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex w-full flex-col items-end justify-between gap-8">
                <div className="flex flex-col items-end gap-4">
                  <ArrowHeader3 title="Game Master" />
                  <div className="relative flex items-center gap-4">
                    <AccountPicture user={campaign?.owner} />
                    <p className="font-semibold">{campaign?.owner.username}</p>
                    <Icon
                      path={mdiCrown}
                      className="absolute -left-2 -top-2 size-5 text-yellow-400"
                    />
                  </div>
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
          </div>
        </ThemeContainer>
        <div className={`mt-14 flex w-full flex-col gap-4 sm:mt-28`}>
          <Calendar />
          <Divider className="col-span-2" />
          <ThemeContainer borderColor={accentPrimary} chamfer="medium">
            <div className="flex flex-col gap-4 p-4 sm:p-8">
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
              <Divider />
              <div className="scrollbar-primary-2 flex max-h-80 w-full flex-col gap-4 overflow-y-auto px-0.5 py-2">
                {tab === 'sessions' && (
                  <>
                    {campaign?.sessions.map((session: Session) => (
                      <BtnAuth
                        key={session.id}
                        className="timing flex w-full items-center justify-between gap-4"
                        onClick={() => navigate(`sessions/${session.id}`)}
                      >
                        <ArrowHeader3 title={session.name} />
                        <p className="text-right">
                          {format(session.createdAt, 'PP')}
                        </p>
                      </BtnAuth>
                    ))}
                  </>
                )}
                {tab === 'factions' && (
                  <>
                    {campaign?.factions.map((faction: Faction) => (
                      <Link
                        className="w-full"
                        key={faction.id}
                        to={`factions/${faction.id}`}
                      >
                        <BtnAuth className="timing flex w-full items-center justify-between p-4">
                          <div className="flex items-center gap-4">
                            {faction.picture?.imageUrl && (
                              <img
                                className="shadow-color size-16 rounded-full object-cover shadow"
                                src={faction.picture?.imageUrl}
                                alt={faction.name + "'s picture"}
                              />
                            )}
                            <ArrowHeader3 title={faction.name} />
                          </div>
                        </BtnAuth>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </div>
          </ThemeContainer>
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
