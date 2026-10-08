import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import BtnRect from '../buttons/BtnRect';
import InputField from '../formFields/InputField';
import Divider from '../Divider';
import { User } from 'src/types/user';
import useUsersByUsernameQuery from 'src/hooks/user hooks/useUsersByUsernameQuery';
import { useState } from 'react';
import Loading from '../Loading';
import AccountPicture from '../AccountPicture';
import ArrowHeader4 from '../ArrowHeader4';
import InputFieldCheckbox from '../formFields/InputFieldCheckbox';

const PlayerSelectModal = () => {
  const { gangId } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const { form } = useOutletContext();

  const { data: users, isLoading } = useUsersByUsernameQuery(query);

  return (
    <>
      <h1>Select Campaign Players</h1>
      <InputField
        label="Search Players"
        value={query}
        onChange={(value) => setQuery(value)}
      />
      <div className="grid w-full grid-cols-[8fr_1fr_1fr] items-center gap-x-4">
        <h4>Username</h4>
        <p>Pending</p>
        <p>Confirmed</p>
      </div>
      {users && users?.length > 0 && (
        <Divider className="col-span-3 opacity-50" />
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid w-full grid-cols-[8fr_1fr_1fr] items-center gap-4">
          {users?.map((user: User) => (
            <Fragment key={user.id}>
              <div className="flex items-center gap-4">
                <AccountPicture user={user} />
                <ArrowHeader4 className="text-primary" title={user.username} />
              </div>
              <form.Field name="pendingPlayerIds">
                {(field) => (
                  <InputFieldCheckbox
                    value={user.id}
                    checked={field.state.value.some(
                      (id: number) => user.id === Number(id),
                    )}
                    onChange={(value) => {
                      field.handleChange((prev: number[]) => {
                        if (prev.some((id: number) => Number(value) === id)) {
                          return prev.filter(
                            (id: number) => Number(value) !== id,
                          );
                        } else {
                          return [...prev, Number(value)];
                        }
                      });
                    }}
                  />
                )}
              </form.Field>
              <form.Field name="playerIds">
                {(field) => (
                  <InputFieldCheckbox
                    value={user.id}
                    checked={field.state.value.some(
                      (id: number) => user.id === id,
                    )}
                    onChange={(value) => {
                      field.handleChange((prev: number[]) => {
                        if (prev.some((id: number) => Number(value) === id)) {
                          return prev.filter(
                            (id: number) => Number(value) !== id,
                          );
                        } else {
                          return [...prev, Number(value)];
                        }
                      });
                    }}
                  />
                )}
              </form.Field>
            </Fragment>
          ))}
        </div>
      )}
      <Divider />
      <BtnRect
        className="mt-auto"
        ariaLabel="Confirm"
        onClick={gangId ? () => form.handleSubmit() : () => navigate('..')}
      >
        Confirm Selection
      </BtnRect>
    </>
  );
};

export default PlayerSelectModal;
