import { useContext, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Loading from './Loading';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useSessionQuery from '../hooks/useSessionQuery/useSessionQuery';
import { format } from 'date-fns';
import { Character } from 'src/types/character';
import ArrowHeader3 from './ArrowHeader3';
import Divider from './Divider';
import useCampaignQuery from '../hooks/useCampaignQuery/useCampaignQuery';
import CoverPicture from './CoverPicture';
import { capitalCase } from 'change-case';
import CharacterPictureRound from './characterComponents/CharacterPictureRound';
import NoteIcon from './icons/NoteIcon';
import BtnAuth from './buttons/BtnAuth';
import IconBtnMedium from './buttons/IconBtnMedium';

const Session = () => {
  const { user } = useContext(AuthContext);
  const { campaignId, sessionId } = useParams();
  const navigate = useNavigate();

  const {
    data: session,
    isLoading: sessionLoading,
    isPending: sessionPending,
    isError,
  } = useSessionQuery(Number(campaignId), Number(sessionId));

  const {
    data: campaign,
    isLoading: campaignLoading,
    isPending: campaignPending,
  } = useCampaignQuery(Number(campaignId));

  const isLoading = sessionLoading || campaignLoading;
  const isPending = sessionPending || campaignPending;

  const sessionPlayerCharacters =
    session?.characters.filter((character) => character.playerCharacter) || [];

  if (isLoading || isPending) {
    return <Loading />;
  }

  if (isError) {
    throw new Error('Failed to find session');
  }

  return (
    <>
      <CoverPicture picture={session.picture} />
      <div className="absolute left-8 right-8 top-8 flex items-start justify-between gap-8">
        <h2 className="text-shadow-color text-shadow text-center font-zen text-4xl text-shadow-x-2 text-shadow-y-2">
          {capitalCase(session.name)}
        </h2>
        <div className="flex flex-col items-end justify-between gap-2">
          <p className="!text-accent whitespace-nowrap font-semibold">
            {'Session ' + session.sessionNumber}
          </p>

          <p className="whitespace-nowrap">{format(session.createdAt, 'PP')}</p>
        </div>
      </div>

      {sessionPlayerCharacters.length > 0 && (
        <>
          {sessionPlayerCharacters.map((character: Character) => (
            <div
              key={character.id}
              className="flex w-full items-center justify-between"
            >
              <Link to={`characters/${character.id}/menu`}>
                <div className="flex items-center gap-4">
                  <CharacterPictureRound character={character} />
                  <ArrowHeader3
                    title={character.firstName + ' ' + character.lastName}
                  />
                </div>
              </Link>
              <IconBtnMedium
                onClick={() => navigate(`characters/${character.id}/notes`)}
              >
                <NoteIcon />
              </IconBtnMedium>
            </div>
          ))}
          <Divider />
        </>
      )}
      <div
        id="quill-display"
        className="ql-editor whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: session.briefing.html }}
      />
      {campaign && campaign.ownerId === user.id && (
        <BtnAuth onClick={() => navigate('update')}>Edit Session</BtnAuth>
      )}
    </>
  );
};

export default Session;
