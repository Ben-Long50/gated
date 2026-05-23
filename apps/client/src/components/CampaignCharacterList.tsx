import CharacterCard from './characterComponents/CharacterCard';
import { useParams, useSearchParams } from 'react-router-dom';
import Loading from './Loading';
import { Character } from 'src/types/character';
import useCampaignQuery from '../hooks/useCampaignQuery/useCampaignQuery';
import useCampaignCharacters from 'src/hooks/useCampaignCharacters';
import { useForm } from '@tanstack/react-form';
import Icon from '@mdi/react';
import { mdiSync } from '@mdi/js';
import InputField from './formFields/InputField';
import ArrowHeader1 from './ArrowHeader1';
import ThemeContainer from './ThemeContainer';
import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import ArrowHeader2 from './ArrowHeader2';

const CampaignCharacterList = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { campaignId } = useParams();
  const [searchParams] = useSearchParams();

  const characterType = searchParams.get('list');

  const { data: campaign, isLoading: campaignLoading } = useCampaignQuery(
    Number(campaignId),
  );

  const {
    playerCharacters,
    nonPlayerCharacters,
    query,
    setQuery,
    isLoading: charactersLoading,
  } = useCampaignCharacters(
    campaign?.characters.map((character) => character.id) || [],
  );

  const isLoading = campaignLoading || charactersLoading;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex w-full max-w-7xl flex-col items-center gap-8">
      <ThemeContainer
        className="w-full"
        chamfer="medium"
        borderColor={accentPrimary}
      >
        <div className="flex w-full flex-col items-start gap-4 p-4">
          <ArrowHeader2 title="Search Characters" />
          <div className="flex w-full gap-4">
            <InputField
              label="Search Characters"
              value={query}
              onChange={(value) => setQuery(value)}
            />
            <button
              className="text-accent bg-tertiary shadow-color group grid size-12 shrink-0 place-items-center rounded-md p-1.5 shadow-md hover:underline"
              onClick={(e) => {
                e.preventDefault();
                setQuery('');
              }}
            >
              <Icon
                path={mdiSync}
                className="text-secondary group-hover:text-accent timing"
              />
            </button>
          </div>
        </div>
      </ThemeContainer>
      <div className="grid w-full grid-flow-row gap-8">
        {playerCharacters.length > 0 &&
          characterType !== 'nonPlayerCharacters' && (
            <>
              <ArrowHeader1 title="Player Characters" />
              {playerCharacters?.map((character: Character) => (
                <CharacterCard key={character.id} characterId={character.id} />
              ))}
            </>
          )}
        {nonPlayerCharacters.length > 0 &&
          characterType !== 'playerCharacters' && (
            <>
              <ArrowHeader1 title="Non-player Characters" />
              {nonPlayerCharacters?.map((character: Character) => (
                <CharacterCard key={character.id} characterId={character.id} />
              ))}
            </>
          )}
      </div>
    </div>
  );
};

export default CampaignCharacterList;
