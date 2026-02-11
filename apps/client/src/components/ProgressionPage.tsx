import { Fragment, useContext, useRef, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';
import {
  mdiAlphaTCircleOutline,
  mdiCheckCircleOutline,
  mdiCircleOutline,
  mdiCloseCircleOutline,
  mdiStorefrontOutline,
  mdiTriangleDown,
} from '@mdi/js';
import Icon from '@mdi/react';
import PerkCard from './PerkCard';
import AttributeCard from './AttributeCard';
import { LayoutContext } from '../contexts/LayoutContext';
import EvasionIcon from './icons/EvasionIcon';
import ArmorIcon from './icons/ArmorIcon';
import WardIcon from './icons/WardIcon';
import SpeedIcon from './icons/SpeedIcon';
import { Link, Outlet, useParams } from 'react-router-dom';
import BtnRect from './buttons/BtnRect';
import InjuryIcon from './icons/InjuryIcon';
import InsanityIcon from './icons/InsanityIcon';
import Loading from './Loading';
import ArrowHeader1 from './ArrowHeader1';
import ArrowHeader3 from './ArrowHeader3';
import Divider from './Divider';
import BtnAuth from './buttons/BtnAuth';
import useCharacter from 'src/hooks/useCharacter';
import CharacterPicture from './CharacterPicture';
import CharacterStatBars from './CharacterStatBars';
import { capitalCase } from 'change-case';
import ConditionTag from './ConditionTag';
import ExpandingList from './ExpandingList';
import NavTabs from './NavTabs';
import ArrowHeader4 from './ArrowHeader4';
import calculateLevelBonus from 'src/utils/calculateLevelBonus';
import ItemCardExpanding from './encounterComponents/ItemCardExpanding';
import ItemCardSmall from './ItemCardSmall';

const ProgressionPage = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { conditionId, characterId } = useParams();
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);

  const [infoVisibility, setInfoVisibility] = useState(mobile ? false : true);

  const cardRef = useRef(null);

  const {
    filteredCharacter: character,
    isLoading,
    isPending,
  } = useCharacter(Number(characterId));

  const characterName = character?.lastName
    ? character?.firstName + ' ' + character?.lastName
    : character?.firstName;

  const height =
    typeof character?.height === 'number'
      ? `${Math.floor(character?.height / 12)}' ${character?.height % 12}"`
      : character?.height;

  if (isLoading || isPending) {
    return <Loading />;
  }

  return (
    <div className="text-primary flex w-full max-w-5xl flex-col gap-8">
      <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
        <div className="flex w-full items-center gap-4">
          <ThemeContainer
            className="w-full grow"
            chamfer="small"
            borderColor={accentPrimary}
          >
            <div className="flex h-full w-full items-center justify-between gap-4 p-4">
              <div className="flex items-center justify-start gap-4">
                <ArrowHeader1 title={characterName} />
                {character?.npcTypes?.includes('shop') && (
                  <Icon
                    className="text-primary"
                    path={mdiStorefrontOutline}
                    size={1.5}
                  />
                )}
                {character?.npcTypes?.includes('template') && (
                  <Icon
                    className="text-primary"
                    path={mdiAlphaTCircleOutline}
                    size={1.5}
                  />
                )}
              </div>

              <h1 className="!text-accent">Level {character?.level}</h1>
            </div>
          </ThemeContainer>
        </div>
      </div>
      <div className="grid gap-8 max-sm:grid-flow-row sm:grid-cols-[1fr,_2fr]">
        {character?.picture.imageUrl && (
          <CharacterPicture character={character} />
        )}
        <ThemeContainer chamfer="medium" borderColor={accentPrimary}>
          <div className="flex flex-col items-start justify-around gap-4 p-4">
            <ArrowHeader3 title="Available Points" />
            <Divider className="!my-0 opacity-50" />
            <div className="flex w-full items-center justify-between gap-2">
              <ArrowHeader4 title="Attribute Points" />
              <p>
                {character?.stats.usedAttributePoints} /{' '}
                {character?.stats.attributePoints}
              </p>
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <ArrowHeader4 title="Skill Points" />
              <p>
                {character?.stats.usedSkillPoints} /{' '}
                {character?.stats.skillPoints}
              </p>
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <ArrowHeader4 title="Perks" />
              <p>
                {character?.stats.usedPerkPoints} /{' '}
                {character?.stats.perkPoints}
              </p>
            </div>
            <div className="flex w-full items-center justify-between gap-2">
              <ArrowHeader4 title="Master Perks" />
              <p>
                {character?.stats.usedMasterPerkPoints} /{' '}
                {character?.stats.masterPerkPoints}
              </p>
            </div>
          </div>
        </ThemeContainer>
      </div>
      <ThemeContainer chamfer="medium" borderColor={accentPrimary}>
        <div className="flex flex-col gap-4 p-4">
          <ExpandingList title="Level Bonuses" className="flex flex-col gap-4">
            {Array.from({ length: character?.level }).map((_, index) => {
              const level = index + 1;

              const {
                attributePoints,
                skillPoints,
                perkPoints,
                masterPerkPoints,
                availableAttributePoints,
                availableSkillPoints,
                availablePerkPoints,
                availableMasterPerkPoints,
              } = calculateLevelBonus(
                level,
                character?.attributes,
                character?.perks,
              );

              const {
                attributePoints: prevAttributePoints,
                skillPoints: prevSkillPoints,
                perkPoints: prevPerkPoints,
                masterPerkPoints: prevMasterPerkPoints,
              } = calculateLevelBonus(
                level - 1,
                character?.attributes,
                character?.perks,
              );

              const levelUpAttributePoints =
                attributePoints - prevAttributePoints;
              const levelUpSkillPoints = skillPoints - prevSkillPoints;
              const levelUpPerkPoints = perkPoints - prevPerkPoints;
              const levelUpMasterPerkPoints =
                masterPerkPoints - prevMasterPerkPoints;

              let outstandingPoints = 0;

              if (levelUpAttributePoints) {
                outstandingPoints += availableAttributePoints;
              }
              if (levelUpSkillPoints) {
                outstandingPoints += availableSkillPoints;
              }
              if (levelUpPerkPoints) {
                outstandingPoints += availablePerkPoints;
              }
              if (levelUpMasterPerkPoints) {
                outstandingPoints += availableMasterPerkPoints;
              }

              const levelBonusUsed = outstandingPoints <= 0;

              return (
                <ItemCardSmall
                  key={index}
                  heading={
                    <div className="mr-4 flex w-full items-start justify-between gap-4">
                      <ArrowHeader4 title={level} />
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
                  <p>Applied Bonus</p>
                </ItemCardSmall>
              );
            })}
          </ExpandingList>
          {character?.level < 12 && (
            <div className="flex w-full items-center gap-4">
              <Divider className="opacity-50" />
              <h4 className="whitespace-nowrap text-center">Next Level</h4>
              <Divider className="opacity-50" />
            </div>
          )}
          {Array.from({ length: 12 - character?.level }).map((_, index) => {
            const level = index + 1 + character?.level;

            const {
              attributePoints,
              skillPoints,
              perkPoints,
              masterPerkPoints,
              availableAttributePoints,
              availableSkillPoints,
              availablePerkPoints,
              availableMasterPerkPoints,
            } = calculateLevelBonus(
              level,
              character?.attributes,
              character?.perks,
            );

            const {
              attributePoints: prevAttributePoints,
              skillPoints: prevSkillPoints,
              perkPoints: prevPerkPoints,
              masterPerkPoints: prevMasterPerkPoints,
            } = calculateLevelBonus(
              level - 1,
              character?.attributes,
              character?.perks,
            );

            const levelUpAttributePoints =
              attributePoints - prevAttributePoints;
            const levelUpSkillPoints = skillPoints - prevSkillPoints;
            const levelUpPerkPoints = perkPoints - prevPerkPoints;
            const levelUpMasterPerkPoints =
              masterPerkPoints - prevMasterPerkPoints;

            let outstandingPoints = 0;

            if (levelUpAttributePoints) {
              outstandingPoints += availableAttributePoints;
            }
            if (levelUpSkillPoints) {
              outstandingPoints += availableSkillPoints;
            }
            if (levelUpPerkPoints) {
              outstandingPoints += availablePerkPoints;
            }
            if (levelUpMasterPerkPoints) {
              outstandingPoints += availableMasterPerkPoints;
            }

            const levelBonusUsed = outstandingPoints <= 0;

            return (
              <ItemCardSmall
                className="pointer-events-none"
                key={index}
                heading={
                  <div className="flex w-full items-start justify-between gap-4">
                    <ArrowHeader4 title={level} />
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
      </ThemeContainer>
    </div>
  );
};

export default ProgressionPage;
