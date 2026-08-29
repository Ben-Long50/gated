import FormLayout from 'src/layouts/FormLayout';
import InputFieldRadio from '../formFields/InputFieldRadio';
import { capitalCase } from 'change-case';
import TextAreaField from '../formFields/TextAreaField';
import { useContext, useState } from 'react';
import usePromptForm from 'src/hooks/form hooks/usePromptForm';
import InputSelectField from '../formFields/InputSelectField';
import IconBtnSmall from '../buttons/IconBtnSmall';
import { mdiMinus, mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import { PictureCard } from '../PictureCard';
import { ThemeContext } from 'src/contexts/ThemeContext';
import useGenerateStandardPictureMutation from 'src/hooks/useGenerateStandardPictureMutation/useGenerateStandardPictureMutation';

const GenerateStandardPictureForm = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const [type, setType] = useState<'character' | 'item' | 'scene'>('character');
  const generatePicture = useGenerateStandardPictureMutation(type);

  const promptForm = usePromptForm(generatePicture);

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
    <FormLayout
      label="Generate Standard Picture"
      form={promptForm}
      createMutation={generatePicture}
    >
      <div className="flex w-full flex-col gap-8">
        <InputSelectField
          label="Picture Type"
          value={type}
          options={['character', 'item', 'scene']}
          onChange={(value) => setType(value)}
        />
        <promptForm.Field name="pictureCount">
          {(field) => (
            <div className="flex items-center justify-between gap-4">
              <IconBtnSmall
                active={field.state.value > 1}
                onClick={() => field.handleChange((prev) => prev - 1)}
              >
                <Icon path={mdiMinus} />
              </IconBtnSmall>
              <p>Picture Count {field.state.value}</p>
              <IconBtnSmall
                active={field.state.value < 4}
                onClick={() => field.handleChange((prev) => prev + 1)}
              >
                <Icon path={mdiPlus} />
              </IconBtnSmall>
            </div>
          )}
        </promptForm.Field>
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
        <promptForm.Subscribe selector={(state) => state.values.pictureCount}>
          {(pictureCount) => (
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: pictureCount }).map((_, index) => {
                const picture = generatePicture.data?.newPictures[index];

                return (
                  <PictureCard
                    label=""
                    color={accentPrimary}
                    publicId={picture?.publicId}
                    key={index}
                  />
                );
              })}
            </div>
          )}
        </promptForm.Subscribe>
      </div>
    </FormLayout>
  );
};

export default GenerateStandardPictureForm;
