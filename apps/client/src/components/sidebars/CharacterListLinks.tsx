import constructName from 'src/utils/constructName';
import CharacterIcon from '../icons/CharacterIcon';
import LinkListSidebar from './LinkListSidebar';
import SubLinkSidebar from './SubLinkSidebar';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import useCharacters from 'src/hooks/useCharacters';
import Loading from '../Loading';
import LinkSidebar from './LinkSidebar';
import CharacterPictureRound from '../characterComponents/CharacterPictureRound';
import { useSearchParams } from 'react-router-dom';
import CreateCharacterIcon from '../icons/CreateCharacterIcon';

const CharacterListLinks = () => {
  const { user } = useContext(AuthContext);

  const [searchParams] = useSearchParams();

  const characterType = searchParams.get('characterType');
  const npcTypes = searchParams.getAll('npcType');

  let playerCharacter = null;

  if (characterType && characterType === 'playerCharacter') {
    playerCharacter = true;
  } else if (characterType && characterType === 'nonPlayerCharacter') {
    playerCharacter = false;
  }

  const { characters, isLoading } = useCharacters(
    user.characters?.map((character) => character.id),
    playerCharacter,
    npcTypes,
  );

  return (
    <>
      <LinkListSidebar
        icon={
          <CharacterIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Character Categories"
      >
        <SubLinkSidebar title="All Characters" path="characters" />
        <SubLinkSidebar
          title="Player Characters"
          path="characters?characterType=playerCharacter"
        />
        <SubLinkSidebar
          title="Generic NPCs"
          path="characters?characterType=nonPlayerCharacter"
        />
        <SubLinkSidebar
          title="Shop NPCs"
          path="characters?characterType=nonPlayerCharacter&npcType=shop"
        />
        <SubLinkSidebar
          title="Template NPCs"
          path="characters?characterType=nonPlayerCharacter&npcType=template"
        />
      </LinkListSidebar>
      <LinkSidebar
        icon={
          <CreateCharacterIcon className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit" />
        }
        title="Create Character"
        path="characters/create"
      />

      {isLoading ? (
        <Loading size={1.5} />
      ) : (
        characters.map((character) => {
          const characterName = constructName(character);

          return (
            <LinkSidebar
              title={characterName}
              icon={<CharacterPictureRound character={character} />}
              path={`characters/${character.id}`}
            />
          );
        })
      )}
    </>
  );
};

export default CharacterListLinks;
