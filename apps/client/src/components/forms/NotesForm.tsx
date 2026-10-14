import LexicalEditor from '../lexical/LexicalEditor';
import useCreateNotesMutation from '../../hooks/useCreateNotesMutation/useCreateNotesMutation';
import useNotesForm from 'src/hooks/form hooks/useNotesForm';
import FormLayout from 'src/layouts/FormLayout';
import { useOutletContext, useParams } from 'react-router-dom';

const NotesForm = () => {
  const { sessionId } = useParams();
  const { notes } = useOutletContext();

  const createNotes = useCreateNotesMutation();

  const note = notes?.find((n) => n.sessionId === Number(sessionId));

  const notesForm = useNotesForm(Number(sessionId), createNotes, note);

  return (
    <FormLayout
      itemId={note?.id ?? undefined}
      label="Notes"
      createMutation={createNotes}
      form={notesForm}
    >
      <h1>Create Notes</h1>
      <notesForm.Field name="content">
        {(field) => <LexicalEditor field={field} />}
      </notesForm.Field>
    </FormLayout>
  );
};

export default NotesForm;
