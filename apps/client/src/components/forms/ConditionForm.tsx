import TextAreaField from '../formFields/TextAreaField';
import InputField from '../formFields/InputField';
import useCreateConditionMutation from '../../hooks/useCreateConditionMutation/useCreateConditionMutation';
import useDeleteConditionMutation from '../../hooks/useDeleteConditionMutation/useDeleteConditionMutation';
import FormLayout from '../../layouts/FormLayout';
import ArrowHeader2 from '../ArrowHeader2';
import InputSelectField from '../formFields/InputSelectField';
import useConditionForm from 'src/hooks/form hooks/useConditionForm';
import useConditionQuery from 'src/hooks/useConditionQuery/useConditionQuery';
import { useParams } from 'react-router-dom';

const ConditionForm = () => {
  const { conditionId } = useParams();

  const condition = useConditionQuery(Number(conditionId));

  const createCondition = useCreateConditionMutation(Number(conditionId));
  const deleteCondition = useDeleteConditionMutation(Number(conditionId));

  const conditionForm = useConditionForm(createCondition, condition);

  return (
    <FormLayout
      label="Condition"
      form={conditionForm}
      itemId={conditionId}
      createMutation={createCondition}
      deleteMutation={deleteCondition}
    >
      <ArrowHeader2 title="Condition Information" />
      <conditionForm.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            value.length < 2
              ? 'Condition name must be at least 2 characters long'
              : undefined,
        }}
      >
        {(field) => (
          <InputField
            label="Condition Name"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </conditionForm.Field>
      <conditionForm.Field
        name="type"
        validators={{
          onChange: ({ value }) =>
            value.length < 1 ? 'A condition type must be selected' : undefined,
        }}
      >
        {(field) => (
          <InputSelectField
            label="Condition Type"
            options={['character', 'item']}
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </conditionForm.Field>
      <conditionForm.Field
        name="description"
        validators={{
          onChange: ({ value }) =>
            value.length < 2
              ? 'Condition description must be at least 2 characters long'
              : undefined,
        }}
      >
        {(field) => (
          <TextAreaField
            label="Condition Description"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </conditionForm.Field>
    </FormLayout>
  );
};

export default ConditionForm;
