import { useStore } from '@tanstack/react-form';
import { useContext } from 'react';
import BtnRect from '../buttons/BtnRect';
import InputField from '../InputField';
import Loading from '../Loading';
import { useParams } from 'react-router-dom';
import ArrowHeader2 from '../ArrowHeader2';
import Divider from '../Divider';
import PictureField from '../formFields/PictureField';
import { ThemeContext } from 'src/contexts/ThemeContext';
import ThemeContainer from '../ThemeContainer';
import TextAreaField from '../TextAreaField';
import useCreatePropertyMutation from 'src/hooks/property hooks/useCreatePropertyMutation/useCreatePropertyMutation';
import usePropertyQuery from 'src/hooks/property hooks/usePropertyQuery/usePropertyQuery';
import BtnAuth from '../buttons/BtnAuth';
import InputSelectField from '../InputSelectField';
import usePropertyForm from 'src/hooks/form hooks/usePropertyForm';

const PropertyForm = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { propertyId } = useParams();

  const createProperty = useCreatePropertyMutation(Number(propertyId));

  const { data: property, isLoading: propertyLoading } = usePropertyQuery(
    Number(propertyId),
  );

  const propertyForm = usePropertyForm(createProperty, property);

  const formErrorMap = useStore(propertyForm.store, (state) => state.errorMap);

  if (propertyLoading) return <Loading />;

  return (
    <ThemeContainer
      className="mb-auto w-full max-w-5xl"
      chamfer="large"
      borderColor={accentPrimary}
    >
      <form
        className="flex flex-col gap-8 p-8"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!createProperty.isPending) {
            propertyForm.handleSubmit();
          }
        }}
      >
        <div className="flex items-center justify-center gap-4">
          <h1>{propertyId ? `Update ${property?.name}` : 'Create Property'}</h1>
        </div>
        <Divider />
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
              <InputField
                className="grow"
                label="Property Name"
                field={field}
              />
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
        <Divider />
        {formErrorMap.onSubmit && typeof formErrorMap.onSubmit === 'string' && (
          <div>
            <em className="text-error">{formErrorMap.onSubmit}</em>
          </div>
        )}
        <BtnRect
          ariaLabel={
            propertyId ? `Update ${property?.name}` : 'Create Property'
          }
          type="submit"
          className="group w-full"
        >
          {createProperty.isPending ? (
            <Loading
              className="group-hover:text-accent dark:text-gray-900"
              size={1.15}
            />
          ) : propertyId ? (
            `Update ${property?.name}`
          ) : (
            'Create Property'
          )}
        </BtnRect>
        <BtnAuth className="ml-auto w-1/3" onClick={() => propertyForm.reset()}>
          Reset Form
        </BtnAuth>
      </form>
    </ThemeContainer>
  );
};

export default PropertyForm;
