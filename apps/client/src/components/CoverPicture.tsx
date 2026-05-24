import { RefObject } from 'react';
import { Picture } from 'src/types/picture';

const CoverPicture = ({ picture }: { picture: Picture }) => {
  return (
    <div
      className="shadow-color relative -mx-8 -mt-8 flex items-center justify-center overflow-hidden shadow-lg"
      style={{
        maskImage: 'linear-gradient(to top, black 0%, transparent 90%',
        aspectRatio: 3 / 1,
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
