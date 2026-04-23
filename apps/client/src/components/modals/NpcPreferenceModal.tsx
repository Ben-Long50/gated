import { capitalCase } from 'change-case';
import BtnRect from '../buttons/BtnRect';
import Modal from './Modal';
import { useNavigate, useOutletContext } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';
import ArrowHeader2 from '../ArrowHeader2';

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
        <p className="text-tertiary border-l-2 border-gray-400 border-opacity-50 pl-4">
          Set your visibility preferences for this NPC. These options will
          determine how much of this NPC's information is viewable by players
          when interacting with them. If a box is checked, that means players
          can see that information.
        </p>

        <div className="flex w-full flex-col gap-8 p-4 sm:p-8">
          <ArrowHeader2 title="Preferences" />
          <div className="flex w-full justify-between">
            <button
              className="text-accent text-base hover:underline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
            </button>
            <button
              className="text-accent text-base hover:underline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
            </button>
          </div>
          <div className="flex w-full flex-col gap-4">
            <form.Subscribe selector={(state) => state.values.preferences}>
              {(preferences) =>
                Object.keys(preferences).map((key, index) => (
                  <form.Field key={key} name={`preferences.${key}`}>
                    {(field) => (
                      <>
                        <label
                          className="flex w-full items-center justify-between"
                          htmlFor={key}
                        >
                          <p
                            className={`${field.state.value ? 'text-accent' : 'text-secondary'}`}
                          >
                            {capitalCase(key)}
                          </p>
                          <input
                            id={key}
                            className="size-7"
                            name={key}
                            type="checkbox"
                            checked={field.state.value}
                            onChange={() => {
                              field.handleChange(!field.state.value);
                            }}
                          />
                        </label>
                      </>
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
