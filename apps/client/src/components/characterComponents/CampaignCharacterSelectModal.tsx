import Loading from '../Loading';
import NavTabs from '../NavTabs';
import BtnAuth from '../buttons/BtnAuth';
import { useParams } from 'react-router-dom';
import useCharacters from 'src/hooks/useCharacters';
import useTemplateCharactersQuery from 'src/hooks/character hooks/useUpdateCharacterLevelMutation/useCharactersQuery/useTemplateCharactersQuery';
import Divider from '../Divider';
import CharacterList from './CharacterList';
import useJoinCampaignMutation from 'src/hooks/useJoinCampaignMutation/useJoinCampaignMutation';
import { useContext, useState } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import { Character } from '@gated/shared';

const CampaignCharacterSelectModal = () => {
  const { user } = useContext(AuthContext);
  const { campaignId } = useParams();
  const [tab, setTab] = useState('player');

  const selectCampaignCharacter = useJoinCampaignMutation(Number(campaignId));

  const { data, isLoading: templatesLoading } = useTemplateCharactersQuery();

  const userCharacters =
    user.characters
      .filter((character) => character.playerCharacter && !character.campaignId)
      .map((character) => character.id) ?? [];

  const codexCharacters =
    data
      ?.filter((character) => character.playerCharacter)
      .map((character) => character.id) ?? [];

  const {
    characters,
    filters,
    setFilters,
    isLoading: charactersLoading,
  } = useCharacters([...userCharacters, ...codexCharacters]);

  const playerCharacters: Character[] = [];
  const prebuiltCharacters: Character[] = [];

  characters.forEach((character) =>
    character?.userId === user.id
      ? playerCharacters.push(character)
      : prebuiltCharacters.push(character),
  );

  const isLoading = templatesLoading || charactersLoading;

  return (
    <>
      <h1>Select Player Character</h1>
      <Divider />
      <NavTabs className="grid-cols-2">
        <BtnAuth active={tab === 'player'} onClick={() => setTab('player')}>
          Player Characters
        </BtnAuth>
        <BtnAuth active={tab === 'prebuilt'} onClick={() => setTab('prebuilt')}>
          Prebuilt Classes
        </BtnAuth>
      </NavTabs>
      {selectCampaignCharacter.isPending ? (
        <div className="mx-auto my-auto flex items-center gap-8">
          <Loading size={2} />
          <h2>Adding Character to Campaign</h2>
        </div>
      ) : (
        <CharacterList
          characters={
            tab === 'prebuilt' ? prebuiltCharacters : playerCharacters
          }
          filters={filters}
          setFilters={setFilters}
          isLoading={isLoading}
          onClick={(value: number) => {
            if (!selectCampaignCharacter.isPending) {
              selectCampaignCharacter.mutate(value);
            }
          }}
        />
      )}
    </>
  );
};

export default CampaignCharacterSelectModal;
