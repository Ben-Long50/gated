import { useParams } from 'react-router-dom';
import LexicalEditor from '../lexical/LexicalEditor';
import useCreateNotesMutation from '../../hooks/useCreateNotesMutation/useCreateNotesMutation';
import useNotesForm from 'src/hooks/form hooks/useNotesForm';
import BtnRect from '../buttons/BtnRect';
import { Notes } from 'src/types/campaign';

const NotesForm = ({
  sessionId,
  notes,
  setEditModeId,
}: {
  sessionId: number;
  notes?: Notes;
  setEditModeId: (value: number | null) => void;
}) => {
  const createNotes = useCreateNotesMutation(setEditModeId);

  const notesForm = useNotesForm(sessionId, createNotes, notes);

  return (
    <div className="flex w-full flex-col gap-8">
      <notesForm.Field name="content">
        {(field) => (
          <>
            <LexicalEditor field={field} />
            {field.state.meta.errors &&
              field.state.meta.errors.map((error, index) => (
                <p
                  key={index}
                  className="timing text-error text-base italic leading-5"
                  role="alert"
                >
                  {error}
                </p>
              ))}
          </>
        )}
      </notesForm.Field>
      <BtnRect
        ariaLabel="Update Notes"
        onClick={() => notesForm.handleSubmit()}
      >
        Update Notes
      </BtnRect>
    </div>
  );
};

export default NotesForm;
