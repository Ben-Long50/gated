import { useParams } from 'react-router-dom';
import useItemQuery from 'src/hooks/useItemQuery/useItemQuery';
import FormLayout from 'src/layouts/FormLayout';
import { KeywordReference } from 'src/types/keyword';
import TextAreaField from '../TextAreaField';
import PictureField from '../formFields/PictureField';
import Loading from '../Loading';
import InputField from '../InputField';
import ArrowHeader2 from '../ArrowHeader2';
import Divider from '../Divider';
import Icon from '@mdi/react';
import { mdiMinus, mdiPlus, mdiStar, mdiTriangleDown } from '@mdi/js';
import ArrowHeader3 from '../ArrowHeader3';
import useModifyItemMutation from 'src/hooks/useModifyItemMutation/useModifyItemMutation';
import useDeleteItemMutation from 'src/hooks/useDeleteItemMutation/useDeleteItemMutation';
import KeywordLinkField from '../formFields/KeywordLinkField';
import useCharacterQuery from 'src/hooks/useCharacterQuery/useCharacterQuery';
import BtnIcon from '../buttons/BtnIcon';
import { capitalCase } from 'change-case';
import upgradePointMap from '../../hooks/upgradePointMap';
import useUpgradePoints from 'src/hooks/useUpgradePoints';
import ExpandingList from '../ExpandingList';
import KeywordCard from '../KeywordCard';
import useItemUpgradeForm from 'src/hooks/form hooks/useItemUpgradeForm';

