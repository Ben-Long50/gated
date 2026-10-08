import { useOutletContext } from 'react-router-dom';
import FormLayout from 'src/layouts/FormLayout';
import InputFieldRadio from '../formFields/InputFieldRadio';
import { capitalCase } from 'change-case';
import TextAreaField from '../formFields/TextAreaField';

const PromptModal = () => {
  const { type, promptForm, generatePicture } = useOutletContext();

  let placeholder = '';

  switch (type) {
    case 'character':
      placeholder =
        'e.g. a tall and muscular adult man; clean shaven with long black hair. He is dressed in torn up gangster clothing and weilds a two handed cyber sword which glows green. He is standing with the sword resting on their shoulder.';
      break;
    case 'item':
      placeholder =
        'e.g. a long, slender sword with glowing blue circuitry running along the length of the blade. The sword is modeled after a katana and is sitting on an ornate, decorative stand.';
      break;
    case 'scene':
      placeholder =
        'e.g. a mob of cybernetically enhanced gangsters running down the street while a large ghastly entity chases them from behind.';
      break;
  }
  return (
    <>
      <h1>{capitalCase(type)} Prompt Info</h1>
      <FormLayout
        label={`${capitalCase(type)} Picture`}
        form={promptForm}
        createMutation={generatePicture}
      >
        <div className="flex w-full flex-col gap-8">
          <promptForm.Field name="time">
            {(field) => (
              <div className="flex w-full flex-col gap-2 border-x-2 border-gray-400 border-opacity-50 px-4">
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
              <TextAreaField
                label="Setting Description"
                value={field.state.value}
                placeholder="e.g. a dimly lit city street with glowing neon lights in the background"
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </promptForm.Field>
          <promptForm.Field name="description">
            {(field) => (
              <TextAreaField
                label={`${capitalCase(type)} Description`}
                value={field.state.value}
                placeholder={placeholder}
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </promptForm.Field>
        </div>
      </FormLayout>
    </>
  );
};

export default PromptModal;
