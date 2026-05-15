import { useContext, useEffect, useState } from 'react';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';

const TextAreaField = ({
  label,
  value,
  onChange,
  errors,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  errors?: string[];
  className?: string;
}) => {
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
    if (errors && errors.length > 0) {
      setFieldState(errorState);
    } else if (focus || value.length > 0) {
      setFieldState(activeState);
    } else {
      setFieldState(inactiveState);
    }
  };

  useEffect(() => {
    handleBorder();
  }, [focus, value]);

  return (
    <div className="h-full min-h-[250px] grow">
      <ThemeContainer
        chamfer="small"
        className={`mx-auto h-full w-full flex-col`}
        borderColor={fieldState.border}
      >
        <textarea
          className={`${className} ${fieldState.field} text-secondary timing focus:bg-primary scrollbar-secondary-2 h-full min-h-[250px] w-full grow rounded-none pb-2 pl-4 pt-3 text-xl outline-none clip-4`}
          value={value}
          onFocus={() => {
            setFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
          }}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
        <label
          className={` ${fieldState.label} timing absolute left-5 top-3.5 transform cursor-text`}
        >
          {label}
        </label>
      </ThemeContainer>
      {errors &&
        errors.map((error: string) => (
          <p
            key={error}
            className="timing text-error mt-1 text-base italic leading-5"
            role="alert"
          >
            {error}
          </p>
        ))}
    </div>
  );
};

export default TextAreaField;
