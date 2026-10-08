import FormLayout from '../../layouts/FormLayout';
import { useParams } from 'react-router-dom';
import { itemTypes, rarities } from 'src/utils/constants/itemConstants';
import InputFieldCheckbox from '../formFields/InputFieldCheckbox';
import { capitalCase } from 'change-case';
import ArrowHeader3 from '../ArrowHeader3';
import useBulkItemForm from 'src/hooks/form hooks/useBulkItemForm';
import useAddBulkCartItemsMutation from 'src/hooks/useAddBulkCartItemsMutation.ts/useAddBulkCartItemsMutation';
import Divider from '../Divider';
import IconBtnSmall from '../buttons/IconBtnSmall';
import Icon from '@mdi/react';
import { mdiMinus, mdiPlus } from '@mdi/js';

const BulkItemForm = () => {
  const { characterId } = useParams();

  const addBulkItems = useAddBulkCartItemsMutation(Number(characterId));

  const bulkItemForm = useBulkItemForm(addBulkItems);

  return (
    <FormLayout
      title="Add Bulk Cart Items"
      label="Cart Items"
      form={bulkItemForm}
      createMutation={addBulkItems}
    >
      <h1>Add Bulk Cart Items</h1>
      <bulkItemForm.Field name="quantity">
        {(field) => (
          <div className="flex items-center justify-between gap-8">
            <ArrowHeader3 title="Bulk Quantity" />
            <div className="flex items-center gap-8">
              <IconBtnSmall
                active={field.state.value > 1}
                onClick={() => field.handleChange((prev) => prev - 1)}
                tooltip="Decrease"
              >
                <Icon path={mdiMinus} />
              </IconBtnSmall>
              <p className="size-6 text-center">{field.state.value}</p>
              <IconBtnSmall
                active={field.state.value < 10}
                onClick={() => field.handleChange((prev) => prev + 1)}
                tooltip="Increase"
              >
                <Icon path={mdiPlus} />
              </IconBtnSmall>
            </div>
          </div>
        )}
      </bulkItemForm.Field>
      <Divider />
      <bulkItemForm.Field name="itemTypes" mode="array">
        {(field) => (
          <div className="flex w-full flex-col gap-4">
            <ArrowHeader3 title="ItemTypes" />
            {itemTypes.map((itemType) => (
              <div className="flex items-center justify-between px-4">
                <InputFieldCheckbox
                  label={capitalCase(itemType)}
                  value={itemType}
                  checked={field.state.value.includes(itemType)}
                  onChange={(value) => {
                    if (field.state.value.includes(value)) {
                      field.handleChange(
                        field.state.value.filter((t: string) => t !== itemType),
                      );
                    } else {
                      field.handleChange([...field.state.value, itemType]);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </bulkItemForm.Field>
      <Divider />
      <bulkItemForm.Field name="rarities" mode="array">
        {(field) => (
          <div className="flex w-full flex-col gap-4">
            <ArrowHeader3 title="Rarities" />
            {rarities.map((rarity) => (
              <div className="flex items-center justify-between px-4">
                <InputFieldCheckbox
                  label={capitalCase(rarity)}
                  value={rarity}
                  checked={field.state.value.includes(rarity)}
                  onChange={(value) => {
                    if (field.state.value.includes(value)) {
                      field.handleChange(
                        field.state.value.filter((t: string) => t !== rarity),
                      );
                    } else {
                      field.handleChange([...field.state.value, rarity]);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </bulkItemForm.Field>
    </FormLayout>
  );
};

export default BulkItemForm;
