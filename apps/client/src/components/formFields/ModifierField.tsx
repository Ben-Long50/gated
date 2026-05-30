import { FormApi } from '@tanstack/react-form';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BtnAuth from '../buttons/BtnAuth';
import StatBarContainer from '../StatBarContainer';
import CharacterStatBars from '../characterComponents/CharacterStatBars';

const ModifierField = ({ form }: { form: FormApi }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  return (
    <>
      <form.Field name="modifiers">
        {(field) => {
          const modifiedStats = Object.entries(field.state.value) || [];

          return (
            <>
              {parts[parts.length - 1] === 'modifiers' && (
                <Outlet context={{ form, parts }} />
              )}
              {modifiedStats.length > 0 && (
                <StatBarContainer>
                  <CharacterStatBars stats={field.state.value} />
                </StatBarContainer>
              )}
            </>
          );
        }}
      </form.Field>
      <BtnAuth
        className="w-full min-w-48"
        onClick={() => {
          navigate('modifiers');
        }}
      >
        Add Stat Modifiers
      </BtnAuth>
    </>
  );
};

export default ModifierField;
