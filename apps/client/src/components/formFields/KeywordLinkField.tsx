import { FormApi, FormState } from '@tanstack/react-form';
import ItemCardSmall from '../ItemCardSmall';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import ArrowHeader2 from '../ArrowHeader2';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useKeywords from 'src/hooks/useKeywords';
import BtnAuth from '../buttons/BtnAuth';

const KeywordLinkField = ({
  form,
  mode,
  title,
}: {
  form: FormApi;
  mode?: string;
  title?: string;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const { keywords: baseKeywords } = useKeywords();

  return (
    <>
      <BtnAuth
        className="w-full min-w-48"
        onClick={() => {
          navigate('traits');
        }}
      >
        Link Traits
      </BtnAuth>
      <form.Subscribe selector={(state: FormState) => state.values.keywords}>
        {(keywords: { keywordId: number; value?: number }[]) => (
          <>
            {keywords.length > 0 && (
              <ArrowHeader2 title={title ? title : 'Linked Traits'} />
            )}
            <form.Field name="keywords">
              {(field) => (
                <>
                  {parts[parts.length - 1] === 'traits' && (
                    <Outlet context={{ field, parts }} />
                  )}
                  {keywords.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {keywords.map(
                        (keyword: { keywordId: number; value?: number }) => {
                          const baseKeyword = baseKeywords?.find(
                            (k) => k.id === keyword.keywordId,
                          );

                          return (
                            <div
                              className="flex items-center"
                              key={keyword.keywordId}
                            >
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
                                    <button
                                      onClick={() => {
                                        field.handleChange(
                                          field.state.value.filter(
                                            (item: {
                                              keywordId: number;
                                              value?: number;
                                            }) =>
                                              item.keywordId !==
                                              baseKeyword?.id,
                                          ),
                                        );
                                      }}
                                    >
                                      <Icon
                                        path={mdiClose}
                                        className="text-tertiary hover:text-accent timing -m-2 mr-1 size-9"
                                      />
                                    </button>
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
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
                </>
              )}
            </form.Field>
          </>
        )}
      </form.Subscribe>
    </>
  );
};

export default KeywordLinkField;
