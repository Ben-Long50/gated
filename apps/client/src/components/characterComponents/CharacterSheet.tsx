import { Fragment, useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import ThemeContainer from '../ThemeContainer';
import { ThemeContext } from '../../contexts/ThemeContext';
import { mdiCrown, mdiTriangleDown } from '@mdi/js';
import Icon from '@mdi/react';
import PerkCard from '../PerkCard';
import AttributeCard from '../AttributeCard';
import { LayoutContext } from '../../contexts/LayoutContext';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import BtnRect from '../buttons/BtnRect';
import Loading from '../Loading';
import ArrowHeader3 from '../ArrowHeader3';
import Divider from '../Divider';
import BtnAuth from '../buttons/BtnAuth';
import useCharacter from 'src/hooks/useCharacter';
import CharacterPicture from './CharacterPicture';
import CharacterStatBars from './CharacterStatBars';
import { capitalCase } from 'change-case';
import ConditionTag from '../ConditionTag';
import ExpandingList from '../ExpandingList';
import ArrowHeader4 from '../ArrowHeader4';
import StatBarContainer from '../StatBarContainer';
import constructName from 'src/utils/constructName';
import CharacterHeader from './CharacterHeader';
import NavTabs from '../NavTabs';
import ArrowHeader2 from '../ArrowHeader2';
import Inventory from '../Inventory';

const CharacterSheet = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { conditionId, characterId } = useParams();
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const size = mobile ? 'small' : 'large';

  const [infoVisibility, setInfoVisibility] = useState(mobile ? false : true);

  const { filteredCharacter: character, isLoading } = useCharacter(
    Number(characterId),
  );

  const height =
    typeof character?.height === 'number'
      ? `${Math.floor(character?.height / 12)}' ${character?.height % 12}"`
      : character?.height;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div
        className={`${mobile ? 'flex-col items-start' : 'flex-row items-center'} flex justify-between gap-8`}
      >
        <CharacterHeader character={character} />
        <div
          className={`${mobile ? 'w-full justify-between' : 'justify-end'} flex items-center gap-2 sm:gap-8`}
        >
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-primary text-xl font-semibold tracking-widest">
              Height
            </h3>
            <p className="text-xl">{height}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-primary text-xl font-semibold tracking-widest">
              Weight
            </h3>
            <p className="text-xl">{character?.weight} lbs</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-primary text-xl font-semibold tracking-widest">
              Age
            </h3>
            <p className="text-xl">{character?.age}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-primary text-xl font-semibold tracking-widest">
              Sex
            </h3>
            <p className="text-xl">{capitalCase(character?.sex)}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-xl">Profits</h3>
            <p className="text-xl">{character?.profits.toLocaleString()} p</p>
          </div>
        </div>
      </div>
      <Divider />
      <div className="grid gap-8 max-sm:grid-flow-row sm:grid-cols-2">
        {character?.generatedPictureId && (
          <CharacterPicture className="relative" character={character}>
            {character?.conditions.length > 0 && (
              <div
                className={`absolute bottom-2 left-2 flex grow flex-wrap items-center justify-start gap-1`}
              >
                {character?.conditions?.map((condition) => (
                  <Fragment key={condition.id}>
                    <ConditionTag key={condition.id} condition={condition} />
                    {characterId && Number(conditionId) === condition.id && (
                      <Outlet context={{ condition, parts }} />
                    )}
                  </Fragment>
                ))}
              </div>
            )}
          </CharacterPicture>
        )}
        <ThemeContainer
          chamfer="medium"
          className="mb-auto w-full"
          borderColor={accentPrimary}
          overflowHidden={true}
        >
          <div className="scrollbar-secondary-2 flex h-full flex-col gap-4 overflow-y-auto p-4">
            <div className="flex w-full items-center justify-between">
              <ArrowHeader3 title={constructName(character) + "'s Info"} />
              <button
                type="button"
                className="text-tertiary hover:underline"
                onClick={() => setInfoVisibility(!infoVisibility)}
              >
                {infoVisibility ? 'hide' : 'show'}
              </button>
            </div>
            {infoVisibility && (
              <>
                <div className="grid grid-cols-[auto_auto_1fr] items-center gap-x-8 gap-y-4">
                  <>
                    <h4>Character Type</h4>
                    <Icon
                      className="text-primary"
                      path={mdiTriangleDown}
                      size={0.375}
                      rotate={-90}
                    />
                    {character?.playerCharacter ? (
                      <p>Player Character</p>
                    ) : (
                      <p>Non-player Character</p>
                    )}
                  </>
                  {character ? (
                    <>
                      <h4>Campaign</h4>
                      <Icon
                        className="text-primary"
                        path={mdiTriangleDown}
                        size={0.375}
                        rotate={-90}
                      />
                      <p>{character?.campaign?.name || 'N/A'}</p>
                    </>
                  ) : (
                    <p>No campaign</p>
                  )}
                  {character ? (
                    <>
                      <h4>Gang</h4>
                      <Icon
                        className="text-primary"
                        path={mdiTriangleDown}
                        size={0.375}
                        rotate={-90}
                      />
                      {character.controlledGang ? (
                        <div className="flex items-center gap-4">
                          <Icon
                            path={mdiCrown}
                            className="text-secondary"
                            size={1}
                          />
                          <p>{character.controlledGang?.name}</p>
                        </div>
                      ) : (
                        <p>{character?.gang?.name || 'N/A'}</p>
                      )}
                    </>
                  ) : (
                    <p>No campaign</p>
                  )}
                </div>
                <Divider />
                {character?.playerCharacter ? (
                  <>
                    <BtnAuth onClick={() => navigate('resume?state=Backstory')}>
                      Backstory
                    </BtnAuth>
                    <BtnAuth
                      onClick={() => navigate('resume?state=First Taste')}
                    >
                      First Taste
                    </BtnAuth>
                    <BtnAuth
                      onClick={() => navigate('resume?state=Bad Medicine')}
                    >
                      Bad Medicine
                    </BtnAuth>
                  </>
                ) : (
                  <p>{character?.description || 'No NPC description'}</p>
                )}
              </>
            )}
          </div>
        </ThemeContainer>
      </div>
      <ArrowHeader2 title="Stats" />
      <StatBarContainer size={size}>
        <CharacterStatBars
          stats={character?.stats}
          size={size}
          characterId={character.id}
        />
      </StatBarContainer>
      <Divider />
      {character?.userId === null && (
        <>
          <ArrowHeader3 title="Starting Inventory" />
          <Inventory />
          {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
            <NavTabs className="grid-cols-1">
              <BtnAuth onClick={() => navigate('shop/global')}>Shop</BtnAuth>
            </NavTabs>
          )}
          <Divider />
        </>
      )}
      <ArrowHeader2 title="Attributes & Skills" />
      <div className="mb-auto flex w-full grow flex-col gap-6 lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:gap-10">
        {Object.entries(character?.attributes)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([attribute, { points, skills }]) => (
            <ThemeContainer
              key={attribute}
              chamfer="medium"
              borderColor={accentPrimary}
            >
              <div className="p-4">
                <AttributeCard
                  attribute={attribute}
                  points={points}
                  skills={skills}
                />
              </div>
            </ThemeContainer>
          ))}
      </div>
      {character?.perks && character?.perks.length > 0 && (
        <>
          <Divider />
          <ExpandingList
            title="Perks"
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            {character?.perks ? (
              character?.perks.map((perk) => (
                <PerkCard key={perk.id} perkId={perk.id} />
              ))
            ) : (
              <h2 className="pl-6">???</h2>
            )}
          </ExpandingList>
        </>
      )}
      {user?.id === character?.userId && (
        <>
          <Divider />
          <BtnRect
            type="button"
            className="w-full"
            ariaLabel="Update character information"
            onClick={() => navigate('update?mode=form')}
          >
            Update Character Info
          </BtnRect>
        </>
      )}
      {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') &&
        character?.userId === null && (
          <>
            <Divider />
            <div className="flex w-full flex-col gap-4">
              <BtnRect
                type="button"
                className="w-full"
                ariaLabel="Update codex character information"
                onClick={() => navigate('update?formType=codex&mode=form')}
              >
                Update Character Info
              </BtnRect>
              <BtnRect
                type="button"
                className="w-full"
                ariaLabel="Update codex character information"
                onClick={() =>
                  navigate('progression/levelBonus?formType=codex&mode=form')
                }
              >
                Update Progression Info
              </BtnRect>
            </div>
          </>
        )}
    </>
  );
};

export default CharacterSheet;
