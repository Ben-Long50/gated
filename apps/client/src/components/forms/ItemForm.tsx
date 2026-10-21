import InputField from '../formFields/InputField';
import InputSelectField from '../formFields/InputSelectField';
import TextAreaField from '../formFields/TextAreaField';
import FormLayout from '../../layouts/FormLayout';
import { useParams, useSearchParams } from 'react-router-dom';
import ArrowHeader2 from '../ArrowHeader2';
import Divider from '../Divider';
import ItemLinkField from '../formFields/ItemLinkField';
import KeywordLinkField from '../formFields/KeywordLinkField';
import useItemQuery from 'src/hooks/useItemQuery/useItemQuery';
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
import useCreateCodexItemMutation from 'src/hooks/useCreateCodexItemMutation/useCreateCodexItemMutation';
import PictureField from '../formFields/PictureField';
import Page from '../Page';

const ItemForm = () => {
  const { itemId } = useParams();

  const [searchParams] = useSearchParams();
  const formType = searchParams.get('formType');

  const { data: item } = useItemQuery(Number(itemId));

  const createItem = useCreateItemMutation();
  const createCodexItem = useCreateCodexItemMutation();

  const createItemCopy = useCreateItemCopyMutation(Number(itemId));

  const deleteItem = useDeleteItemMutation(Number(itemId));

  const itemForm = useItemForm(
    formType === 'codex' ? createCodexItem : createItem,
    item,
  );

  return (
    <Page title={itemId ? 'Update Item' : 'Create Item'} context={{ type: 'item', form: itemForm }}>
      <FormLayout
        label="Item"
        form={itemForm}
        itemId={itemId}
        createMutation={formType === 'codex' ? createCodexItem : createItem}
        deleteMutation={itemId ? deleteItem : undefined}
      >
        <ArrowHeader2 title="Item Information" />
        <div className="flex w-full gap-4">
          <itemForm.Field name="name">
            {(field) => (
              <InputField
                label={'Item Name'}
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </itemForm.Field>
          <itemForm.Field name="price">
            {(field) => (
              <InputField
                className="max-w-28"
                type="number"
                label="Price"
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
            )}
          </itemForm.Field>
        </div>
        <RarityField form={itemForm} />
        <itemForm.Field name="itemTypes">
          {(field) => (
            <div className="flex w-full flex-col gap-4">
              {field.state.value.map((_, i) => (
                <div className="flex w-full items-center gap-4">
                  <itemForm.Field key={i} name={`itemTypes[${i}]`}>
                    {(subfield) => (
                      <InputSelectField
                        label="Item Type"
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
                        value={subfield.state.value}
                        onChange={(value) => subfield.handleChange(value)}
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
                  itemForm.setFieldValue('itemTypes', [
                    ...field.state.value,
                    '',
                  ]);
                }}
              >
                Add Item Type
              </BtnAuth>
            </div>
          )}
        </itemForm.Field>
        <itemForm.Field name="description">
          {(field) => (
            <TextAreaField
              label="Item Description"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </itemForm.Field>
        <Divider />
        <ArrowHeader2 title="Item Picture" />
        <PictureField form={itemForm} type="item" />
        <StatFields form={itemForm} />
        <Divider />
        <KeywordLinkField form={itemForm} />
        <Divider />
        <ActionLinkField form={itemForm} />
        <Divider />
        <ItemLinkField form={itemForm} />
      </FormLayout>
    </Page>
  );
};

export default ItemForm;
