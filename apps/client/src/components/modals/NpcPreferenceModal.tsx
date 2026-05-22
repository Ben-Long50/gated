import { capitalCase } from 'change-case';
import BtnRect from '../buttons/BtnRect';
import Modal from './Modal';
import { useNavigate, useOutletContext } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';
import ArrowHeader2 from '../ArrowHeader2';
import InputFieldCheckbox from '../formFields/InputFieldCheckbox';
import BtnAuth from '../buttons/BtnAuth';
import Divider from '../Divider';

const NpcPreferenceModal = () => {
  const navigate = useNavigate();
  const { form } = useOutletContext() || {};

  const backgroundPath = useModalStore((state) => state.backgroundPath);

  return (
    <Modal
      button={
        <BtnRect
          type="button"
          ariaLabel="Confirm preferences"
          className="w-full"
          onClick={() => {
            if (backgroundPath) {
              navigate(backgroundPath, { replace: true });
            }
          }}
        >
          Close
        </BtnRect>
      }
    >
      <div
        className="relative flex w-full flex-col items-center gap-8"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1>NPC Preferences</h1>
        <Divider />
        <div className="flex w-full flex-col gap-8">
          <ArrowHeader2 title="Visibility to Players" />
          <div className="flex w-full justify-between">
            <BtnAuth
              className="min-w-56"
              onClick={() => {
                form.setFieldValue('preferences', () => {
                  const currentValues = form.getFieldValue('preferences');
                  return Object.fromEntries(
                    Object.entries(currentValues).map(([key, value]) => [
                      key,
                      true,
                    ]),
                  );
                });
              }}
            >
              Check All
            </BtnAuth>
            <BtnAuth
              className="min-w-56"
              onClick={() => {
                form.setFieldValue('preferences', () => {
                  const currentValues = form.getFieldValue('preferences');
                  return Object.fromEntries(
                    Object.entries(currentValues).map(([key, value]) => [
                      key,
                      false,
                    ]),
                  );
                });
              }}
            >
              Uncheck All
            </BtnAuth>
          </div>
          <div className="flex w-full flex-col gap-4">
            <form.Subscribe selector={(state) => state.values.preferences}>
              {(preferences) =>
                Object.keys(preferences).map((key) => (
                  <form.Field key={key} name={`preferences.${key}`}>
                    {(field) => (
                      <InputFieldCheckbox
                        label={capitalCase(key)}
                        value={field.state.value}
                        checked={field.state.value}
                        onChange={() => {
                          field.handleChange((prev) => !prev);
                        }}
                      />
                    )}
                  </form.Field>
                ))
              }
            </form.Subscribe>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default NpcPreferenceModal;
