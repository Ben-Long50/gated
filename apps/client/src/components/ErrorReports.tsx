import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import useErrorReportsQuery from '../hooks/useErrorReportsQuery/useErrorReportsQuery';
import Loading from './Loading';
import { ErrorReport } from 'src/types/errorReport';
import { format } from 'date-fns';
import { ThemeContext } from '../contexts/ThemeContext';
import ThemeContainer from './ThemeContainer';
import useDeleteErrorReportMutation from '../hooks/useDeleteErrorReportMutation/useDeleteErrorReportMutation';
import Divider from './Divider';
import ArrowHeader3 from './ArrowHeader3';
import IconBtnSmall from './buttons/IconBtnSmall';
import { mdiTrashCanOutline } from '@mdi/js';
import Icon from '@mdi/react';

const ErrorReports = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { data: errorReports, isLoading, isPending } = useErrorReportsQuery();

  const deleteErrorReport = useDeleteErrorReportMutation();

  if (isLoading || isPending) return <Loading />;

  return (
    <>
      {errorReports?.map((report: ErrorReport, index: number) => (
        <>
          <div key={index} className="flex flex-col gap-4">
            <div className="flex w-full items-end justify-between">
              <ArrowHeader3 title={report.title} />
              <p>{report.user.firstName + ' ' + report.user.lastName}</p>
            </div>
            <p>{format(report.createdAt, 'PP')}</p>
            <p>{report.content}</p>
            <IconBtnSmall
              className="self-end"
              onClick={() => {
                deleteErrorReport.mutate(report.id);
              }}
              tooltip="Delete"
            >
              <Icon path={mdiTrashCanOutline} />
            </IconBtnSmall>
          </div>
          {index + 1 < errorReports.length && <Divider />}
        </>
      ))}
    </>
  );
};

export default ErrorReports;
