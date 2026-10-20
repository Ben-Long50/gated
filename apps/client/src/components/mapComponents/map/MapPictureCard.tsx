import { Map } from '@gated/shared';
import { ReactNode, useContext } from 'react';
import { PictureCard } from 'src/components/PictureCard';
import { ThemeContext } from 'src/contexts/ThemeContext';

const MapPictureCard = ({
  map,
  label,
  onClick,
}: {
  map: Map;
  label?: ReactNode;
  onClick: () => void;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  return (
    <div className="relative">
      <PictureCard
        className="w-full border-opacity-50 hover:border-opacity-100"
        label={label ?? map.name}
        publicId={map.generatedPicture?.publicId}
        color={accentPrimary}
        onClick={onClick}
      />
    </div>
  );
};

export default MapPictureCard;
