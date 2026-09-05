import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Loading from './Loading';
import { Link, useLocation, useParams } from 'react-router-dom';
import BtnRect from './buttons/BtnRect';
import BtnAuth from './buttons/BtnAuth';
import { LayoutContext } from '../contexts/LayoutContext';
import useCharacter from 'src/hooks/useCharacter';
import Divider from './Divider';
import NpcTypeList from './NpcTypeList';
import ArrowHeader2 from './ArrowHeader2';

const Resume = () => {
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);
  const { characterId } = useParams();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const state = query.get('state');
  const [resume, setResume] = useState(state || 'Backstory');

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
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center justify-start gap-4">
          <h2 className="text-5xl font-bold tracking-widest">
            {character?.name}
          </h2>
          <NpcTypeList npcTypes={character?.npcTypes} />
        </div>
        <p className="!text-accent text-5xl font-bold tracking-widest">
          {character?.level}
        </p>
      </div>
      <div
        className={`${mobile ? 'grid-rows-3 gap-2' : 'grid-cols-3 gap-4'} grid`}
      >
        <BtnAuth onClick={() => setResume('Backstory')}>Backstory</BtnAuth>
        <BtnAuth onClick={() => setResume('First Taste')}>First Taste</BtnAuth>
        <BtnAuth onClick={() => setResume('Bad Medicine')}>
          Bad Medicine
        </BtnAuth>
      </div>
      <Divider />
      <ArrowHeader2 title={resume} className="text-center" />
      {content ? (
        <>
          <div
            id="quill-display"
            className="ql-editor whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {character?.userId === user?.id && (
            <Link className="self-end" to="../resume/update">
              <button className="text-accent hover:underline">
                Update {resume}
              </button>
            </Link>
          )}
        </>
      ) : character?.userId === user?.id ? (
        <div className="flex w-full flex-col items-start gap-8">
          <p>
            You have not created a {resume.toLowerCase()} resume entry for{' '}
            {character?.name}. Click the button below to create one.
          </p>
          <Link className="w-full" to="../resume/update">
            <BtnRect
              className="w-full"
              type="button"
              ariaLabel={'Create ' + resume}
            >
              Update {resume}
            </BtnRect>
          </Link>
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
