import { useContext, useState } from 'react';
import CharacterCard from './CharacterCard';
import Loading from '../Loading';
import { Character } from '@gated/shared';
import InputSelectField from '../formFields/InputSelectField';
import useCampaignsQuery from 'src/hooks/useCampaignsQuery/useCampaignsQuery';
import InputField from '../formFields/InputField';
import Icon from '@mdi/react';
import { mdiCropSquare, mdiGrid, mdiSync } from '@mdi/js';
import { useParams } from 'react-router-dom';
import IconBtnMedium from '../buttons/IconBtnMedium';
import { LayoutContext } from 'src/contexts/LayoutContext';
import useParts from 'src/hooks/useParts';

const CharacterList = ({
  characters,
  onClick,
  filters,
  setFilters,
  isLoading,
}: {
  characters: Character[];
  onClick?: (value: number) => void;
  filters: {
    playerCharacter: boolean | null;
    npcTypes: string[] | null;
    query: string | null;
    campaignId: number | null;
  };
  setFilters: ({}: {
    playerCharacter: boolean | null;
    npcTypes: string[] | null;
    query: string | null;
    campaignId: number | null;
  }) => void;
  isLoading?: boolean;
}) => {
  const { mobile } = useContext(LayoutContext);
  const { campaignId } = useParams();
  const [size, setSize] = useState<'small' | 'large'>('small');

  const { parts } = useParts();

  const cardSize = mobile || size === 'small' ? 'small' : 'large';

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
                value={filters.campaignId}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, campaignId: value }))
                }
              />
            )}
          <div className="flex w-full items-center gap-4">
            <InputField
              label="Search Characters"
              value={filters.query}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, query: value }))
              }
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
                setFilters((prev) => ({ ...prev, campaignId: null }));
                setFilters((prev) => ({ ...prev, query: '' }));
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
            className={`${mobile ? 'gap-4' : 'gap-8'} ${cardSize === 'large' ? 'w-full grid-cols-1' : 'grid-cols-[repeat(auto-fill,minmax(350px,1fr))]'} grid`}
          >
            {characters.map((character, index: number) => (
              <CharacterCard
                size={cardSize}
                key={index}
                characterId={character?.id}
                onClick={onClick}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CharacterList;
