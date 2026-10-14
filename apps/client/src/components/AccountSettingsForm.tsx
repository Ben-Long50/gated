import Loading from './Loading';
import InputField from './formFields/InputField';
import FormLayout from '../layouts/FormLayout';
import ArrowHeader2 from './ArrowHeader2';
import useUpdateAccountMutation from '../hooks/useUpdateAccountMutation/useUpdateAccountMutation';
import useAccountSettingsForm from 'src/hooks/form hooks/useAccountSettingsForm';
import { useParams } from 'react-router-dom';
import useUserQuery from 'src/hooks/user hooks/useUserQuery';
import Page from './Page';

const AccountSettingsForm = () => {
  const { userId } = useParams();

  const { data: account, isLoading } = useUserQuery(Number(userId));

  const updateAccount = useUpdateAccountMutation();

  const accountSettingsForm = useAccountSettingsForm(updateAccount, account);

  if (isLoading) return <Loading />;

  return (
    <Page title="Update Account Info">
      <FormLayout
        label="Account"
        itemId={userId}
        form={accountSettingsForm}
        createMutation={updateAccount}
      >
        <accountSettingsForm.Field
          name="username"
          validators={{
            onChange: ({ value }) =>
              value.length < 2
                ? 'Username name must be at least 4 characters long'
                : undefined,
          }}
        >
          {(field) => (
            <InputField
              label="Username"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </accountSettingsForm.Field>
        <accountSettingsForm.Field
          name="firstName"
          validators={{
            onChange: ({ value }) =>
              value.length < 2
                ? 'First name must be at least 2 characters long'
                : undefined,
          }}
        >
          {(field) => (
            <InputField
              label="First Name"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </accountSettingsForm.Field>
        <accountSettingsForm.Field
          name="lastName"
          validators={{
            onChange: ({ value }) =>
              value.length < 2
                ? 'Last name must be at least 2 characters long'
                : undefined,
          }}
        >
          {(field) => (
            <InputField
              label="Last Name"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </accountSettingsForm.Field>
        <accountSettingsForm.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              value.length < 2
                ? 'Email must be a valid email format'
                : undefined,
          }}
        >
          {(field) => (
            <InputField
              label="Email"
              type="email"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </accountSettingsForm.Field>
        <accountSettingsForm.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              value.length < 8
                ? 'Enter your password to change your account information securely'
                : undefined,
          }}
        >
          {(field) => (
            <InputField
              label="Password"
              type="password"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </accountSettingsForm.Field>
      </FormLayout>
    </Page>
  );
};

export default AccountSettingsForm;
