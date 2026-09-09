import Modal from '../modals/Modal';
import Loading from '../Loading';
import CharacterCardXSmall from './CharacterCardXSmall';
import useCodexCharactersQuery from 'src/hooks/useCodexCharactersQuery/useCodexCharactersQuery';
import IconBtnSmall from '../buttons/IconBtnSmall';
import NavTabs from '../NavTabs';
import BtnAuth from '../buttons/BtnAuth';
import useCharacters from 'src/hooks/useCharacters';
import { useParams, useSearchParams } from 'react-router-dom';
import useAddCharacterMutation from 'src/hooks/useCharacterAddMutation/useCharacterAddMutation';
import CreateCharacterIcon from '../icons/CreateCharacterIcon';

const CharacterAddModal = () => {
  const { campaignId, gangId } = useParams();
  const { data: codexCharacters, isLoading } = useCodexCharactersQuery();

  const [searchParams, setSearchParams] = useSearchParams();

  const addCharacter = useAddCharacterMutation(
    Number(campaignId),
    Number(gangId),
  );

  const characterIds = codexCharacters?.map((character) => character.id) ?? [];

  const { characters, params } = useCharacters(characterIds);

  if (isLoading) return <Loading />;

  return (
    <Modal>
      <h1>Add Characters</h1>
      <NavTabs>
        <BtnAuth
          active={params === 'nonPlayerCharacter '}
          onClick={() =>
            setSearchParams({ characterType: 'nonPlayerCharacter' })
          }
        >
          NPCs
        </BtnAuth>
        <BtnAuth
          active={params === 'nonPlayerCharacter goon'}
          onClick={() =>
            setSearchParams({
              characterType: 'nonPlayerCharacter',
              npcType: 'goon',
            })
          }
        >
          Goons
        </BtnAuth>
        <BtnAuth
          active={params === 'nonPlayerCharacter monster'}
          onClick={() =>
            setSearchParams({
              characterType: 'nonPlayerCharacter',
              npcType: 'monster',
            })
          }
        >
          Monsters
        </BtnAuth>
      </NavTabs>
      <div className="flex w-full flex-col gap-4">
        {characters?.map((character) => (
          <div
            className="flex w-full items-center justify-between gap-8"
            key={character.id}
          >
            <CharacterCardXSmall
              characterList={true}
              characterId={character.id}
              active={false}
            />

            <IconBtnSmall
              active={!addCharacter.isPending}
              tooltip={`Create ${character.name}`}
              onClick={() => addCharacter.mutate(character.id)}
            >
              {addCharacter.isPending ? (
                <Loading size={1.15} />
              ) : (
                <CreateCharacterIcon />
              )}
            </IconBtnSmall>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default CharacterAddModal;
