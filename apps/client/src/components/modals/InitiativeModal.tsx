import { Fragment } from 'react/jsx-runtime';
import Modal from './Modal';
import Divider from '../Divider';
import BtnRect from '../buttons/BtnRect';
import { useContext } from 'react';
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

const InitiativeModal = () => {
  const { gameMaster } = useContext(CampaignContext);
  const { combat, joinedPlayers, rolls, rolling, rollCounter, resetRolls } =
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

  // const rollAllInitiative = async () => {
  //   setRollingInitiative(true);
  //   const rollAll = async (ids?: []) => {
  //     const rolls = rollRefs.current
  //       .map((ref) => {
  //         if (ref?.rollInitiative && !ids) {
  //           return ref.rollInitiative();
  //         } else if (ids?.includes(ref.characterId)) {
  //           return ref.rollInitiative();
  //         }
  //       })
  //       .filter((roll) => roll != null);

  //     const results = (await Promise.all(rolls)) as {
  //       characterId: number;
  //       playerCharacter: boolean;
  //       successes: number;
  //     }[];

  //     const sortedResults = results.sort((a, b) => b.successes - a.successes);

  //     const ties = new Map();

  //     sortedResults.map((result) => {
  //       if (!ties.get(result.successes)) {
  //         ties.set(result.successes, [result]);
  //       } else {
  //         const old = ties.get(result.successes);
  //         ties.set(result.successes, [...old, result]);
  //       }
  //     });

  //     let newResults = [] as {
  //       characterId: number;
  //       name: string;
  //       playerCharacter: boolean;
  //       successes: number;
  //     }[];

  //     for (const tie of ties.values()) {
  //       if (tie.length > 1) {
  //         const result = await rollAll(tie.map((result) => result.characterId));
  //         newResults = [...newResults, ...result];
  //       } else {
  //         newResults = [...newResults, tie[0]];
  //       }
  //     }

  //     return newResults;
  //   };

  //   const results = await rollAll();

  //   let resultsOrder = results.splice(0, 1);

  //   const remainingPcs =
  //     results.filter((result) => result.playerCharacter) || [];
  //   const remainingNpcs =
  //     results.filter((result) => !result.playerCharacter) || [];

  //   for (let i = 0; i < results.length; i++) {
  //     let previous = resultsOrder[i].playerCharacter;

  //     if (previous && remainingNpcs.length > 0) {
  //       resultsOrder = [...resultsOrder, ...remainingNpcs.splice(0, 1)];
  //     } else if (!previous && remainingPcs.length > 0) {
  //       resultsOrder = [...resultsOrder, ...remainingPcs.splice(0, 1)];
  //     } else if (remainingNpcs.length > 0 && remainingPcs.length === 0) {
  //       resultsOrder = [...resultsOrder, ...remainingNpcs.splice(0, 1)];
  //     } else if (remainingNpcs.length === 0 && remainingPcs.length > 0) {
  //       resultsOrder = [...resultsOrder, ...remainingNpcs.splice(0, 1)];
  //     }
  //   }

  //   console.log(resultsOrder.map((result) => result.characterId));

  //   setRollingInitiative(false);
  // };

  const initiativeRollIdArray = Array.from(rolls.keys());

  const initiativeOrder =
    initiativeRollIdArray.length > 0 ? initiativeRollIdArray : combat.turnOrder;

  return (
    <Modal>
      <h1>Initiative Rolls</h1>
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
      <div className="flex w-full flex-col gap-2">
        {initiativeOrder?.map((characterId: number, index: number) => {
          return (
            <Fragment key={characterId}>
              <CharacterInitiativeRoll characterId={characterId} />
              {index < combat.turnOrder.length - 1 && <Divider />}
            </Fragment>
          );
        })}
      </div>
      {gameMaster ? (
        <div className="flex w-full items-center gap-8">
          <BtnRect
            className="group w-full"
            ariaLabel="Roll initiative"
            type="button"
            onClick={() => {
              if (!rolling) {
                rollInitiative.mutate();
              }
            }}
          >
            {rolling ? (
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
    </Modal>
  );
};

export default InitiativeModal;
