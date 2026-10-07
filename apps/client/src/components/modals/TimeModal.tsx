import { useOutletContext, useParams } from 'react-router-dom';
import BtnRect from '../buttons/BtnRect';
import Loading from '../Loading';
import Divider from '../Divider';
import useSetCampaignTimeMutation from 'src/hooks/useSetCampaignTimeMutation/useSetCampaignTimeMutation';
import { useForm } from '@tanstack/react-form';
import TimeField from '../formFields/TimeField';

const TimeModal = () => {
  const { campaignId } = useParams();

  const currentTime = useOutletContext() || {};

  const timeForm = useForm({
    defaultValues: {
      time: {
        hour: currentTime?.hour || 0,
        minute: currentTime?.minute || 0,
        second: currentTime?.second || 0,
      },
    },
    onSubmit: ({ value }) => {
      setCampaignTime.mutate(value.time);
    },
  });

  const setCampaignTime = useSetCampaignTimeMutation(Number(campaignId));

  return (
    <>
      <h2>Set Campaign Time</h2>
      <Divider />
      <TimeField form={timeForm} />
      <Divider />
      <BtnRect
        className="group w-full"
        type="button"
        ariaLabel="Add event"
        onClick={() => timeForm.handleSubmit()}
      >
        {setCampaignTime.isPending ? (
          <Loading
            className="group-hover:text-accent dark:text-gray-900"
            size={1.15}
          />
        ) : (
          'Save Time'
        )}
      </BtnRect>
    </>
  );
};

export default TimeModal;
