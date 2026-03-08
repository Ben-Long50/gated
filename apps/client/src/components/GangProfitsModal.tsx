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
import BtnIcon from './buttons/BtnIcon';
import Icon from '@mdi/react';
import { mdiMinus, mdiPlus } from '@mdi/js';
import useDistributeProfitsMutation from 'src/hooks/gang hooks/useDistributeProfitsMutation/useDistributeProfitsMutation';

const GangProfitsModal = () => {
  const { campaignId, gangId } = useParams();

  const { gang, characters } = useGang(Number(gangId));

  const distributeProfits = useDistributeProfitsMutation(
    Number(campaignId),
    Number(gangId),
  );

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
      <h1>Distribute Gang Profits</h1>
      <div className="flex w-full items-center justify-between gap-8">
        <ArrowHeader2 title="Gang Profits" />
        <h1 className="!text-accent">{gang?.profits}</h1>
      </div>

      <div className="flex w-full flex-col gap-4">
        <Divider />
        <div className="flex w-full items-center justify-between gap-8">
          <ArrowHeader3 title="Player Characters" />
          <p>Profits</p>
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
                <BtnIcon
                  active={character.profits > 0}
                  path={mdiMinus}
                  onClick={() => {
                    distributeProfits.mutate({
                      characterId: character.id,
                      value: -1,
                    });
                  }}
                />
                <p className="w-8 text-center text-2xl">{character.profits}</p>
                <BtnIcon
                  active={gang?.profits > 0}
                  path={mdiPlus}
                  onClick={() => {
                    distributeProfits.mutate({
                      characterId: character.id,
                      value: 1,
                    });
                  }}
                />
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
                <BtnIcon
                  active={character.profits > 0}
                  path={mdiMinus}
                  onClick={() => {
                    distributeProfits.mutate({
                      characterId: character.id,
                      value: -1,
                    });
                  }}
                />
                <p className="w-8 text-center text-2xl">{character.profits}</p>
                <BtnIcon
                  active={gang?.profits > 0}
                  path={mdiPlus}
                  onClick={() => {
                    distributeProfits.mutate({
                      characterId: character.id,
                      value: 1,
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default GangProfitsModal;
