import { format } from 'date-fns';
import Divider from './Divider';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useContext, useState } from 'react';
import Loading from './Loading';
import useNotesQuery from '../hooks/useNotesQuery/useNotesQuery';
import useCharacterQuery from '../hooks/useCharacterQuery/useCharacterQuery';
import ArrowHeader3 from './ArrowHeader3';
import NotesForm from './forms/NotesForm';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import CharacterPictureRound from './CharacterPictureRound';
import BtnAuth from './buttons/BtnAuth';
import constructName from 'src/utils/constructName';

const Notes = () => {
  const { user } = useContext(AuthContext);
  const { campaignId, characterId } = useParams();
  const [editModeId, setEditModeId] = useState<number | null>(null);

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
    <div className="flex w-full max-w-5xl flex-col gap-8">
      {character && (
        <div className="flex items-center justify-center gap-8">
          <CharacterPictureRound character={character} />
          <h1 className="text-left">{constructName(character)}'s Notes</h1>
        </div>
      )}
      {campaign?.sessions.map((session) => {
        const notes = characterNotes?.find(
          (notes) => notes.sessionId === session.id,
        );

        return (
          <div className="bg-primary shadow-color flex flex-col gap-2 rounded-lg p-4 shadow-lg sm:p-8">
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
            <ArrowHeader3 className="mt-2" title={session?.name} />
            <Divider />
            {editModeId !== session.id ? (
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
                  <BtnAuth onClick={() => setEditModeId(session.id)}>
                    {notes ? 'Edit Session Notes' : 'Create Session Notes'}
                  </BtnAuth>
                )}
              </div>
            ) : (
              <NotesForm notes={notes} setEditModeId={setEditModeId} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Notes;
