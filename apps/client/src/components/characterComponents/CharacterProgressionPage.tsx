import { mdiCheckCircleOutline, mdiCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import BtnRect from '../buttons/BtnRect';
import Loading from '../Loading';
import ArrowHeader3 from '../ArrowHeader3';
import Divider from '../Divider';
import useCharacter from 'src/hooks/useCharacter';
import CharacterPicture from './CharacterPicture';
import ExpandingList from '../ExpandingList';
import ArrowHeader4 from '../ArrowHeader4';
import ItemCardSmall from '../ItemCardSmall';
import updateCharacterLevelMutation from 'src/hooks/character hooks/useUpdateCharacterLevelMutation/useUpdateCharacterLevelMutation';
import PerkCard from '../PerkCard';
import AttributeList from '../AttributeList';
import { Perk } from 'src/types/perk';
import usePerkQueries from 'src/hooks/usePerkQueries/usePerkQueries';
import CharacterHeader from './CharacterHeader';
import calculateLevelBonus from 'src/utils/calculateLevelBonus';
import ThemeContainer from '../ThemeContainer';
import AttributeCard from '../AttributeCard';
import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import ArrowHeader2 from '../ArrowHeader2';
import IconBtnMedium from '../buttons/IconBtnMedium';
import ProgressionIcon from '../icons/ProgressionIcon';

const CharacterProgressionPage = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { characterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const changeLevel = updateCharacterLevelMutation();

  const {
    filteredCharacter: character,
    isLoading,
    isPending,
  } = useCharacter(Number(characterId));

  usePerkQueries(character?.perks?.map((perk) => perk.id) || []);

  if (isLoading || isPending) {
    return <Loading />;
  }

  return (
    <>
      <CharacterHeader character={character} />
      <div className="grid items-center gap-8 max-sm:grid-flow-row sm:grid-cols-[2fr,3fr]">
        {character?.generatedPicture?.publicId && (
          <CharacterPicture character={character} />
        )}

        {character?.playerCharacter ? (
          <div className="flex flex-col items-start gap-4">
            <div className="flex w-full grow flex-col items-center justify-start gap-4">
              <div className="bg-secondary flex w-full items-center justify-between gap-2 rounded-md p-4 shadow-md shadow-black">
                <ArrowHeader4
                  className="text-primary"
                  title="Attribute Points"
                />
                <p>
                  {character?.stats.usedAttributePoints} /{' '}
                  {character?.stats.attributePoints}
                </p>
              </div>
              <div className="bg-secondary flex w-full items-center justify-between gap-2 rounded-md p-4 shadow-md shadow-black">
                <ArrowHeader4 className="text-primary" title="Skill Points" />
                <p>
                  {character?.stats.usedSkillPoints} /{' '}
                  {character?.stats.skillPoints}
                </p>
              </div>
              <div className="bg-secondary flex w-full items-center justify-between gap-2 rounded-md p-4 shadow-md shadow-black">
                <ArrowHeader4 className="text-primary" title="Perks" />
                <p>
                  {character?.stats.usedPerkPoints} /{' '}
                  {character?.stats.perkPoints}
                </p>
              </div>
              <div className="bg-secondary flex w-full items-center justify-between gap-2 rounded-md p-4 shadow-md shadow-black">
                <ArrowHeader4 className="text-primary" title="Master Perks" />
                <p>
                  {character?.stats.usedMasterPerkPoints} /{' '}
                  {character?.stats.masterPerkPoints}
                </p>
              </div>
            </div>
            <BtnRect
              className="w-full"
              ariaLabel="Level up"
              onClick={() =>
                changeLevel.mutate({
                  characterId: Number(characterId),
                  levelChange: 1,
                })
              }
            >
              Level Up
            </BtnRect>
            <BtnRect
              className="w-full"
              ariaLabel="Level down"
              onClick={() =>
                changeLevel.mutate({
                  characterId: Number(characterId),
                  levelChange: -1,
                })
              }
            >
              Level Down
            </BtnRect>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-4">
            <ArrowHeader3 title="Distributed Points" />
            <Divider />
            <div className="flex w-full grow flex-col items-center justify-start gap-4">
              <div className="bg-secondary flex w-full items-center justify-between gap-2 rounded-md p-4 shadow-md shadow-black">
                <ArrowHeader4
                  className="text-primary"
                  title="Attribute Points"
                />
                <p>{character?.stats.usedAttributePoints}</p>
              </div>
              <div className="bg-secondary flex w-full items-center justify-between gap-2 rounded-md p-4 shadow-md shadow-black">
                <ArrowHeader4 className="text-primary" title="Skill Points" />
                <p>{character?.stats.usedSkillPoints}</p>
              </div>
              <div className="bg-secondary flex w-full items-center justify-between gap-2 rounded-md p-4 shadow-md shadow-black">
                <ArrowHeader4 className="text-primary" title="Perks" />
                <p>{character?.stats.usedPerkPoints}</p>
              </div>
              <div className="bg-secondary flex w-full items-center justify-between gap-2 rounded-md p-4 shadow-md shadow-black">
                <ArrowHeader4 className="text-primary" title="Master Perks" />
                <p>{character?.stats.usedMasterPerkPoints}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-8">
        {character?.characterLevelBonuses && character?.attributes && (
          <>
            <ArrowHeader2 title="Attributes & Skills" />
            <div className="mb-auto flex w-full grow flex-col gap-4 lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:gap-8">
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
          </>
        )}
        {character?.characterLevelBonuses && character?.perks.length > 0 && (
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
        {!character?.playerCharacter && (
          <BtnRect
            className="w-full"
            ariaLabel="Select level up bonus"
            onClick={() => navigate(`levelBonus?level=0`)}
          >
            Edit NPC Stat Bonuses
          </BtnRect>
        )}
      </div>
      <Divider />
      {character?.playerCharacter && (
        <div className="flex flex-col gap-4">
          <ExpandingList title="Level Bonuses" className="flex flex-col gap-4">
            {Array.from({ length: Number(character?.level) || 1 }).map(
              (_, index) => {
                const level = index + 1;

                const characterLevelBonus =
                  character?.characterLevelBonuses.find(
                    (bonus) => bonus.level === level,
                  );

                const {
                  skillPoints,
                  attributePoints,
                  perkPoints,
                  masterPerkPoints,
                } = calculateLevelBonus(level);

                return (
                  <div className="flex items-center gap-4">
                    <ItemCardSmall
                      key={index}
                      heading={
                        <div className="mr-4 flex w-full items-center justify-between gap-4">
                          <ArrowHeader4 title={level} className="w-12" />
                          {characterLevelBonus ? (
                            <Icon
                              path={mdiCheckCircleOutline}
                              size={1}
                              className="text-accent mr-auto"
                            />
                          ) : (
                            <Icon
                              path={mdiCircleOutline}
                              size={1}
                              className="mr-auto"
                            />
                          )}
                          <div className="flex flex-col gap-1">
                            {attributePoints > 0 && (
                              <div className="flex items-start justify-between gap-4">
                                <p className="grow">Attribute Points</p>
                                <p className="size-6 text-center">
                                  {attributePoints}
                                </p>
                              </div>
                            )}
                            {skillPoints > 0 && (
                              <div className="flex items-start justify-between gap-4">
                                <p className="grow">Skill Points</p>
                                <p className="size-6 text-center">
                                  {skillPoints}
                                </p>
                              </div>
                            )}
                            {perkPoints > 0 && (
                              <div className="flex items-start justify-between gap-4">
                                <p className="grow">Perks</p>
                                <p className="size-6 text-center">
                                  {perkPoints}
                                </p>
                              </div>
                            )}
                            {masterPerkPoints > 0 && (
                              <div className="flex items-start justify-between gap-4">
                                <p className="grow">Master Perks</p>
                                <p className="size-6 text-center">
                                  {masterPerkPoints}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      }
                    >
                      {!characterLevelBonus ? (
                        <p>Select a level up bonus</p>
                      ) : (
                        <div className="flex flex-col gap-4 p-4">
                          {characterLevelBonus &&
                            characterLevelBonus.attributes && (
                              <AttributeList
                                attributeTree={characterLevelBonus.attributes}
                              />
                            )}
                          {characterLevelBonus &&
                            characterLevelBonus.perks &&
                            characterLevelBonus.perks.map((perk: Perk) => (
                              <PerkCard perkId={perk.id} />
                            ))}
                        </div>
                      )}
                    </ItemCardSmall>
                    {!characterLevelBonus && (
                      <IconBtnMedium
                        tooltip="Select Level Bonus"
                        onClick={() => navigate(`levelBonus?level=${level}`)}
                      >
                        <ProgressionIcon />
                      </IconBtnMedium>
                    )}
                  </div>
                );
              },
            )}
          </ExpandingList>
          {character?.level < 12 && (
            <div className="flex w-full items-center gap-4">
              <Divider />
              <h4 className="whitespace-nowrap text-center">Next Level</h4>
              <Divider />
            </div>
          )}
          {Array.from({ length: 12 - character?.level }).map((_, index) => {
            const level = index + 1 + character?.level;

            const {
              skillPoints,
              attributePoints,
              perkPoints,
              masterPerkPoints,
            } = calculateLevelBonus(level);

            return (
              <ItemCardSmall
                className="pointer-events-none"
                key={index}
                heading={
                  <div className="flex w-full items-start justify-between gap-4">
                    <ArrowHeader4 title={level} className="w-12" />
                    <div className="flex flex-col gap-1">
                      {attributePoints > 0 && (
                        <div className="flex items-start justify-between gap-4">
                          <p className="grow">Attribute Points</p>
                          <p className="size-6 text-center">
                            {attributePoints}
                          </p>
                        </div>
                      )}
                      {skillPoints > 0 && (
                        <div className="flex items-start justify-between gap-4">
                          <p className="grow">Skill Points</p>
                          <p className="size-6 text-center">{skillPoints}</p>
                        </div>
                      )}
                      {perkPoints > 0 && (
                        <div className="flex items-start justify-between gap-4">
                          <p className="grow">Perks</p>
                          <p className="size-6 text-center">{perkPoints}</p>
                        </div>
                      )}
                      {masterPerkPoints > 0 && (
                        <div className="flex items-start justify-between gap-4">
                          <p className="grow">Master Perks</p>
                          <p className="size-6 text-center">
                            {masterPerkPoints}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                }
              />
            );
          })}
        </div>
      )}
      {parts.includes('levelBonus') && <Outlet />}
    </>
  );
};

export default CharacterProgressionPage;
