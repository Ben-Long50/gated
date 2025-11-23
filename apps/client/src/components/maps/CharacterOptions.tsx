import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from '../CharacterPictureRound';
import ArrowHeader3 from '../ArrowHeader3';
import { useContext, useState } from 'react';
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
        className={`relative flex w-full flex-col gap-4 p-4`}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {gameMaster && visible && (
          <InputSelectField
            label="Switch Character"
            reverse={true}
            options={characters}
            onChange={(value) => {
              setControlledCharacterId(value.id);
              setItem(null);
            }}
          />
        )}
        <div className="grid grid-cols-[1fr_auto] gap-8">
          <div className="flex flex-col items-center justify-start gap-4 overflow-hidden">
            <div className="grid w-full grid-cols-[auto_1fr_3fr] items-center gap-4">
              <CharacterPictureRound
                key={character?.id}
                character={character}
              />
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
            </div>
            {visible && (
              <EquippedItems
                setActionSidebar={setActionSidebar}
                setItemId={setItemId}
              />
            )}
          </div>
          <div
            className={`${visible ? 'flex-col justify-evenly' : 'flex-row justify-end'} flex gap-2`}
          >
            <div
              className={`${mobile || !visible ? 'gap-2' : 'gap-4'} flex items-center`}
            >
              <ActionIcon
                className={`${mobile || !visible ? 'size-7' : 'size-8'} text-primary shrink-0`}
              />
              <h2
                className={`${mobile || !visible ? 'size-6' : 'size-8'} text-center`}
              >
                {character?.stats.currentActions}
              </h2>
            </div>
            <div
              className={`${mobile || !visible ? 'gap-2' : 'gap-4'} flex items-center`}
            >
              <ReactionIcon
                className={`${mobile || !visible ? 'size-7' : 'size-8'} text-primary shrink-0`}
              />
              <h2
                className={`${mobile || !visible ? 'size-6' : 'size-8'} text-center`}
              >
                {character?.stats.currentReactions}
              </h2>
            </div>
            <div
              className={`${mobile || !visible ? 'gap-2' : 'gap-4'} flex items-center`}
            >
              <HandIcon
                className={`${mobile || !visible ? 'size-7' : 'size-8'} text-primary shrink-0`}
              />
              <h2
                className={`${mobile || !visible ? 'size-6' : 'size-8'} text-center`}
              >
                {character?.stats.currentHands}
              </h2>
            </div>
          </div>
        </div>
        {visible && (
          <div className="flex w-full gap-4">
            {encounterPermissions &&
            controlledCharacterId === activeCharacter.id &&
            combat.phaseHistory[0]?.action ? (
              <BtnRect
                className="w-full"
                ariaLabel="Close"
                type="button"
                onClick={() => {
                  socket.emit('confirmActionQueueResults', {
                    campaignId: Number(campaignId),
                    encounterId: Number(encounterId),
                  });

                  socket.emit('advancePhase', {
                    campaignId: Number(campaignId),
                    encounterId: Number(encounterId),
                  });

                  socket.emit('resetBoard', {
                    encounterId: Number(encounterId),
                  });
                  resetRolls();
                  setTarget(null);
                }}
              >
                Confirm Action Queue Results
              </BtnRect>
            ) : (
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
              combat.passes.length < combat.turnOrder.length - 1 && (
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
              activeCharacter.id !== controlledCharacterId &&
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
        )}
      </div>
    </ThemeContainer>
  );
};

export default CharacterOptions;
