import InputField from '../formFields/InputField';
import Icon from '@mdi/react';
import { mdiSync } from '@mdi/js';
import FormLayout from '../../layouts/FormLayout';
import InputSelectField from '../formFields/InputSelectField';
import useUpdateUserRoleMutation from 'src/hooks/user hooks/useUpdateUserRoleMutation';
import AccountPicture from '../AccountPicture';
import ArrowHeader3 from '../ArrowHeader3';
import useUserRoleForm from 'src/hooks/form hooks/useUserRoleForm';
import useUsersByUsernameQuery from 'src/hooks/user hooks/useUsersByUsernameQuery';
import { useState } from 'react';
import IconBtnMedium from '../buttons/IconBtnMedium';
import Loading from '../Loading';
import InputFieldCheckbox from '../formFields/InputFieldCheckbox';
import Divider from '../Divider';
import ArrowHeader4 from '../ArrowHeader4';
import Page from '../Page';

const UserRoleForm = () => {
  const updateUserRoles = useUpdateUserRoleMutation();

  const [query, setQuery] = useState('');

  const { data: users, isLoading } = useUsersByUsernameQuery(query);
  const userRoleForm = useUserRoleForm(updateUserRoles);

  return (
    <Page title="Manage User Roles">
      <FormLayout
        form={userRoleForm}
        label="Update User Roles"
        createMutation={updateUserRoles}
      >
        <div className="flex w-full items-center gap-4">
          <InputField
            label="Search Users"
            value={query}
            onChange={(value) => {
              setQuery(value);
            }}
          />
          <IconBtnMedium onClick={() => setQuery('')} tooltip="Reset Search">
            <Icon path={mdiSync} />
          </IconBtnMedium>
        </div>
        <ArrowHeader3 title="Users" />
        <userRoleForm.Field name="users">
          {(field) =>
            isLoading ? (
              <Loading />
            ) : (
              users?.map((user) => {
                const checked = field.state.value.some(
                  (value) => value.id === user.id,
                );
                return (
                  <InputFieldCheckbox
                    label={
                      <div className="flex items-center gap-4">
                        <AccountPicture user={user} />
                        <ArrowHeader4
                          className="text-primary"
                          title={user.username}
                        />
                        <p className="text-tertiary text-base">{user.role}</p>
                      </div>
                    }
                    value={user.id}
                    checked={checked}
                    onChange={() => {
                      if (checked) {
                        field.handleChange((prev) =>
                          prev.filter((value) => value.id !== user.id),
                        );
                      } else {
                        field.handleChange((prev) => [
                          ...prev,
                          {
                            id: user.id,
                            username: user.username,
                            profilePicutre: user.profilePicture,
                            role: user.role,
                          },
                        ]);
                      }
                    }}
                  />
                );
              })
            )
          }
        </userRoleForm.Field>
        <userRoleForm.Subscribe selector={(state) => state.values.users}>
          {(users) =>
            users.length > 0 && (
              <>
                <Divider />
                <ArrowHeader3 title="Selected Users" />
              </>
            )
          }
        </userRoleForm.Subscribe>
        <userRoleForm.Field name="users" mode="array">
          {(field) =>
            field.state.value.map((user, index) => (
              <userRoleForm.Field name={`users[${index}].role`}>
                {(subfield) => (
                  <div className="flex w-full items-center justify-between gap-8">
                    <div className="flex w-full items-center gap-4">
                      <AccountPicture user={user} />
                      <ArrowHeader4
                        className="text-primary"
                        title={user.username}
                      />
                    </div>
                    <InputSelectField
                      reverse={true}
                      label="Role"
                      options={[
                        'SUPERADMIN',
                        'ADMIN',
                        'PROUSER',
                        'USER',
                        'GUEST',
                      ]}
                      value={user.role}
                      onChange={(value) => subfield.handleChange(value)}
                    />
                  </div>
                )}
              </userRoleForm.Field>
            ))
          }
        </userRoleForm.Field>
      </FormLayout>
    </Page>
  );
};

export default UserRoleForm;
