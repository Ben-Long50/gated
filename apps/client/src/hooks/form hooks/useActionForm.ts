import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Action, ActionCosts } from 'src/types/action';
import { filterFormData } from './constructFormData';

const useActionForm = (
  mutation: UseMutationResult<any, Error, any>,
  action?: Action,
) => {
  const actionForm = useForm({
    defaultValues: {
      id: action?.id ?? 0,
      name: action?.name ?? '',
      costs: {
        currentActions: action?.costs?.currentActions ?? null,
        currentReactions: action?.costs?.currentReactions ?? null,
        currentPower: action?.costs?.currentPower ?? null,
        currentHealth: action?.costs?.currentHealth ?? null,
        currentSanity: action?.costs?.currentSanity ?? null,
        wyrmShells: action?.costs?.wyrmShells ?? null,
        currentAmmoCount: action?.costs?.currentAmmoCount ?? null,
      },
      roll:
        action?.roll ??
        ([] as {
          attribute: string;
          skill: string;
        }[]),
      actionType: action?.actionType ?? '',
      actionSubtypes: action?.actionSubtypes ?? ([] as string[]),
      duration:
        action?.duration ??
        (null as { unit: string; value: number | null } | null),
      cooldown:
        action?.cooldown ??
        (null as { unit: string; value: number | null } | null),
      description: action?.description ?? '',
      modifiers: action?.modifiers ?? ({} as Record<string, number>),
      keywords:
        action?.keywordModifiers.map((keyword) => ({
          keywordId: keyword.keyword.id,
          value: keyword.value,
        })) ?? ([] as { keywordId: number; value: number | null }[]),
    },
    onSubmit: async ({ value }) => {
      const filteredSubtypes = value.actionSubtypes.filter(
        (subtype) => subtype.length,
      );

      const filteredCosts = Object.fromEntries(
        Object.entries(value.costs).filter(([_, value]) => value !== null),
      ) as ActionCosts;

      const data = {
        ...value,
        actionSubtypes: filteredSubtypes,
        costs: filteredCosts,
      };

      const filteredData = filterFormData(data);

      await mutation.mutate(filteredData);
    },
    // validators: {
    //   onSubmit: ({ value }) => {
    //     const errors = [];
    //     if (value.name.length < 2) {
    //       errors.push('Action name is too short');
    //     }
    //     if (value.name.length > 100) {
    //       errors.push('Action name is too long');
    //     }
    //     if (!value.actionType) {
    //       errors.push('An action type must be selected');
    //     }
    //     if (value.description.length < 10) {
    //       errors.push('Action description is too short');
    //     }
    //     if (value.description.length > 250) {
    //       errors.push('Action description is too long');
    //     }

    //     return errors.length > 0 ? errors.join(',') : undefined;
    //   },
    // },
  });

  return actionForm;
};

export default useActionForm;
