import Modal from '../modals/Modal';
import Loading from '../Loading';
import NavTabs from '../NavTabs';
import BtnAuth from '../buttons/BtnAuth';
import { useParams } from 'react-router-dom';
import useAddCharacterMutation from 'src/hooks/useCharacterAddMutation/useCharacterAddMutation';
import useCharacters from 'src/hooks/useCharacters';
import useTemplateCharactersQuery from 'src/hooks/character hooks/useUpdateCharacterLevelMutation/useCharactersQuery/useTemplateCharactersQuery';
import Divider from '../Divider';
import CharacterList from './CharacterList';

const CharacterAddModal = () => {
  const { campaignId, gangId } = useParams();

  const addCharacter = useAddCharacterMutation(
    Number(campaignId),
    Number(gangId),
  );

  const { data, isLoading: templatesLoading } = useTemplateCharactersQuery();

  const {
    characters,
    filters,
    setFilters,
    isLoading: charactersLoading,
  } = useCharacters(data?.map((character) => character.id) ?? []);

  const isLoading = templatesLoading || charactersLoading;

  return (
    <Modal>
      <h1>Add Characters</h1>
      <Divider />
      <NavTabs className="grid-cols-3 grid-rows-2">
        <BtnAuth
          active={filters.playerCharacter === true}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              playerCharacter: true,
              npcTypes: [],
            }))
          }
        >
          Player Classes
        </BtnAuth>
        <BtnAuth
          active={
            filters.playerCharacter === false && filters.npcTypes?.length === 0
          }
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              playerCharacter: false,
              npcTypes: [],
            }))
          }
        >
          Unique NPCs
        </BtnAuth>
        <BtnAuth
          active={filters.npcTypes?.includes('goon')}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              playerCharacter: false,
              npcTypes: ['goon'],
            }))
          }
        >
          Goons
        </BtnAuth>
        <BtnAuth
          active={filters.npcTypes?.includes('shop')}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              playerCharacter: false,
              npcTypes: ['shop'],
            }))
          }
        >
          Merchants
        </BtnAuth>
        <BtnAuth
          active={filters.npcTypes?.includes('monster')}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              playerCharacter: false,
              npcTypes: ['monster'],
            }))
          }
        >
          Monsters
        </BtnAuth>
        <BtnAuth
          active={filters.npcTypes?.includes('template')}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              playerCharacter: false,
              npcTypes: ['template'],
            }))
          }
        >
          Templates
        </BtnAuth>
      </NavTabs>
      {isLoading ? (
        <Loading />
      ) : (
        <CharacterList
          characters={characters}
          filters={filters}
          setFilters={setFilters}
          isLoading={charactersLoading}
          onClick={(value: number) => {
            if (!addCharacter.isPending) {
              addCharacter.mutate(value);
            }
          }}
        />
      )}
    </Modal>
  );
};

export default CharacterAddModal;
