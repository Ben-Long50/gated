import { AdvancedImage, lazyload, responsive } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { mdiImageOutline } from '@mdi/js';
import Icon from '@mdi/react';

const CloudinaryPicture = ({
  publicId,
  className,
  onClick,
  style,
}: {
  publicId?: string;
  className?: string;
  onClick?: () => void;
  style?: object;
}) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUD_NAME,
    },
  });

  const responsiveImage = cld.image(publicId);

  return (
    <div className={`${className} timing bg-primary w-full`} onClick={onClick}>
      {publicId ? (
        <AdvancedImage
          style={{
            width: '100%',
            minHeight: '100%',
            objectFit: 'cover',
            ...style,
          }}
          cldImg={responsiveImage}
          plugins={[responsive({ steps: 100 }), lazyload()]}
        />
      ) : (
        <div className="flex aspect-square size-full items-center justify-center">
          <Icon
            path={mdiImageOutline}
            className="text-tertiary w-1/2 max-w-64 opacity-50"
          />
        </div>
      )}
    </div>
  );
};

export default CloudinaryPicture;
