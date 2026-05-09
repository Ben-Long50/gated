import { useContext, useState } from 'react';
import CharacterCard from './CharacterCard';
import CharacterCardAlt from './CharacterCardAlt';
import BtnRect from './buttons/BtnRect';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import ThemeContainer from './ThemeContainer';
import { Character } from 'src/types/character';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import ArrowHeader2 from './ArrowHeader2';
import InputSelectField from './InputSelectField';
import useCampaignsQuery from 'src/hooks/useCampaignsQuery/useCampaignsQuery';
import useCharacters from 'src/hooks/useCharacters';
import InputField from './InputField';
import Icon from '@mdi/react';
import {
  mdiCropSquare,
  mdiGrid,
  mdiGridLarge,
  mdiSquare,
  mdiSync,
} from '@mdi/js';
import { useSearchParams, useParams } from 'react-router-dom';

const CharacterList = ({ characterIds }: { characterIds?: number[] }) => {
  const { user } = useContext(AuthContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { campaignId } = useParams();
  const [searchParams] = useSearchParams();
  const [cardType, setCardType] = useState<'large' | 'small'>('large');

  const characterType = searchParams.get('characterType');
  const npcTypes = searchParams.getAll('npcType');

  let playerCharacter = null;

  if (characterType && characterType === 'playerCharacter') {
    playerCharacter = true;
  } else if (characterType && characterType === 'nonPlayerCharacter') {
    playerCharacter = false;
  }

  const characterIdList =
    characterIds || user.characters.map((character) => character.id);

  const { characters, filterByCampaign, filterByQuery, isLoading } =
    useCharacters(characterIdList, playerCharacter, npcTypes);

  const { data: campaigns } = useCampaignsQuery();

  const availableCampaigns = campaignId
    ? campaigns?.filter((campaign) => campaign.id === Number(campaignId))
    : campaigns || [];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex w-full max-w-7xl flex-col items-center gap-8">
      <h1 className="text-center">Characters</h1>
      <ThemeContainer
        className={`ml-auto w-full`}
        chamfer="medium"
        borderColor={accentPrimary}
      >
        <form className="flex w-full flex-col gap-4 p-4">
          <div className="grid w-full items-center gap-4 max-sm:grid-flow-row sm:grid-flow-col sm:gap-8">
            <ArrowHeader2 title="Character Options" />
          </div>
          {availableCampaigns && availableCampaigns?.length > 1 && (
            <InputSelectField
              label="Filter By Campaign"
              options={availableCampaigns}
              onChange={(campaign) => filterByCampaign(campaign.id)}
            />
          )}
          <div className="flex w-full items-center gap-4">
            <InputField
              className="w-full"
              label="Search Characters"
              onChange={(query) => filterByQuery(query)}
            />

            <button
              className="text-accent bg-tertiary shadow-color group grid size-12 shrink-0 place-items-center rounded-md p-1.5 shadow-md hover:underline"
              onClick={(e) => {
                e.preventDefault();
                filterByCampaign(null);
                filterByQuery('');
              }}
            >
              <Icon
                path={mdiSync}
                className="text-tertiary group-hover:text-accent timing"
              />
            </button>
            <button
              className="text-accent bg-tertiary shadow-color group grid size-12 shrink-0 place-items-center rounded-md p-1.5 shadow-md hover:underline"
              onClick={(e) => {
                e.preventDefault();
                if (cardType === 'large') {
                  setCardType('small');
                } else if (cardType === 'small') {
                  setCardType('large');
                }
              }}
            >
              <Icon
                path={cardType === 'large' ? mdiGrid : mdiCropSquare}
                className="text-tertiary group-hover:text-accent timing"
              />
            </button>
          </div>
        </form>
      </ThemeContainer>
      {!characters || characters?.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center gap-8">
          <h1 className="text-center">No Characters Found</h1>
          <Link to="create">
            <BtnRect ariaLabel="Create character" type="button">
              Character creator
            </BtnRect>
          </Link>
        </div>
      ) : (
        <div
          className={`${cardType === 'large' ? 'grid-cols-1' : 'grid-cols-3'} grid w-full gap-10`}
        >
          {characters
            ?.filter((character) => character !== undefined)
            .map((character: Character) =>
              cardType === 'large' ? (
                <CharacterCard key={character.id} characterId={character.id} />
              ) : (
                <CharacterCardAlt
                  key={character.id}
                  characterId={character.id}
                />
              ),
            )}
        </div>
      )}
    </div>
  );
};

export default CharacterList;
