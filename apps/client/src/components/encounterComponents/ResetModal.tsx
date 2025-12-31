import { useNavigate, useOutletContext } from 'react-router-dom';
import Modal from '../modals/Modal';
import { useForm } from '@tanstack/react-form';
import BtnIcon from '../buttons/BtnIcon';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import ActionIcon from '../icons/ActionIcon';
import ReactionIcon from '../icons/ReactionIcon';
import HandIcon from '../icons/HandIcon';
import BtnRect from '../buttons/BtnRect';
import Divider from '../Divider';
import Loading from '../Loading';
import useResetCharacterStatMutation from 'src/hooks/character stat hooks/useResetCharacterStatMutation/useResetCharacterStatMutation';
import FootIcon from '../icons/FootIcon';

const ResetModal = () => {
  const { character } = useOutletContext();
  const navigate = useNavigate();

  const resetCharacterStat = useResetCharacterStatMutation();

  const resetForm = useForm({
    defaultValues: {
      currentActions: character?.stats.currentActions,
      currentReactions: character?.stats.currentReactions,
      currentHands: character?.stats.currentHands,
      currentFeet: character?.stats.currentFeet,
    },
    onSubmit: ({ value }) => {
      if (!character) {
        return;
      }

      resetCharacterStat.mutate({
        characterId: character?.id,
        stat: 'currentActions',
        value: value.currentActions,
      });
      resetCharacterStat.mutate({
        characterId: character?.id,
        stat: 'currentReactions',
        value: value.currentReactions,
      });
      resetCharacterStat.mutate({
        characterId: character?.id,
        stat: 'currentHands',
        value: value.currentHands,
      });
      resetCharacterStat.mutate({
        characterId: character?.id,
        stat: 'currentFeet',
        value: value.currentFeet,
      });
    },
  });

  return (
    <Modal>
      <div className="flex w-full flex-col items-center gap-4">
        <h1>Reset Stats</h1>
        <Divider className="opacity-50" />
        <div className="flex items-center gap-8">
          <resetForm.Field name="currentActions">
            {(field) => (
              <div className="flex min-w-20 flex-col gap-4">
                <BtnIcon
                  path={mdiChevronUp}
                  active={true}
                  onClick={() => {
                    if (field.state.value < character.stats.actions) {
                      field.handleChange(field.state.value + 1);
                    }
                  }}
                />
                <div className="flex items-center gap-4">
                  <ActionIcon className="text-primary size-10" />
                  <h2 className="flex size-8 items-center justify-center">
                    {field.state.value}
                  </h2>
                </div>
                <BtnIcon
                  path={mdiChevronDown}
                  active={true}
                  onClick={() => {
                    if (field.state.value > 0) {
                      field.handleChange(field.state.value - 1);
                    }
                  }}
                />
              </div>
            )}
          </resetForm.Field>
          <resetForm.Field name="currentReactions">
            {(field) => (
              <div className="flex min-w-20 flex-col gap-4">
                <BtnIcon
                  path={mdiChevronUp}
                  active={true}
                  onClick={() => {
                    if (field.state.value < character.stats.reactions) {
                      field.handleChange(field.state.value + 1);
                    }
                  }}
                />
                <div className="flex items-center gap-4">
                  <ReactionIcon className="text-primary size-10" />
                  <h2 className="flex size-8 items-center justify-center">
                    {field.state.value}
                  </h2>
                </div>
                <BtnIcon
                  path={mdiChevronDown}
                  active={true}
                  onClick={() => {
                    if (field.state.value > 0) {
                      field.handleChange(field.state.value - 1);
                    }
                  }}
                />
              </div>
            )}
          </resetForm.Field>
          <resetForm.Field name="currentHands">
            {(field) => (
              <div className="flex min-w-20 flex-col gap-4">
                <BtnIcon
                  path={mdiChevronUp}
                  active={true}
                  onClick={() => {
                    if (field.state.value < character.stats.hands) {
                      field.handleChange(field.state.value + 1);
                    }
                  }}
                />
                <div className="flex items-center gap-4">
                  <HandIcon className="text-primary size-10" />
                  <h2 className="flex size-8 items-center justify-center">
                    {field.state.value}
                  </h2>
                </div>
                <BtnIcon
                  path={mdiChevronDown}
                  active={true}
                  onClick={() => {
                    if (field.state.value > 0) {
                      field.handleChange(field.state.value - 1);
                    }
                  }}
                />
              </div>
            )}
          </resetForm.Field>
          <resetForm.Field name="currentFeet">
            {(field) => (
              <div className="flex min-w-20 flex-col gap-4">
                <BtnIcon
                  path={mdiChevronUp}
                  active={true}
                  onClick={() => {
                    if (field.state.value < character.stats.feet) {
                      field.handleChange(field.state.value + 1);
                    }
                  }}
                />
                <div className="flex items-center gap-4">
                  <FootIcon className="text-primary size-10" />
                  <h2 className="flex size-8 items-center justify-center">
                    {field.state.value}
                  </h2>
                </div>
                <BtnIcon
                  path={mdiChevronDown}
                  active={true}
                  onClick={() => {
                    if (field.state.value > 0) {
                      field.handleChange(field.state.value - 1);
                    }
                  }}
                />
              </div>
            )}
          </resetForm.Field>
        </div>
        <Divider className="opacity-50" />
        <BtnRect
          className="group w-full"
          type="button"
          ariaLabel="Submet"
          onClick={() => {
            resetForm.handleSubmit();
            navigate('..');
          }}
        >
          {resetCharacterStat.isPending ? (
            <Loading className="group-hover:text-accent" size={1.15} />
          ) : (
            'Submit'
          )}
        </BtnRect>
      </div>
    </Modal>
  );
};

export default ResetModal;
