import InputField from '../formFields/InputField';
import Loading from '../Loading';
import { useParams } from 'react-router-dom';
import ArrowHeader2 from '../ArrowHeader2';
import PictureField from '../formFields/PictureField';
import TextAreaField from '../formFields/TextAreaField';
import useCreatePropertyMutation from 'src/hooks/property hooks/useCreatePropertyMutation/useCreatePropertyMutation';
import usePropertyQuery from 'src/hooks/property hooks/usePropertyQuery/usePropertyQuery';
import InputSelectField from '../formFields/InputSelectField';
import usePropertyForm from 'src/hooks/form hooks/usePropertyForm';
import FormLayout from 'src/layouts/FormLayout';
import Page from '../Page';

const PropertyForm = () => {
  const { propertyId } = useParams();

  const createProperty = useCreatePropertyMutation();

  const { data: property, isLoading: propertyLoading } = usePropertyQuery(
    Number(propertyId),
  );

  const propertyForm = usePropertyForm(createProperty, property);

  if (propertyLoading) return <Loading />;

  return (
    <Page
      title={propertyId ? 'Update Property' : 'Create Property'}
      context={{ form: propertyForm }}
    >
      <FormLayout
        label="Property"
        form={propertyForm}
        itemId={propertyId}
        createMutation={createProperty}
      >
        <ArrowHeader2 title="Property Information" />
        <div className="flex w-full gap-4">
          <propertyForm.Field name="name">
            {(field) => (
              <InputField
                label="Property Name"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </propertyForm.Field>
          <propertyForm.Field name="gpPrice">
            {(field) => (
              <InputField
                className="max-w-28"
                type="number"
                label="GP Price"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </propertyForm.Field>
        </div>
        <propertyForm.Field name="type">
          {(field) => (
            <InputSelectField
              label="Property Type"
              options={['property', 'districtUpgrade']}
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </propertyForm.Field>
        <propertyForm.Field name="description">
          {(field) => (
            <TextAreaField
              label="Property Description"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </propertyForm.Field>
        <PictureField form={propertyForm} type="scene" />
      </FormLayout>
    </Page>
  );
};

export default PropertyForm;
