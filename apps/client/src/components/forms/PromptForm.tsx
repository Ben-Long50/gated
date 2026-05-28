import InputField from '../formFields/InputField';
import FormLayout from '../../layouts/FormLayout';
import usePromptForm from 'src/hooks/form hooks/usePromptForm';
import { capitalCase } from 'change-case';
import InputFieldRadio from '../formFields/InputFieldRadio';
import useGeneratePictureMutation from 'src/hooks/useGeneratePictureMutation/useGeneratePictureMutation';
import { FormApi } from '@tanstack/react-form';
import ArrowHeader3 from '../ArrowHeader3';
import Divider from '../Divider';

const PromptForm = ({ form }: { form: FormApi }) => {
  const generatePicture = useGeneratePictureMutation();

  const promptForm = usePromptForm(generatePicture, form.state.values);

  return (
    <FormLayout
      label="Picture Prompt"
      form={promptForm}
      createMutation={generatePicture}
    >
      <div className="grid w-full grid-cols-2 gap-8">
        <div className="flex w-full flex-col gap-8">
          <promptForm.Field name="pictureCount">
            {(field) => (
              <InputField
                type="number"
                label="Picture Count"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </promptForm.Field>
        </div>
        <div className="flex w-full flex-col gap-4">
          <ArrowHeader3 title="Setting" />
          <promptForm.Field name="time">
            {(field) => (
              <div className="flex w-full flex-col gap-4">
                {['daytime', 'nighttime', 'sunrise', 'sunset'].map((time) => (
                  <InputFieldRadio
                    label={capitalCase(time)}
                    checked={field.state.value === time}
                    value={time}
                    onChange={(value) => field.handleChange(value)}
                  />
                ))}
              </div>
            )}
          </promptForm.Field>
          <promptForm.Field name="setting">
            {(field) => (
              <InputField
                label="Setting Description"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </promptForm.Field>
          <Divider />
          <ArrowHeader3 title="Character" />
          <promptForm.Field name="height">
            {(field) =>
              field.state.value ? (
                <p>{field.state.value}</p>
              ) : (
                <p className="text-tertiary">Provide a height</p>
              )
            }
          </promptForm.Field>
          <promptForm.Field name="weight">
            {(field) =>
              field.state.value ? (
                <p>{field.state.value}</p>
              ) : (
                <p className="text-tertiary">Provide a weight</p>
              )
            }
          </promptForm.Field>
          <promptForm.Field name="age">
            {(field) =>
              field.state.value ? (
                <p>{field.state.value}</p>
              ) : (
                <p className="text-tertiary">Provide an age</p>
              )
            }
          </promptForm.Field>
          <promptForm.Field name="sex">
            {(field) =>
              field.state.value ? (
                <p>{field.state.value}</p>
              ) : (
                <p className="text-tertiary">Choose a sex</p>
              )
            }
          </promptForm.Field>
          <promptForm.Field name="hair">
            {(field) => (
              <InputField
                label="Hair Description"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </promptForm.Field>
          <promptForm.Field name="build">
            {(field) => (
              <InputField
                label="Build Description"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </promptForm.Field>
          <promptForm.Field name="outfit">
            {(field) => (
              <InputField
                label="Outfit Description"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </promptForm.Field>
          <promptForm.Field name="cybernetics">
            {(field) => (
              <InputField
                label="Cybernetics Description"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </promptForm.Field>
          <promptForm.Field name="weapons">
            {(field) => (
              <InputField
                label="Weapons Description"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </promptForm.Field>
          <promptForm.Field name="pose">
            {(field) => (
              <InputField
                label="Pose Description"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </promptForm.Field>
        </div>
      </div>
    </FormLayout>
  );
};

export default PromptForm;
