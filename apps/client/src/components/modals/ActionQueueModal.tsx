import { Fragment } from 'react/jsx-runtime';
import Modal from './Modal';
import Divider from '../Divider';
import BtnRect from '../buttons/BtnRect';
import { useContext } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Loading from '../Loading';
import CharacterInitiativeRoll from '../maps/CharacterInitiativeRoll';
import { CampaignContext } from 'src/contexts/CampaignContext';
import { socket } from 'src/socket';
import CharacterCardSmall from '../CharacterCardSmall';
import Die from '../maps/Die';
import useCombatStore from 'src/stores/combatStore';
import ArrowHeader2 from '../ArrowHeader2';
import ArrowHeader3 from '../ArrowHeader3';

const ActionQueueModal = () => {
  const { gameMaster, rolls, rolling, animateRoll, rollComplete, rollCounter } =
    useContext(CampaignContext);
  const { campaignId, mapId, encounterId } = useParams();
  const navigate = useNavigate();

  const { campaign, combat, activeCharacter } = useOutletContext() || {};

  const targetId = useCombatStore((state) => state.target);

  const actionRoll = rolls.get(activeCharacter.id);
  const targetReactionRoll = rolls.get(targetId);

  return (
    <Modal>
      <h1>Action Queue</h1>
      <ArrowHeader3 title="Pending Action" className="self-start" />
      <div className="grid w-full grid-cols-2 gap-8">
        <div className="flex w-full flex-col gap-4">
          <CharacterCardSmall
            characterId={activeCharacter.id}
            characterList={true}
          />
          <div className="flex w-full flex-wrap items-center justify-start gap-2">
            {actionRoll?.diceArray.map((number: number, index) => (
              <Die
                key={index}
                size={64}
                number={number}
                rolling={actionRoll?.rolling}
                rollComplete={rollComplete}
                modifiers={[]}
              />
            ))}
          </div>
        </div>
        {targetId && (
          <div className="flex w-full flex-col gap-4">
            <CharacterCardSmall characterId={targetId} characterList={true} />
            <div className="flex w-full flex-wrap items-center justify-start gap-2">
              {targetReactionRoll?.diceArray.map((number: number, index) => (
                <Die
                  key={index}
                  size={64}
                  number={number}
                  rolling={targetReactionRoll?.rolling}
                  rollComplete={rollComplete}
                  modifiers={[]}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Divider className="!my-0 opacity-50" />
      <ArrowHeader3 title="Pending Reactions" className="self-start" />
      {combat.reactions.map((reaction) => {
        return (
          <div className="flex w-full flex-col gap-4" key={reaction}>
            <CharacterCardSmall characterId={reaction} characterList={true} />
            <div className="flex w-full flex-wrap items-center justify-start gap-2">
              {targetReactionRoll?.diceArray.map((number: number, index) => (
                <Die
                  key={index}
                  size={64}
                  number={number}
                  rolling={targetReactionRoll?.rolling}
                  rollComplete={rollComplete}
                  modifiers={[]}
                />
              ))}
            </div>
          </div>
        );
      })}
      <BtnRect
        className="w-full"
        ariaLabel="Close"
        type="button"
        onClick={() => {
          navigate('..');
        }}
      >
        Close
      </BtnRect>
    </Modal>
  );
};

export default ActionQueueModal;
