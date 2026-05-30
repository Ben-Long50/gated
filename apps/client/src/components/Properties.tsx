import useBasePropertiesQuery from 'src/hooks/property hooks/useBasePropertiesQuery/useBasePropertiesQuery';
import PropertyCard from './PropertyCard';

const Properties = () => {
  const { data: properties } = useBasePropertiesQuery();

  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-8">
      {properties?.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default Properties;
