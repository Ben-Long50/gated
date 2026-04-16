import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Campaign } from 'src/types/campaign';
import constructFormData from './constructFormData';

const useCampaignForm = (
  mutation: UseMutationResult<any, Error, FormData>,
  campaign?: Campaign,
) => {
  const campaignForm = useForm({
    defaultValues: {
      id: campaign?.id || null,
      name: campaign?.name || '',
      location: campaign?.location || '',
      pictureFile: null as File | null,
      picture: campaign?.picture || {
        imageUrl: '',
        publicId: '',
        position: { x: 50, y: 50 },
      },
      factions:
        campaign?.factions ||
        ([
          { factionType: '', name: '' },
          { factionType: '', name: '' },
        ] as { factionType: string; name: string }[]),
      affiliation: 0,
      briefing: {} as { html: string; nodes: string },
      playerIds:
        campaign?.players.map((player) => player.id) || ([] as number[]),
      pendingPlayerIds:
        campaign?.pendingPlayers.map((player) => player.id) || ([] as number[]),
    },

    onSubmit: async ({ value }) => {
      const formData = constructFormData(value);

      await mutation.mutate(formData);
    },
    // validators: {
    //   onSubmit: ({ value }) => {
    //     if ([...value.playerIds, ...value.pendingPlayerIds].length < 1) {
    //       return 'You must invite or have a minimum of one active player to create or update this campaign';
    //     }
    //     return undefined;
    //   },
    // },
  });

  return campaignForm;
};

export default useCampaignForm;
