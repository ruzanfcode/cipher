import { useMemo, useState } from 'react';

const initialUploads = [
  { id: 'upload-1', name: 'nike_reviews_july.json', rows: 1240, size: '1.8 MB', uploadedBy: 'maya.chen@mas.com', uploadedAt: '21 Jul 2026, 09:40' },
  { id: 'upload-2', name: 'apac_activewear_signal.json', rows: 842, size: '940 KB', uploadedBy: 'priya.nair@studio.com', uploadedAt: '20 Jul 2026, 15:12' },
  { id: 'upload-3', name: 'emea_outerwear_readout.json', rows: 410, size: '620 KB', uploadedBy: 'sofia.bianchi@studio.com', uploadedAt: '19 Jul 2026, 11:05' },
];

const initialJobs = [
  { id: 'job-1', fileName: 'nike_reviews_july.json', status: 'success', rows: 1240, startedAt: '21 Jul 2026, 09:41', completedAt: '21 Jul 2026, 09:48', errors: [] },
  { id: 'job-2', fileName: 'apac_activewear_signal.json', status: 'running', rows: 512, startedAt: '21 Jul 2026, 10:05', completedAt: '-', errors: [] },
  { id: 'job-3', fileName: 'emea_outerwear_readout.json', status: 'error', rows: 236, startedAt: '20 Jul 2026, 16:12', completedAt: '20 Jul 2026, 16:14', errors: [{ line: 42, message: 'Missing product_id field.' }, { line: 87, message: 'reviews must be a number.' }, { line: 133, message: 'Invalid sentiment value.' }] },
  { id: 'job-4', fileName: 'zara_quality_import.json', status: 'pending', rows: 0, startedAt: '-', completedAt: '-', errors: [] },
];

function formatFileSize(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ConfirmProcessModal({ job, onClose, onConfirm }) {
  if (!job) return null;
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal-panel confirm-panel" role="dialog" aria-modal="true" aria-label="Process with errors">
        <h3 className="confirm-title">Process with errors?</h3>
        <p className="confirm-message">{job.fileName} has {job.errors.length} validation {job.errors.length === 1 ? 'error' : 'errors'}. Admin approval will continue processing and mark the job as success.</p>
        <div className="confirm-actions">
          <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
          <button className="primary-button" type="button" onClick={onConfirm}>Approve</button>
        </div>
      </div>
    </div>
  );
}

