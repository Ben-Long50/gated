import Modal from '../modals/Modal';
import Loading from '../Loading';
import CharacterCardXSmall from './CharacterCardXSmall';
import IconBtnSmall from '../buttons/IconBtnSmall';
import NavTabs from '../NavTabs';
import BtnAuth from '../buttons/BtnAuth';
import { useParams, useSearchParams } from 'react-router-dom';
import useAddCharacterMutation from 'src/hooks/useCharacterAddMutation/useCharacterAddMutation';
import CreateCharacterIcon from '../icons/CreateCharacterIcon';
import useCharacters from 'src/hooks/useCharacters';
import useTemplateCharactersQuery from 'src/hooks/character hooks/useUpdateCharacterLevelMutation/useCharactersQuery/useTemplateCharactersQuery';
import Divider from '../Divider';
import { Character } from 'src/types/character';

const CharacterAddModal = () => {
  const { campaignId, gangId } = useParams();

  const addCharacter = useAddCharacterMutation(
    Number(campaignId),
    Number(gangId),
  );

  const { data, isLoading } = useTemplateCharactersQuery();

  const { characters, filters, setFilters } = useCharacters(
    data?.map((character) => character.id) ?? [],
  );

  return (
    <Modal>
      <h1>Add Characters</h1>
      <Divider />
      <NavTabs className="grid-cols-5">
        <BtnAuth
          active={filters.playerCharacter === true}
          onClick={() => setFilters({ playerCharacter: true, npcTypes: [] })}
        >
          Player Classes
        </BtnAuth>
        <BtnAuth
          active={
            filters.playerCharacter === false && filters.npcTypes?.length === 0
          }
          onClick={() => setFilters({ playerCharacter: false, npcTypes: [] })}
        >
          Unique NPCs
        </BtnAuth>
        <BtnAuth
          active={filters.npcTypes?.includes('goon')}
          onClick={() =>
            setFilters({ playerCharacter: false, npcTypes: ['goon'] })
          }
        >
          Goons
        </BtnAuth>
        <BtnAuth
          active={filters.npcTypes?.includes('shop')}
          onClick={() =>
            setFilters({ playerCharacter: false, npcTypes: ['shop'] })
          }
        >
          Merchants
        </BtnAuth>
        <BtnAuth
          active={filters.npcTypes?.includes('monster')}
          onClick={() =>
            setFilters({ playerCharacter: false, npcTypes: ['monster'] })
          }
        >
          Monsters
        </BtnAuth>
      </NavTabs>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex w-full flex-col gap-4">
          {characters?.map((character: Character) => (
            <div
              className="flex w-full items-center justify-between gap-8"
              key={character.id}
            >
              <CharacterCardXSmall
                characterList={true}
                character={character}
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
      )}
    </Modal>
  );
};

export default CharacterAddModal;
