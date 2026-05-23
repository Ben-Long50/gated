import { RefObject } from 'react';
import { Picture } from 'src/types/picture';

const CoverPicture = ({
  ref,
  picture,
}: {
  ref: RefObject;
  picture: Picture;
}) => {
  return (
    <div
      ref={ref}
      className="shadow-color absolute left-0 right-0 top-0 flex aspect-video items-center justify-center overflow-hidden shadow-lg"
      style={{
        maskImage: 'linear-gradient(to top, black 0%, transparent 90%',
        aspectRatio: 24 / 8,
      }}
    >
      <img
        className="w-full"
        src={`${picture?.imageUrl}`}
        alt="Cover image"
        style={{
          objectPosition: picture?.position
            ? `${picture?.position.x}% ${picture?.position.y}%`
            : '50% 50%',
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default CoverPicture;
