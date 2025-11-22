import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';
import { FieldApi } from '@tanstack/react-form';
import { Action } from 'src/types/action';
import { mdiChevronDown, mdiSync } from '@mdi/js';
import Icon from '@mdi/react';
import InputFieldBasic from './InputFieldBasic';
import Divider from './Divider';
import { Character } from 'src/types/character';
import { Keyword } from 'src/types/keyword';
import BtnIcon from './buttons/BtnIcon';
import { capitalCase } from 'change-case';
import { Campaign } from 'src/types/campaign';

type onChangeArg = Character | Action | Keyword | Campaign | string;

const InputSelectField = ({
  field,
  onChange,
  label,
  className,
  options,
  initialValue,
  reverse,
}: {
  field?: FieldApi;
  label: string;
  options: any[];
  initialValue?: string;
  onChange?: (value: onChangeArg) => void;
  className?: string;
  reverse?: boolean;
}) => {
  const [fieldColor, setFieldColor] = useState({
    border: 'transparent',
    background: 'bg-zinc-300 dark:bg-zinc-700',
  });
  const [focus, setFocus] = useState(false);
  const { accentPrimary, errorPrimary } = useContext(ThemeContext);
  const [query, setQuery] = useState('');
  const [value, setValue] = useState(field ? field.state.value : initialValue);

  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleValue = (newValue: string) => {
    if (inputRef.current) {
      inputRef.current.value = newValue;
      setValue(newValue);
      if (field) {
        field.handleChange(newValue);
      }
      if (onChange) {
        onChange(newValue);
      }
      setFocus(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const name = field ? field.name : label.toLowerCase();
  const errors = field ? field.state.meta.errors : [];
  const isPristine = field ? field.state.meta.isPristine : false;
  const isTouched = field
    ? field.state.meta.isTouched
    : false || value || focus;

  const handleBorder = () => {
    if (isTouched || (focus && errors?.length === 0)) {
      setFieldColor({
        border: accentPrimary,
        background: 'bg-primary',
      });
    } else if (!value && errors?.length === 0 && !focus) {
      setFieldColor({
        border: 'transparent',
        background: 'bg-zinc-300 dark:bg-zinc-700',
      });
    } else if (errors?.length > 0) {
      setFieldColor({
        border: errorPrimary,
        background: 'bg-primary',
      });
    } else if (value) {
      setFieldColor({
        border: accentPrimary,
        background: 'bg-primary',
      });
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

  useEffect(() => {
    handleBorder();
  }, [focus, field?.state]);

  const optionName = (option: any) => {
    if (!option) return '';
    if (option?.firstName) {
      return option.firstName + ' ' + option.lastName;
    } else if (option?.name) {
      return capitalCase(option.name);
    } else if (typeof option === 'number') {
      return option.toString();
    } else if (typeof option === 'string') {
      return capitalCase(option);
    } else return '';
  };

  const filteredOptions =
    options?.filter((item) => {
      return item
        ? optionName(item).toLowerCase().includes(query.toLowerCase())
        : '';
    }) || [];

  return (
    <div
      ref={selectRef}
      className={`${className} timing relative flex w-full items-center`}
    >
      <ThemeContainer
        className="grow"
        chamfer="small"
        borderColor={fieldColor.border}
      >
        <input
          ref={inputRef}
          className={`${fieldColor.border} ${fieldColor.background} text-secondary timing relative w-full rounded-none pb-2 pl-4 pr-2 pt-3 outline-none clip-4`}
          name={name}
          id={name}
          value={field ? optionName(field.state.value) : optionName(value)}
          onFocus={() => {
            setFocus(true);
          }}
          onChange={() => {
            handleBorder();
          }}
          readOnly
        />
        <label
          htmlFor={name}
          className={` ${errors?.length > 0 ? 'text-error' : ''} ${isTouched ? 'bg-primary text-accent -translate-y-6' : 'text-gray-400'} timing absolute left-5 top-3.5 transform cursor-text transition-all`}
        >
          {label}
        </label>
        <div
          className={`${focus ? 'max-h-96 py-3' : 'max-h-0'} ${!reverse ? 'top-full translate-y-2' : 'bottom-full -translate-y-5'} bg-secondary timing absolute left-0 z-10 flex w-full flex-col items-start overflow-hidden rounded-md px-3 shadow-lg shadow-zinc-950`}
        >
          <div className="flex w-full items-center gap-4">
            <InputFieldBasic
              className="w-full"
              label="Search"
              value={query}
              onChange={(value: string) => setQuery(value)}
            />
            <BtnIcon
              path={mdiSync}
              active={true}
              onClick={() => {
                handleValue('');
              }}
            />
          </div>
          <Divider />
          <div className="scrollbar-secondary flex w-full flex-col overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <button
                className="hover:bg-tertiary text-secondary w-full rounded-md p-2 text-left text-lg"
                key={index}
                value={optionName(option)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleValue(option);
                }}
              >
                <p>{optionName(option)}</p>
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
