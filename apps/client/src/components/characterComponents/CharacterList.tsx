import { useContext, useState } from 'react';
import CharacterCard from './CharacterCard';
import BtnRect from '../buttons/BtnRect';
import { Link, useLocation } from 'react-router-dom';
import Loading from '../Loading';
import { Character } from 'src/types/character';
import { AuthContext } from '../../contexts/AuthContext';
import InputSelectField from '../formFields/InputSelectField';
import useCampaignsQuery from 'src/hooks/useCampaignsQuery/useCampaignsQuery';
import useCharacters from 'src/hooks/useCharacters';
import InputField from '../formFields/InputField';
import Icon from '@mdi/react';
import { mdiCropSquare, mdiGrid, mdiSync } from '@mdi/js';
import { useParams } from 'react-router-dom';
import IconBtnMedium from '../buttons/IconBtnMedium';
import { LayoutContext } from 'src/contexts/LayoutContext';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';

const CharacterList = ({
  characterIds,
  menu = false,
}: {
  characterIds?: number[];
  menu?: boolean;
}) => {
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);
  const { campaignId } = useParams();
  const [size, setSize] = useState<'small' | 'large'>('small');
  const location = useLocation();
  const parts = location.pathname.split('/');

  const cardSize = mobile || size === 'small' ? 'small' : 'large';

  const { data: campaign } = useCampaignQuery(Number(campaignId));

  const characterIdList =
    characterIds ||
    (campaign
      ? campaign.characters.map((character) => character.id)
      : user.characters.map((character) => character.id));

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
      <div className={`${mobile ? 'gap-4' : 'gap-8'} flex flex-col`}>
        <div className="flex w-full flex-col gap-4">
          {!parts.includes('codex') &&
            availableCampaigns &&
            availableCampaigns?.length > 1 && (
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
            {!mobile && (
              <IconBtnMedium
                onClick={() => {
                  if (size === 'large') {
                    setSize('small');
                  } else if (size === 'small') {
                    setSize('large');
                  }
                }}
                tooltip={size === 'large' ? 'Grid Display' : 'List Display'}
              >
                <Icon path={size === 'large' ? mdiGrid : mdiCropSquare} />
              </IconBtnMedium>
            )}
            <IconBtnMedium
              onClick={() => {
                setCampaignId(null);
                setQuery('');
              }}
              tooltip="Reset Search"
            >
              <Icon path={mdiSync} />
            </IconBtnMedium>
          </div>
        </div>

        {!characters || characters?.length === 0 ? (
          <p className="text-center">No Characters Found</p>
        ) : (
          <div
            className={`${mobile ? 'gap-4' : 'gap-8'} ${cardSize === 'large' ? 'w-full grid-cols-1' : 'grid-cols-[repeat(auto-fit,minmax(350px,1fr))]'} grid`}
          >
            {characters.map((character: Character, index: number) => (
              <CharacterCard
                menu={menu}
                size={cardSize}
                key={index}
                characterId={character.id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CharacterList;
