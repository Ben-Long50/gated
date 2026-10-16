import { useState } from 'react';
import { Link } from 'react-router-dom';
import InputField from '../formFields/InputField';
import BtnRect from '../buttons/BtnRect';
import useSignupMutation from '../../hooks/useSignupMutation/useSignupMutation';
import { useForm } from '@tanstack/react-form';
import Loading from '../Loading';
import AuthFormLayout from './AuthFormLayout';

const SignupForm = () => {
  const signupMutation = useSignupMutation();

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
      signupMutation.mutate(value);
    },
  });

  return (
    <AuthFormLayout form={signupForm}>
      <h1 className="font-zen mb-auto text-center">Sign Up</h1>
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
      <p className="text-tertiary mt-auto text-center">
        Already have an account?
        <Link to="/signin">
          <span className="pl-2 hover:underline">Sign in</span>
        </Link>
      </p>
    </AuthFormLayout>
  );
};

export default SignupForm;
