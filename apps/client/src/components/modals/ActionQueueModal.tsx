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

const ActionQueueModal = () => {
  const { gameMaster, rolls, rolling, animateRoll, rollComplete, rollCounter } =
    useContext(CampaignContext);
  const { campaignId, mapId, encounterId } = useParams();
  const navigate = useNavigate();

  const { combat } = useOutletContext() || {};

  const targetId = useCombatStore((state) => state.target);

  const phaseAction = combat.phaseActionHistory || null;
  const phaseReaction = rolls.get(targetId);

  return (
    <Modal>
      <h1>Action Queue</h1>
      <ArrowHeader3 title="Pending Action" className="self-start" />
      <div className="bg-primary flex w-full flex-col gap-6 rounded-md p-4 shadow-md shadow-black">
        <div className="flex w-full items-center gap-8">
          <CharacterCardSmall
            className="flex-1"
            characterId={phaseAction.characterId}
            characterList={true}
          />
          <Icon path={mdiArrowRight} size={1.5} className="text-tertiary" />
          {phaseAction.targetId && (
            <CharacterCardSmall
              className="flex-1"
              characterId={phaseAction.targetId}
              characterList={true}
            />
          )}
        </div>
        <div className="col-span-2 grid grid-cols-2 items-start gap-8">
          <ActionCard action={phaseAction.action} />
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {phaseAction?.rollResult.result.map((number: number, index) => (
              <Die
                key={index}
                size={64}
                number={number}
                rolling={phaseAction?.rolling}
                rollComplete={rollComplete}
                modifiers={[]}
              />
            ))}
          </div>
        </div>
      </div>

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
