import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Campaign } from 'src/types/campaign';
import { filterFormData } from './filterFormData';

const useCampaignForm = (
  mutation: UseMutationResult<any, Error, any>,
  campaign?: Campaign,
) => {
  const campaignForm = useForm({
    defaultValues: {
      id: campaign?.id ?? null,
      name: campaign?.name ?? '',
      location: campaign?.location ?? '',
      generatedPictureId: campaign?.generatedPictureId as number | null,
      factions:
        campaign?.factions ??
        ([
          { factionType: '', name: '' },
          { factionType: '', name: '' },
        ] as { factionType: string; name: string }[]),
      affiliation: 0,
      briefing: {} as { html: string; nodes: string },
      playerIds:
        campaign?.players.map((player) => player.id) ?? ([] as number[]),
      pendingPlayerIds:
        campaign?.pendingPlayers.map((player) => player.id) ?? ([] as number[]),
    },

    onSubmit: async ({ value }) => {
      const formData = filterFormData(value);

      await mutation.mutate(formData);
    },
  });

  return campaignForm;
};

export default useCampaignForm;
