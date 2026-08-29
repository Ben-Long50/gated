import { Picture } from 'src/types/picture';

const CoverPicture = ({ picture }: { picture: Picture }) => {
  return (
    <div
      className="shadow-color relative -mx-8 -mt-8 flex items-center justify-center overflow-hidden shadow-lg"
      style={{
        maskImage: 'linear-gradient(to top, black 0%, transparent 90%',
      }}
    >
      <img className="w-full" src={`${picture?.imageUrl}`} alt="Cover image" />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default CoverPicture;
