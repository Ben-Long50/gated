import CharacterPictureRound from '../CharacterPictureRound';
import useCharacter from 'src/hooks/useCharacter';
import Loading from '../Loading';
import { useDraggable } from '@dnd-kit/core';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import { CampaignContext } from 'src/contexts/CampaignContext';

const CharacterToken = ({
  characterId,
  locationId,
}: {
  characterId: number;
  locationId: number;
}) => {
  const { user } = useContext(AuthContext);
  const { gameMaster } = useContext(CampaignContext);

  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${characterId} ${locationId}`,
    data: { characterId, locationId },
    disabled: !gameMaster && !character?.userId === user.id,
  });

  if (isLoading) return <Loading size={1.25} />;

  return (
    <div
      ref={setNodeRef}
      id={characterId.toString()}
      className="group relative inset-0 size-12 cursor-grab touch-none rounded-full"
      style={
        transform
          ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              opacity: '0.5',
            }
          : undefined
      }
      {...listeners}
      {...attributes}
    >
      <CharacterPictureRound
        className={`group-hover:border-accent timing size-12 border-2 border-white`}
        character={character}
      />
    </div>
  );
};

export default CharacterToken;
