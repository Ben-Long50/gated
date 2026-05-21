import { useForm } from '@tanstack/react-form';
import ArrowHeader3 from './ArrowHeader3';
import BtnRect from './buttons/BtnRect';
import Modal from './modals/Modal';
import Divider from './Divider';
import InputSelectField from './InputSelectField';
import { useParams } from 'react-router-dom';
import { mdiCheck, mdiClose } from '@mdi/js';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import { sentenceCase } from 'change-case';
import BtnAuth from './buttons/BtnAuth';
import InputField from './InputField';
import { useState } from 'react';
import Icon from '@mdi/react';
import useAllocateReputationMutation from 'src/hooks/gang hooks/useAllocateReputationMutation/useAllocateReputationMutation';
import Loading from './Loading';
import useGang from 'src/hooks/useGang';

const ReputationPointModal = () => {
  const { campaignId, gangId } = useParams();
  const [customDescription, setCustomDescription] = useState(new Map());

  const { data: campaign } = useCampaignQuery(Number(campaignId));
  const { gang } = useGang(Number(gangId));

  const allocateReputation = useAllocateReputationMutation(
    Number(campaignId),
    Number(gangId),
  );

  const reputationBonusData = [
    {
      value: 1,
      description: [
        'Circulation by rumor or hearsay',
        'A small one on one scuffle',
        'pickpocketing on the streets',
        'throwing out vague insults',
      ],
    },
    {
      value: 2,
      description: [
        'Eyewitness testimony',
        'a brawl with numbers on both sides',
        'a smash and grab',
        'threatening a known figure or gang by name',
      ],
    },
    {
      value: 3,
      description: [
        'A firefight',
        'witnessed murder',
        'dealing contraband on enemy turf',
        'leave a calling card',
        'collect protection money from an area',
      ],
    },
    {
      value: 4,
      description: [
        'An all out brawl with multiple dead',
        'robbing a secured location',
        'video footage of crime',
        'taking out members of a higher rep gang',
      ],
    },
    {
      value: 5,
      description: [
        'An extermination',
        'acts of open terrorism',
        'robbing a location of cultural significance',
        'public mass-rebellion against the Royals',
      ],
    },
  ];

  const defaultSessionId = campaign?.sessions[0]?.id;
  const defaultBonus = gang?.gangSessionBonuses.find(
    (bonus) => bonus.sessionId === defaultSessionId,
  )?.reputationBonus;

  const reputationForm = useForm({
    defaultValues: {
      sessionId: defaultSessionId as number,
      bonus: defaultBonus || ([] as { value: number; description: string }[]),
    },
    onSubmit: ({ value }) => {
      allocateReputation.mutate({
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
          <reputationForm.Field name="bonus">
            {(field) => {
              const total = field.state.value.reduce(
                (sum, bonus) => sum + bonus.value,
                0,
              );
              return (
                <div className="flex flex-col gap-8">
                  {field.state.value.length > 0 && (
                    <div className="flex flex-col gap-2 border-x-2 border-gray-400 border-opacity-50 px-4">
                      {field.state.value.map((bonus, index) => (
                        <div className="flex items-center justify-between">
                          <p>{bonus.description}</p>
                          <div className="flex items-center gap-4">
                            <p>{bonus.value}</p>
                            <button
                              className="group"
                              onClick={(e) => {
                                e.stopPropagation();
                                const newBonuses = field.state.value.filter(
                                  (_, i) => i !== index,
                                );
                                field.handleChange(newBonuses);
                              }}
                            >
                              <Icon
                                path={mdiClose}
                                size={1}
                                className="text-tertiary timing group-hover:text-accent"
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex w-full items-center justify-between">
                    <ArrowHeader3 title="Total Reputation Points" />
                    <h2>{total}</h2>
                  </div>
                </div>
              );
            }}
          </reputationForm.Field>
          <BtnRect
            className="group"
            ariaLabel="Confirm"
            onClick={(e) => {
              e.preventDefault();
              reputationForm.handleSubmit();
            }}
          >
            {allocateReputation.isPending ? (
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
        <reputationForm.Subscribe selector={(state) => state.errorMap}>
          {(errorMap) =>
            errorMap.onSubmit ? (
              <em className="text-error text-lg">{errorMap.onSubmit}</em>
            ) : null
          }
        </reputationForm.Subscribe>
      }
    >
      <h1>Allocate Reputation</h1>
      <Divider />
      <reputationForm.Field
        name="sessionId"
        listeners={{
          onChange: ({ value }) => {
            const existingBonus = gang?.gangSessionBonuses.find(
              (bonus) => bonus.sessionId === value,
            )?.reputationBonus;

            if (existingBonus) {
              reputationForm.setFieldValue('bonus', existingBonus);
            } else {
              reputationForm.setFieldValue('bonus', []);
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
      </reputationForm.Field>
      <reputationForm.Field name="bonus">
        {(field) => (
          <div className="flex w-full flex-col gap-8">
            {reputationBonusData.map((bonus, index) => {
              return (
                <div key={index} className="flex w-full flex-col gap-4">
                  <ArrowHeader3 title={`+ ${bonus.value} RP`} />
                  {bonus.description.map((d, index) => (
                    <BtnAuth
                      key={index}
                      onClick={() => {
                        field.handleChange([
                          ...field.state.value,
                          { value: bonus.value, description: sentenceCase(d) },
                        ]);
                      }}
                    >
                      {sentenceCase(d)}
                    </BtnAuth>
                  ))}
                  <div className="flex w-full items-center gap-4">
                    <InputField
                      label="Custom Description"
                      value={customDescription.get(index) || null}
                      onChange={(value) => {
                        const descriptionMap = customDescription;
                        descriptionMap.set(index, value);
                        setCustomDescription(descriptionMap);
                      }}
                    />
                    <button
                      className="bg-secondary shadow-color group rounded p-1.5 shadow-md"
                      onClick={() => {
                        const description = customDescription.get(index);
                        field.handleChange([
                          ...field.state.value,
                          {
                            value: bonus.value,
                            description: sentenceCase(description),
                          },
                        ]);
                      }}
                    >
                      <Icon
                        path={mdiCheck}
                        size={1.3}
                        className="text-tertiary timing group-hover:text-accent"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </reputationForm.Field>
    </Modal>
  );
};

export default ReputationPointModal;
