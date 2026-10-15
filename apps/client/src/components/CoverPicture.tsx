import { AdvancedImage, lazyload, responsive } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { mdiImageOutline } from '@mdi/js';
import Icon from '@mdi/react';

const CoverPicture = ({ publicId }: { publicId?: string }) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUD_NAME,
    },
  });

  const responsiveImage = cld.image(publicId);

  return (
    <div
      className="shadow-color relative -mx-8 -mt-8 flex items-center justify-center overflow-hidden shadow-lg"
      style={{
        maskImage: 'linear-gradient(to top, black 0%, transparent 90%',
        aspectRatio: '16/9',
      }}
    >
      {publicId ? (
        <AdvancedImage
          style={{
            width: '100%',
            minHeight: '100%',
            objectFit: 'cover',
          }}
          cldImg={responsiveImage}
          plugins={[responsive({ steps: 100 }), lazyload()]}
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <Icon
            path={mdiImageOutline}
            className="text-tertiary w-1/2 max-w-64 opacity-50"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default CoverPicture;
