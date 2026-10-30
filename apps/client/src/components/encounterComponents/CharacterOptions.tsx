import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from '../characterComponents/CharacterPictureRound';
import ArrowHeader3 from '../ArrowHeader3';
import { useContext, useRef, useState } from 'react';
import EquippedItems from './EquippedItems';
import BtnRect from '../buttons/BtnRect';
import ActionIcon from '../icons/ActionIcon';
import ReactionIcon from '../icons/ReactionIcon';
import CharacterStatBars from '../characterComponents/CharacterStatBars';
import { LayoutContext } from 'src/contexts/LayoutContext';
import ThemeContainer from '../ThemeContainer';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { CampaignContext } from 'src/contexts/CampaignContext';
import { ThemeContext } from 'src/contexts/ThemeContext';
import HandIcon from '../icons/HandIcon';
import { socket } from 'src/socket';
import InputSelectField from '../formFields/InputSelectField';
import useCombatStore from 'src/stores/combatStore';
import { EncounterContext } from 'src/contexts/EncounterContext';
import usePassAllReactionsMutation from 'src/hooks/encounter hooks/usePassAllReactionsMutation/usePassAllReactionsMutation';
import useScheduleReactionMutation from 'src/hooks/encounter hooks/useScheduleReactionMutation/useScheduleReactionMutation';
import usePassReactionMutation from 'src/hooks/encounter hooks/usePassReactionMutation/usePassReactionMutation';
import useFinishReactionMutation from 'src/hooks/encounter hooks/useFinishReactionMutation/useFinishReactionMutation';
import FootIcon from '../icons/FootIcon';
import useCharacterQueries from 'src/hooks/character hooks/useUpdateCharacterLevelMutation/useCharactersQuery/useCharacterQueries';
import IconBtnMedium from '../buttons/IconBtnMedium';
import StatBarContainer from '../StatBarContainer';
import Icon from '@mdi/react';
import { mdiSync } from '@mdi/js';

