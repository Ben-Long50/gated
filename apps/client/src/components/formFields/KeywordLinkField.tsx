import { FormApi } from '@tanstack/react-form';
import ItemCardSmall from '../ItemCardSmall';
import useKeywords from 'src/hooks/useKeywords';
import BtnAuth from '../buttons/BtnAuth';
import InputFieldCheckbox from './InputFieldCheckbox';
import { useContext } from 'react';
import { LayoutContext } from 'src/contexts/LayoutContext';
import ArrowHeader2 from '../ArrowHeader2';
import { useNavigateWithQuery } from 'src/hooks/useNavigateWithQuery';

const KeywordLinkField = ({ form, mode }: { form: FormApi; mode?: string }) => {
  const { mobile } = useContext(LayoutContext);
  const navigate = useNavigateWithQuery();

  const { keywords: baseKeywords } = useKeywords();

  return (
    <>
      <ArrowHeader2 title="Traits" />
      <form.Field name="keywords">
        {(field) =>
          field.state.value.length > 0 && (
            <div
              className={`${mobile ? 'flex flex-col' : 'grid grid-cols-2'} gap-4`}
            >
              {field.state.value.map(
                (keyword: { keywordId: number; value?: number }) => {
                  const baseKeyword = baseKeywords?.find(
                    (k) => k.id === Number(keyword.keywordId),
                  );

                  return (
                    <InputFieldCheckbox
                      className="flex items-center"
                      key={keyword.keywordId}
                      checked={true}
                      value={keyword.keywordId}
                      onChange={() => {
                        field.handleChange(
                          field.state.value.filter(
                            (item: { keywordId: number; value?: number }) =>
                              Number(item.keywordId) !== baseKeyword?.id,
                          ),
                        );
                      }}
                      label={
                        <ItemCardSmall
                          key={keyword.keywordId}
                          heading={
                            <div className="flex w-full items-center justify-between">
                              <h4>
                                {keyword.value
                                  ? baseKeyword?.name.replace(
                                      /X/g,
                                      keyword.value.toString(),
                                    )
                                  : baseKeyword?.name}
                              </h4>
                              {mode === 'upgrade' && (
                                <p className="text-tertiary ml-auto pr-2">
                                  ({baseKeyword?.gpCost} GP)
                                </p>
                              )}
                            </div>
                          }
                        >
                          <p>
                            {keyword.value
                              ? baseKeyword?.description.replace(
                                  /X/g,
                                  keyword.value.toString(),
                                )
                              : baseKeyword?.description}
                          </p>
                        </ItemCardSmall>
                      }
                    ></InputFieldCheckbox>
                  );
                },
              )}
            </div>
          )
        }
      </form.Field>
      <BtnAuth
        className="w-full min-w-48"
        onClick={() => {
          navigate('modal/traits?mode=form');
        }}
      >
        Link Traits
      </BtnAuth>
    </>
  );
};

export default KeywordLinkField;
