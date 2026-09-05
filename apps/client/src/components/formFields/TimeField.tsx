import { FormApi, useStore } from '@tanstack/react-form';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';
import IconBtnSmall from '../buttons/IconBtnSmall';
import Icon from '@mdi/react';

const TimeField = ({
  form,
  className,
}: {
  form: FormApi;
  className?: string;
}) => {
  const hour = useStore(form.store, (state) => state.values.time.hour);
  const minute = useStore(form.store, (state) => state.values.time.minute);
  const second = useStore(form.store, (state) => state.values.time.second);

  const time = new Date();
  time.setHours(hour);
  time.setMinutes(minute);
  time.setSeconds(second);
  time.setMilliseconds(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', clear);

    return () => document.removeEventListener('mouseup', clear);
  });

  return (
    <div className={`${className} flex items-center gap-1`}>
      <form.Field name="time.hour">
        {(field) => (
          <div className="flex min-w-20 flex-col gap-4">
            <IconBtnSmall
              active={true}
              tooltip="Increase"
              onClick={() => {
                field.handleChange(field.state.value + 1);
              }}
              onMouseDown={() => {
                if (intervalRef.current) return;
                intervalRef.current = setInterval(() => {
                  field.handleChange(field.state.value + 1);
                }, 100);
              }}
              onMouseUp={clear}
            >
              <Icon path={mdiChevronUp} />
            </IconBtnSmall>
            <h1 className="text-center text-5xl">{format(time, 'HH')}</h1>
            <IconBtnSmall
              active={true}
              tooltip="Decrease"
              onClick={() => {
                field.handleChange(field.state.value - 1);
              }}
              onMouseDown={() => {
                if (intervalRef.current) return;
                intervalRef.current = setInterval(() => {
                  field.handleChange(field.state.value - 1);
                }, 100);
              }}
              onMouseUp={clear}
            >
              <Icon path={mdiChevronDown} />
            </IconBtnSmall>
          </div>
        )}
      </form.Field>
      <h1 className="text-5xl">:</h1>
      <form.Field name="time.minute">
        {(field) => (
          <div className="flex min-w-20 flex-col gap-4">
            <IconBtnSmall
              active={true}
              tooltip="Increase"
              onClick={() => {
                field.handleChange(field.state.value + 1);
              }}
              onMouseDown={() => {
                if (intervalRef.current) return;
                intervalRef.current = setInterval(() => {
                  field.handleChange(field.state.value + 1);
                }, 100);
              }}
              onMouseUp={clear}
            >
              <Icon path={mdiChevronUp} />
            </IconBtnSmall>
            <h1 className="text-center text-5xl">{format(time, 'mm')}</h1>
            <IconBtnSmall
              active={true}
              tooltip="Decrease"
              onClick={() => {
                field.handleChange(field.state.value - 1);
              }}
              onMouseDown={() => {
                if (intervalRef.current) return;
                intervalRef.current = setInterval(() => {
                  field.handleChange(field.state.value - 1);
                }, 100);
              }}
              onMouseUp={clear}
            >
              <Icon path={mdiChevronDown} />
            </IconBtnSmall>
          </div>
        )}
      </form.Field>
      <h1 className="text-5xl">:</h1>
      <form.Field name="time.second">
        {(field) => (
          <div className="flex min-w-20 flex-col gap-4">
            <IconBtnSmall
              active={true}
              tooltip="Increase"
              onClick={() => {
                field.handleChange(field.state.value + 1);
              }}
              onMouseDown={() => {
                if (intervalRef.current) return;
                intervalRef.current = setInterval(() => {
                  field.handleChange(field.state.value + 1);
                }, 100);
              }}
              onMouseUp={clear}
            >
              <Icon path={mdiChevronUp} />
            </IconBtnSmall>

            <h1 className="text-center text-5xl">{format(time, 'ss')}</h1>
            <IconBtnSmall
              active={true}
              tooltip="Decrease"
              onClick={() => {
                field.handleChange(field.state.value - 1);
              }}
              onMouseDown={() => {
                if (intervalRef.current) return;
                intervalRef.current = setInterval(() => {
                  field.handleChange(field.state.value - 1);
                }, 100);
              }}
              onMouseUp={clear}
            >
              <Icon path={mdiChevronDown} />
            </IconBtnSmall>
          </div>
        )}
      </form.Field>
    </div>
  );
};

export default TimeField;
