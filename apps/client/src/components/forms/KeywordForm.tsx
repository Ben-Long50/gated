import InputField from '../InputField';
import TextAreaField from '../TextAreaField';
import useCreateKeywordMutation from '../../hooks/useCreateKeywordMutation/useCreateKeywordMutation';
import FormLayout from '../../layouts/FormLayout';
import { useParams } from 'react-router-dom';
import useDeleteKeywordMutation from '../../hooks/useDeleteKeywordMutation/useDeleteKeywordMutation';
import ArrowHeader2 from '../ArrowHeader2';
import InputSelectField from '../InputSelectField';
import useKeywordForm from 'src/hooks/form hooks/useKeywordForm';
import useKeywordQuery from 'src/hooks/useKeywordQuery/useKeywordQuery';

const KeywordForm = () => {
  const { keywordId } = useParams();

  const { data: keyword } = useKeywordQuery(Number(keywordId));

  const createKeyword = useCreateKeywordMutation(Number(keywordId));

  const deleteKeyword = useDeleteKeywordMutation(Number(keywordId));

  const keywordForm = useKeywordForm(createKeyword, keyword);

  return (
    <FormLayout
      label="Keyword"
      form={keywordForm}
      itemId={keywordId}
      createMutation={createKeyword}
      deleteMutation={deleteKeyword}
    >
      <ArrowHeader2 title="Trait Information" />
      <keywordForm.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            value.length < 2
              ? 'Trait name must be at least 2 characters long'
              : undefined,
        }}
      >
        {(field) => (
          <InputField
            label="Trait Name"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </keywordForm.Field>
      <keywordForm.Field
        name="description"
        validators={{
          onChange: ({ value }) =>
            value.length < 2
              ? 'Trait description must be at least 2 characters long'
              : undefined,
        }}
      >
        {(field) => (
          <TextAreaField
            className="w-full"
            label="Trait Description"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </keywordForm.Field>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <keywordForm.Field
          name="keywordType"
          validators={{
            onSubmit: ({ value }) =>
              value.length < 1 ? 'You must select a trait type' : undefined,
          }}
        >
          {(field) => (
            <InputSelectField
              options={[
                'weapon',
                'armor',
                'vehicle',
                'chromebits',
                'hardwired',
                'networked',
              ]}
              label="Trait Type"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </keywordForm.Field>
        <keywordForm.Field
          name="gpCost"
          validators={{
            onSubmit: ({ value }) =>
              !value ? 'You must enter GP cost' : undefined,
          }}
        >
          {(field) => (
            <InputField
              type="number"
              label="GP Cost"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </keywordForm.Field>
      </div>
    </FormLayout>
  );
};

export default KeywordForm;
