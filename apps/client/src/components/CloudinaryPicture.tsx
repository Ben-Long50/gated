import { AdvancedImage, lazyload, responsive } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { ReactNode } from 'react';

type Position = {
  x: number;
  y: number;
};

const CloudinaryPicture = ({
  publicId,
  position,
  className,
  onClick,
  style,
}: {
  publicId: string;
  position?: Position;
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
    <div className={`${className} bg-primary h-full w-full`} onClick={onClick}>
      <AdvancedImage
        style={{
          width: '100%',
          minHeight: '100%',
          objectFit: 'cover',
          objectPosition: position
            ? `${position.x}% ${position.y}%`
            : '50% 50%',
          ...style,
        }}
        cldImg={responsiveImage}
        plugins={[responsive({ steps: 100 }), lazyload()]}
      />
    </div>
  );
};

export default CloudinaryPicture;
