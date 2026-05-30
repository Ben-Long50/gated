import FormLayout from '../layouts/FormLayout';
import InputField from './formFields/InputField';
import useCreateErrorReportMutation from '../hooks/useCreateErrorReportMutation/useCreateErrorReportMutation';
import TextAreaField from './formFields/TextAreaField';
import ArrowHeader2 from './ArrowHeader2';
import useErrorReportForm from 'src/hooks/form hooks/useErrorReportForm';

const ErrorReport = () => {
  const createErrorReport = useCreateErrorReportMutation();

  const errorReportForm = useErrorReportForm(createErrorReport);

  return (
    <FormLayout
      label="Error Report"
      form={errorReportForm}
      createMutation={createErrorReport}
    >
      <ArrowHeader2 title="Report Information" />
      <errorReportForm.Field
        name="title"
        validators={{
          onSubmit: ({ value }) =>
            value.length < 2 ? 'You gotta have a title' : undefined,
        }}
      >
        {(field) => (
          <InputField
            label="Title"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </errorReportForm.Field>
      <errorReportForm.Field
        name="content"
        validators={{
          onChange: ({ value }) =>
            value.length < 10 ? 'Tell me something substantial' : undefined,
          onSubmit: ({ value }) =>
            value.length > 500
              ? "Ok that's too many words calm down"
              : undefined,
        }}
      >
        {(field) => (
          <TextAreaField
            label="Describe the error"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </errorReportForm.Field>
      <errorReportForm.Subscribe selector={(state) => [state.values.content]}>
        {([content]) => (
          <p className="text-tertiary self-end text-base">{`${content.length} / 500`}</p>
        )}
      </errorReportForm.Subscribe>
    </FormLayout>
  );
};

export default ErrorReport;
