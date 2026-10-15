import ArrowHeader4 from './ArrowHeader4';
import { useRef } from 'react';
import { Faction } from 'src/types/faction';
import { Gang } from 'src/types/gang';
import { Character } from 'src/types/character';
import EntityAvater from './EntityAvatar';

const EntityCard = ({
  entity,
  reverse = false,
  className,
}: {
  entity: Faction | Gang | Character;
  reverse?: boolean;
  className?: string;
}) => {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className={`${className} ${reverse ? 'flex-row-reverse' : 'flex-row'} timing relative flex items-center gap-4`}
    >
      <EntityAvater
        publicId={entity.generatedPicture?.publicId}
        label={entity.name}
      />
      <ArrowHeader4
        className="text-primary"
        reverse={reverse}
        title={entity.name}
      />
    </div>
  );
};

export default EntityCard;
