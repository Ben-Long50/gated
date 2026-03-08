import { useParams } from 'react-router-dom';
import Modal from './modals/Modal';
import useGang from 'src/hooks/useGang';
import ArrowHeader2 from './ArrowHeader2';
import Divider from './Divider';
import ArrowHeader3 from './ArrowHeader3';
import { Character } from 'src/types/character';
import CharacterCardXSmall from './CharacterCardXSmall';
import BtnRect from './buttons/BtnRect';
import useUpdateCharacterLevelMutation from 'src/hooks/character hooks/useUpdateCharacterLevelMutation/useUpdateCharacterLevelMutation';

const CharacterLevelsModal = () => {
  const { gangId } = useParams();

  const { characters, levelData } = useGang(Number(gangId));

  const changeCharacterLevel = useUpdateCharacterLevelMutation();

  const playerCharacters = [] as Character[];
  const nonPlayerCharacters = [] as Character[];

  characters
    .sort((a, b) => a.firstName.localeCompare(b))
    .forEach((character) => {
      if (character.playerCharacter) {
        playerCharacters.push(character);
      } else {
        nonPlayerCharacters.push(character);
      }
    });

  return (
    <Modal>
      <h1>Level Up Characters</h1>
      <div className="flex w-full items-center justify-between gap-8">
        <ArrowHeader2 title="Gang Level" />
        <h1 className="!text-accent">{levelData.level}</h1>
      </div>

      <div className="flex w-full flex-col gap-4">
        <Divider />
        <div className="flex w-full items-center justify-between gap-8">
          <ArrowHeader3 title="Player Characters" />
          <p>Character Level</p>
        </div>
        <div className="flex flex-col gap-4">
          {playerCharacters.map((character: Character) => (
            <div className="flex items-center justify-between gap-8">
              <CharacterCardXSmall
                key={character.id}
                className="grow"
                characterId={character.id}
                characterList={true}
                active={false}
              />
              <div className="flex items-center gap-8">
                {levelData.level > character.level && (
                  <BtnRect
                    className="min-w-32"
                    type="button"
                    ariaLabel="Level up"
                    onClick={() => {
                      changeCharacterLevel.mutate({
                        characterId: character.id,
                        levelChange: 1,
                      });
                    }}
                  >
                    Level Up
                  </BtnRect>
                )}
                <h2>{character.level}</h2>
              </div>
            </div>
          ))}
        </div>
        <Divider />
        <ArrowHeader3 title="Non-Player Characters" />
        <div className="flex flex-col gap-4">
          {nonPlayerCharacters.map((character: Character) => (
            <div className="flex items-center justify-between gap-8">
              <CharacterCardXSmall
                key={character.id}
                characterId={character.id}
                characterList={true}
                active={false}
              />
              <div className="flex items-center gap-8">
                {levelData.level > character.level && (
                  <BtnRect
                    className="min-w-32"
                    type="button"
                    ariaLabel="Level up"
                    onClick={() => {
                      changeCharacterLevel.mutate({
                        characterId: character.id,
                        levelChange: 1,
                      });
                    }}
                  >
                    Level Up
                  </BtnRect>
                )}
                <h2>{character.level}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default CharacterLevelsModal;
