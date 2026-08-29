import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import ThemeContainer from './ThemeContainer';
import ItemPicture from './ItemPicture';
import ArrowHeader2 from './ArrowHeader2';
import { useInView } from 'react-intersection-observer';
import { Property } from 'src/types/property';
import { capitalCase } from 'change-case';
import ArrowHeader3 from './ArrowHeader3';
import Divider from './Divider';

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
            className={`${className} my-auto grid w-full grid-cols-2 gap-8 p-4`}
          >
            {property.generatedPictureId && (
              <ItemPicture
                key={property.id}
                className={`timing h-[300px]`}
                item={property}
              />
            )}
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full items-start justify-between gap-4">
                <div className="flex items-center justify-start gap-4">
                  <ArrowHeader2 title={property?.name} />
                  <p>( {capitalCase(property.type)} )</p>
                </div>
                <p>{property?.gpPrice ? property.gpPrice + ' GP' : 'N/A'}</p>
              </div>
              <Divider />
              <ArrowHeader3 title="Description" />
              <p>{property.description}</p>
            </div>
          </div>
        </ThemeContainer>
      )}
    </div>
  );
};

export default PropertyCard;
