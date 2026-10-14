import InputField from '../formFields/InputField';
import TextAreaField from '../formFields/TextAreaField';
import useCreatePerkMutation from '../../hooks/useCreatePerkMutation/useCreatePerkMutation';
import FormLayout from '../../layouts/FormLayout';
import { useParams } from 'react-router-dom';
import useDeletePerkMutation from '../../hooks/useDeletePerkMutation/useDeletePerkMutation';
import Divider from '../Divider';
import ArrowHeader2 from '../ArrowHeader2';
import AttributeField from '../formFields/AttributeField';
import usePerkForm from 'src/hooks/form hooks/usePerkForm';
import usePerkQuery from 'src/hooks/usePerkQuery/usePerkQuery';
import InputSelectField from '../formFields/InputSelectField';
import ActionLinkField from '../formFields/ActionLinkField';
import Page from '../Page';

const PerkForm = () => {
  const { perkId } = useParams();

  const { data: perk } = usePerkQuery(Number(perkId));

  const createPerk = useCreatePerkMutation(Number(perkId));
  const deletePerk = useDeletePerkMutation(Number(perkId));

  const perkForm = usePerkForm(createPerk, perk);

  return (
    <Page
      title={perkId ? 'Update Perk' : 'Create Perk'}
      context={{ form: perkForm }}
    >
      <FormLayout
        label="Perk"
        form={perkForm}
        itemId={perkId}
        createMutation={createPerk}
        deleteMutation={deletePerk}
      >
        <ArrowHeader2 title="Perk Information" />
        <perkForm.Field name="name">
          {(field) => (
            <InputField
              label="Perk Name"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </perkForm.Field>
        <perkForm.Field name="type">
          {(field) => (
            <InputSelectField
              label="Perk Type"
              options={['character', 'monster']}
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </perkForm.Field>
        <perkForm.Field name="description">
          {(field) => (
            <TextAreaField
              label="Perk description"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </perkForm.Field>
        <ActionLinkField form={perkForm} />
        <Divider />
        <ArrowHeader2 title="Perk Requirements" />
        <AttributeField form={perkForm} />
      </FormLayout>
    </Page>
  );
};

export default PerkForm;
