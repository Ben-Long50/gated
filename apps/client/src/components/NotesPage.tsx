import { format } from 'date-fns';
import Divider from './Divider';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import Loading from './Loading';
import useNotesQuery from '../hooks/useNotesQuery/useNotesQuery';
import useCharacterQuery from '../hooks/useCharacterQuery/useCharacterQuery';
import ArrowHeader3 from './ArrowHeader3';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import CharacterPictureRound from './characterComponents/CharacterPictureRound';
import BtnAuth from './buttons/BtnAuth';
import Page from './Page';

const NotesPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { campaignId, characterId } = useParams();

  const { data: character, isLoading: characterLoading } = useCharacterQuery(
    Number(characterId),
  );

  const { data: campaign, isLoading: campaignLoading } = useCampaignQuery(
    Number(campaignId),
  );

  const { data: characterNotes, isLoading: notesLoading } = useNotesQuery(
    Number(characterId),
  );

  const isLoading = notesLoading || characterLoading || campaignLoading;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Page title="Notes" context={{ notes: characterNotes }}>
      {character && (
        <div className="flex items-center justify-center gap-8">
          <CharacterPictureRound character={character} />
          <h2 className="font-zen text-4xl">{character?.name}</h2>
        </div>
      )}
      {campaign?.sessions.map((session, index) => {
        const notes = characterNotes?.find(
          (notes) => notes.sessionId === session.id,
        );

        return (
          <>
            <div className="flex flex-col gap-8">
              <div className="flex w-full items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <p className="whitespace-nowrap">
                    {'Session ' + session.sessionNumber}
                  </p>
                </div>
                <p className="whitespace-nowrap">
                  {format(session.createdAt, 'PP')}
                </p>
              </div>
              <ArrowHeader3 title={session?.name} />

              <div className="flex w-full flex-col gap-6">
                {notes ? (
                  <div
                    id="quill-display"
                    className="ql-editor whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: notes.content?.html }}
                  />
                ) : (
                  <p>No notes created</p>
                )}
                {character?.userId === user?.id && (
                  <BtnAuth
                    onClick={() =>
                      navigate(`modal/session/${session.id}/update`)
                    }
                  >
                    {notes ? 'Edit Session Notes' : 'Create Session Notes'}
                  </BtnAuth>
                )}
              </div>
            </div>
            {index + 1 < campaign?.sessions.length && <Divider />}
          </>
        );
      })}
    </Page>
  );
};

export default NotesPage;
