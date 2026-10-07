import { useParams } from 'react-router-dom';
import useGang from 'src/hooks/useGang';
import ArrowHeader2 from './ArrowHeader2';
import Divider from './Divider';
import ArrowHeader3 from './ArrowHeader3';
import { Character } from 'src/types/character';
import CharacterCardXSmall from './characterComponents/CharacterCardXSmall';
import { mdiMinus, mdiPlus } from '@mdi/js';
import useDistributeProfitsMutation from 'src/hooks/gang hooks/useDistributeProfitsMutation/useDistributeProfitsMutation';
import { CampaignContext } from 'src/contexts/CampaignContext';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import useGangProfitsMutation from 'src/hooks/gang hooks/useGangProfitsMutation/useGangProfitsMutation';
import IconBtnSmall from './buttons/IconBtnSmall';
import Icon from '@mdi/react';

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
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((character) => {
      if (character?.playerCharacter) {
        playerCharacters.push(character);
      } else {
        nonPlayerCharacters.push(character);
      }
    });

  return (
    <>
      <h1>Distribute Gang Profits</h1>
      <div className="flex w-full items-center justify-between gap-8">
        <ArrowHeader2 title="Gang Profits" />
        <div className="flex items-center gap-8">
          {gameMaster && (
            <IconBtnSmall
              active={gang?.profits > 0 && gameMaster}
              tooltip="Decrease"
              onClick={() => {
                editGangProfits.mutate(-1);
              }}
            >
              <Icon path={mdiMinus} />
            </IconBtnSmall>
          )}
          <h1 className="!text-accent w-12 text-center">{gang?.profits}</h1>
          {gameMaster && (
            <IconBtnSmall
              active={gang?.profits >= 0 && gameMaster}
              tooltip="Increase"
              onClick={() => {
                editGangProfits.mutate(1);
              }}
            >
              <Icon path={mdiPlus} />
            </IconBtnSmall>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col gap-4">
        <Divider />
        <ArrowHeader3 title="Player Characters" />

        <div className="grid grid-cols-[1fr,auto,auto,auto] items-center gap-x-8 gap-y-4">
          {playerCharacters.map((character: Character) => (
            <>
              <CharacterCardXSmall
                key={character.id}
                className="grow"
                character={character}
                characterList={true}
                active={false}
              />
              <IconBtnSmall
                active={
                  character.profits > 0 &&
                  (user?.id === character.userId || gameMaster)
                }
                tooltip="Give To Gang"
                onClick={() => {
                  distributeProfits.mutate({
                    characterId: character.id,
                    value: -1,
                  });
                }}
              >
                <Icon path={mdiMinus} />
              </IconBtnSmall>
              <p className="justify-self-end text-2xl">
                {character.profits.toLocaleString()} p
              </p>
              <IconBtnSmall
                active={
                  gang?.profits && (user?.id === character.userId || gameMaster)
                }
                tooltip="Take From Gang"
                onClick={() => {
                  distributeProfits.mutate({
                    characterId: character.id,
                    value: 1,
                  });
                }}
              >
                <Icon path={mdiPlus} />
              </IconBtnSmall>
            </>
          ))}
        </div>
        <Divider />
        <ArrowHeader3 title="Non-Player Characters" />
        <div className="grid grid-cols-[1fr,auto,auto,auto] items-center gap-x-8 gap-y-4">
          {nonPlayerCharacters.map((character: Character) => (
            <>
              <CharacterCardXSmall
                key={character.id}
                character={character}
                characterList={true}
                active={false}
              />
              <IconBtnSmall
                active={
                  character.profits > 0 &&
                  (user?.id === character.userId || gameMaster)
                }
                tooltip="Give To Gang"
                onClick={() => {
                  distributeProfits.mutate({
                    characterId: character.id,
                    value: -1,
                  });
                }}
              >
                <Icon path={mdiMinus} />
              </IconBtnSmall>
              <p className="justify-self-end text-2xl">
                {character.profits.toLocaleString()} p
              </p>
              <IconBtnSmall
                active={
                  gang?.profits > 0 &&
                  (user?.id === character.userId || gameMaster)
                }
                tooltip="Take From Gang"
                onClick={() => {
                  distributeProfits.mutate({
                    characterId: character.id,
                    value: 1,
                  });
                }}
              >
                <Icon path={mdiPlus} />
              </IconBtnSmall>
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default GangProfitsModal;
