import { useContext } from 'react';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';
import {
  mdiAlphaTCircleOutline,
  mdiCheckCircleOutline,
  mdiCircleOutline,
  mdiCloseCircleOutline,
  mdiStorefrontOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import BtnRect from './buttons/BtnRect';
import Loading from './Loading';
import ArrowHeader1 from './ArrowHeader1';
import ArrowHeader3 from './ArrowHeader3';
import Divider from './Divider';
import useCharacter from 'src/hooks/useCharacter';
import CharacterPicture from './CharacterPicture';
import ExpandingList from './ExpandingList';
import ArrowHeader4 from './ArrowHeader4';
import ItemCardSmall from './ItemCardSmall';
import updateCharacterLevelMutation from 'src/hooks/character hooks/useUpdateCharacterLevelMutation/useUpdateCharacterLevelMutation';
import constructName from 'src/utils/constructName';
import PerkCard from './PerkCard';
import AttributeList from './AttributeList';
import getLevelBonusData from 'src/utils/getLevelBonusData';
import { Perk } from 'src/types/perk';
import usePerkQueries from 'src/hooks/usePerkQueries/usePerkQueries';
import NpcTypeList from './NpcTypeList';
import CharacterHeader from './CharacterHeader';

const ProgressionPage = () => {
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
      <div className="grid gap-8 max-sm:grid-flow-row sm:grid-cols-[1fr,_2fr]">
        {character?.picture.imageUrl && (
          <CharacterPicture character={character} />
        )}
        <ThemeContainer chamfer="medium" borderColor={accentPrimary}>
          <div className="flex flex-col items-start justify-around gap-4 p-4">
            <ArrowHeader3 title="Available Points" />
            <Divider className="!my-0 opacity-50" />
            <div className="flex w-full items-center justify-between gap-2">
              <ArrowHeader4 className="text-primary" title="Attribute Points" />
              <p>
                {character?.stats.usedAttributePoints} /{' '}
                {character?.stats.attributePoints}
              </p>
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <ArrowHeader4 className="text-primary" title="Skill Points" />
              <p>
                {character?.stats.usedSkillPoints} /{' '}
                {character?.stats.skillPoints}
              </p>
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <ArrowHeader4 className="text-primary" title="Perks" />
              <p>
                {character?.stats.usedPerkPoints} /{' '}
                {character?.stats.perkPoints}
              </p>
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <ArrowHeader4 className="text-primary" title="Master Perks" />
              <p>
                {character?.stats.usedMasterPerkPoints} /{' '}
                {character?.stats.masterPerkPoints}
              </p>
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
        </ThemeContainer>
      </div>
      <div className="flex flex-col gap-4">
        <ExpandingList title="Level Bonuses" className="flex flex-col gap-4">
          {Array.from({ length: character?.level }).map((_, index) => {
            const level = index + 1;

            const characterLevelBonus = character.characterLevelBonuses.find(
              (bonus) => bonus.level === level,
            );

            const {
              levelUpAttributePoints,
              levelUpSkillPoints,
              levelUpPerkPoints,
              levelUpMasterPerkPoints,
              levelBonusUsed,
            } = getLevelBonusData(character, level);

            return (
              <div className="flex items-center gap-4">
                <ItemCardSmall
                  key={index}
                  heading={
                    <div className="mr-4 flex w-full items-center justify-between gap-4">
                      <ArrowHeader4 title={level} className="w-12" />
                      {levelBonusUsed ? (
                        level > character.level ? (
                          <Icon
                            path={mdiCloseCircleOutline}
                            size={1}
                            className="text-error mr-auto"
                          />
                        ) : (
                          <Icon
                            path={mdiCheckCircleOutline}
                            size={1}
                            className="text-accent mr-auto"
                          />
                        )
                      ) : (
                        <Icon
                          path={mdiCircleOutline}
                          size={1}
                          className="mr-auto"
                        />
                      )}
                      <div className="flex flex-col gap-1">
                        {levelUpAttributePoints +
                          levelUpSkillPoints +
                          levelUpPerkPoints +
                          levelUpMasterPerkPoints <=
                          0 && <p>No Bonuses</p>}
                        {levelUpAttributePoints > 0 && (
                          <div className="flex items-start justify-between gap-4">
                            <p className="grow">Attribute Points</p>
                            <p className="size-6 text-center">
                              {levelUpAttributePoints}
                            </p>
                          </div>
                        )}
                        {levelUpSkillPoints > 0 && (
                          <div className="flex items-start justify-between gap-4">
                            <p className="grow">Skill Points</p>
                            <p className="size-6 text-center">
                              {levelUpSkillPoints}
                            </p>
                          </div>
                        )}
                        {levelUpPerkPoints > 0 && (
                          <div className="flex items-start justify-between gap-4">
                            <p className="grow">Perks</p>
                            <p className="size-6 text-center">
                              {levelUpPerkPoints}
                            </p>
                          </div>
                        )}
                        {levelUpMasterPerkPoints > 0 && (
                          <div className="flex items-start justify-between gap-4">
                            <p className="grow">Master Perks</p>
                            <p className="size-6 text-center">
                              {levelUpMasterPerkPoints}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  }
                >
                  {!levelBonusUsed && <p>Select a level up bonus</p>}
                  {levelBonusUsed && !characterLevelBonus ? (
                    <p>Legacy level up bonuses are not displayed</p>
                  ) : null}
                  {characterLevelBonus ? (
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
                  ) : null}
                </ItemCardSmall>
                {!levelBonusUsed && (
                  <BtnRect
                    className="w-80"
                    ariaLabel="Select level up bonus"
                    onClick={() => navigate(`levelBonus?level=${level}`)}
                  >
                    Select Level Up Bonus
                  </BtnRect>
                )}
              </div>
            );
          })}
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
            levelUpAttributePoints,
            levelUpSkillPoints,
            levelUpPerkPoints,
            levelUpMasterPerkPoints,
            levelBonusUsed,
          } = getLevelBonusData(character, level);

          return (
            <ItemCardSmall
              className="pointer-events-none"
              key={index}
              heading={
                <div className="flex w-full items-start justify-between gap-4">
                  <ArrowHeader4 title={level} className="w-12" />
                  {levelBonusUsed ? (
                    level > character.level ? (
                      <Icon
                        path={mdiCloseCircleOutline}
                        size={1}
                        className="text-error mr-auto"
                      />
                    ) : (
                      <Icon
                        path={mdiCheckCircleOutline}
                        size={1}
                        className="text-accent mr-auto"
                      />
                    )
                  ) : (
                    <Icon
                      path={mdiCircleOutline}
                      size={1}
                      className="mr-auto"
                    />
                  )}
                  <div className="flex flex-col gap-1">
                    {levelUpAttributePoints +
                      levelUpSkillPoints +
                      levelUpPerkPoints +
                      levelUpMasterPerkPoints <=
                      0 && <p>No Bonuses</p>}
                    {levelUpAttributePoints > 0 && (
                      <div className="flex items-start justify-between gap-4">
                        <p className="grow">Attribute Points</p>
                        <p className="size-6 text-center">
                          {levelUpAttributePoints}
                        </p>
                      </div>
                    )}
                    {levelUpSkillPoints > 0 && (
                      <div className="flex items-start justify-between gap-4">
                        <p className="grow">Skill Points</p>
                        <p className="size-6 text-center">
                          {levelUpSkillPoints}
                        </p>
                      </div>
                    )}
                    {levelUpPerkPoints > 0 && (
                      <div className="flex items-start justify-between gap-4">
                        <p className="grow">Perks</p>
                        <p className="size-6 text-center">
                          {levelUpPerkPoints}
                        </p>
                      </div>
                    )}
                    {levelUpMasterPerkPoints > 0 && (
                      <div className="flex items-start justify-between gap-4">
                        <p className="grow">Master Perks</p>
                        <p className="size-6 text-center">
                          {levelUpMasterPerkPoints}
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
      {parts.includes('levelBonus') && <Outlet context={{ parts }} />}
    </>
  );
};

export default ProgressionPage;
