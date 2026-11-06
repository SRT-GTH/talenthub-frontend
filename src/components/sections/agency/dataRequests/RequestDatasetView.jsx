import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  agencyDownloadRequest,
  agencyRequestDataset,
  saveCsv,
} from '../../../../services/agency.api.js';
import { debug } from '../../../../utils/debug.js';
import AgencyButton from '../AgencyButton.jsx';
import AgencyPageHero from '../AgencyPageHero.jsx';
import { useAgencyResource } from '../useAgencyResource.js';
import DatasetLoggedCard from './DatasetLoggedCard.jsx';
import { DATASET as D, fmtDateTime, plural } from './data/dataRequestsData.js';

const log = debug('RequestDatasetView');

/*
 * RequestDatasetView — ?view=dataset on an approved request (Figma 11.4.3h): the approved dataset from GET /agency/data-requests/:id/dataset
 * (aggregates only, groups under 5 shown as <5, limited to the approved regions). Opening it is logged as a view; "Download CSV (logged)"
 * fetches a server-built CSV (POST …/download, logged as a download). The green "Logged view" card shows this request's own access log counts.
 * Props: request (GET /agency/data-requests/:id), onBack().
 */

const RequestDatasetView = ({ request, onBack }) => {
  const navigate = useNavigate();
  const res = useAgencyResource(() => agencyRequestDataset(request.id), [request.id]);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const [downloads, setDownloads] = useState(0);
  const ds = res.data;

  const download = async () => {
    setBusy(true);
    setFailure('');
    try {
      const out = await agencyDownloadRequest(request.id);
      saveCsv(out.fileName, out.csv);
      setDownloads((n) => n + 1);
      log('downloaded', out.fileName, out.rows);
    } catch (err) {
      setFailure(err?.response?.data?.message || err?.message || 'The download failed.');
    } finally {
      setBusy(false);
    }
  };

  const views = ds?.log?.views ?? 0;
  const dls = (ds?.log?.downloads ?? 0) + downloads;

  return (
    <>
      <AgencyPageHero
        title={request.title}
        subtitle={`Approved dataset · ${request.regionsLabel} · access ends ${fmtDateTime(request.accessEndsAt)} · every view and download is logged under your name.`}
        actions={
          <div className="flex flex-wrap gap-[8px]">
            <AgencyButton size="sm" onClick={onBack}>
              Back to request
            </AgencyButton>
            <AgencyButton size="sm" onClick={download} disabled={busy || !ds}>
              {busy ? 'Preparing…' : D.download}
            </AgencyButton>
          </div>
        }
      />
      {failure ? (
        <p
          role="alert"
          className="m-0 rounded-[12px] bg-[#fdecea] px-[14px] py-[10px] font-sans text-[14px] text-[#902b20]"
        >
          {failure}
        </p>
      ) : null}
      <div className="grid min-w-0 grid-cols-1 gap-[24px] xl:grid-cols-[minmax(0,880fr)_minmax(0,456fr)]">
        <section
          aria-labelledby="dr-dataset-title"
          className="min-w-0 rounded-[20px] border border-solid border-[#e1eae2] bg-white p-[20px]"
        >
          <h2
            id="dr-dataset-title"
            className="m-0 mb-[4px] font-sans text-[18px] leading-[24px] font-semibold text-[#1c2a21]"
          >
            {ds?.title || 'Dataset'}
          </h2>
          <p className="m-0 mb-[14px] font-sans text-[13px] leading-[18px] text-[#737373]">
            Aggregates only. Groups under 5 are shown as “&lt;5”.
          </p>
          {res.loading && !ds ? (
            <p role="status" className="m-0 font-sans text-[14px] text-[#737373]">
              Loading the dataset…
            </p>
          ) : res.error ? (
            <p role="alert" className="m-0 font-sans text-[14px] text-[#902b20]">
              {res.error?.response?.data?.message || 'We couldn’t open the dataset.'}
            </p>
          ) : ds.rows.length ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-sans text-[14px] leading-[20px]">
                <thead>
                  <tr>
                    {ds.columns.map((c) => (
                      <th
                        key={c.key}
                        scope="col"
                        className="border-0 border-b border-solid border-[#e1eae2] px-[10px] py-[8px] text-left text-[12px] font-semibold tracking-[0.3px] text-[#595959] uppercase"
                      >
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ds.rows.map((row) => (
                    <tr
                      key={ds.columns.map((c) => row[c.key]).join('|')}
                      className="even:bg-[#f8f8f4]"
                    >
                      {ds.columns.map((c) => (
                        <td key={c.key} className="px-[10px] py-[8px] text-[#1c2a21]">
                          {row[c.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="m-0 font-sans text-[14px] text-[#737373]">
              No groups of 5 or more yet in the approved regions. As more talents join, rows appear
              here.
            </p>
          )}
        </section>
        <DatasetLoggedCard
          logged={{
            eyebrow: D.loggedEyebrow,
            title: D.loggedTitle,
            text: `Your agency opened this dataset ${plural(views, 'time')} and downloaded it ${plural(dls, 'time')}. The DPO can see this log.`,
            action: D.loggedAction,
          }}
          onAction={() => navigate('/agency/settings/audit-log')}
        />
      </div>
    </>
  );
};

export default RequestDatasetView;
