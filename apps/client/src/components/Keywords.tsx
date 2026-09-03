import KeywordCard from './KeywordCard';
import useKeywords from '../hooks/useKeywords';
import InputField from './formFields/InputField';
import { FormApi } from '@tanstack/react-form';
import Loading from './Loading';
import InputSelectField from './formFields/InputSelectField';
import Icon from '@mdi/react';
import { mdiSync } from '@mdi/js';
import { KeywordReference } from 'src/types/keyword';
import { capitalCase } from 'change-case';
import ExpandingList from './ExpandingList';
import { useSearchParams } from 'react-router-dom';
import IconBtnMedium from './buttons/IconBtnMedium';
import InputFieldCheckbox from './formFields/InputFieldCheckbox';

const Keywords = ({ form }: { form?: FormApi }) => {
  const { keywords, query, category, setQuery, setCategory, isLoading } =
    useKeywords();

  const [searchParams] = useSearchParams();

  const mode = searchParams.get('mode');

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <InputSelectField
          label="Trait Type"
          options={[
            '',
            'weapon',
            'armor',
            'vehicle',
            'chromebits',
            'hardwired',
            'networked',
          ]}
          value={category}
          onChange={(value) => {
            setCategory(value);
          }}
        />
        <div className="flex items-end gap-4">
          <InputField
            label="Search Traits"
            value={query}
            onChange={(value) => {
              setQuery(value);
            }}
          />
          <IconBtnMedium
            onClick={() => {
              setQuery('');
              setCategory('');
            }}
            tooltip="Reset Search"
          >
            <Icon path={mdiSync} />
          </IconBtnMedium>
        </div>
      </div>
      {form ? (
        <form.Field name="keywords">
          {(field) => (
            <ExpandingList
              title={
                category.length > 0
                  ? capitalCase(category) + ' Traits'
                  : 'All Traits'
              }
              className="flex flex-col gap-4 md:grid md:grid-cols-2"
            >
              {keywords?.map((keyword) => {
                const checked = field.state.value?.find(
                  (item: KeywordReference) => item.keywordId === keyword.id,
                );

                return (
                  <InputFieldCheckbox
                    label={
                      <>
                        <KeywordCard keyword={keyword} />
                        {checked && (
                          <InputField
                            className="max-w-24 shrink-0"
                            type="number"
                            label="Value"
                            value={checked?.value}
                            onChange={(value: number | string) => {
                              const updatedValue = field.state.value?.map(
                                (item: {
                                  keywordId: number;
                                  value?: number;
                                }) =>
                                  item.keywordId === keyword.id
                                    ? {
                                        keywordId: item.keywordId,
                                        value,
                                      }
                                    : item,
                              );
                              field.handleChange(updatedValue);
                            }}
                          />
                        )}
                      </>
                    }
                    value={keyword.id}
                    checked={checked}
                    onChange={(value) => {
                      if (!checked) {
                        field.handleChange([
                          ...field.state.value,
                          { keywordId: Number(value) },
                        ]);
                      } else {
                        field.handleChange(
                          field.state.value?.filter(
                            (item: { keywordId: number; value?: number }) =>
                              item.keywordId !== Number(value),
                          ),
                        );
                      }
                    }}
                  />
                );
              })}
            </ExpandingList>
          )}
        </form.Field>
      ) : (
        <ExpandingList
          title={
            category.length > 0
              ? capitalCase(category) + ' Traits'
              : 'All Traits'
          }
          className="flex flex-col gap-4 md:grid md:grid-cols-2"
        >
          {keywords?.map((keyword) => (
            <KeywordCard keyword={keyword} />
          ))}
        </ExpandingList>
      )}
    </>
  );
};

export default Keywords;
