import { useForm } from '@tanstack/react-form';
import BtnRect from './buttons/BtnRect';
import Modal from './modals/Modal';
import Divider from './Divider';
import ArrowHeader3 from './ArrowHeader3';
import ArrowHeader4 from './ArrowHeader4';

const LevelNodeModal = () => {
  const reputationBonusData = [
    {
      value: 1,
      description: `Ending a Session with more Profit Margins than you begin with.`,
    },
    {
      value: 1,
      description: `Save or make 20% or more on a Deal.`,
    },
    {
      value: 1,
      description: `Eliminating a rival gang.`,
    },
    {
      value: 1,
      description: `Start a war with a gang.`,
    },
    {
      value: 1,
      description: `Critically fail a roll.`,
    },
    {
      value: 1,
      description: `Fail due to Dooming.`,
    },
    {
      value: 1,
      description: `Become Wounded.`,
    },
    {
      value: 1,
      description: `Become Deranged.`,
    },
    {
      value: 1,
      description: `Receive a Permanent Injury.`,
    },
    {
      value: 1,
      description: `Receive a Permanent Insanity.`,
    },
    {
      value: 1,
      description: `Pursue a paranormal encounter.`,
    },
    {
      value: 1,
      description: `Zero something.`,
    },
    {
      value: 1,
      description: `Entertainment puts you into a bad situation.`,
    },
    {
      value: 1,
      description: `Perform Treatment on someone with 3 or less Health.`,
    },
    {
      value: 1,
      description: `Increase your Reputation Level.`,
    },
    {
      value: 1,
      description: `Talk your way out of getting shot.`,
    },
    {
      value: 1,
      description: `Resolve a Conflict peacefully.`,
    },
    {
      value: 1,
      description: `Investigate significant information.`,
    },
  ];

  const levelNodeForm = useForm({
    defaultValues: {
      levelNodes: [] as { value: number; description: string }[],
    },
    onSubmit: ({ value }) => {
      const total = value.levelNodes.reduce(
        (sum, bonus) => sum + bonus.value,
        0,
      );

      console.log(total);
    },
  });

  return (
    <Modal
      button={
        <div className="flex w-full flex-col gap-8">
          <Divider />
          <levelNodeForm.Subscribe
            selector={(state) => state.values.levelNodes}
          >
            {(levelNodes) => {
              const total = levelNodes.reduce(
                (sum, bonus) => sum + bonus.value,
                0,
              );
              return (
                <div className="flex w-full items-center justify-between">
                  <ArrowHeader3 title="Total Level Nodes" />
                  <h2>{total}</h2>
                </div>
              );
            }}
          </levelNodeForm.Subscribe>
          <BtnRect
            ariaLabel="Confirm"
            onClick={(e) => {
              e.preventDefault();
              levelNodeForm.handleSubmit();
            }}
          >
            Confirm
          </BtnRect>
        </div>
      }
    >
      <h1>Allocate Level Nodes</h1>
      <Divider />
      <levelNodeForm.Field name="levelNodes">
        {(field) => (
          <div className="flex w-full flex-col gap-8">
            {reputationBonusData.map((bonus) => (
              <div className="flex w-full items-center justify-between gap-8">
                <ArrowHeader4
                  className="text-primary"
                  title={bonus.description}
                />
                <input
                  type="checkbox"
                  className="size-7 shrink-0"
                  checked={field.state.value.some(
                    (b) => b.description === bonus.description,
                  )}
                  onChange={() => {
                    if (
                      field.state.value.some(
                        (b) => b.description === bonus.description,
                      )
                    ) {
                      field.handleChange(
                        field.state.value.filter(
                          (b) => b.description !== bonus.description,
                        ),
                      );
                    } else {
                      field.handleChange([...field.state.value, bonus]);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </levelNodeForm.Field>
    </Modal>
  );
};

export default LevelNodeModal;
