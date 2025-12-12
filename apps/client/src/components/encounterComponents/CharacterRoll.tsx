import ArrowHeader3 from '../ArrowHeader3';
import Die from './Die';
import { useContext } from 'react';
import Loading from '../Loading';
import { LayoutContext } from 'src/contexts/LayoutContext';
import Divider from '../Divider';
import { FormApi } from '@tanstack/react-form';

const CharacterRoll = ({
  form,
  characterId,
  rollData,
}: {
  form: FormApi;
  characterId: number;
  rollData: Map<
    number,
    { diceArray: number[]; rolling: boolean; successes: number }
  >;
}) => {
  const { mobile } = useContext(LayoutContext);

  const roll = rollData.get(characterId);

  return (
    <div className="flex flex-col justify-between gap-4">
      <Divider />
      <form.Subscribe selector={(state) => state.values.modifiers}>
        {(modifiers: string[]) => (
          <div className="flex flex-wrap justify-start gap-2">
            {roll?.diceArray.map((number: number, index: number) => (
              <Die
                key={index}
                size={68}
                number={number}
                rolling={roll?.rolling}
                modifiers={modifiers}
              />
            ))}
          </div>
        )}
      </form.Subscribe>
      <Divider />
      <div className="grid grid-cols-[1fr_auto] gap-y-4">
        <ArrowHeader3 title="Successes" />
        {!roll?.rolling ? (
          <h3 className="justify-self-end">{roll?.successes}</h3>
        ) : (
          <Loading
            className="text-accent ml-auto justify-self-end"
            size={mobile ? 1.1 : 1.3}
          />
        )}
        <ArrowHeader3 title="Success Rate" />
        {!roll?.rolling ? (
          <h3 className="justify-self-end">
            {Math.floor((roll?.successes / roll?.diceArray.length) * 100 || 0) +
              '%'}
          </h3>
        ) : (
          <Loading
            className="text-accent ml-auto justify-self-end"
            size={mobile ? 1.1 : 1.3}
          />
        )}
      </div>
    </div>
  );
};

export default CharacterRoll;
