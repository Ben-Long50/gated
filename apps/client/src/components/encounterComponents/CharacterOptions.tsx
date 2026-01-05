import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from '../CharacterPictureRound';
import ArrowHeader3 from '../ArrowHeader3';
import { useContext, useRef, useState } from 'react';
import EquippedItems from './EquippedItems';
import BtnRect from '../buttons/BtnRect';
import ActionIcon from '../icons/ActionIcon';
import ReactionIcon from '../icons/ReactionIcon';
import CharacterStatBars from '../CharacterStatBars';
import { LayoutContext } from 'src/contexts/LayoutContext';
import ThemeContainer from '../ThemeContainer';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { CampaignContext } from 'src/contexts/CampaignContext';
import { ThemeContext } from 'src/contexts/ThemeContext';
import HandIcon from '../icons/HandIcon';
import { socket } from 'src/socket';
import InputSelectField from '../InputSelectField';
import useCharacterQueries from 'src/hooks/useCharactersQuery/useCharacterQueries';
import useCombatStore from 'src/stores/combatStore';
import { EncounterContext } from 'src/contexts/EncounterContext';
import usePassAllReactionsMutation from 'src/hooks/encounter hooks/usePassAllReactionsMutation/usePassAllReactionsMutation';
import useScheduleReactionMutation from 'src/hooks/encounter hooks/useScheduleReactionMutation/useScheduleReactionMutation';
import usePassReactionMutation from 'src/hooks/encounter hooks/usePassReactionMutation/usePassReactionMutation';
import useFinishReactionMutation from 'src/hooks/encounter hooks/useFinishReactionMutation/useFinishReactionMutation';
import FootIcon from '../icons/FootIcon';

const CharacterOptions = ({
  setActionSidebar,
  characterOptions,
}: {
  setActionSidebar: (state: boolean) => void;
  characterOptions: boolean;
}) => {
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);
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
  const location = useLocation();
  const parts = location.pathname.split('/');

  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);

  const [visible, setVisible] = useState(false);

  const { filteredCharacter: character } = useCharacter(controlledCharacterId);

  const { characters } = useCharacterQueries(combat.turnOrder);

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

  const characterName = character?.lastName
    ? character?.firstName + ' ' + character?.lastName
    : character?.firstName;

  return (
    <ThemeContainer
      className={`${characterOptions ? 'visible opacity-100' : 'invisible opacity-0'} timing mx-auto w-full max-w-5xl`}
      borderColor={accentPrimary}
      chamfer="medium"
    >
      <div
        className={`${visible ? 'gap-4' : 'gap-0'} timing relative flex w-full flex-col p-4`}
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
          <InputSelectField
            ref={inputRef}
            className={`${visible ? 'max-h-24' : 'max-h-0 overflow-hidden'} timing`}
            label="Switch Character"
            reverse={true}
            options={characters}
            onChange={(value) => {
              setControlledCharacterId(value.id);
              setItem(null);
            }}
          />
        )}
        <div
          className={`${visible ? 'gap-4' : 'gap-0'} timing flex flex-col items-center justify-start overflow-hidden`}
        >
          <div className="timing grid w-full grid-cols-[auto_.5fr_1fr_auto] items-center gap-4">
            <CharacterPictureRound key={character?.id} character={character} />
            {!mobile && <ArrowHeader3 title={characterName} />}
            <div className="grid w-full grow grid-cols-[auto_auto_1fr_auto] place-items-center gap-2 gap-y-0">
              <CharacterStatBars
                size="large"
                characterId={controlledCharacterId}
                stats={{
                  currentHealth: character?.stats.currentHealth,
                  maxHealth: character?.stats.maxHealth,
                  currentSanity: character?.stats.currentSanity,
                  maxSanity: character?.stats.maxSanity,
                }}
                cardWidth={300}
              />
            </div>
            <button
              className={`timing hover:bg-secondary hover:border-accent flex flex-row justify-end gap-2 rounded-md border-2 border-transparent p-3 hover:shadow-md hover:shadow-black`}
              onClick={() => navigate('reset')}
            >
              <div className={`flex items-center gap-2`}>
                <ActionIcon className={`text-primary size-8 shrink-0`} />
                <h2 className={`size-6 text-center`}>
                  {character?.stats.currentActions}
                </h2>
              </div>
              <div className={`flex items-center gap-2`}>
                <ReactionIcon className={`text-primary size-8 shrink-0`} />
                <h2 className={`size-6 text-center`}>
                  {character?.stats.currentReactions}
                </h2>
              </div>
              <div className={`flex items-center gap-2`}>
                <HandIcon className={`text-primary size-8 shrink-0`} />
                <h2 className={`size-6 text-center`}>
                  {character?.stats.currentHands}
                </h2>
              </div>
              <div className={`flex items-center gap-2`}>
                <FootIcon className={`text-primary size-8 shrink-0`} />
                <h2 className={`size-6 text-center`}>
                  {character?.stats.currentFeet}
                </h2>
              </div>
            </button>
          </div>
          <EquippedItems
            className={`${visible ? 'max-h-40' : 'max-h-0'} timing overflow-hidden`}
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
              onClick={() => navigate('initiative')}
            >
              Start Combat
            </BtnRect>
          )}
        </div>
      </div>
      {parts.includes('reset') && <Outlet context={{ character }} />}
    </ThemeContainer>
  );
};

export default CharacterOptions;
