import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import InputField from '../formFields/InputField';
import BtnRect from '../buttons/BtnRect';
import Icon from '@mdi/react';
import { mdiFacebook, mdiGoogle } from '@mdi/js';
import BtnAuth from '../buttons/BtnAuth';
import { useForm } from '@tanstack/react-form';
import useSigninMutation from '../../hooks/useSigninMutation/useSigninMutation';
import Loading from '../Loading';
import apiUrl from 'src/utils/configureUrl';
import Divider from '../Divider';
import ArrowHeader1 from '../ArrowHeader1';
import AuthFormLayout from './AuthFormLayout';

const SigninForm = () => {
  const [errors, setErrors] = useState([]);

  const signinMutation = useSigninMutation(setErrors);

  const signinForm = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await signinMutation.mutate(value);
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorMessage = params.get('error');
    const statusCode = params.get('status');
    if (errorMessage) {
      setErrors([errorMessage]);
      console.log(`Error Code: ${statusCode}`);
    }
  }, []);

  const facebookSignin = () => {
    window.location.href = `${apiUrl}/auth/facebook/callback`;
  };

  const googleSignin = async () => {
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <AuthFormLayout form={signinForm}>
      <ArrowHeader1 className="font-zen" title="Sign in" />
      <div className="flex flex-col gap-4">
        <signinForm.Field
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
        </signinForm.Field>
        <signinForm.Field
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
        </signinForm.Field>
      </div>
      <BtnRect
        ariaLabel="Submit form"
        type="submit"
        className="group w-full min-w-40"
      >
        {signinMutation.isPending ? (
          <Loading
            className="group-hover:text-accent dark:text-gray-900"
            size={1.15}
          />
        ) : (
          'Sign in'
        )}
      </BtnRect>
      <div className="flex items-center">
        <Divider />
        <p className="mx-4 text-gray-400">or</p>
        <Divider />
      </div>
      <div className="grid grid-rows-2 gap-4">
        <BtnAuth
          onClick={() => {
            googleSignin();
          }}
        >
          <Icon
            className="mr-2 stroke-inherit text-inherit"
            path={mdiGoogle}
            size={1.5}
          />
          Google
        </BtnAuth>
        <BtnAuth
          onClick={() => {
            facebookSignin();
          }}
        >
          <Icon
            className="mr-2 stroke-inherit text-inherit"
            path={mdiFacebook}
            size={1.5}
          />
          Facebook
        </BtnAuth>
      </div>
      <p className="text-tertiary w-full text-center">
        Don't have an account?
        <Link to="/signup">
          <span className="pl-2 hover:underline">Sign up</span>
        </Link>
      </p>
      {errors?.length > 0 && (
        <div className="flex flex-col gap-3 self-start">
          <span className="text-primary">Error creating account:</span>
          {errors?.map((error, index) => (
            <p key={index} className="text-error">
              {error}
            </p>
          ))}
        </div>
      )}
    </AuthFormLayout>
  );
};

export default SigninForm;