const CharacterOptions = ({
  setActionSidebar,
  characterOptions,
}: {
  setActionSidebar: (state: boolean) => void;
  characterOptions: boolean;
}) => {
  const { mobile } = useContext(LayoutContext);
  const { gameMaster } = useContext(CampaignContext);
  const {
    combat,
    resetTargetMap,
    isFetching,
    setIsFetching,
    encounterPermissions,
    activeCharacter,
    controlledCharacterId,
    setControlledCharacterId,
    handleAdvanceTurn,
    resetRolls,
    resetForms,
  } = useContext(EncounterContext);

  const { campaignId, encounterId } = useParams();
  const navigate = useNavigate();

  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);

  const [visible, setVisible] = useState(false);

  const { filteredCharacter: character } = useCharacter(controlledCharacterId);

  const { characters, isLoading } = useCharacterQueries(combat.turnOrder);

  const passAllReactions = usePassAllReactionsMutation(
    Number(campaignId),
    Number(encounterId),
  );
  const scheduleReaction = useScheduleReactionMutation(
    Number(campaignId),
    Number(encounterId),
  );
  const passReaction = usePassReactionMutation(
    Number(campaignId),
    Number(encounterId),
  );
  const finishReaction = useFinishReactionMutation(
    Number(campaignId),
    Number(encounterId),
  );

  const setItem = useCombatStore((state) => state.setItem);
  const setRangeData = useCombatStore((state) => state.setRangeData);

  if (isLoading) {
    return;
  }

  return (
    <div
      className={`${visible ? 'gap-4' : 'gap-0'} bg-base shadow-color timing relative mx-auto flex w-full max-w-5xl flex-col rounded-md p-4`}
      onMouseEnter={() => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        setVisible(true);
      }}
      onMouseLeave={(e) => {
        if (!inputRef.current?.contains(e.target)) {
          timerRef.current = setTimeout(() => setVisible(false), 100);
        }
      }}
    >
      {gameMaster && (
        <div
          className={`${visible ? 'max-h-24' : 'max-h-0 overflow-hidden'} timing flex w-full items-center gap-4`}
        >
          <InputSelectField
            label="Switch Character"
            reverse={true}
            options={characters}
            value={controlledCharacterId}
            onChange={(value) => {
              setControlledCharacterId(value.id);
              setItem(null);
            }}
          />
          <IconBtnMedium
            tooltip="Switch to Active"
            onClick={() => {
              setControlledCharacterId(activeCharacter.id);
              setItem(null);
            }}
          >
            <CharacterPictureRound
              className="group-hover:border-accent group-hover:border-2"
              key={activeCharacter.id}
              character={activeCharacter}
            />
          </IconBtnMedium>
        </div>
      )}
      <div
        className={`${visible ? 'gap-4' : 'gap-0 overflow-hidden'} timing flex flex-col items-center justify-start`}
      >
        <div className="timing grid w-full grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4">
          <CharacterPictureRound key={character?.id} character={character} />
          <StatBarContainer size="small">
            <CharacterStatBars
              size="small"
              characterId={controlledCharacterId}
              stats={{
                currentHealth: character?.stats.currentHealth,
                maxHealth: character?.stats.maxHealth,
                currentSanity: character?.stats.currentSanity,
                maxSanity: character?.stats.maxSanity,
              }}
              cardWidth={300}
            />
          </StatBarContainer>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className={`flex items-center gap-2`}>
              <ActionIcon className={`text-primary size-7 shrink-0`} />
              <p className={`w-10 text-center`}>
                {character?.stats.currentActions} / {character?.stats.actions}
              </p>
            </div>
            <div className={`flex items-center gap-2`}>
              <ReactionIcon className={`text-primary size-7 shrink-0`} />
              <p className={`w-10 text-center`}>
                {character?.stats.currentReactions} /{' '}
                {character?.stats.reactions}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className={`flex items-center gap-2`}>
              <HandIcon className={`text-primary size-7 shrink-0`} />
              <p className={`w-10 text-center`}>
                {character?.stats.currentHands} / {character?.stats.hands}
              </p>
            </div>
            <div className={`flex items-center gap-2`}>
              <FootIcon className={`text-primary size-7 shrink-0`} />
              <p className={`w-10 text-center`}>
                {character?.stats.currentFeet} / {character?.stats.feet}
              </p>
            </div>
          </div>

          <IconBtnMedium
            tooltip="Status Reset"
            onClick={() => navigate('modal/reset')}
          >
            <Icon path={mdiSync} />
          </IconBtnMedium>
        </div>
        <EquippedItems
          className={`${visible ? 'max-h-60' : 'max-h-0'} timing overflow-hidden`}
          setActionSidebar={setActionSidebar}
        />
      </div>
      <div
        className={`${visible ? 'max-h-24' : 'max-h-0 overflow-hidden'} timing flex w-full gap-4`}
      >
        {encounterPermissions &&
          controlledCharacterId === activeCharacter?.id &&
          combat.combatPhase === 'reaction' && (
            <BtnRect
              className="w-full"
              ariaLabel="Close"
              type="button"
              onClick={() => navigate('actionQueue')}
            >
              Action Queue
            </BtnRect>
          )}
        {controlledCharacterId === activeCharacter?.id &&
          combat.combatPhase === 'action' && (
            <BtnRect
              className="w-full"
              ariaLabel="Pass turn"
              type="button"
              active={!isFetching}
              onClick={() => {
                setIsFetching(true);
                resetRolls();
                resetForms();
                resetTargetMap();
                setRangeData(null);
                setItem(null);
                handleAdvanceTurn();
                socket.emit('resetBoard', {
                  encounterId: Number(encounterId),
                });
              }}
            >
              Pass Turn
            </BtnRect>
          )}
        {gameMaster &&
          combat.combatPhase === 'reaction' &&
          combat.passes.length < combat.turnOrder.length - 1 &&
          controlledCharacterId === activeCharacter?.id && (
            <BtnRect
              className="w-full"
              ariaLabel="Pass All Reactions"
              type="button"
              active={!isFetching}
              onClick={() => {
                setIsFetching(true);
                passAllReactions.mutate();
              }}
            >
              Pass All Reactions
            </BtnRect>
          )}

        {!combat.reactions.includes(controlledCharacterId) &&
          !combat.passes.includes(controlledCharacterId) &&
          activeCharacter?.id !== controlledCharacterId &&
          combat.combatPhase === 'reaction' && (
            <>
              <BtnRect
                className="w-full"
                type="button"
                ariaLabel="Make reaction"
                active={!isFetching}
                onClick={() => {
                  setIsFetching(true);
                  scheduleReaction.mutate(controlledCharacterId);
                }}
              >
                Make Reaction
              </BtnRect>
              <BtnRect
                className="w-full"
                type="button"
                ariaLabel="Pass"
                active={!isFetching}
                onClick={() => {
                  setIsFetching(true);
                  passReaction.mutate(controlledCharacterId);
                }}
              >
                Pass
              </BtnRect>
            </>
          )}
        {combat.reactions.includes(controlledCharacterId) && (
          <BtnRect
            className="w-full"
            ariaLabel="Pass Reaction"
            type="button"
            active={!isFetching}
            onClick={() => {
              setIsFetching(true);
              finishReaction.mutate(controlledCharacterId);
            }}
          >
            Pass Reaction
          </BtnRect>
        )}
        {gameMaster && !activeCharacter && (
          <BtnRect
            ariaLabel="Open initiative modal"
            type="button"
            onClick={() => navigate('modal/initiative')}
          >
            Start Combat
          </BtnRect>
        )}
      </div>
    </div>
  );
};

export default CharacterOptions;
