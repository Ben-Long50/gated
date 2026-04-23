import InputField from '../InputField';
import TextAreaField from '../TextAreaField';
import useAttributeTree from '../../hooks/useAttributeTree';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import FormLayout from '../../layouts/FormLayout';
import useCreateActionMutation from '../../hooks/useCreateActionMutation/useCreateActionMutation';
import { useParams } from 'react-router-dom';
import useDeleteActionMutation from '../../hooks/useDeleteActionMutation/useDeleteActionMutation';
import useActions from '../../hooks/useActions';
import { Action } from 'src/types/action';
import Divider from '../Divider';
import ArrowHeader2 from '../ArrowHeader2';
import ModifierField from '../formFields/ModifierField';
import InputSelectField from '../InputSelectField';
import KeywordLinkField from '../formFields/KeywordLinkField';
import useActionForm from 'src/hooks/form hooks/useActionForm';
import BtnAuth from '../buttons/BtnAuth';

const ActionForm = () => {
  const { actionId } = useParams();

  const actions = useActions();

  const action = actions.filteredActions?.filter(
    (action: Action) => action.id === Number(actionId),
  )[0];

  const createAction = useCreateActionMutation(Number(actionId));
  const deleteAction = useDeleteActionMutation(Number(actionId));

  const { emptyAttributeTree } = useAttributeTree();

  const actionForm = useActionForm(createAction, action);

  return (
    <FormLayout
      label="Action"
      form={actionForm}
      itemId={actionId}
      createMutation={createAction}
      deleteMutation={deleteAction}
    >
      <ArrowHeader2 title="Action Information" />
      <actionForm.Field name="name">
        {(field) => (
          <InputField className="grow" label="Action name" field={field} />
        )}
      </actionForm.Field>
      <actionForm.Field name="actionType">
        {(field) => (
          <InputSelectField
            options={['action', 'extendedAction', 'reaction', 'passive']}
            label="Action Type"
            field={field}
          />
        )}
      </actionForm.Field>
      <actionForm.Field name="roll" mode="array">
        {(field) => {
          return (
            <div className="flex w-full flex-col gap-4 sm:gap-6 lg:gap-8">
              {field.state.value.map((_, j: number) => (
                <div key={j} className="flex w-full gap-4 sm:gap-6 lg:gap-8">
                  <div className="flex w-full flex-col gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                    <actionForm.Field
                      name={`roll[${j}].attribute`}
                      listeners={{
                        onChange: () => {
                          actionForm.setFieldValue(`roll[${j}].skill`, '');
                        },
                      }}
                    >
                      {(field) => (
                        <InputSelectField
                          options={Object.keys(emptyAttributeTree)}
                          label="Attribute"
                          field={field}
                        />
                      )}
                    </actionForm.Field>
                    <actionForm.Subscribe
                      selector={(state) => state.values.roll[j].attribute}
                    >
                      {(attribute) => (
                        <actionForm.Field name={`roll[${j}].skill`}>
                          {(field) => {
                            return (
                              <InputSelectField
                                options={
                                  attribute
                                    ? Object.keys(
                                        emptyAttributeTree[attribute].skills,
                                      )
                                    : []
                                }
                                label="Skill"
                                field={field}
                              />
                            );
                          }}
                        </actionForm.Field>
                      )}
                    </actionForm.Subscribe>
                  </div>
                  <button
                    className="sm:-ml-2 lg:-ml-4"
                    onClick={() => field.removeValue(j)}
                    type="button"
                  >
                    <Icon
                      className="text-tertiary"
                      path={mdiClose}
                      size={1.25}
                    />
                  </button>
                </div>
              ))}
              <BtnAuth
                onClick={() => field.pushValue({ attribute: '', skill: '' })}
              >
                Add Roll
              </BtnAuth>
            </div>
          );
        }}
      </actionForm.Field>
      <actionForm.Field name="actionSubtypes" mode="array">
        {(field) => {
          return (
            <div className="flex flex-col gap-4">
              {field.state.value.map((_, i) => {
                return (
                  <div key={i} className="flex gap-2 sm:gap-4 lg:gap-6">
                    <actionForm.Field name={`actionSubtypes[${i}]`}>
                      {(subField) => {
                        return (
                          <InputSelectField
                            options={['attack', 'movement', 'upkeep', 'unique']}
                            label="Action Subtype"
                            field={subField}
                          />
                        );
                      }}
                    </actionForm.Field>
                    <button
                      className="sm:-ml-2 lg:-ml-4"
                      onClick={() => field.removeValue(i)}
                      type="button"
                    >
                      <Icon
                        className="text-tertiary"
                        path={mdiClose}
                        size={1.25}
                      />
                    </button>
                  </div>
                );
              })}
              <BtnAuth onClick={() => field.pushValue('')}>
                Add Action Subtype
              </BtnAuth>
            </div>
          );
        }}
      </actionForm.Field>
      <actionForm.Field name="duration">
        {(field) =>
          field.state.value ? (
            <div className="flex w-full items-center gap-4 lg:gap-8">
              <actionForm.Field name="duration.unit">
                {(field) => (
                  <InputSelectField
                    options={[
                      'second',
                      'minute',
                      'hour',
                      'day',
                      'action',
                      'reaction',
                      'turn',
                      'round',
                      'scene',
                      'session',
                    ]}
                    label="Effect Duration"
                    field={field}
                  />
                )}
              </actionForm.Field>
              <actionForm.Field
                name="duration.value"
                validators={{
                  onChange: ({ value }) =>
                    value && value <= 0 ? 'Minimum value is 1' : undefined,
                }}
              >
                {(field) => (
                  <InputField
                    className="w-full max-w-28"
                    type="number"
                    label="Dur. Value"
                    field={field}
                  />
                )}
              </actionForm.Field>
            </div>
          ) : (
            <BtnAuth
              onClick={() => field.handleChange({ unit: '', value: null })}
            >
              Add Effect Duration
            </BtnAuth>
          )
        }
      </actionForm.Field>
      <actionForm.Field name="cooldown">
        {(field) =>
          field.state.value ? (
            <div className="flex w-full items-center gap-4 lg:gap-8">
              <actionForm.Field name="cooldown.unit">
                {(field) => (
                  <InputSelectField
                    options={[
                      'second',
                      'minute',
                      'hour',
                      'day',
                      'action',
                      'reaction',
                      'turn',
                      'round',
                      'scene',
                      'session',
                    ]}
                    label="Cooldown Duration"
                    field={field}
                  />
                )}
              </actionForm.Field>
              <actionForm.Field
                name="cooldown.value"
                validators={{
                  onChange: ({ value }) =>
                    value && value <= 0 ? 'Minimum value is 1' : undefined,
                }}
              >
                {(field) => (
                  <InputField
                    className="w-full max-w-28"
                    type="number"
                    label="Cd. Value"
                    field={field}
                  />
                )}
              </actionForm.Field>
            </div>
          ) : (
            <BtnAuth
              onClick={() => field.handleChange({ unit: '', value: null })}
            >
              Add Effect Cooldown
            </BtnAuth>
          )
        }
      </actionForm.Field>
      <actionForm.Field name="description">
        {(field) => (
          <TextAreaField
            className="w-full"
            label="Action Description"
            field={field}
          />
        )}
      </actionForm.Field>
      <Divider />
      <ArrowHeader2 title="Action Costs" />
      <div className="grid grid-cols-2 gap-4">
        <actionForm.Field name="costs.currentActions">
          {(field) => (
            <InputField
              className="grow"
              type="number"
              label="Actions"
              field={field}
            />
          )}
        </actionForm.Field>
        <actionForm.Field name="costs.currentReactions">
          {(field) => (
            <InputField
              className="grow"
              type="number"
              label="Reactions"
              field={field}
            />
          )}
        </actionForm.Field>
        <actionForm.Field name="costs.currentPower">
          {(field) => (
            <InputField
              className="grow"
              type="number"
              label="Power"
              field={field}
            />
          )}
        </actionForm.Field>
        <actionForm.Field name="costs.currentHealth">
          {(field) => (
            <InputField
              className="grow"
              type="number"
              label="Health"
              field={field}
            />
          )}
        </actionForm.Field>
        <actionForm.Field name="costs.currentSanity">
          {(field) => (
            <InputField
              className="grow"
              type="number"
              label="Sanity"
              field={field}
            />
          )}
        </actionForm.Field>
        <actionForm.Field name="costs.wyrmShells">
          {(field) => (
            <InputField
              className="grow"
              type="number"
              label="Wyrm Shells"
              field={field}
            />
          )}
        </actionForm.Field>
        <actionForm.Field name="costs.currentAmmoCount">
          {(field) => (
            <InputField
              className="grow"
              type="number"
              label="Ammunition"
              field={field}
            />
          )}
        </actionForm.Field>
      </div>
      <Divider />
      <ModifierField form={actionForm} />
      <KeywordLinkField title="Trait Modifiers" form={actionForm} />
    </FormLayout>
  );
};

export default ActionForm;
