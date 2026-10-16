import { useQuery } from '@tanstack/react-query';
import getCampaigns from './getCampaigns';
import { Campaign } from '@gated/shared';

const useCampaignsQuery = () => {
  return useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: () => getCampaigns(),
    throwOnError: false,
  });
};

export default useCampaignsQuery;
