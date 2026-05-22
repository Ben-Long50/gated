import { mdiCheckboxBlankOutline, mdiCheckboxMarkedOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useRef } from 'react';

const InputFieldCheckbox = ({
  className,
  label,
  value,
  checked,
  onChange,
}: {
  className?: string;
  label?: string;
  value: any;
  checked: boolean;
  onChange: (value: any) => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      className={`${className} flex w-full items-center justify-between gap-8`}
    >
      {label && (
        <label
          className={`${checked ? 'text-accent font-semibold' : 'text-secondary'} w-full grow cursor-text text-xl`}
        >
          {label}
        </label>
      )}
      <button
        onClick={(e) => {
          e.preventDefault();
          inputRef.current?.click();
        }}
      >
        <Icon
          path={checked ? mdiCheckboxMarkedOutline : mdiCheckboxBlankOutline}
          size={1.5}
          className={`${checked ? 'text-accent' : 'text-secondary'}`}
        />
      </button>
      <input
        ref={inputRef}
        hidden
        type="checkbox"
        value={value}
        checked={checked}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
};

export default InputFieldCheckbox;
