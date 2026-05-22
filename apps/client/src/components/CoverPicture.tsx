import { Picture } from 'src/types/picture';

const CoverPicture = ({ picture }: { picture: Picture }) => {
  return (
    <div className="shadow-color absolute left-0 right-0 top-0 flex aspect-video items-center justify-center overflow-hidden shadow-lg">
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
