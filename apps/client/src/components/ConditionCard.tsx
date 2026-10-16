import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Condition } from '@gated/shared';
import ItemCardSmall from './ItemCardSmall';
import { FormApi } from '@tanstack/react-form';
import InputField from './formFields/InputField';
import InputFieldCheckbox from './formFields/InputFieldCheckbox';

const ConditionCard = ({
  condition,
  form,
}: {
  condition: Condition;
  form?: FormApi;
}) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex w-full items-center gap-4">
      <ItemCardSmall
        heading={
          <div className="flex w-full items-center justify-between gap-4 pr-2">
            <h3> {condition.name}</h3>
            <div
              className="pointer-events-auto -my-2 flex items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
                <Link to={`/glam/codex/conditions/${condition.id}/update`}>
                  <button className="text-accent hover:underline">Edit</button>
                </Link>
              )}
            </div>
            {form && (
              <form.Field name="conditions">
                {(field) => {
                  const conditionData =
                    field.state.value.find(
                      (c) => c.conditionId === condition.id,
                    ) || null;

                  return (
                    conditionData && (
                      <InputField
                        className="max-w-20 shrink-0"
                        type="number"
                        label="Stacks"
                        value={conditionData.stacks}
                        onChange={(stacks) => {
                          const updatedValue = field.state.value.map(
                            (c: {
                              conditionId: number;
                              stacks: number | null;
                            }) =>
                              c.conditionId === condition.id
                                ? {
                                    conditionId: condition.id,
                                    stacks,
                                  }
                                : c,
                          );
                          field.handleChange(updatedValue);
                        }}
                      />
                    )
                  );
                }}
              </form.Field>
            )}
          </div>
        }
      >
        <p className="text-secondary">{condition.description}</p>
      </ItemCardSmall>
      {form && (
        <form.Field name="conditions">
          {(field) => {
            const conditionData =
              field.state.value.find((c) => c.conditionId === condition.id) ||
              null;

            return (
              <InputFieldCheckbox
                value={condition.id}
                checked={conditionData}
                onChange={(value) => {
                  if (!conditionData) {
                    field.handleChange([
                      ...field.state.value,
                      { conditionId: Number(value), stacks: null },
                    ]);
                  } else {
                    field.handleChange(
                      field.state.value.filter(
                        (c: { conditionId: number; stacks: number | null }) =>
                          c.conditionId !== Number(value),
                      ),
                    );
                  }
                }}
              />
            );
          }}
        </form.Field>
      )}
    </div>
  );
};

export default ConditionCard;
