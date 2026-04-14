import InputField from '../InputField';
import Loading from '../Loading';
import { useParams } from 'react-router-dom';
import ArrowHeader2 from '../ArrowHeader2';
import PictureField from '../formFields/PictureField';
import TextAreaField from '../TextAreaField';
import useCreatePropertyMutation from 'src/hooks/property hooks/useCreatePropertyMutation/useCreatePropertyMutation';
import usePropertyQuery from 'src/hooks/property hooks/usePropertyQuery/usePropertyQuery';
import InputSelectField from '../InputSelectField';
import usePropertyForm from 'src/hooks/form hooks/usePropertyForm';
import FormLayout from 'src/layouts/FormLayout';

const PropertyForm = () => {
  const { propertyId } = useParams();

  const createProperty = useCreatePropertyMutation(Number(propertyId));

  const { data: property, isLoading: propertyLoading } = usePropertyQuery(
    Number(propertyId),
  );

  const propertyForm = usePropertyForm(createProperty, property);

  if (propertyLoading) return <Loading />;

  return (
    <FormLayout
      label="Property"
      form={propertyForm}
      itemId={propertyId}
      createMutation={createProperty}
    >
      <ArrowHeader2 title="Property Information" />
      <div className="flex w-full gap-4 lg:gap-8">
        <propertyForm.Field
          name="name"
          validators={{
            onChange: ({ value }) =>
              value.length < 2
                ? 'Gang name must be at least 2 characters long'
                : undefined,
          }}
        >
          {(field) => (
            <InputField className="grow" label="Property Name" field={field} />
          )}
        </propertyForm.Field>
        <propertyForm.Field
          name="gpPrice"
          validators={{
            onChange: ({ value }) => {
              if (!value || value < 0) {
                return 'Gang Point price cannot be negative';
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <InputField
              className="max-w-28"
              type="number"
              label="GP Price"
              field={field}
            />
          )}
        </propertyForm.Field>
      </div>
      <propertyForm.Field
        name="type"
        validators={{
          onChange: ({ value }) =>
            value.length < 2
              ? 'Gang name must be at least 2 characters long'
              : undefined,
        }}
      >
        {(field) => (
          <InputSelectField
            label="Property Type"
            field={field}
            options={['property', 'districtUpgrade']}
          />
        )}
      </propertyForm.Field>
      <div className="grid w-full gap-8 max-sm:col-span-2 max-sm:grid-flow-row sm:grid-cols-2">
        <PictureField
          form={propertyForm}
          sizeInfo={{ aspectRatio: '1/1', maxHeight: '', minHeight: '' }}
        />
        <propertyForm.Field
          name="description"
          validators={{
            onChange: ({ value }) =>
              value.length < 2
                ? `Property description must be at least 2 characters long`
                : undefined,
          }}
        >
          {(field) => (
            <TextAreaField label={'Property Description'} field={field} />
          )}
        </propertyForm.Field>
      </div>
    </FormLayout>
  );
};

export default PropertyForm;
