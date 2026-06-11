import { FormApi, FormState } from '@tanstack/react-form';
import ItemCardSmall from '../ItemCardSmall';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useKeywords from 'src/hooks/useKeywords';
import BtnAuth from '../buttons/BtnAuth';
import ArrowHeader3 from '../ArrowHeader3';
import InputFieldCheckbox from './InputFieldCheckbox';
import Divider from '../Divider';

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
      <form.Subscribe selector={(state: FormState) => state.values.keywords}>
        {(keywords: { keywordId: number; value?: number }[]) => (
          <>
            {keywords.length > 0 && (
              <ArrowHeader3 title={title ? title : 'Linked Traits'} />
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
                                    (item: {
                                      keywordId: number;
                                      value?: number;
                                    }) =>
                                      Number(item.keywordId) !==
                                      baseKeyword?.id,
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
                  )}
                </>
              )}
            </form.Field>
            <BtnAuth
              className="w-full min-w-48"
              onClick={() => {
                navigate('traits?mode=form');
              }}
            >
              Link Traits
            </BtnAuth>
            {keywords.length > 0 && <Divider />}
          </>
        )}
      </form.Subscribe>
    </>
  );
};

export default KeywordLinkField;
