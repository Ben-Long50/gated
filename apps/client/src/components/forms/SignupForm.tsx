import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import InputField from '../formFields/InputField';
import BtnRect from '../buttons/BtnRect';
import { ThemeContext } from '../../contexts/ThemeContext';
import ThemeContainer from '../ThemeContainer';
import useSignupMutation from '../../hooks/useSignupMutation/useSignupMutation';
import { useForm } from '@tanstack/react-form';
import Loading from '../Loading';
import ArrowHeader1 from '../ArrowHeader1';
import AuthFormLayout from './AuthFormLayout';

const SignupForm = () => {
  const [errors, setErrors] = useState([]);

  const { accentPrimary } = useContext(ThemeContext);

  const signupMutation = useSignupMutation(setErrors);

  const signupForm = useForm({
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      setErrors([]);
      signupMutation.mutate(value);
    },
  });

  return (
    <AuthFormLayout form={signupForm}>
      <ArrowHeader1 title="Sign up" />
      <div className="flex flex-col gap-4">
        <signupForm.Field
          name="username"
          validators={{
            onChange: ({ value }) =>
              value.length < 2
                ? 'Username must be at least 4 characters long'
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
        </signupForm.Field>
        <signupForm.Field
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
        </signupForm.Field>
        <signupForm.Field
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
        </signupForm.Field>
        <signupForm.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ? undefined
                : 'Email must be in a valid email format',
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
        </signupForm.Field>
        <signupForm.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              value.length < 8
                ? 'Password must be at least 8 characters long'
                : undefined,
          }}
        >
          {(field) => (
            <InputField
              type="password"
              label="Password"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </signupForm.Field>
        <signupForm.Field
          name="confirmPassword"
          validators={{
            onChange: ({ value }) =>
              value.length < 8
                ? 'Password must be at least 8 characters long'
                : undefined,
          }}
        >
          {(field) => (
            <InputField
              type="password"
              label="Confirm Password"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </signupForm.Field>
      </div>
      <BtnRect
        ariaLabel="Submit form"
        type="submit"
        className="group w-full min-w-40"
      >
        {signupMutation.isPending ? (
          <Loading
            className="group-hover:text-accent dark:text-gray-900"
            size={1.15}
          />
        ) : (
          'Sign up'
        )}
      </BtnRect>
      <p className="text-tertiary text-center">
        Already have an account?
        <Link to="/signin">
          <span className="pl-2 hover:underline">Sign in</span>
        </Link>
      </p>
      {errors?.length > 0 && (
        <div className="flex flex-col gap-3 self-start">
          <span className="text-primary">Error creating account:</span>
          {errors.map((error, index) => (
            <p key={index} className="text-error">
              {error}
            </p>
          ))}
        </div>
      )}
    </AuthFormLayout>
  );
};

export default SignupForm;
