import { useOutletContext } from 'react-router-dom';
import Modal from './Modal';
import FormLayout from 'src/layouts/FormLayout';
import ArrowHeader3 from '../ArrowHeader3';
import InputFieldRadio from '../formFields/InputFieldRadio';
import { capitalCase } from 'change-case';
import Divider from '../Divider';
import TextAreaField from '../formFields/TextAreaField';

const PromptModal = () => {
  const { promptForm, generatePicture } = useOutletContext();

  return (
    <Modal>
      <div className="flex w-full flex-col items-center gap-8">
        <h1>Prompt Info</h1>
        <FormLayout
          label="Character Picture"
          form={promptForm}
          createMutation={generatePicture}
        >
          <div className="flex w-full flex-col gap-4">
            <ArrowHeader3 title="Setting" />
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
            <Divider />
            <ArrowHeader3 title="Height" />
            <promptForm.Field name="height">
              {(field) => (
                <div className="flex w-full flex-col gap-2 border-x-2 border-gray-400 border-opacity-50 px-4">
                  {['tall', 'average', 'short'].map((height) => (
                    <InputFieldRadio
                      label={capitalCase(height)}
                      checked={field.state.value === height}
                      value={height}
                      onChange={(value) => field.handleChange(value)}
                    />
                  ))}
                </div>
              )}
            </promptForm.Field>
            <ArrowHeader3 title="Age" />
            <promptForm.Field name="age">
              {(field) => (
                <div className="flex w-full flex-col gap-2 border-x-2 border-gray-400 border-opacity-50 px-4">
                  {['old', 'adult', 'teen', 'child'].map((age) => (
                    <InputFieldRadio
                      label={capitalCase(age)}
                      checked={field.state.value === age}
                      value={age}
                      onChange={(value) => field.handleChange(value)}
                    />
                  ))}
                </div>
              )}
            </promptForm.Field>
            <ArrowHeader3 title="Build" />
            <promptForm.Field name="build">
              {(field) => (
                <div className="flex w-full flex-col gap-2 border-x-2 border-gray-400 border-opacity-50 px-4">
                  {['skinny', 'fat', 'muscular'].map((build) => (
                    <InputFieldRadio
                      label={capitalCase(build)}
                      checked={field.state.value === build}
                      value={build}
                      onChange={(value) => field.handleChange(value)}
                    />
                  ))}
                </div>
              )}
            </promptForm.Field>
            <promptForm.Field name="hair">
              {(field) => (
                <TextAreaField
                  label="Hair Description"
                  value={field.state.value}
                  placeholder="e.g. long blonde hair flowing in the wind with a long beard and mustache"
                  onChange={(value) => field.handleChange(value)}
                />
              )}
            </promptForm.Field>
            <promptForm.Field name="outfit">
              {(field) => (
                <TextAreaField
                  label="Outfit Description"
                  value={field.state.value}
                  placeholder="e.g. a skin tight black suit with cicuitry running throughout that glows blue"
                  onChange={(value) => field.handleChange(value)}
                />
              )}
            </promptForm.Field>
            <promptForm.Field name="augmentation">
              {(field) => (
                <TextAreaField
                  label="Augmentation Description"
                  value={field.state.value}
                  placeholder="e.g. a metal cybernetic jaw replacing the lower half of the face"
                  onChange={(value) => field.handleChange(value)}
                />
              )}
            </promptForm.Field>
            <promptForm.Field name="weapon">
              {(field) => (
                <TextAreaField
                  label="Weapon Description"
                  value={field.state.value}
                  placeholder="e.g. a long katana held in one hand with glowing red cicuitry running thoughout the blade"
                  onChange={(value) => field.handleChange(value)}
                />
              )}
            </promptForm.Field>
            <promptForm.Field name="pose">
              {(field) => (
                <TextAreaField
                  label="Pose Description"
                  value={field.state.value}
                  placeholder="e.g. standing tall with their weapon resting on their shoulder"
                  onChange={(value) => field.handleChange(value)}
                />
              )}
            </promptForm.Field>
          </div>
        </FormLayout>
      </div>
    </Modal>
  );
};

export default PromptModal;
