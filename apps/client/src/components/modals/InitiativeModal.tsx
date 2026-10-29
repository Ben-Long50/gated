import BtnRect from '../buttons/BtnRect';
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../Loading';
import CharacterInitiativeRoll from '../encounterComponents/CharacterInitiativeRoll';
import { CampaignContext } from 'src/contexts/CampaignContext';
import Icon from '@mdi/react';
import { mdiCrown } from '@mdi/js';
import useCreateCombatMutation from 'src/hooks/encounter hooks/useCreateCombatMutation/useCreateCombatMutation';
import { EncounterContext } from 'src/contexts/EncounterContext';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import useRollInitiativeMutation from 'src/hooks/encounter hooks/useRollInitiativeMutation/useRollInitiativeMutation';
import { socket } from 'src/socket';
import useAdvancePhaseMutation from 'src/hooks/encounter hooks/useAdvancePhaseMutation/useAdvancePhaseMutation';
import { Character, RollResult } from '@gated/shared';

const InitiativeModal = () => {
  const { gameMaster } = useContext(CampaignContext);
  const { combat, joinedPlayers, rolls, rolling, rollCounter } =
    useContext(EncounterContext);

  const { campaignId, mapId, encounterId } = useParams();

  const { data: campaign } = useCampaignQuery(Number(campaignId));

  const startCombat = useCreateCombatMutation(Number(campaignId));

  const advancePhase = useAdvancePhaseMutation(
    Number(campaignId),
    Number(encounterId),
  );

  const rollInitiative = useRollInitiativeMutation(
    Number(campaignId),
    Number(encounterId),
  );

  const playerIds = new Set();

  combat?.characters.forEach((character) => playerIds.add(character.userId));

  const [rollData, setRollData] = useState<Map<number, RollResult>>(
    new Map(
      combat?.characters.map((character: Character) => [
        character.id,
        { modifiers: [], extraDice: 0 },
      ]),
    ),
  );

  return (
    <>
      <h1 className="text-center">Initiative Rolls</h1>
      <div className="absolute left-4 top-4 mr-auto flex flex-col items-start justify-start">
        {joinedPlayers?.map((player) => (
          <div className="flex items-center gap-2" key={player.username}>
            <p className="text-base">{player.username}</p>
            {campaign?.ownerId === player.playerId && (
              <Icon path={mdiCrown} color="gold" size={0.8} />
            )}
          </div>
        ))}
        {playerIds && [...playerIds].length === joinedPlayers.length ? (
          <p className="text-base">All Players Here</p>
        ) : (
          <div className="flex items-center gap-2">
            <Loading size={0.7} />
            <p className="text-base">Waiting for Players</p>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col gap-4">
        {combat.turnOrder?.map((characterId: number, index: number) => (
          <div className="flex w-full items-center gap-4">
            <h2 className="size-8 text-center">{index + 1}</h2>
            <CharacterInitiativeRoll
              key={index}
              characterId={characterId}
              rollData={rollData}
              setRollData={setRollData}
            />
          </div>
        ))}
      </div>
      {gameMaster ? (
        <div className="flex w-full items-center gap-8">
          <BtnRect
            className="group w-full"
            ariaLabel="Roll initiative"
            type="button"
            onClick={() => {
              if (!rolling) {
                rollInitiative.mutate(Array.from(rollData));
              }
            }}
          >
            {rolling || rollInitiative.isPending ? (
              <Loading
                className="group-hover:text-accent text-zinc-950"
                size={1.15}
              />
            ) : !rolling && rollCounter > 0 ? (
              'Reroll Initiative'
            ) : (
              'Roll Initiative'
            )}
          </BtnRect>
          {rollCounter > 0 && (
            <BtnRect
              className={`${rolling && 'pointer-events-none opacity-50'} w-full`}
              ariaLabel="Start combat"
              type="button"
              onClick={() => {
                startCombat.mutate({
                  id: Number(encounterId),
                  mapId: Number(mapId),
                  turnOrder: Array.from(rolls.keys()),
                  turnPosition: 0,
                });
                advancePhase.mutate();
                socket.emit('resetBoard', { encounterId: Number(encounterId) });
              }}
            >
              Start Combat
            </BtnRect>
          )}
        </div>
      ) : (
        !rolling && (
          <div className="flex items-center gap-4">
            <Loading size={1.15} />
            {rollCounter === 0 ? (
              <h3>Waiting for the Game Master to roll initiative</h3>
            ) : (
              <h3>
                Waiting for the Game Master to reroll initiative or start combat
              </h3>
            )}
          </div>
        )
      )}
    </>
  );
};

export default InitiativeModal;
