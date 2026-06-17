import { mdiCheckboxBlankOutline, mdiCheckboxMarkedOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { ReactNode, useRef } from 'react';

const InputFieldCheckbox = ({
  className,
  active = true,
  label,
  value,
  checked,
  onChange,
}: {
  className?: string;
  active?: boolean;
  label?: ReactNode;
  value: any;
  checked: boolean;
  onChange: (value: any) => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      className={`${className} ${label ? 'w-full justify-between' : 'justify-end'} flex items-center gap-8`}
    >
      {label && (
        <label
          className={`${checked ? 'text-accent font-semibold' : 'text-secondary'} flex w-full grow cursor-text items-center gap-4 text-xl`}
        >
          {label}
        </label>
      )}
      <button
        className={`${!active && 'pointer-events-none opacity-50'}`}
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
