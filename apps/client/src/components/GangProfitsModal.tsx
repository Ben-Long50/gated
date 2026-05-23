import { useParams } from 'react-router-dom';
import Modal from './modals/Modal';
import useGang from 'src/hooks/useGang';
import ArrowHeader2 from './ArrowHeader2';
import Divider from './Divider';
import ArrowHeader3 from './ArrowHeader3';
import { Character } from 'src/types/character';
import CharacterCardXSmall from './characterComponents/CharacterCardXSmall';
import BtnIcon from './buttons/BtnIcon';
import { mdiMinus, mdiPlus } from '@mdi/js';
import useDistributeProfitsMutation from 'src/hooks/gang hooks/useDistributeProfitsMutation/useDistributeProfitsMutation';
import { CampaignContext } from 'src/contexts/CampaignContext';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import useGangProfitsMutation from 'src/hooks/gang hooks/useGangProfitsMutation/useGangProfitsMutation';

const GangProfitsModal = () => {
  const { user } = useContext(AuthContext);
  const { gameMaster } = useContext(CampaignContext);
  const { campaignId, gangId } = useParams();

  const { gang, characters } = useGang(Number(gangId));

  const distributeProfits = useDistributeProfitsMutation(
    Number(campaignId),
    Number(gangId),
  );

  const editGangProfits = useGangProfitsMutation(
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
        <div className="flex items-center gap-8">
          {gameMaster && (
            <BtnIcon
              active={gang?.profits > 0 && gameMaster}
              path={mdiMinus}
              onClick={() => {
                editGangProfits.mutate(-1);
              }}
            />
          )}
          <h1 className="!text-accent w-12 text-center">{gang?.profits}</h1>
          {gameMaster && (
            <BtnIcon
              active={gameMaster}
              path={mdiPlus}
              onClick={() => {
                editGangProfits.mutate(1);
              }}
            />
          )}
        </div>
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
                  active={
                    character.profits > 0 &&
                    (user?.id === character.userId || gameMaster)
                  }
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
                  active={
                    gang?.profits &&
                    (user?.id === character.userId || gameMaster)
                  }
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
                  active={
                    character.profits > 0 &&
                    (user?.id === character.userId || gameMaster)
                  }
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
                  active={
                    gang?.profits > 0 &&
                    (user?.id === character.userId || gameMaster)
                  }
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
