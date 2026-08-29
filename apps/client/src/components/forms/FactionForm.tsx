import InputField from '../formFields/InputField';
import Loading from '../Loading';
import FormLayout from '../../layouts/FormLayout';
import { useParams } from 'react-router-dom';
import LexicalEditor from '../lexical/LexicalEditor';
import Divider from '../Divider';
import ArrowHeader2 from '../ArrowHeader2';
import useUpdateFactionMutation from '../../hooks/useUpdateFactionMutation/useUpdateFactionMutation';
import useDeleteFactionMutation from '../../hooks/useDeleteFactionMutation/useDeleteFactionMutation';
import PictureField from '../formFields/PictureField';
import useFactionForm from 'src/hooks/form hooks/useFactionForm';
import useFactionQuery from 'src/hooks/faction hooks/useFactionQuery';

const FactionForm = () => {
  const { campaignId, factionId } = useParams();

  const updateFaction = useUpdateFactionMutation(
    Number(campaignId),
    Number(factionId),
  );

  const {
    data: faction,
    isLoading,
    isPending,
  } = useFactionQuery(Number(factionId));

  const deleteFaction = useDeleteFactionMutation(
    Number(campaignId),
    Number(factionId),
  );

  const factionForm = useFactionForm(updateFaction, faction);

  if (isLoading || isPending) return <Loading />;

  return (
    <FormLayout
      label="Faction"
      form={factionForm}
      itemId={factionId}
      createMutation={updateFaction}
      deleteMutation={deleteFaction}
    >
      <ArrowHeader2 title="Basic Faction Information" />
      <factionForm.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            value.length < 2
              ? 'Faction name must be at least 2 characters long'
              : undefined,
        }}
      >
        {(field) => (
          <InputField
            label="Faction name"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </factionForm.Field>
      <PictureField form={factionForm} type="scene" />
      <Divider />
      <ArrowHeader2 title="Faction Background" />
      <factionForm.Field
        name="background"
        validators={{
          onChange: ({ value }) =>
            value.html.length < 20
              ? 'Section content has not met the minimum length requirement'
              : undefined,
        }}
      >
        {(field) => (
          <>
            <LexicalEditor field={field} />
            {field.state.meta.errors &&
              field.state.meta.errors.map((error, index) => (
                <p
                  key={index}
                  className="timing text-error text-base italic leading-5"
                  role="alert"
                >
                  {error}
                </p>
              ))}
          </>
        )}
      </factionForm.Field>
    </FormLayout>
  );
};

export default FactionForm;
