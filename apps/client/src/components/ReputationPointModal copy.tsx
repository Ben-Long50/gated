import { useForm } from '@tanstack/react-form';
import ArrowHeader3 from './ArrowHeader3';
import BtnRect from './buttons/BtnRect';
import InputFieldCheckbox from './InputFieldCheckbox';
import Modal from './modals/Modal';
import Divider from './Divider';

const ReputationPointModal = () => {
  const reputationBonusData = [
    {
      value: 1,
      description: `Circulation by rumor or hearsay — A small one on one scuffle —
                pickpocketing on the streets — throwing out vague insults`,
    },
    {
      value: 2,
      description: `Eyewitness testimony — a brawl with numbers on both sides — a
                smash and grab — threatening a known figure or gang by name`,
    },
    {
      value: 3,
      description: `A firefight — witnessed murder — dealing contraband on enemy
                turf — leave a calling card — collect protection money from an
                area`,
    },
    {
      value: 4,
      description: `An all out brawl with multiple dead — robbing a secured location
                — video footage of crime — taking out members of a higher rep
                gang`,
    },
    {
      value: 5,
      description: `An extermination — acts of open terrorism — robbing a location
                of cultural significance — public mass-rebellion against the
                Royals`,
    },
  ];

  const reputationForm = useForm({
    defaultValues: {
      reputationPoints: [] as number[],
    },
    onSubmit: ({ value }) => {
      const total = value.reputationPoints.reduce(
        (sum, value) => sum + value,
        0,
      );

      console.log(total);
    },
  });

  return (
    <Modal
      button={
        <BtnRect
          ariaLabel="Confirm"
          onClick={(e) => {
            e.preventDefault();
            reputationForm.handleSubmit();
          }}
        >
          Confirm
        </BtnRect>
      }
    >
      <h1>Allocate Reputation</h1>
      <Divider />
      <reputationForm.Field name="reputationPoints">
        {(field) => (
          <div className="flex flex-col gap-8">
            {reputationBonusData.map((bonus) => (
              <div className="flex items-center gap-8">
                <h3 className="whitespace-nowrap">+ {bonus.value}</h3>
                <p>{bonus.description}</p>
                <input
                  type="checkbox"
                  className="size-7 shrink-0"
                  checked={field.state.value.includes(bonus.value)}
                  onChange={() => {
                    if (field.state.value.includes(bonus.value)) {
                      field.handleChange(
                        field.state.value.filter(
                          (value) => value !== bonus.value,
                        ),
                      );
                    } else {
                      field.handleChange([...field.state.value, bonus.value]);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </reputationForm.Field>
      <Divider />
      <reputationForm.Subscribe
        selector={(state) => state.values.reputationPoints}
      >
        {(reputationPoints) => {
          const total = reputationPoints.reduce((sum, value) => sum + value, 0);
          return (
            <div className="flex w-full items-center justify-between">
              <ArrowHeader3 title="Total Reputation Points" />
              <h2>{total}</h2>
            </div>
          );
        }}
      </reputationForm.Subscribe>
    </Modal>
  );
};

export default ReputationPointModal;
