import Loading from './Loading';
import InputField from './InputField';
import FormLayout from '../layouts/FormLayout';
import ArrowHeader2 from './ArrowHeader2';
import useUpdateAccountMutation from '../hooks/useUpdateAccountMutation/useUpdateAccountMutation';
import useAccountSettingsForm from 'src/hooks/form hooks/useAccountSettingsForm';
import { useParams } from 'react-router-dom';
import useUserQuery from 'src/hooks/user hooks/useUserQuery';

const AccountSettingsForm = () => {
  const { userId } = useParams();

  const { data: account, isLoading } = useUserQuery(Number(userId));

  const updateAccount = useUpdateAccountMutation();

  const accountSettingsForm = useAccountSettingsForm(updateAccount, account);

  if (isLoading) return <Loading />;

  return (
    <FormLayout
      label="Account"
      itemId={userId}
      form={accountSettingsForm}
      createMutation={updateAccount}
    >
      <ArrowHeader2 title="Account Information" />
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
          <InputField className="grow" label="Username" field={field} />
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
          <InputField className="grow" label="First Name" field={field} />
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
          <InputField className="grow" label="Last Name" field={field} />
        )}
      </accountSettingsForm.Field>
      <accountSettingsForm.Field
        name="email"
        validators={{
          onChange: ({ value }) =>
            value.length < 2 ? 'Email must be a valid email format' : undefined,
        }}
      >
        {(field) => (
          <InputField
            className="grow"
            label="Email"
            type="email"
            field={field}
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
            className="grow"
            label="Password"
            type="password"
            field={field}
          />
        )}
      </accountSettingsForm.Field>
    </FormLayout>
  );
};

export default AccountSettingsForm;
