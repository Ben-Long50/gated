import { useNavigate, useOutletContext } from 'react-router-dom';
import BtnRect from '../buttons/BtnRect';
import Die from '../encounterComponents/Die';
import ArrowHeader3 from '../ArrowHeader3';
import CharacterPictureRound from '../characterComponents/CharacterPictureRound';
import Divider from '../Divider';
import { capitalCase } from 'change-case';
import { useContext } from 'react';
import { CampaignContext } from 'src/contexts/CampaignContext';

const RollModal = () => {
  const { rolls, rolling } = useContext(CampaignContext);
  const { rollForm } = useOutletContext() || {};

  const rollsArray = Array.from(rolls.entries());

  return (
    <>
      <h1>Roll Results</h1>
      <Divider />
      {rollsArray.map(([_, roll], index) => (
        <div className="flex w-full grow flex-col items-start gap-4">
          <div className="flex items-center gap-4">
            <CharacterPictureRound character={roll.character} />
            <ArrowHeader3 title={roll.character.name} />
          </div>
          <div className="flex w-full items-center justify-between">
            <p>{roll.action.name}</p>
            <p>{`${capitalCase(roll.roll.attribute)} - ${capitalCase(roll.roll.skill)}`}</p>
          </div>
          <div
            key={index}
            className="scrollbar-primary-2 flex w-full shrink-0 flex-wrap gap-4"
          >
            {roll.diceArray.map((value: number, index: number) => (
              <Die
                key={index}
                number={value}
                rolling={rolling}
                size={80}
                modifiers={roll.modifiers}
              />
            ))}
          </div>
        </div>
      ))}
      <Divider />
      {rollForm && (
        <BtnRect
          type="button"
          className="w-full"
          ariaLabel="Reroll"
          onClick={() => {
            rollForm.handleSubmit();
          }}
        >
          Reroll
        </BtnRect>
      )}
    </>
  );
};

export default RollModal;
