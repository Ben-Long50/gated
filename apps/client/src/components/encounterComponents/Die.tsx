import Die1Icon from '../icons/Die1Icon';
import Die2Icon from '../icons/Die2Icon';
import Die3Icon from '../icons/Die3Icon';
import Die4Icon from '../icons/Die4Icon';
import Die5Icon from '../icons/Die5Icon';
import Die6Icon from '../icons/Die6Icon';
import Loading from '../Loading';

const Die = ({
  number,
  rolling,
  size,
  modifiers,
}: {
  number: number;
  rolling: boolean;
  size: number;
  modifiers: string[];
}) => {
  const lucky = modifiers.includes('lucky') && !modifiers.includes('unlucky');
  const unlucky = modifiers.includes('unlucky') && !modifiers.includes('lucky');
  const loading = modifiers.includes('loading');

  let die;

  switch (number) {
    case 1:
      die = (
        <Die1Icon
          className={`${loading && 'opacity-50'} ${modifiers.includes('dooming') ? 'fill-red-500' : 'fill-zinc-600 dark:fill-gray-200'} h-full w-full`}
        />
      );
      break;
    case 2:
      die = (
        <Die2Icon
          className={`${loading && 'opacity-50'} h-full w-full fill-zinc-600 shadow-md dark:fill-gray-200`}
        />
      );
      break;
    case 3:
      die = (
        <Die3Icon
          className={`${loading && 'opacity-50'} h-full w-full fill-zinc-600 dark:fill-gray-200`}
        />
      );
      break;
    case 4:
      die = (
        <Die4Icon
          className={`${loading && 'opacity-50'} ${lucky ? 'fill-green-500' : 'fill-zinc-600 dark:fill-gray-200'} h-full w-full`}
        />
      );
      break;
    case 5:
      die = (
        <Die5Icon
          className={`${loading && 'opacity-50'} ${!unlucky ? 'fill-green-500' : 'fill-zinc-600 dark:fill-gray-200'} h-full w-full`}
        />
      );
      break;
    case 6:
      die = (
        <Die6Icon
          className={`${loading && 'opacity-50'} ${modifiers.includes('booming') ? 'fill-yellow-400' : !modifiers.includes('booming') ? 'fill-green-500' : 'fill-zinc-600 dark:fill-gray-200'} h-full w-full`}
        />
      );
      break;
    default:
      die = null;
  }

  return (
    <div
      className={`${!rolling && 'rollComplete'} relative shrink-0 shadow-md shadow-black`}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.125,
      }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center !opacity-100">
          <Loading className="text-accent bg-transparent" size={1.5} />
        </div>
      )}
      {die}
      {!loading && <div className="absolute inset-1 -z-10 bg-black" />}
    </div>
  );
};

export default Die;
