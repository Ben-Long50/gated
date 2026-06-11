import KeywordCard from './KeywordCard';
import useKeywords from '../hooks/useKeywords';
import InputField from './formFields/InputField';
import { FieldApi } from '@tanstack/react-form';
import Loading from './Loading';
import ArrowHeader2 from './ArrowHeader2';
import InputSelectField from './formFields/InputSelectField';
import Icon from '@mdi/react';
import { mdiSync } from '@mdi/js';
import { KeywordReference } from 'src/types/keyword';
import { capitalCase } from 'change-case';
import ExpandingList from './ExpandingList';
import Divider from './Divider';
import { useSearchParams } from 'react-router-dom';
import IconBtnMedium from './buttons/IconBtnMedium';

const Keywords = ({ field }: { field?: FieldApi }) => {
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
          >
            <Icon path={mdiSync} />
          </IconBtnMedium>
        </div>
      </div>
      <div className="flex w-full flex-col gap-8">
        <ExpandingList
          title={
            category.length > 0
              ? capitalCase(category) + ' Traits'
              : 'All Traits'
          }
          className="flex flex-col gap-4 md:grid md:grid-cols-2"
        >
          {keywords?.map((keyword) => {
            const activeKeyword =
              mode === 'form'
                ? field.state.value?.find(
                    (item: KeywordReference) => item.keywordId === keyword.id,
                  )
                : null;
            return (
              <KeywordCard
                mode={mode}
                keyword={keyword}
                activeKeyword={activeKeyword}
                field={field}
              />
            );
          })}
        </ExpandingList>
      </div>
    </>
  );
};

export default Keywords;
