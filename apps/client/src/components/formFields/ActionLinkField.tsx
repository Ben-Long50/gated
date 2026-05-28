import { FormApi, useStore } from '@tanstack/react-form';
import { Action } from 'src/types/action';
import ActionCard from '../ActionCard';
import Icon from '@mdi/react';
import { mdiLinkVariantOff } from '@mdi/js';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useActionQueries from 'src/hooks/useActionsQuery/useActionQueries';
import BtnAuth from '../buttons/BtnAuth';
import Loading from '../Loading';
import IconBtnMedium from '../buttons/IconBtnMedium';
import ArrowHeader3 from '../ArrowHeader3';

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
            {actionIds.length > 0 && <ArrowHeader3 title="Linked Actions" />}
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
                          <ActionCard action={action} />
                          <IconBtnMedium
                            onClick={() => {
                              field.handleChange(
                                field.state.value.filter(
                                  (actionId: number) =>
                                    Number(actionId) !== action?.id,
                                ),
                              );
                            }}
                          >
                            <Icon path={mdiLinkVariantOff} />
                          </IconBtnMedium>
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
        onClick={() => {
          navigate('actions?mode=form');
        }}
      >
        Link Actions
      </BtnAuth>
    </>
  );
};

export default ActionLinkField;
