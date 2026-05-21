import ThemeContainer from './ThemeContainer';
import useInputState from 'src/hooks/useInputState';

const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  errors,
  className,
}: {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number' | 'email' | 'password';
  errors?: string[];
  className?: string;
}) => {
  const { fieldState, setFocus } = useInputState(value, errors);

  return (
    <div className={`${className}`}>
      <ThemeContainer
        className={`${className} ml-auto`}
        chamfer="small"
        borderColor={fieldState.border}
      >
        <input
          className={`${className} ${fieldState.field} text-secondary timing focus:bg-primary scrollbar-secondary-2 h-full min-h-[250px] w-full grow rounded-none pb-2 pl-4 pt-3 text-xl outline-none clip-4`}
          type={type}
          value={value}
          onFocus={() => {
            setFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
          }}
          onChange={(e) => {
            onChange(
              type === 'number' ? Number(e.target.value) : e.target.value,
            );
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

export default InputField;
