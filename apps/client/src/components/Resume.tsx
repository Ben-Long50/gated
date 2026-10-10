import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Loading from './Loading';
import { useParams, useSearchParams } from 'react-router-dom';
import useCharacter from 'src/hooks/useCharacter';
import Divider from './Divider';
import BtnAuth from './buttons/BtnAuth';
import { useNavigateWithQuery } from 'src/hooks/useNavigateWithQuery';

const Resume = () => {
  const { user } = useContext(AuthContext);
  const { characterId } = useParams();
  const [searchParams] = useSearchParams();
  const resume = searchParams.get('state');
  const navigate = useNavigateWithQuery();

  const {
    filteredCharacter: character,
    isLoading,
    isPending,
  } = useCharacter(Number(characterId));

  let content;

  switch (resume) {
    case 'Backstory':
      content = character?.backstory?.html;
      break;
    case 'First Taste':
      content = character?.firstTaste?.html;
      break;
    case 'Bad Medicine':
      content = character?.badMedicine?.html;
      break;
    default:
      content = null;
      break;
  }

  if (isLoading || isPending) {
    return <Loading />;
  }

  return (
    <>
      <h1>{resume}</h1>
      <Divider />
      {content ? (
        <>
          <div
            id="quill-display"
            className="ql-editor whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {character?.userId === user?.id && (
            <BtnAuth onClick={() => navigate('update')}>
              Update {resume}
            </BtnAuth>
          )}
        </>
      ) : character?.userId === user?.id ? (
        <div className="flex w-full flex-col items-start gap-8">
          <p>
            You have not created a {resume.toLowerCase()} resume entry for{' '}
            {character?.name}. Click the button below to create one.
          </p>
          <BtnAuth onClick={() => navigate('update')}>Update {resume}</BtnAuth>
        </div>
      ) : (
        <h3 className="text-center">
          A {resume.toLowerCase()} resume entry for {character?.name} has not
          been created.
        </h3>
      )}
    </>
  );
};

export default Resume;
