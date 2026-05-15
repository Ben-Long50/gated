import TextAreaField from '../TextAreaField';
import InputField from '../InputField';
import useCreateConditionMutation from '../../hooks/useCreateConditionMutation/useCreateConditionMutation';
import useDeleteConditionMutation from '../../hooks/useDeleteConditionMutation/useDeleteConditionMutation';
import FormLayout from '../../layouts/FormLayout';
import ArrowHeader2 from '../ArrowHeader2';
import InputSelectField from '../InputSelectField';
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
          <InputField className="grow" label="Condition Name" field={field} />
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
            className="grow"
            label="Condition Type"
            field={field}
            options={['character', 'item']}
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
