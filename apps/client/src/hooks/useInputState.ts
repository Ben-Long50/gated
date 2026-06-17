import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';

const useInputState = (value: string | number, errors?: string[]) => {
  const { accentPrimary, errorPrimary } = useContext(ThemeContext);

  const activeState = {
    border: accentPrimary,
    field: 'bg-primary',
    label: 'bg-primary text-accent -translate-y-6',
  };
  const inactiveState = {
    border: 'transparent',
    field: 'bg-zinc-300 dark:bg-zinc-700',
    label: 'text-gray-400',
  };
  const errorState = {
    border: errorPrimary,
    field: 'bg-primary',
    label: 'text-error',
  };

  const [fieldState, setFieldState] = useState({
    border: 'transparent',
    field: 'bg-zinc-300 dark:bg-zinc-700',
    label: 'text-tertiary',
  });
  const [focus, setFocus] = useState(false);

  const handleBorder = () => {
    const length = value != null ? value.toString().length : 0;

    if (errors && errors.length > 0) {
      setFieldState(errorState);
    } else if (focus || length > 0) {
      setFieldState(activeState);
    } else {
      setFieldState(inactiveState);
    }
  };

  useEffect(() => {
    handleBorder();
  }, [focus, value]);

  return {
    fieldState,
    focus,
    setFocus,
  };
};

export default useInputState;
