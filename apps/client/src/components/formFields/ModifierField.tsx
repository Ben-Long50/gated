import { FormApi } from '@tanstack/react-form';
import BtnAuth from '../buttons/BtnAuth';
import StatBarContainer from '../StatBarContainer';
import ArrowHeader2 from '../ArrowHeader2';
import StatBars from '../StatBars';
import { useNavigateWithQuery } from 'src/hooks/useNavigateWithQuery';
import { useContext } from 'react';
import { LayoutContext } from 'src/contexts/LayoutContext';

const ModifierField = ({ form }: { form: FormApi }) => {
  const { mobile } = useContext(LayoutContext);
  const navigate = useNavigateWithQuery();

  const size = mobile ? 'small' : 'large';

  return (
    <>
      <ArrowHeader2 title="Stat Modifiers" />
      <form.Field name="modifiers">
        {(field) => {
          const modifiedStats = Object.entries(field.state.value) || [];

          return (
            <>
              {modifiedStats.length > 0 && (
                <StatBarContainer size={size}>
                  <StatBars size={size} stats={field.state.value} />
                </StatBarContainer>
              )}
            </>
          );
        }}
      </form.Field>
      <BtnAuth
        className="w-full min-w-48"
        onClick={() => {
          navigate('modal/modifiers');
        }}
      >
        Add Stat Modifiers
      </BtnAuth>
    </>
  );
};

export default ModifierField;
