import ThemeContainer from './ThemeContainer';
import useInputState from 'src/hooks/useInputState';

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
  const { fieldState, setFocus } = useInputState(value, errors);

  return (
    <div className={`${className} h-full min-h-[250px]`}>
      <ThemeContainer
        chamfer="small"
        className="w-full"
        borderColor={fieldState.border}
      >
        <textarea
          className={`${fieldState.field} timing scrollbar-secondary-2 h-full w-full grow rounded-bl rounded-tr pb-2 pl-4 pt-3 text-xl outline-none clip-4`}
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
