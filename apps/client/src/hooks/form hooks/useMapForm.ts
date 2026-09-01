import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import constructFormData from './constructFormData';
import { Map, MapType } from 'src/types/map';
import { useParams } from 'react-router-dom';

const useMapForm = (
  mutation: UseMutationResult<any, Error, FormData>,
  map?: Map,
) => {
  const { campaignId } = useParams();

  const mapForm = useForm({
    defaultValues: {
      id: map?.id ?? null,
      campaignId: map?.campaignId ?? (campaignId ? Number(campaignId) : null),
      type: map?.type ?? ('map' as MapType),
      draft: map?.draft ?? true,
      name: map?.name ?? '',
      description: map?.description ?? '',
      width: map?.width ?? 24,
      height: map?.height ?? 14,
      baseColor: map?.baseColor ?? 'black',
      layerCount: map?.layerCount ?? 1,
      layers: map?.layers ?? [
        {
          name: 'Layer 1',
          id: 1,
          hidden: false,
          componentCount: 0,
          components: [],
        },
      ],
      generatedPictureId: map?.generatedPictureId ?? null,
    },
    onSubmit: async ({ value }) => {
      const formData = constructFormData(value);

      mutation.mutate(formData);
    },
  });

  return mapForm;
};

export default useMapForm;
