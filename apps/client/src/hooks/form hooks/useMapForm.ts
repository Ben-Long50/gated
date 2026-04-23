import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import constructFormData from './constructFormData';
import { Map, MapType } from 'src/types/map';
import { RefObject } from 'react';
import html2canvas from 'html2canvas';
import { useParams } from 'react-router-dom';

const useMapForm = (
  mutation: UseMutationResult<any, Error, FormData>,
  mapRef: RefObject,
  map?: Map,
) => {
  const { campaignId } = useParams();

  const mapForm = useForm({
    defaultValues: {
      id: map?.id ?? null,
      campaignId: map?.campaignId ?? Number(campaignId),
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
      pictureFile: null as File | null,
      picture: {
        imageUrl: map?.picture.imageUrl ?? '',
        publicId: map?.picture.publicId ?? '',
        position: map?.picture.position ?? { x: 50, y: 50 },
      },
    },
    onSubmit: async ({ value }) => {
      if (mapRef.current) {
        const canvas = await html2canvas(mapRef.current);

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((blob) => resolve(blob), 'image/png');
        });

        if (!blob) return;

        const fileName = value.name.split(' ').join('_').toLowerCase();

        const file = new File([blob], `${fileName}.png`, { type: 'image/png' });
        value.pictureFile = file;
      }

      const formData = constructFormData(value);

      mutation.mutate(formData);
    },
  });

  return mapForm;
};

export default useMapForm;
