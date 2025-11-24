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
import { useNavigate, useParams } from 'react-router-dom';
import { CampaignContext } from 'src/contexts/CampaignContext';
import { ThemeContext } from 'src/contexts/ThemeContext';
import HandIcon from '../icons/HandIcon';
import { socket } from 'src/socket';
import InputSelectField from '../InputSelectField';
import useCharacterQueries from 'src/hooks/useCharactersQuery/useCharacterQueries';
import useCombatStore from 'src/stores/combatStore';
import optimisticUpdateEncounter from 'src/utils/optimisticUpdateEncounter';
import { EncounterContext } from 'src/contexts/EncounterContext';

const CharacterOptions = ({
  setActionSidebar,
  characterOptions,
  setItemId,
}: {
  setActionSidebar: (state: boolean) => void;
  characterOptions: boolean;
  setItemId: (id: number) => void;
}) => {
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { gameMaster } = useContext(CampaignContext);
  const {
    combat,
    encounterPermissions,
    activeCharacter,
    controlledCharacterId,
    setControlledCharacterId,
    handleAdvanceTurn,
    resetRolls,
  } = useContext(EncounterContext);

  const { campaignId, encounterId } = useParams();
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);

  const [visible, setVisible] = useState(false);

  const { filteredCharacter: character } = useCharacter(controlledCharacterId);

  const { characters } = useCharacterQueries(combat.turnOrder);

  const setItem = useCombatStore((state) => state.setItem);
  const setTarget = useCombatStore((state) => state.setTarget);

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
          <div className="timing grid w-full grid-cols-[auto_auto_1fr_auto] items-center gap-4">
            <CharacterPictureRound key={character?.id} character={character} />
            {!mobile && (
              <ArrowHeader3
                title={`${character?.firstName} ${character?.lastName}`}
              />
            )}
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
            <div className={`timing flex flex-row justify-end gap-2`}>
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
            </div>
          </div>
          <EquippedItems
            className={`${visible ? 'max-h-40' : 'max-h-0'} timing overflow-hidden`}
            setActionSidebar={setActionSidebar}
            setItemId={setItemId}
          />
        </div>
        <div
          className={`${visible ? 'max-h-24' : 'max-h-0 overflow-hidden'} timing flex w-full gap-4`}
        >
          {encounterPermissions &&
            controlledCharacterId === activeCharacter?.id &&
            combat.phaseHistory[0]?.action && (
              <BtnRect
                className="w-full"
                ariaLabel="Close"
                type="button"
                onClick={() => navigate('actionQueue')}
              >
                Action Queue Results
              </BtnRect>
            )}
          {controlledCharacterId === activeCharacter?.id &&
            combat.combatPhase === 'action' && (
              <BtnRect
                className="w-full"
                ariaLabel="Pass turn"
                type="button"
                onClick={() => {
                  handleAdvanceTurn();
                  socket.emit('resetBoard', {
                    encounterId: Number(encounterId),
                  });
                  resetRolls();
                  setTarget(null);
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
                onClick={() => {
                  optimisticUpdateEncounter(Number(encounterId), {
                    reactions: [],
                    passes: combat.turnOrder.filter(
                      (id) => id !== activeCharacter.id,
                    ),
                  });

                  socket.emit('passAllReactions', {
                    campaignId: Number(campaignId),
                    encounterId: Number(encounterId),
                  });
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
                  onClick={() =>
                    socket.emit('scheduleReaction', {
                      campaignId: Number(campaignId),
                      encounterId: Number(encounterId),
                      characterId: controlledCharacterId,
                    })
                  }
                >
                  Make Reaction
                </BtnRect>
                <BtnRect
                  className="w-full"
                  type="button"
                  ariaLabel="Pass"
                  onClick={() =>
                    socket.emit('passReaction', {
                      campaignId: Number(campaignId),
                      encounterId: Number(encounterId),
                      characterId: controlledCharacterId,
                    })
                  }
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
              onClick={() => {
                socket.emit('finishReaction', {
                  campaignId: Number(campaignId),
                  encounterId: Number(encounterId),
                  characterId: controlledCharacterId,
                });
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
    </ThemeContainer>
  );
};

export default CharacterOptions;
