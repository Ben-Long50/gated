import { FormApi, useStore } from '@tanstack/react-form';
import { Action } from 'src/types/action';
import ActionCard from '../ActionCard';
import Icon from '@mdi/react';
import { mdiLinkVariantOff } from '@mdi/js';
import ArrowHeader2 from '../ArrowHeader2';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useActionQueries from 'src/hooks/useActionsQuery/useActionQueries';
import BtnAuth from '../buttons/BtnAuth';
import Loading from '../Loading';

const ActionLinkField = ({ form }: { form: FormApi }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const actionIds = useStore(form.store, (state) => state.values.actionIds);
  const { actions, isLoading } = useActionQueries(actionIds);

  return (
    <>
      <form.Subscribe selector={(state) => state.values.actionIds}>
        {(actionIds: number[]) => (
          <>
            {actionIds.length > 0 && <ArrowHeader2 title="Linked Actions" />}
            <form.Field name="actionIds">
              {(field) => (
                <>
                  {parts[parts.length - 1] === 'actions' && (
                    <Outlet context={{ field, parts }} />
                  )}
                  {isLoading ? (
                    <Loading />
                  ) : (
                    actions?.map((action: Action) => {
                      return (
                        <div
                          className="flex items-center gap-4"
                          key={action?.id}
                        >
                          <ActionCard action={action} mode="form" />
                          <button
                            className="shadow-color hover:border-accent timing bg-secondary group rounded border-2 border-transparent p-4"
                            onClick={() => {
                              field.handleChange(
                                field.state.value.filter(
                                  (actionId: number) => actionId !== action?.id,
                                ),
                              );
                            }}
                          >
                            <Icon
                              className="text-primary timing group-hover:text-accent"
                              path={mdiLinkVariantOff}
                              size={1.2}
                            />
                          </button>
                        </div>
                      );
                    })
                  )}
                </>
              )}
            </form.Field>
          </>
        )}
      </form.Subscribe>
      <BtnAuth
        className="w-full min-w-48"
        ariaLabel="Open link action modal"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          navigate('actions?mode=form');
        }}
      >
        Link Actions
      </BtnAuth>
    </>
  );
};

export default ActionLinkField;
