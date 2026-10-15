import ThemeContainer from '../ThemeContainer';
import useInputState from 'src/hooks/useInputState';

const TextAreaField = ({
  label,
  value,
  onChange,
  errors,
  className,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  errors?: string[];
  className?: string;
  placeholder?: string;
}) => {
  const { fieldState, focus, setFocus } = useInputState(value, errors);

  return (
    <div className={`${className} `}>
      <ThemeContainer
        className="h-32"
        chamfer="small"
        borderColor={fieldState.border}
      >
        <textarea
          className={`${fieldState.field} timing scrollbar-secondary-2 size-full h-full rounded-bl rounded-tr pl-4 pt-3 text-xl outline-none clip-4`}
          value={value}
          placeholder={focus && placeholder ? placeholder : undefined}
          onFocus={() => {
            setFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
          }}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/\n/g, ' ');
            onChange(cleaned);
          }}
        />
        <label
          className={`${fieldState.label} timing absolute left-5 top-3.5 transform cursor-text`}
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
