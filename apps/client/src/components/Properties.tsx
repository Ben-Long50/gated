import useBasePropertiesQuery from 'src/hooks/property hooks/useBasePropertiesQuery/useBasePropertiesQuery';
import PropertyCard from './PropertyCard';
import Page from './Page';

const Properties = () => {
  const { data: properties } = useBasePropertiesQuery();

  return (
    <Page title="Properties">
      {properties?.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </Page>
  );
};

export default Properties;
