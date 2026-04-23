import {
  mdiFileDocumentOutline,
  mdiMinus,
  mdiPlus,
  mdiTrashCanOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useNavigate } from 'react-router-dom';
import useCharacterConditionStacksMutation from 'src/hooks/item stat hooks/useCharacterConditionStacksMutation/useCharacterConditionStacksMutation';
import useItemConditionStacksMutation from 'src/hooks/item stat hooks/useItemConditionStacksMutation/useItemConditionStacksMutation';
import useDeleteCharacterConditionMutation from 'src/hooks/useDeleteCharacterConditionMutation/useDeleteCharacterConditionMutation';
import useDeleteItemConditionMutation from 'src/hooks/useDeleteItemConditionMutation/useDeleteItemConditionMutation';
import { ConditionReference } from 'src/types/condition';
import RadialMenu from './RadialMenu';
import useRadialMenuStore from 'src/stores/radialMenuStore';

const ConditionRadialMenu = ({
  condition,
  containerRef,
}: {
  condition: ConditionReference;
  containerRef: ReactNode;
}) => {
  const navigate = useNavigate();

  const setMenuOpen = useRadialMenuStore((state) => state.setMenuOpen);

  const editItemConditionStacks = useItemConditionStacksMutation(
    condition?.id,
    condition?.itemId,
  );

  const editCharacterConditionStacks = useCharacterConditionStacksMutation(
    condition?.id,
    condition?.characterId,
  );

  const deleteCharacterCondition = useDeleteCharacterConditionMutation(
    condition?.id,
    condition?.characterId,
  );

  const deleteItemCondition = useDeleteItemConditionMutation(
    condition?.id,
    condition?.itemId,
  );

  return (
    <RadialMenu
      elementId={condition.id}
      containerRef={containerRef}
      array={[
        {
          label: 'Current Stacks',
          element: (
            <div>
              <p className="w-full text-center font-semibold !text-inherit">
                {condition.stacks || 0}
              </p>
            </div>
          ),
        },
        {
          label: 'Add Stack',
          element: (
            <div
              onClick={() => {
                if (condition.itemId) {
                  editItemConditionStacks.mutate(1);
                } else if (condition.characterId) {
                  editCharacterConditionStacks.mutate(1);
                }
              }}
            >
              <Icon className="text-inherit" path={mdiPlus} />
            </div>
          ),
        },
        {
          label: 'Remove Condition',
          element: (
            <div
              onClick={() => {
                if (condition.itemId) {
                  deleteItemCondition.mutate();
                } else if (condition.characterId) {
                  deleteCharacterCondition.mutate();
                }
              }}
            >
              <Icon className="text-inherit" path={mdiTrashCanOutline} />
            </div>
          ),
        },
        {
          label: 'Description',
          element: (
            <div
              onClick={() => {
                navigate(`conditions/${condition.id}`);
                setMenuOpen(false);
              }}
            >
              <Icon className="text-inherit" path={mdiFileDocumentOutline} />
            </div>
          ),
        },
        {
          label: 'Remove Stack',
          element: (
            <div
              onClick={() => {
                if (condition.itemId) {
                  editItemConditionStacks.mutate(-1);
                } else if (condition.characterId) {
                  editCharacterConditionStacks.mutate(-1);
                }
              }}
            >
              <Icon className="text-inherit" path={mdiMinus} />
            </div>
          ),
        },
      ]}
    />
  );
};

export default ConditionRadialMenu;
