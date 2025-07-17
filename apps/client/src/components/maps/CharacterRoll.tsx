import useCharacter from 'src/hooks/useCharacter';
import ArrowHeader3 from '../ArrowHeader3';
import Die from './Die';
import { useContext } from 'react';
import Loading from '../Loading';
import { LayoutContext } from 'src/contexts/LayoutContext';
import Divider from '../Divider';
import { AttributeTree } from 'src/types/attributeTree';
import { FormApi } from '@tanstack/react-form';

const CharacterRoll = ({
  form,
  diceArray,
  rolling,
  successes,
}: {
  form: FormApi;
  characterId: number;
  diceArray: number[];
  rolling: boolean;
  calculateSuccesses: (
    attributes: AttributeTree,
    rolls: { attribute: string; skill: string }[],
    modifiers: string[],
  ) => number;
  successes: number;
}) => {
  const { mobile } = useContext(LayoutContext);

  return (
    <div className="flex flex-col justify-between gap-4">
      <Divider />
      <form.Subscribe selector={(state) => state.values.modifiers}>
        {(modifiers: string[]) => (
          <div className="flex flex-wrap justify-start gap-2">
            {diceArray?.map((number: number, index: number) => (
              <Die
                key={index}
                size={68}
                number={number}
                rolling={rolling}
                modifiers={modifiers}
              />
            ))}
          </div>
        )}
      </form.Subscribe>
      <Divider />
      <div className="grid grid-cols-[1fr_auto] gap-y-4">
        <ArrowHeader3 title="Successes" />
        {!rolling ? (
          <h3 className="justify-self-end">{successes}</h3>
        ) : (
          <Loading
            className="text-accent ml-auto justify-self-end"
            size={mobile ? 1.1 : 1.3}
          />
        )}
        <ArrowHeader3 title="Success Rate" />
        {!rolling ? (
          <h3 className="justify-self-end">
            {Math.floor((successes / diceArray.length) * 100 || 0) + '%'}
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
