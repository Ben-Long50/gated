import { useForm } from '@tanstack/react-form';
import BtnRect from './buttons/BtnRect';
import Modal from './modals/Modal';
import Divider from './Divider';
import ArrowHeader3 from './ArrowHeader3';
import InputSelectField from './formFields/InputSelectField';
import { useParams } from 'react-router-dom';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import { sentenceCase } from 'change-case';
import useAllocateLevelNodesMutation from 'src/hooks/gang hooks/useAllocateLevelNodesMutation/useAllocateLevelNodesMutation';
import useGang from 'src/hooks/useGang';
import Loading from './Loading';
import InputFieldCheckbox from './formFields/InputFieldCheckbox';

const LevelNodeModal = () => {
  const { campaignId, gangId } = useParams();

  const { data: campaign } = useCampaignQuery(Number(campaignId));
  const { gang } = useGang(Number(gangId));

  const allocateLevelNodes = useAllocateLevelNodesMutation(
    Number(campaignId),
    Number(gangId),
  );

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

  const defaultSessionId = campaign?.sessions[0]?.id;
  const defaultBonus = gang?.gangSessionBonuses.find(
    (bonus) => bonus.sessionId === defaultSessionId,
  )?.levelNodeBonus;

  const levelNodeForm = useForm({
    defaultValues: {
      sessionId: defaultSessionId as number,
      bonus: defaultBonus || ([] as { value: number; description: string }[]),
    },
    onSubmit: ({ value }) => {
      allocateLevelNodes.mutate({
        sessionId: value.sessionId,
        bonus: value.bonus,
      });
    },
    validators: {
      onSubmit: ({ value }) => {
        if (!value.sessionId) {
          return 'Select a session';
        }
        return undefined;
      },
    },
  });

  return (
    <Modal
      button={
        <div className="flex w-full flex-col gap-8">
          <levelNodeForm.Subscribe selector={(state) => state.values.bonus}>
            {(bonus) => {
              const total = bonus.reduce((sum, bonus) => sum + bonus.value, 0);
              return (
                <div className="flex w-full items-center justify-between">
                  <ArrowHeader3 title="Total Level Nodes" />
                  <h2>{total}</h2>
                </div>
              );
            }}
          </levelNodeForm.Subscribe>
          <BtnRect
            className="group"
            ariaLabel="Confirm"
            onClick={(e) => {
              e.preventDefault();
              levelNodeForm.handleSubmit();
            }}
          >
            {allocateLevelNodes.isPending ? (
              <Loading
                size={1.15}
                className="group-hover:text-accent text-black"
              />
            ) : (
              'Confirm'
            )}
          </BtnRect>
        </div>
      }
      errors={
        <levelNodeForm.Subscribe selector={(state) => state.errorMap}>
          {(errorMap) =>
            errorMap.onSubmit ? (
              <em className="text-error text-lg">{errorMap.onSubmit}</em>
            ) : null
          }
        </levelNodeForm.Subscribe>
      }
    >
      <h1>Allocate Level Nodes</h1>
      <Divider />
      <levelNodeForm.Field
        name="sessionId"
        listeners={{
          onChange: ({ value }) => {
            const existingBonus = gang?.gangSessionBonuses.find(
              (bonus) => bonus.sessionId === value,
            )?.levelNodeBonus;

            if (existingBonus) {
              levelNodeForm.setFieldValue('bonus', existingBonus);
            } else {
              levelNodeForm.setFieldValue('bonus', []);
            }
          },
        }}
      >
        {(field) => (
          <InputSelectField
            label="Session"
            options={campaign?.sessions || []}
            value={field.state.value}
            onChange={(value) => field.handleChange(value.id)}
          />
        )}
      </levelNodeForm.Field>
      <levelNodeForm.Field name="bonus">
        {(field) => (
          <div className="flex w-full flex-col gap-8">
            <ArrowHeader3 title="Level Node Bonuses" />
            {reputationBonusData.map((bonus) => (
              <InputFieldCheckbox
                label={sentenceCase(bonus.description)}
                value={bonus}
                checked={field.state.value.some(
                  (b) => b.description === bonus.description,
                )}
                onChange={(value) => {
                  if (
                    field.state.value.some(
                      (b) => b.description === value.description,
                    )
                  ) {
                    field.handleChange(
                      field.state.value.filter(
                        (b) => b.description !== value.description,
                      ),
                    );
                  } else {
                    field.handleChange([...field.state.value, value]);
                  }
                }}
              />
            ))}
          </div>
        )}
      </levelNodeForm.Field>
    </Modal>
  );
};

export default LevelNodeModal;
