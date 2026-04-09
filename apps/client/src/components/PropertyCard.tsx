import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import ThemeContainer from './ThemeContainer';
import ItemPicture from './ItemPicture';
import ArrowHeader2 from './ArrowHeader2';
import { useInView } from 'react-intersection-observer';
import { Property } from 'src/types/property';
import { capitalCase } from 'change-case';

const PropertyCard = ({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {inView && (
        <ThemeContainer
          chamfer="medium"
          className="h-full w-full"
          borderColor={accentPrimary}
        >
          <div
            className={`${className} my-auto flex w-full flex-row gap-8 p-4`}
          >
            {property.picture?.publicId && (
              <ItemPicture
                key={property.id}
                className={`timing aspect-square h-[300px]`}
                item={property}
              />
            )}
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full items-start justify-between gap-4">
                <ArrowHeader2 title={property?.name} />
                <p>{property?.gpPrice ? property.gpPrice + ' GP' : 'N/A'}</p>
              </div>
              <p>{capitalCase(property.type)}</p>
              <p className="h-full border-x-2 border-gray-400 border-opacity-50 px-4">
                {property.description}
              </p>
              <div
                className={`timing flex items-center justify-between gap-x-8 gap-y-2`}
              ></div>
            </div>
          </div>
        </ThemeContainer>
      )}
    </div>
  );
};

export default PropertyCard;
