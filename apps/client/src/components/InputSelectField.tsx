import { useEffect, useRef, useState } from 'react';
import ThemeContainer from './ThemeContainer';
import { mdiChevronDown, mdiSync } from '@mdi/js';
import Icon from '@mdi/react';
import InputField from './InputField';
import Divider from './Divider';
import BtnIcon from './buttons/BtnIcon';
import constructName from 'src/utils/constructName';
import useInputState from 'src/hooks/useInputState';

const InputSelectField = ({
  options,
  label,
  value,
  onChange,
  errors,
  className,
  reverse,
}: {
  options: any[];
  label: string;
  value: string;
  onChange: (value: any) => void;
  errors?: string[];
  className?: string;
  reverse?: boolean;
}) => {
  const { fieldState, focus, setFocus } = useInputState(value, errors);
  const [query, setQuery] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleValue = (newValue: any) => {
    if (inputRef.current) {
      inputRef.current.value = newValue;
      onChange(newValue);

      setFocus(false);
      inputRef.current.blur();
    }
  };

  useEffect(() => {
    const minimizeSelect = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setFocus(false);
      }
    };

    document.addEventListener('click', minimizeSelect);

    return () => document.removeEventListener('click', minimizeSelect);
  }, []);

  const filteredOptions =
    options?.filter((entity) =>
      constructName(entity).toLowerCase().includes(query.toLowerCase()),
    ) || [];

  let displayValue =
    typeof value === 'number'
      ? constructName(options.find((option) => option.id === value))
      : constructName(value);

  return (
    <div
      ref={selectRef}
      className={`${className} timing relative flex w-full items-center`}
    >
      <ThemeContainer
        className="grow"
        chamfer="small"
        borderColor={fieldState.border}
      >
        <input
          ref={inputRef}
          className={`${className} ${fieldState.field} text-secondary timing focus:bg-primary scrollbar-secondary-2 h-full min-h-[250px] w-full grow rounded-none pb-2 pl-4 pt-3 text-xl outline-none clip-4`}
          value={displayValue}
          onFocus={() => {
            setFocus(true);
          }}
          readOnly
        />
        <label
          className={` ${fieldState.label} timing absolute left-5 top-3.5 transform cursor-text`}
        >
          {label}
        </label>
        <div
          className={`${focus ? 'max-h-96 py-3' : 'max-h-0'} ${!reverse ? 'top-full translate-y-2' : 'bottom-full -translate-y-5'} bg-secondary timing absolute left-0 z-10 flex w-full flex-col items-start overflow-hidden rounded-md px-3 shadow-lg shadow-zinc-950`}
        >
          <div className="flex w-full items-center gap-4">
            <InputField
              label="Search"
              value={query}
              onChange={(value) => setQuery(value)}
            />
            <BtnIcon
              path={mdiSync}
              active={true}
              onClick={() => {
                setQuery('');
              }}
            />
          </div>
          <Divider />
          <div className="scrollbar-secondary flex w-full flex-col overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <button
                className="hover:bg-tertiary text-secondary w-full rounded-md p-2 text-left text-lg"
                key={index}
                value={constructName(option)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleValue(option);
                }}
              >
                <p>{constructName(option)}</p>
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setFocus(!focus);
          }}
        >
          <Icon
            className="timing text-tertiary absolute right-2 top-2 size-9 rounded-full"
            path={mdiChevronDown}
            rotate={focus ? 180 : 0}
          />
        </button>
      </ThemeContainer>
      {errors &&
        errors?.map((error: string) => (
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

export default InputSelectField;
