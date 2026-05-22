import FormLayout from '../../layouts/FormLayout';
import { useParams } from 'react-router-dom';
import InputField from '../formFields/InputField';
import LexicalEditor from '../lexical/LexicalEditor';
import useCreatePatchNoteMutation from '../../hooks/useCreatePatchNoteMutation/useCreatePatchNoteMutation';
import useDeletePatchNoteMutation from '../../hooks/useDeletePatchNoteMutation/useDeletePatchNoteMutation';
import usePatchNoteForm from 'src/hooks/form hooks/usePatchNoteForm';
import usePatchNoteQuery from 'src/hooks/usePatchNoteQuery/usePatchNoteQuery';

const PatchNoteForm = () => {
  const { patchNoteId } = useParams();

  const { data: patchNote } = usePatchNoteQuery(Number(patchNoteId));

  const createPatchNote = useCreatePatchNoteMutation(Number(patchNoteId));
  const deletePatchNote = useDeletePatchNoteMutation(Number(patchNoteId));

  const patchNoteForm = usePatchNoteForm(createPatchNote, patchNote);

  return (
    <FormLayout
      label="Patch Note"
      form={patchNoteForm}
      itemId={patchNoteId}
      createMutation={createPatchNote}
      deleteMutation={deletePatchNote}
    >
      <div className="flex w-full gap-4">
        <patchNoteForm.Field
          name="title"
          validators={{
            onChange: ({ value }) =>
              value.length < 2
                ? 'Patch notes title needs be at least 2 characters long'
                : undefined,
          }}
        >
          {(field) => (
            <InputField
              label="Title"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </patchNoteForm.Field>
        <patchNoteForm.Field
          name="version"
          validators={{
            onChange: ({ value }) =>
              !value ? 'A version number must be provided' : undefined,
          }}
        >
          {(field) => (
            <InputField
              className="w-24"
              type="number"
              label="Version"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </patchNoteForm.Field>
      </div>
      <patchNoteForm.Field
        name="content"
        validators={{
          onChange: ({ value }) =>
            value.html.length < 100
              ? 'Section content has not met the minimum length requirement'
              : undefined,
        }}
      >
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
      </patchNoteForm.Field>
    </FormLayout>
  );
};

export default PatchNoteForm;
