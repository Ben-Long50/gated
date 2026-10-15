import Conditions from '../Conditions';
import BtnRect from '../buttons/BtnRect';
import useCreateCharacterConditionMutation from 'src/hooks/useCreateCharacterConditionMutation/useCreateCharacterConditionMutation';
import useCreateItemConditionMutation from 'src/hooks/useCreateItemConditionMutation/useCreateItemConditionMutation';
import { useParams } from 'react-router-dom';
import useCharacter from 'src/hooks/useCharacter';
import useItemQuery from 'src/hooks/useItemQuery/useItemQuery';
import useConditionLinkForm from 'src/hooks/form hooks/useConditionLinkForm';
import Loading from '../Loading';

const ConditionModal = () => {
  const { characterId, itemId } = useParams();

  const { filteredCharacter: character } = useCharacter(Number(characterId));

  const { data: item } = useItemQuery(Number(itemId));

  const createCharacterCondition = useCreateCharacterConditionMutation(
    Number(character?.id),
  );

  const createItemCondition = useCreateItemConditionMutation(
    Number(item?.id),
    Number(characterId),
  );

  const conditionLinkForm = useConditionLinkForm(
    createCharacterCondition,
    createItemCondition,
    character,
    item,
  );

  return (
    <>
      <Conditions form={conditionLinkForm} />
      <BtnRect
        className="group w-full"
        type="button"
        ariaLabel="Submit conditions"
        onClick={() => {
          conditionLinkForm.handleSubmit();
        }}
      >
        {createCharacterCondition.isPending || createItemCondition.isPending ? (
          <Loading
            className="group-hover:text-accent dark:text-gray-900"
            size={1.15}
          />
        ) : (
          'Submit'
        )}
      </BtnRect>
    </>
  );
};

export default ConditionModal;
