import { useContext, useState } from 'react';
import CharacterCard from './CharacterCard';
import CharacterCardAlt from './CharacterCardAlt';
import BtnRect from '../buttons/BtnRect';
import { Link } from 'react-router-dom';
import Loading from '../Loading';
import { Character } from 'src/types/character';
import { AuthContext } from '../../contexts/AuthContext';
import InputSelectField from '../formFields/InputSelectField';
import useCampaignsQuery from 'src/hooks/useCampaignsQuery/useCampaignsQuery';
import useCharacters from 'src/hooks/useCharacters';
import InputField from '../formFields/InputField';
import Icon from '@mdi/react';
import { mdiCropSquare, mdiGrid, mdiSync } from '@mdi/js';
import { useSearchParams, useParams } from 'react-router-dom';
import { camelCase, capitalCase } from 'change-case';

const CharacterList = ({
  characterIds,
  menu = true,
}: {
  characterIds?: number[];
  menu?: boolean;
}) => {
  const { user } = useContext(AuthContext);
  const { campaignId } = useParams();
  const [setSearchParams] = useSearchParams();
  const [cardType, setCardType] = useState<'large' | 'small'>('large');

  const characterIdList =
    characterIds || user.characters.map((character) => character.id);

  const {
    characters,
    query,
    campaignId: selectedCampaignId,
    setQuery,
    setCampaignId,
    isLoading,
  } = useCharacters(characterIdList);

  const { data: campaigns } = useCampaignsQuery();

  const availableCampaigns = campaignId
    ? campaigns?.filter((campaign) => campaign.id === Number(campaignId))
    : campaigns || [];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex w-full flex-col gap-4">
          {availableCampaigns && availableCampaigns?.length > 1 && (
            <InputSelectField
              label="Filter By Campaign"
              options={availableCampaigns}
              value={selectedCampaignId}
              onChange={(value) => setCampaignId(value.id)}
            />
          )}
          <div className="flex w-full items-center gap-4">
            <InputField
              label="Search Characters"
              value={query}
              onChange={(value) => setQuery(value)}
            />
            <button
              className="text-accent bg-tertiary shadow-color group grid size-12 shrink-0 place-items-center rounded-md p-1.5 shadow-md hover:underline"
              onClick={(e) => {
                e.preventDefault();
                setCampaignId(null);
                setQuery('');
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
        </div>

        {!characters || characters?.length === 0 ? (
          <>
            <p className="text-center">No Characters Found</p>
            <Link to="create">
              <BtnRect ariaLabel="Create character" type="button">
                Character creator
              </BtnRect>
            </Link>
          </>
        ) : (
          <div
            className={`${cardType === 'large' ? 'grid-cols-1' : 'grid-cols-3'} grid w-full gap-10`}
          >
            {characters.map((character: Character) =>
              cardType === 'large' ? (
                <CharacterCard
                  menu={menu}
                  key={character.id}
                  characterId={character.id}
                />
              ) : (
                <CharacterCardAlt
                  menu={menu}
                  key={character.id}
                  characterId={character.id}
                />
              ),
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CharacterList;
