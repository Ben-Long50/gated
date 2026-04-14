import FormLayout from '../../layouts/FormLayout';
import { useParams } from 'react-router-dom';
import Loading from '../Loading';
import LexicalEditor from '../lexical/LexicalEditor';
import useCharacterQuery from '../../hooks/useCharacterQuery/useCharacterQuery';
import useUpdateCharacterMutation from '../../hooks/useCharacterUpdateMutation/useCharacterUpdateMutation';
import ArrowHeader2 from '../ArrowHeader2';
import useResumeForm from 'src/hooks/form hooks/useResumeForm';

const ResumeForm = () => {
  const { characterId } = useParams();

  const { data: character, isLoading } = useCharacterQuery(Number(characterId));

  const updateCharacter = useUpdateCharacterMutation(Number(characterId));

  const resume = character
    ? {
        backstory: character.backstory,
        firstTaste: character.firstTaste,
        badMedicine: character.badMedicine,
      }
    : undefined;

  const resumeForm = useResumeForm(updateCharacter, resume);

  if (isLoading) return <Loading />;

  return (
    <FormLayout
      label="Resume"
      form={resumeForm}
      itemId={characterId}
      createMutation={updateCharacter}
    >
      <ArrowHeader2 title="Backstory" />
      <resumeForm.Field
        name="backstory"
        validators={{
          onChange: ({ value }) =>
            value.html.length < 50
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
      </resumeForm.Field>
      <ArrowHeader2 title="First Taste" />
      <resumeForm.Field
        name="firstTaste"
        validators={{
          onChange: ({ value }) =>
            value.html.length < 50
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
      </resumeForm.Field>
      <ArrowHeader2 title="Bad Medicine" />
      <resumeForm.Field
        name="badMedicine"
        validators={{
          onChange: ({ value }) =>
            value.html.length < 50
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
      </resumeForm.Field>
    </FormLayout>
  );
};

export default ResumeForm;