function DataManagementPage({ app: _app }) {
  const [activeView, setActiveView] = useState('uploads');
  const [uploads, setUploads] = useState(initialUploads);
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedJobId, setSelectedJobId] = useState(initialJobs[0].id);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [confirmProcessJob, setConfirmProcessJob] = useState(null);
  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) || jobs[0], [jobs, selectedJobId]);

  function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.json')) {
      setUploadMessage({ type: 'error', text: 'Upload a JSON file only.' });
      event.target.value = '';
      return;
    }

    const upload = {
      id: `upload-${Date.now()}`,
      name: file.name,
      rows: Math.max(12, Math.round(file.size / 180)),
      size: formatFileSize(file.size),
      uploadedBy: 'maya.chen@mas.com',
      uploadedAt: 'Just now',
    };
    const job = { id: `job-${Date.now()}`, fileName: file.name, status: 'pending', rows: 0, startedAt: '-', completedAt: '-', errors: [] };
    setUploads((current) => [upload, ...current]);
    setJobs((current) => [job, ...current]);
    setSelectedJobId(job.id);
    setUploadMessage({ type: 'success', text: `${file.name} uploaded and queued for processing.` });
    event.target.value = '';
  }

  function downloadErrorReport(job) {
    const rows = [['file_name', 'line', 'error'], ...job.errors.map((error) => [job.fileName, String(error.line), error.message])];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${job.fileName.replace(/\.json$/i, '')}-error-report.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function processWithErrors(job) {
    setJobs((current) => current.map((item) => item.id === job.id ? { ...item, status: 'success', completedAt: 'Just now', errors: [] } : item));
    setConfirmProcessJob(null);
  }

  return (
    <main className="page wide-page fade-page data-page">
      <div className="data-page-head">
        <div className="page-intro">
          <h1>Data management</h1>
          <p>Upload JSON feeds, review imported files, and inspect processed data health.</p>
        </div>
        <div className="data-tabs" role="tablist" aria-label="Data management views">
          <button className={activeView === 'uploads' ? 'active' : ''} type="button" onClick={() => setActiveView('uploads')}>Uploaded data</button>
          <button className={activeView === 'processed' ? 'active' : ''} type="button" onClick={() => setActiveView('processed')}>Processed data</button>
        </div>
      </div>

      {activeView === 'uploads' ? (
        <section className="data-view-grid">
          <article className="data-upload-panel">
            <div><h2>Upload JSON data</h2><p>Select a JSON file to add it to the uploaded data list and queue processing.</p></div>
            <label className="data-upload-drop"><input type="file" accept="application/json,.json" onChange={handleUpload} /><span>Choose JSON file</span><small>Product, review, or collection feed</small></label>
            {uploadMessage ? <div className={`sbu-form-message sbu-form-message--${uploadMessage.type}`}>{uploadMessage.text}</div> : null}
          </article>
          <article className="data-table-card">
            <div className="data-table-head"><h2>Uploaded data</h2><span>{uploads.length} files</span></div>
            <div className="data-table-wrap"><table className="data-table"><thead><tr><th>JSON file</th><th>Rows</th><th>Size</th><th>Uploaded by</th><th>Uploaded</th></tr></thead><tbody>{uploads.map((upload) => <tr key={upload.id}><td><strong>{upload.name}</strong></td><td>{upload.rows.toLocaleString()}</td><td>{upload.size}</td><td>{upload.uploadedBy}</td><td>{upload.uploadedAt}</td></tr>)}</tbody></table></div>
          </article>
        </section>
      ) : (
        <section className="data-processed-grid">
          <article className="data-table-card">
            <div className="data-table-head"><h2>Processed data</h2><span>{jobs.length} jobs</span></div>
            <div className="data-table-wrap"><table className="data-table"><thead><tr><th>JSON file</th><th>Status</th><th>Rows ingested</th><th>Started</th></tr></thead><tbody>{jobs.map((job) => <tr className={selectedJob?.id === job.id ? 'selected' : ''} key={job.id} onClick={() => setSelectedJobId(job.id)}><td><strong>{job.fileName}</strong></td><td><span className={`data-status data-status--${job.status}`}>{job.status}</span></td><td>{job.rows.toLocaleString()}</td><td>{job.startedAt}</td></tr>)}</tbody></table></div>
          </article>
          <aside className="data-detail-card">
            <div className="data-detail-head"><span className={`data-status data-status--${selectedJob.status}`}>{selectedJob.status}</span><h2>{selectedJob.fileName}</h2></div>
            <div className="data-detail-stats"><span><b>{selectedJob.rows.toLocaleString()}</b><small>Rows ingested</small></span><span><b>{selectedJob.startedAt}</b><small>Started</small></span><span><b>{selectedJob.completedAt}</b><small>Completed</small></span></div>
            {selectedJob.status === 'error' ? <div className="data-error-actions"><button className="secondary-button" type="button" onClick={() => downloadErrorReport(selectedJob)}>Download error CSV</button><button className="primary-button" type="button" onClick={() => setConfirmProcessJob(selectedJob)}>Process with errors</button></div> : null}
            <div className="data-error-list"><h3>Processing errors</h3>{selectedJob.errors.length ? selectedJob.errors.map((error) => <p key={`${error.line}-${error.message}`}><b>Line {error.line}</b><span>{error.message}</span></p>) : <p className="data-empty-note">No errors reported for this file.</p>}</div>
          </aside>
          <ConfirmProcessModal job={confirmProcessJob} onClose={() => setConfirmProcessJob(null)} onConfirm={() => processWithErrors(confirmProcessJob)} />
        </section>
      )}
    </main>
  );
}

export default DataManagementPage;