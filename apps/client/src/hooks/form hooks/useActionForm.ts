import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Action, ActionCosts } from 'src/types/action';

const useActionForm = (
  mutation: UseMutationResult<any, Error, any>,
  action?: Action,
) => {
  const actionForm = useForm({
    defaultValues: {
      id: action?.id || 0,
      name: action?.name || '',
      costs: {
        currentActions: action?.costs?.currentActions || '',
        currentReactions: action?.costs?.currentReactions || '',
        currentPower: action?.costs?.currentPower || '',
        currentHealth: action?.costs?.currentHealth || '',
        currentSanity: action?.costs?.currentSanity || '',
        wyrmShells: action?.costs?.wyrmShells || '',
        currentAmmoCount: action?.costs?.currentAmmoCount || '',
      },
      roll:
        action?.roll ||
        ([] as {
          attribute: string;
          skill: string;
        }[]),
      actionType: action?.actionType || '',
      actionSubtypes: action?.actionSubtypes || ([] as string[]),
      duration:
        action?.duration ||
        ({ unit: '', value: null } as { unit: string; value: number | null }),
      cooldown:
        action?.cooldown ||
        ({ unit: '', value: null } as { unit: string; value: number | null }),
      description: action?.description || '',
      modifiers: action?.modifiers || {},
      keywords:
        action?.keywordModifiers.map((keyword) => ({
          keywordId: keyword.keyword.id,
          value: keyword.value,
        })) || ([] as { keywordId: number; value: number | null }[]),
    },
    onSubmit: async ({ value }) => {
      const filteredSubtypes = value.actionSubtypes.filter(
        (subtype) => subtype.length,
      );

      const filteredCosts = Object.fromEntries(
        Object.entries(value.costs).filter(([_, value]) => value),
      ) as ActionCosts;

      const { keywords, ...rest } = value;

      const data = {
        ...rest,
        actionSubtypes: filteredSubtypes,
        costs: filteredCosts,
        keywordModifierIds: keywords,
      };

      await mutation.mutate(data);
    },
  });

  return actionForm;
};

export default useActionForm;
