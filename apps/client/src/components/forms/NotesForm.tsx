import FormLayout from '../../layouts/FormLayout';
import { useParams } from 'react-router-dom';
import LexicalEditor from '../lexical/LexicalEditor';
import useCreateNotesMutation from '../../hooks/useCreateNotesMutation/useCreateNotesMutation';
import useNotesForm from 'src/hooks/form hooks/useNotesForm';

const NotesForm = () => {
  const { notesId } = useParams();

  const createNotes = useCreateNotesMutation(Number(notesId));

  const notesForm = useNotesForm(createNotes);

  return (
    <FormLayout
      label="Notes"
      form={notesForm}
      itemId={notesId}
      createMutation={createNotes}
    >
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
    </FormLayout>
  );
};

export default NotesForm;
