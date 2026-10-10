import FormLayout from '../../layouts/FormLayout';
import { useParams, useSearchParams } from 'react-router-dom';
import Loading from '../Loading';
import LexicalEditor from '../lexical/LexicalEditor';
import useCharacterQuery from '../../hooks/useCharacterQuery/useCharacterQuery';
import useUpdateCharacterMutation from '../../hooks/useCharacterUpdateMutation/useCharacterUpdateMutation';
import useResumeForm from 'src/hooks/form hooks/useResumeForm';
import { camelCase, capitalCase } from 'change-case';

const ResumeForm = () => {
  const { characterId } = useParams();
  const [searchParams] = useSearchParams();
  const resumeName = searchParams.get('state') || '';

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
      <h1>Update {capitalCase(resumeName)}</h1>
      <resumeForm.Field name={camelCase(resumeName)}>
        {(field) => <LexicalEditor field={field} />}
      </resumeForm.Field>
    </FormLayout>
  );
};

export default ResumeForm;
