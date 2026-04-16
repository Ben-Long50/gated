import { FormApi } from '@tanstack/react-form';
import ArrowHeader2 from '../ArrowHeader2';
import { capitalCase } from 'change-case';
import ThemeContainer from '../ThemeContainer';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';
import BtnAuth from '../buttons/BtnAuth';

const ModifierField = ({ form }: { form: FormApi }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const setBackgroundPath = useModalStore((state) => state.setBackgroundPath);

  const openModifierModal = () => {
    setBackgroundPath(location.pathname);
    navigate('modifiers');
  };

  return (
    <>
      <BtnAuth onClick={() => openModifierModal()}>Add Stat Modifiers</BtnAuth>
      <form.Field name="modifiers">
        {(field) => {
          const modifiedStats = Object.entries(field.state.value) || [];

          return (
            <>
              {parts[parts.length - 1] === 'modifiers' && (
                <Outlet context={{ form, field }} />
              )}
              {modifiedStats.length > 0 && (
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  <ArrowHeader2 title="Stat Modifiers" className="col-span-2" />
                  {modifiedStats.map(([stat, value]) => (
                    <ThemeContainer
                      key={stat}
                      className="mb-auto"
                      borderColor="transparent"
                      chamfer="small"
                    >
                      <div className="bg-secondary flex w-full items-center justify-between gap-8 p-4 clip-4">
                        <h4>{capitalCase(stat)}</h4>
                        <h4
                          className={`${value > 0 || typeof value === 'string' ? 'text-accent' : 'text-error'}`}
                        >
                          {typeof value === 'number'
                            ? value
                            : capitalCase(value)}
                        </h4>
                      </div>
                    </ThemeContainer>
                  ))}
                </div>
              )}
            </>
          );
        }}
      </form.Field>
    </>
  );
};

export default ModifierField;
