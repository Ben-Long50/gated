import InputField from '../InputField';
import InputSelectField from '../InputSelectField';
import TextAreaField from '../TextAreaField';
import FormLayout from '../../layouts/FormLayout';
import { useParams } from 'react-router-dom';
import ArrowHeader2 from '../ArrowHeader2';
import Divider from '../Divider';
import ItemLinkField from '../formFields/ItemLinkField';
import KeywordLinkField from '../formFields/KeywordLinkField';
import useItemQuery from 'src/hooks/useItemQuery/useItemQuery';
import PictureField from '../formFields/PictureField';
import RarityField from '../formFields/RarityField';
import StatFields from '../formFields/StatFields';
import useCreateItemMutation from 'src/hooks/useCreateItemMutation/useCreateItemMutation';
import useDeleteItemMutation from 'src/hooks/useDeleteItemMutation/useDeleteItemMutation';
import useCreateItemCopyMutation from 'src/hooks/useCreateItemCopyMutation/useCreateItemCopyMutation';
import useItemForm from 'src/hooks/form hooks/useItemForm';
import BtnAuth from '../buttons/BtnAuth';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import ActionLinkField from '../formFields/ActionLinkField';

const ItemForm = () => {
  const { itemId } = useParams();

  const { data: item } = useItemQuery(Number(itemId));

  const createItem = useCreateItemMutation();

  const createItemCopy = useCreateItemCopyMutation(Number(itemId));

  const deleteItem = useDeleteItemMutation(Number(itemId));

  const itemForm = useItemForm(createItem, item);

  return (
    <FormLayout
      label="Item"
      form={itemForm}
      itemId={itemId}
      createMutation={createItem}
      deleteMutation={deleteItem}
    >
      <ArrowHeader2 title="Item Information" />
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full gap-4">
          <itemForm.Field name="name">
            {(field) => (
              <InputField className="grow" label={'Item Name'} field={field} />
            )}
          </itemForm.Field>
          <itemForm.Field name="price">
            {(field) => (
              <InputField
                className="max-w-28"
                type="number"
                label="Price"
                field={field}
              />
            )}
          </itemForm.Field>
        </div>
        <div className="flex w-full items-center gap-4">
          <RarityField form={itemForm} />
          <itemForm.Field name="grade">
            {(field) => (
              <InputField
                className="w-full max-w-28"
                type="number"
                label="Grade"
                field={field}
              />
            )}
          </itemForm.Field>
        </div>
      </div>
      <itemForm.Field name="itemTypes">
        {(field) => (
          <div className="flex w-full flex-col gap-4">
            {field.state.value.map((_, i) => (
              <div className="flex w-full items-center gap-4">
                <itemForm.Field key={i} name={`itemTypes[${i}]`}>
                  {(subfield) => (
                    <InputSelectField
                      label="Item Type"
                      field={subfield}
                      options={[
                        'weapon',
                        'armor',
                        'cybernetic',
                        'mutation',
                        'vehicle',
                        'drone',
                        'modification',
                        'reusable',
                        'consumable',
                      ]}
                    />
                  )}
                </itemForm.Field>
                {i > 0 && (
                  <button onClick={() => field.removeValue(i)} type="button">
                    <Icon
                      className="text-tertiary hover:text-accent timing"
                      path={mdiClose}
                      size={1.5}
                    />
                  </button>
                )}
              </div>
            ))}
            <BtnAuth
              onClick={() => {
                itemForm.setFieldValue('itemTypes', [...field.state.value, '']);
              }}
            >
              Add Item Type
            </BtnAuth>
          </div>
        )}
      </itemForm.Field>
      <div className="grid w-full gap-8 max-sm:col-span-2 max-sm:grid-flow-row sm:grid-cols-2">
        <PictureField
          form={itemForm}
          sizeInfo={{ aspectRatio: '1/1', maxHeight: '', minHeight: '' }}
        />
        <itemForm.Field name="description">
          {(field) => (
            <TextAreaField
              label={'Item Description'}
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </itemForm.Field>
      </div>
      <StatFields form={itemForm} />
      <div className="flex flex-col gap-4">
        <Divider />
        <KeywordLinkField form={itemForm} />
        <ActionLinkField form={itemForm} />
        <ItemLinkField form={itemForm} />
      </div>
    </FormLayout>
  );
};

export default ItemForm;
