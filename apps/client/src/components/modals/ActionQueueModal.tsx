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
import CharacterPictureRound from '../CharacterPictureRound';
import ActionCard from '../ActionCard';
import Icon from '@mdi/react';
import { mdiArrowRight } from '@mdi/js';
import PhaseActionCard from '../maps/PhaseActionCard';

const ActionQueueModal = () => {
  const { gameMaster, rolls, rolling, animateRoll, rollComplete, rollCounter } =
    useContext(CampaignContext);
  const { campaignId, mapId, encounterId } = useParams();
  const navigate = useNavigate();

  const { combat } = useOutletContext() || {};

  const targetId = useCombatStore((state) => state.target);

  const phaseAction = combat.phaseActionHistory || null;
  const phaseReaction = rolls.get(targetId);

  console.log(phaseAction);

  return (
    <Modal>
      <h1>Action Queue</h1>
      <ArrowHeader3 title="Pending Action" className="self-start" />
      <PhaseActionCard phaseAction={phaseAction} />
      <Divider className="!my-0 opacity-50" />
      <ArrowHeader3 title="Pending Reactions" className="self-start" />
      {combat.reactions.map((reaction) => {
        return (
          <div className="flex w-full flex-col gap-4" key={reaction}>
            <CharacterCardSmall characterId={reaction} characterList={true} />
            <div className="flex w-full flex-wrap items-center justify-start gap-2">
              {phaseReaction?.diceArray.map((number: number, index) => (
                <Die
                  key={index}
                  size={64}
                  number={number}
                  rolling={phaseReaction?.rolling}
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
