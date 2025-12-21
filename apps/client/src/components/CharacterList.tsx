import { useContext } from 'react';
import CharacterCard from './CharacterCard';
import BtnRect from './buttons/BtnRect';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import ThemeContainer from './ThemeContainer';
import { useForm } from '@tanstack/react-form';
import { Character } from 'src/types/character';
import { ThemeContext } from '../contexts/ThemeContext';
import ArrowHeader2 from './ArrowHeader2';
import InputSelectField from './InputSelectField';
import useCampaignsQuery from 'src/hooks/useCampaignsQuery/useCampaignsQuery';
import useCharacters from 'src/hooks/useCharacters';
import InputField from './InputField';
import Icon from '@mdi/react';
import { mdiSync } from '@mdi/js';
import { Campaign } from 'src/types/campaign';
import useCharactersQuery from 'src/hooks/useCharactersQuery/useCharactersQuery';
import { useSearchParams } from 'react-router-dom';

const CharacterList = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const [searchParams] = useSearchParams();

  const characterType = searchParams.get('characterType');
  const includedNpcTypes = searchParams.getAll('includedNpcType');
  const excludedNpcTypes = searchParams.getAll('excludedNpcType');

  let playerCharacter = null;

  if (characterType === 'playerCharacter') {
    playerCharacter = true;
  } else if (characterType === 'nonPlayerCharacter') {
    playerCharacter = false;
  }

  const { data: characterIds, isLoading: idsLoading } = useCharactersQuery();

  const { characters, filterByCampaign, filterByQuery, isLoading } =
    useCharacters(
      characterIds,
      playerCharacter,
      includedNpcTypes,
      excludedNpcTypes,
    );

  const { data: campaigns } = useCampaignsQuery();

  const searchForm = useForm({
    defaultValues: {
      campaign: null as Campaign | null,
      query: '' as string,
    },
    onSubmit: ({ value }) => {},
  });

  if (isLoading || idsLoading) {
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
          <searchForm.Field name="campaign">
            {(field) => (
              <InputSelectField
                field={field}
                label="Filter By Campaign"
                options={campaigns || []}
                onChange={() => filterByCampaign(field.state.value.id)}
              />
            )}
          </searchForm.Field>
          <div className="flex w-full items-center gap-4">
            <searchForm.Field name="query">
              {(field) => (
                <InputField
                  field={field}
                  className="w-full"
                  label="Search Characters"
                  onChange={() => filterByQuery(field.state.value)}
                />
              )}
            </searchForm.Field>
            <button
              className="text-accent bg-tertiary shadow-color group grid size-12 shrink-0 place-items-center rounded-md p-1.5 shadow-md hover:underline"
              onClick={(e) => {
                e.preventDefault();
                searchForm.reset();
                filterByCampaign(null);
                filterByQuery('');
              }}
            >
              <Icon
                path={mdiSync}
                className="text-secondary group-hover:text-accent timing"
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
        <div className="grid w-full grid-flow-row gap-10">
          {characters?.map((character: Character) => (
            <CharacterCard key={character.id} characterId={character.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterList;