const ItemUpgradeForm = () => {
  const { characterId, itemId } = useParams();

  const { data: character, isLoading: characterLoading } = useCharacterQuery(
    Number(characterId),
  );

  const { data: item, isLoading: itemLoading } = useItemQuery(Number(itemId));

  const deleteItem = useDeleteItemMutation(Number(itemId));

  const modifyItem = useModifyItemMutation(Number(characterId), Number(itemId));

  const itemUpgradeForm = useItemUpgradeForm(modifyItem, item);

  const { availableUp, upgradePrice, powerLevel, upgradedPowerLevel } =
    useUpgradePoints(itemUpgradeForm, item);

  itemUpgradeForm.setFieldValue('upgradePrice', upgradePrice);

  if (itemLoading || characterLoading) return <Loading />;

  return (
    <>
      <FormLayout
        label="Item"
        form={itemUpgradeForm}
        itemId={itemId}
        createMutation={modifyItem}
        deleteMutation={deleteItem}
      >
        <ArrowHeader2 title={item?.name + ' Information'} />
        <div className="grid w-full gap-8 max-sm:col-span-2 max-sm:grid-flow-row sm:grid-cols-2">
          <PictureField
            form={itemUpgradeForm}
            sizeInfo={{ aspectRatio: '1/1', maxHeight: '', minHeight: '' }}
          />
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between gap-4">
              <ArrowHeader3 title="Upgrade" />
              <itemUpgradeForm.Field name="grade">
                {(field) => (
                  <div className="flex w-1/2 items-center gap-2">
                    <BtnIcon
                      path={mdiMinus}
                      active={item?.grade && field.state.value > item?.grade}
                      onClick={() => field.handleChange(field.state.value - 1)}
                    />
                    <div className="flex grow flex-wrap items-center justify-end gap-1">
                      {field.state.value > 5 ? (
                        <div className="flex items-center gap-2">
                          <Icon
                            path={mdiStar}
                            className="text-accent size-6 shrink-0"
                          />
                          <p className="whitespace-nowrap pt-1 font-semibold">
                            x {field.state.value}
                          </p>
                        </div>
                      ) : (
                        <div className="flex">
                          {Array.from({ length: field.state.value }).map(
                            (_, index) => (
                              <Icon
                                key={index}
                                path={mdiStar}
                                className="text-accent size-6"
                              />
                            ),
                          )}
                        </div>
                      )}
                    </div>
                    <BtnIcon
                      path={mdiPlus}
                      active={field.state.value < 10}
                      onClick={() => field.handleChange(field.state.value + 1)}
                    />
                  </div>
                )}
              </itemUpgradeForm.Field>
            </div>
            <itemUpgradeForm.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  value.length < 2
                    ? 'Weapon name must be at least 2 characters long'
                    : undefined,
              }}
            >
              {(field) => (
                <InputField
                  className="grow"
                  label={`Item Name`}
                  field={field}
                />
              )}
            </itemUpgradeForm.Field>
            <itemUpgradeForm.Field
              name="description"
              validators={{
                onChange: ({ value }) =>
                  value.length < 2
                    ? 'Weapon description must be at least 2 characters long'
                    : undefined,
              }}
            >
              {(field) => (
                <TextAreaField label={`Item Description`} field={field} />
              )}
            </itemUpgradeForm.Field>
          </div>
        </div>
        <Divider />
        <div className="flex items-center justify-between gap-8">
          <ArrowHeader2 title="Upgrade Point Distribution" />
          <p>
            Available UP -{' '}
            <span className={`${availableUp < 0 && 'text-error'}`}>
              ( {availableUp} )
            </span>
          </p>
        </div>
        <div className="grid w-full grid-cols-[1fr_auto_auto_auto_auto_auto] items-center gap-x-2 gap-y-6 border-x-2 border-gray-400 border-opacity-50 px-6">
          <itemUpgradeForm.Field name="modifiedStats">
            {(field) =>
              Object.keys(field.state.value).map((stat) => {
                console.log(field.state.value);

                return (
                  <itemUpgradeForm.Field
                    name={`modifiedStats[${stat}]`}
                    key={stat}
                  >
                    {(subField) => {
                      const currentLevel =
                        subField.state.value + item?.stats[stat];

                      const nextLevelUpgradePoints = upgradePointMap[stat]
                        ? upgradePointMap[stat](currentLevel + 1)
                        : 0;

                      const currentLevelUpgradePoints = upgradePointMap[stat]
                        ? upgradePointMap[stat](currentLevel)
                        : 0;

                      return (
                        <>
                          <h4 className="w-full">
                            {capitalCase(stat)}{' '}
                            <span className="text-tertiary ml-2 text-base font-normal">
                              ({nextLevelUpgradePoints} GP)
                            </span>
                          </h4>
                          <p className="mr-3 font-semibold !text-green-400">
                            {subField.state.value > 0
                              ? `+${subField.state.value}`
                              : ''}
                          </p>
                          <BtnIcon
                            path={mdiMinus}
                            active={subField.state.value > 0}
                            onClick={() =>
                              subField.handleChange(subField.state.value - 1)
                            }
                          />
                          <p className="min-w-8 text-center">
                            {item?.stats[stat] + subField.state.value}
                          </p>
                          <BtnIcon
                            path={mdiPlus}
                            active={availableUp >= currentLevelUpgradePoints}
                            onClick={() =>
                              subField.handleChange(subField.state.value + 1)
                            }
                          />
                          <p className="text-tertiary text-sm">
                            {item?.modifiedStats &&
                              item?.modifiedStats[stat] &&
                              `( ${item?.modifiedStats[stat]} )`}
                          </p>
                        </>
                      );
                    }}
                  </itemUpgradeForm.Field>
                );
              })
            }
          </itemUpgradeForm.Field>
        </div>
        <Divider />
        <ExpandingList
          title="Base Traits"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {item?.keywords.map((keyword: KeywordReference) => (
            <KeywordCard key={keyword.id} keyword={keyword.keyword} />
          ))}
        </ExpandingList>
        <KeywordLinkField title="Upgraded Traits" form={itemUpgradeForm} />
        <Divider />
        <div className="flex w-full items-center justify-between">
          <ArrowHeader3 title="Power Level" />
          <div className="flex items-center gap-4">
            <h3>{powerLevel}</h3>
            <Icon
              path={mdiTriangleDown}
              className="text-secondary"
              rotate={-90}
              size={0.375}
            />
            <h3
              className={`${upgradedPowerLevel > powerLevel && '!text-green-400'}`}
            >
              {upgradedPowerLevel}
            </h3>
          </div>
        </div>
        <itemUpgradeForm.Field name="upgradePrice">
          {(field) => (
            <div className="flex flex-col gap-2">
              <div className="flex w-full items-center justify-between">
                <ArrowHeader3 title="Upgrade Price" />
                <h3>{field.state.value}p</h3>
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="text-tertiary pl-7">Remaining Profits</p>
                <p className="text-tertiary">
                  {character?.profits - field.state.value}p
                </p>
              </div>
            </div>
          )}
        </itemUpgradeForm.Field>
      </FormLayout>
    </>
  );
};

export default ItemUpgradeForm;
